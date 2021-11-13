import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private userList: User[] = [];
  constructor(
    private storageService: StorageService
  ) {
    this.retrieveDataFromLocalStorage();
  }

  // methods
  /**
   * add User
   * get User
   * update Users
   * delete User
   * retrieve from local storage
   */

  public addUser(user: User): Observable<User> {
    return new Observable( observer => {
      this.userList.push(user);
      this.updateStorage()
      observer.next(user);
      observer.complete();
    })
  }

  public getUsers(): Observable<User[]> {
    return new Observable( observer => {
      observer.next(this.userList);
      observer.complete();
    })
  }

  public getUser(email: string): Observable<User> {
    return new Observable( observer => {
      const userDetails = this.findUser(email);
      if (userDetails) {
        observer.next(userDetails);
        observer.complete();
      } else {
        observer.error( new Error('User Details Not found'));
        observer.complete();
      }
    })
  }

  public updateUser(user: User): Observable<User> {
    return new Observable( observer => {
      const userIndex = this.findIndex(user.email);
      this.userList[userIndex] = user;
      this.updateStorage();
      observer.next(user);
      observer.complete();
    })
  }

  private retrieveDataFromLocalStorage(): void {
    const userData = this.storageService.get('userInfo');
    this.userList = userData || [];
  }

  public deleteUser(email: string): Observable<Boolean> {
    return new Observable( observer => {
      const findIndex = this.findIndex(email);
      this.userList.splice(findIndex, 1);
      this.updateStorage();
      observer.next(true);
      observer.complete();
    })
  }

  private findUser(email: string): User {
    return this.userList.find( user =>  user.email === email);
  }

  private findIndex(email: string): number {
    return  this.userList.findIndex( listUser => listUser.email === email);
  }

  private updateStorage(): void {
    this.storageService.add('userInfo', this.userList);
  }
}
