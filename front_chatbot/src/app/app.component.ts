import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front_chatbot';
  messages: { sender: string, text?: string, html?: SafeHtml }[] = [];
  newMessage = '';
  messageTemporal = '';

  constructor(private chatService:ChatService, private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.addBotMessage();
  }

  ngAfterViewChecked() {
    this.attachButtonClickListeners();
  }

  addBotMessage() {
    this.messages.push({
      sender: 'bot',
      text: 'Hola! Com et puc ajudar avui?',
      html: this.sanitize(`
        <button class="btn btn-primary btn-chat" data-msg="A què es dedica EIO?">A què es dedica EIO?</button><br>
        <button class="btn btn-primary btn-chat" data-msg="Quines oportunitats laborals ofereix EIO i en quins sectors?">Quines oportunitats laborals ofereix EIO i en quins sectors?</button><br>
        <button class="btn btn-primary btn-chat" data-msg="Quins estudis cal cursar per optar a una oportunitat laboral a EIO?">Quins estudis cal cursar per optar a una oportunitat laboral a EIO?</button><br>
        <button class="btn btn-primary btn-chat" data-msg="Quines competències valora EIO, més enllà de les competències professionals?">Quines competències valora EIO, més enllà de les competències professionals?</button><br>
        <button class="btn btn-primary btn-chat" data-msg="Quina experiència té EIO amb alumnes provinents de Formació Professional (Graus mitjà i superior)?">Quina experiència té EIO amb alumnes provinents de Formació Professional (Graus mitjà i superior)?</button><br>
      `)
    });
  }

  attachButtonClickListeners() {
    document.querySelectorAll('.chat-messages button[data-msg]').forEach(button => {
      button.removeEventListener('click', this.handleButtonClick); // Evita duplicats
      button.addEventListener('click', this.handleButtonClick);
    });
  }

  handleButtonClick = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    const message = button.getAttribute('data-msg');
    if (message) {
      this.fakeSend(message);
    }
  };

  async sendMessage() {
    if (this.newMessage.trim()) { 
      const messageTemporal = this.newMessage; // Guardem el missatge abans de netejar-lo
      this.newMessage = ''; // Neteja immediata del camp input

      this.messages.push({ sender: 'me', text: messageTemporal});

      const response = await this.chatService.sendMessage(messageTemporal);
      let formattedResponse = response.resposta.replace(/(^|[^*])\* /g, '$1<br>');
      formattedResponse = formattedResponse.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      this.messages.push({ sender: 'bot', html: formattedResponse});
    }
  }

  async keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await this.sendMessage();
    }
  }
  async fakeSend(miss:string) {
    this.newMessage = miss;
    await this.sendMessage();
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
