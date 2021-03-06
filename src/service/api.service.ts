import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdvertisementResponse, AdvertisementRequest } from '../app/module/advertisement';
import { SteemconnectAuthService, MongoUserData } from '../app/steemconnect/services/steemconnect-auth.service'
import { OrderResponse, OrderRequest } from '../app/module/order';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { MessageRequest } from '../app/module/message';
import { ReviewRequest, ReviewResponse } from '../app/module/review';
import { environment } from '../environments/environment';
export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}
export interface UserData {
  user: string;
  _id: string;
  name: string;
  account: Account;
  scope: string[];
  user_metadata: Object;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private _http: HttpClient, private auth: SteemconnectAuthService) {

  }

  selectedTrade: any = null;
  selectedAd: any = null;
  token: OAuth2Token = this.auth.token;
  result: any;

  selectTradeEvent(trade: AdvertisementResponse
  ) {
    this.selectedTrade = trade;
  }

  selectAdEvent(trade: AdvertisementResponse
  ) {
    this.selectedAd = trade;
  }

  createOrder(order: OrderRequest): Observable<OrderRequest> {
    console.log(JSON.stringify(order));
    return this._http.post<OrderRequest>(`${environment.API_URL}/orders`, JSON.stringify(order));

  }

  createMessage(message: MessageRequest): Observable<MessageRequest> {
    console.log(JSON.stringify(message));
    return this._http.post<MessageRequest>(`${environment.API_URL}/messages`, JSON.stringify(message));

  }

  createAd(ad: AdvertisementRequest, id?: string): Observable<AdvertisementRequest> {
    console.log(JSON.stringify(ad));
    return this._http[id ? 'put' : 'post']<AdvertisementRequest>(`${environment.API_URL}/listings/${id || ''}`, JSON.stringify(ad));

  }

  getBuyAds() {
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>(`${environment.API_URL}/listings/sell`, { headers: headers });
  }

  getAdsByUser(user: string) {
    return this._http.get<AdvertisementResponse[]>(`${environment.API_URL}/listings/by_user/${user}`);
  }
  getUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get(`${environment.API_URL}/users/` + user);
  }
  setUserData(user: MongoUserData, access_token: string): Observable<MongoUserData> {
    console.log(user);
    const headers = new HttpHeaders({ 'No-Auth': 'True', 'Authorization': access_token, 'Content-Type':  'application/json' });
    return this._http.post<MongoUserData>(`${environment.API_URL}/users/`, JSON.stringify(user), {headers});
  }
  getOpenOrdersForUser(user: string) {
    return this._http.get<OrderResponse[]>(`${environment.API_URL}/orders/by_reciever/${user}`);
  }

  getOpenOrdersByUser(user: string) {
    return this._http.get<OrderResponse[]>(`${environment.API_URL}/orders/by_creator/${user}`);
  }

  getSellAds() {
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>(`${environment.API_URL}/listings/buy`, { headers: headers });
  }

  getPrice() {
    const headers = new HttpHeaders({ 'No-Auth': 'True' }); 
    return this._http.get(`https://api.coingecko.com/api/v3/simple/price?ids=steem%2Csteem-dollars&vs_currencies=usd,inr,krw,btc,eos,eth,vef,ngn,cad,aud,gbp,eur,cny,xrp,ltc,bch,usdt,bnb,xlm,trx`, { headers: headers })
    .map(result => this.result = result);

  }

  getPriceByPair(from: string, to: string) {
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    if (from == "SBD") {
      from = 'steem-dollars'
    }
    if (from == "STEEM") {
      from = 'steem'
    }
    return this._http.get('https://api.coingecko.com/api/v3/simple/price?ids=' + from + '&vs_currencies=' + to, { headers: headers }).map(result => this.result = result);
  }

  getSelectedTrade() {
    return this.selectedTrade;
  }

  getSelectedAd() {
    return this.selectedAd;
  }

  getSelectedTradeFromAPI(id: string) {
    return this._http.get<AdvertisementResponse>(`${environment.API_URL}/listings/${id}`);
  }

  getSelectedOrderFromAPI(id: string) {
    return this._http.get<OrderResponse>(`${environment.API_URL}/orders/${id}`);
  }

  deleteAd(id: string): Observable<AdvertisementRequest> {
    return this._http.delete<AdvertisementRequest>(`${environment.API_URL}/listings/${id}`);
  }

  /**
   *
   * @name pauseAd 
   *
   * @description
   * This method used to open/paused a advertisement
   * @param id advertisement id
   * @param currentStatus current ad_status
   * @returns {Api response}
  */
  pauseAd(id: string, currentStatus: string): Observable<AdvertisementRequest> {
    return this._http.put<AdvertisementRequest>(`${environment.API_URL}/listings/${id}`, JSON.stringify({
      ad_status: currentStatus === "pause" ? "open" : "pause"
    }));
  }

  /**
   *
   * @name updateSelectedOrderFromAPI 
   *
   * @description
   * This method used to update order details
   * @param id order id
   * @param body order details in json stringify format
   * @returns {Api response}
  */
  updateSelectedOrderFromAPI(id: string, body: any) {
    return this._http.put<OrderResponse>(`${environment.API_URL}/orders/${id}`, body);
  }


  /**
   *
   * @name createReview 
   *
   * @description
   * This method used to add review details
   * @param body review details
   * @returns {Api response}
  */
  createReview(body: any, id?: string): Observable<ReviewRequest> {
    return this._http[id ? 'put' : 'post']<ReviewResponse>(`${environment.API_URL}/reviews/${id || ''}`, JSON.stringify(body));
  }

  /**
   *
   * @name getReviews 
   *
   * @description
   * This method used to get review details
   * @param body review details
   * @returns {Api response}
  */
  getReviews(id: string, by_type: string) {
    return this._http.get<[ReviewResponse]>(`${environment.API_URL}/reviews/${by_type}/${id || ''}`);
  }

}
