import makeTemplate from './chat-message.html';
import { getMessage, getActivePeerId } from '../../store/store';
import './chatMessage.scss';

export default class ChatMessage extends HTMLElement {
	render() {
		const peerId = getActivePeerId();
		const messageId = this.getAttribute('id');
		const message = getMessage(peerId)(messageId);
		this.innerHTML = `${makeTemplate(message)}`;
	}

	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.render();
	}
}
