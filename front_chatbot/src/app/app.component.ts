import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front_chatbot';
  messages = [
    { sender: 'bot', text: 'Hola! Com et puc ajudar avui?' }
  ];
  newMessage = '';
  messageTemporal = '';

  constructor(private chatService:ChatService) { }

  async sendMessage() {
    if (this.newMessage.trim()) { 
      const messageTemporal = this.newMessage; // Guardem el missatge abans de netejar-lo
      this.newMessage = ''; // Neteja immediata del camp input

      this.messages.push({ sender: 'me', text: messageTemporal });

      const response = await this.chatService.sendMessage(messageTemporal);
      this.messages.push({ sender: 'bot', text: response.resposta });
    }
  }

  async keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await this.sendMessage();
    }
  }
}
