/**
 *
 * @name signup.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for sign-up new user
 */
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SteemconnectAuthService } from '../../steemconnect/services/steemconnect-auth.service';
import {environment} from '../../../environments/environment';

declare var SteemNinja;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public userData: {username: string;} = {
    username: ''
  };
  
  constructor(public auth: SteemconnectAuthService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  onSignup() {
    let ninja = new SteemNinja(environment.SIGNUP_KEY, environment.REFERRER);
    ninja.setRedirectFailureUrl(encodeURIComponent(
      `${this.document.location.origin}/signup/failure`
    ));
    ninja.setRedirectSuccessUrl(encodeURIComponent(
      `${this.document.location.origin}/signup/success`
    ));
    ninja.requestToken("account_15", this.userData.username, 250).then(data => {
      window.location.href = ninja.host + "/checkout?token=" + data.token;
    }).catch(error => {
      alert(error.error);
    });
  }

}
