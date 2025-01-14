import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {environment} from '../environments/environment';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgIf, NgForOf],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'untitled';
  token: string = "";
  inputValue: string = '';
  selectedFile: File | null = null;
  url: string = `${environment.requestUrl}`;
  progress: number = 0;
  result: string = "Результат";

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
      console.log(this.selectedFile.size.toString())
    }
    this.http.post(`${this.url}?logicStorageId=${this.inputValue}&fileSize=${this.selectedFile?.size}`, formData, {
      headers,
      observe: 'events',
      reportProgress: true
    }).subscribe(
      (event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            }
            break;
          case HttpEventType.Response:
            console.log('Файл успішно завантажено:', event.body);
            this.result = event.body as string;
            break;
          default:
            break;
        }
      },
      (
        error) => {
        console.error('Помилка при завантаженні файлу:', error);
      }
    );
  }
}
