function cancelarLetras(event){
      if (["e", "E", "+", "-" , ",", "."].includes(event.key)) {
        event.preventDefault(); 
    }
}

