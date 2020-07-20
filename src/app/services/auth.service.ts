import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loged:boolean=false;

  constructor() { }

  login(userName,password){

    if(userName==='user' && password==='password'){
      localStorage.setItem('userName', userName);
      this.loged=true;
    
    }
    return this.loged;
  }

  logout(){


    localStorage.removeItem('userName');
  }

  getUser():any{
    return localStorage.getItem('userName')
  }

  isLogedIn(){
    return this.getUser() != null;
  }
}
