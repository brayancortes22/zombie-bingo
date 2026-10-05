import { Peer, type DataConnection } from 'peerjs'
import type { RoomData, RoomPlayer } from '../types/navigation'
import type { BallotData, BingoClaimPayload, PeerMessage, ProgressPayload } from '../types/multiplayer'

type Callback<T> = (data: T) => void

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
]

export class MultiplayerService {
  private peer: Peer | null = null
  private hostConnection: DataConnection | null = null
  private clientConnections: Map<string, DataConnection> = new Map()
  public isHost: boolean = false
  public currentRoom: RoomData | null = null
  private hostPassword?: string

  private onRoomUpdateCbs: Callback<RoomData>[] = []
  private onGameStartCbs: Callback<void>[] = []
  private onBallotCbs: Callback<BallotData>[] = []
  private onProgressCbs: Callback<ProgressPayload>[] = []
  private onBingoCbs: Callback<BingoClaimPayload>[] = []

  private cleanId(id: string): string {
    return 'zb-' + id.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  // --- CREAR SALA (HOST) ---
  createRoom(roomId: string, password: string | undefined, maxPlayers: number, hostPlayer: RoomPlayer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.leaveRoom()
      const peerId = this.cleanId(roomId)
      this.isHost = true
      this.hostPassword = password
      this.currentRoom = { id: roomId, password, maxPlayers, players: [hostPlayer], isHost: true }

      this.peer = new Peer(peerId, { config: { iceServers: ICE_SERVERS } })

      this.peer.on('open', (id) => resolve(id))
      this.peer.on('error', (err) => reject(new Error('No se pudo crear la sala: ' + err.message)))

      this.peer.on('connection', (conn) => {
        conn.on('data', (raw: unknown) => {
          const msg = raw as PeerMessage
          this.handleHostMessage(conn, msg)
        })

        conn.on('close', () => {
          this.clientConnections.delete(conn.peer)
          if (this.currentRoom) {
            this.currentRoom.players = this.currentRoom.players.filter((p) => p.id !== conn.peer)
            this.broadcast({ type: 'ROOM_UPDATE', senderId: 'host', payload: this.currentRoom })
            this.emitRoomUpdate(this.currentRoom)
          }
        })
      })
    })
  }

  private handleHostMessage(conn: DataConnection, msg: PeerMessage) {
    if (!this.currentRoom) return

    if (msg.type === 'JOIN_REQUEST') {
      const { player, password } = msg.payload
      if (this.hostPassword && password !== this.hostPassword) {
        conn.send({ type: 'JOIN_REJECTED', senderId: 'host', payload: 'Contraseña de sala incorrecta' })
        conn.close()
        return
      }
      if (this.currentRoom.players.length >= this.currentRoom.maxPlayers) {
        conn.send({ type: 'JOIN_REJECTED', senderId: 'host', payload: 'La sala está llena' })
        conn.close()
        return
      }

      this.clientConnections.set(conn.peer, conn)
      const newPlayer: RoomPlayer = { ...player, id: conn.peer, isHost: false, isReady: false }
      this.currentRoom.players.push(newPlayer)

      conn.send({ type: 'JOIN_ACCEPTED', senderId: 'host', payload: this.currentRoom })
      this.broadcast({ type: 'ROOM_UPDATE', senderId: 'host', payload: this.currentRoom })
      this.emitRoomUpdate(this.currentRoom)
    } else if (msg.type === 'TOGGLE_READY') {
      const p = this.currentRoom.players.find((pl) => pl.id === msg.senderId)
      if (p) {
        p.isReady = !p.isReady
        this.broadcast({ type: 'ROOM_UPDATE', senderId: 'host', payload: this.currentRoom })
        this.emitRoomUpdate(this.currentRoom)
      }
    } else if (msg.type === 'PLAYER_PROGRESS') {
      this.broadcast(msg)
      this.onProgressCbs.forEach((cb) => cb(msg.payload))
    } else if (msg.type === 'BINGO_CLAIM') {
      this.broadcast(msg)
      this.onBingoCbs.forEach((cb) => cb(msg.payload))
    }
  }

  // --- UNIRSE A SALA (CLIENT) ---
  joinRoom(roomId: string, password: string | undefined, clientPlayer: RoomPlayer): Promise<RoomData> {
    return new Promise((resolve, reject) => {
      this.leaveRoom()
      this.isHost = false
      const targetHostId = this.cleanId(roomId)

      this.peer = new Peer({ config: { iceServers: ICE_SERVERS } })

      this.peer.on('error', (err) => reject(new Error('Error de conexión P2P: ' + err.message)))

      this.peer.on('open', () => {
        const conn = this.peer!.connect(targetHostId, { reliable: true })
        this.hostConnection = conn

        conn.on('open', () => {
          conn.send({
            type: 'JOIN_REQUEST',
            senderId: this.peer!.id,
            payload: { player: clientPlayer, password },
          })
        })

        conn.on('data', (raw: unknown) => {
          const msg = raw as PeerMessage
          if (msg.type === 'JOIN_ACCEPTED') {
            this.currentRoom = { ...msg.payload, isHost: false }
            this.emitRoomUpdate(this.currentRoom!)
            resolve(this.currentRoom!)
          } else if (msg.type === 'JOIN_REJECTED') {
            reject(new Error(msg.payload || 'No se pudo unir a la sala'))
            this.leaveRoom()
          } else if (msg.type === 'ROOM_UPDATE') {
            this.currentRoom = { ...msg.payload, isHost: false }
            this.emitRoomUpdate(this.currentRoom!)
          } else if (msg.type === 'START_GAME') {
            this.onGameStartCbs.forEach((cb) => cb())
          } else if (msg.type === 'BALLOT_DRAWN') {
            this.onBallotCbs.forEach((cb) => cb(msg.payload))
          } else if (msg.type === 'PLAYER_PROGRESS') {
            this.onProgressCbs.forEach((cb) => cb(msg.payload))
          } else if (msg.type === 'BINGO_CLAIM') {
            this.onBingoCbs.forEach((cb) => cb(msg.payload))
          }
        })

        conn.on('close', () => {
          this.currentRoom = null
        })
      })
    })
  }

  // --- ACCIONES EN PARTIDA ---
  broadcast(msg: PeerMessage) {
    if (this.isHost) {
      this.clientConnections.forEach((conn) => {
        if (conn.open) conn.send(msg)
      })
    } else if (this.hostConnection?.open) {
      this.hostConnection.send(msg)
    }
  }

  startGame() {
    if (this.isHost) {
      this.broadcast({ type: 'START_GAME', senderId: 'host' })
      this.onGameStartCbs.forEach((cb) => cb())
    }
  }

  drawBallot(ballot: BallotData) {
    if (this.isHost) {
      this.broadcast({ type: 'BALLOT_DRAWN', senderId: 'host', payload: ballot })
      this.onBallotCbs.forEach((cb) => cb(ballot))
    }
  }

  sendProgress(markedCount: number) {
    const id = this.peer?.id || 'local'
    const payload: ProgressPayload = { playerId: id, markedCount }
    this.broadcast({ type: 'PLAYER_PROGRESS', senderId: id, payload })
    this.onProgressCbs.forEach((cb) => cb(payload))
  }

  claimBingo(winnerName: string) {
    const id = this.peer?.id || 'local'
    const payload: BingoClaimPayload = { winnerId: id, winnerName }
    this.broadcast({ type: 'BINGO_CLAIM', senderId: id, payload })
    this.onBingoCbs.forEach((cb) => cb(payload))
  }

  toggleReady() {
    if (!this.isHost && this.hostConnection?.open) {
      this.hostConnection.send({ type: 'TOGGLE_READY', senderId: this.peer!.id })
    }
  }

  // --- SUBSCRIPCIONES ---
  onRoomUpdate(cb: Callback<RoomData>) { this.onRoomUpdateCbs.push(cb) }
  onGameStart(cb: Callback<void>) { this.onGameStartCbs.push(cb) }
  onBallotReceived(cb: Callback<BallotData>) { this.onBallotCbs.push(cb) }
  onProgressUpdate(cb: Callback<ProgressPayload>) { this.onProgressCbs.push(cb) }
  onBingoClaim(cb: Callback<BingoClaimPayload>) { this.onBingoCbs.push(cb) }

  private emitRoomUpdate(room: RoomData) {
    this.onRoomUpdateCbs.forEach((cb) => cb(room))
  }

  leaveRoom() {
    if (this.hostConnection) {
      this.hostConnection.close()
      this.hostConnection = null
    }
    this.clientConnections.forEach((conn) => conn.close())
    this.clientConnections.clear()
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }
    this.currentRoom = null
    this.isHost = false
  }
}

export const multiplayerService = new MultiplayerService()
