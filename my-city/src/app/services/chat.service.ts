import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = environment.chatApi;

  constructor(private http: HttpClient) {}

  sendMessageStream(message: string): Observable<string> {
    return new Observable<string>((observer) => {
      const controller = new AbortController();

      fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          if (!response.body) throw new Error('No response body to stream');

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
              const chunk = decoder.decode(value);
              const parsedChunk = JSON.parse(chunk)?.response;
              observer.next(parsedChunk);
            }
          }

          observer.complete();
        })
        .catch((error) => {
          console.error('Chat stream error:', error);
          observer.error(error);
        });

      return () => controller.abort();
    });
  }
}
