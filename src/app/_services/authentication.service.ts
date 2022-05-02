import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {User} from '@app/_models';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  info(){
    return this.http.get<any>(`${environment.apiUrl}/introspect`)
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/login`, {user: username, pass: password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);

        return user
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('logged');
    localStorage.removeItem("pendingTurns")
    localStorage.removeItem("activeTurn")

    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
