import lottie from 'lottie-web';
import { getActivePeerId, getMessage } from '../../../store/store';
import { telegramApi } from '../../../App';
import { startLoadingProgress, setLoadingProgress, stopLoadingProgress, clsx } from '../../../helpers/index';

import docIcon from './doc';
import { outSvg, outNotReadSvg } from '../../user-dialogs/dialog/dialog.html';
import AppMessagesManagerModule from '../../../utils/TelegramApi/js/App/AppMessagesManager';

export default class DocumentMessage extends HTMLElement {
	constructor() {
		super();
		this.id = this.getAttribute('id');
		this.peerId = getActivePeerId();
	}

	render() {
		const {
			media: { document },
			date,
			outRead,
			flags,
		} = new AppMessagesManagerModule(this.peerId).getMessage(this.id);
		const { out } = telegramApi._checkMessageFlags(flags);

		const outIcon = out ? (outRead ? outSvg : outNotReadSvg) : '';
		let time = new Date(date * 1000);
		time = `${time.getHours()}:${time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes()}`;
		const messageInfo = `<div class="${clsx('message__info')}">${time}${outIcon}</div>`;

		this.innerHTML = `<div class="document-message">${this.getContentByMimeType(document)}${messageInfo}</div>`;
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

	getContentByMimeType(document) {
		switch (document.mime_type) {
			case 'application/x-tgsticker':
				return this.getAnimatedSticker(document);
			case 'image/webp':
				return this.getSticker(document);
			case 'video/quicktime':
			case 'video/mp4':
			case 'video/x-msvideo':
				return this.getVideoDocument(document);
			default:
				// console.log('UNDEFINED', document);
				return this.getDocument(document);
		}
	}

	getDocument(doc) {

		// console.log('JUST DOC', doc);
		const progress = (current, full) => {
			setLoadingProgress(this.querySelector('.document-message__document'), (current / full) * 100);
		};
		const mime = doc.mime_type.slice(doc.mime_type.indexOf('/') + 1);

		this.addEventListener('click', () => {
			telegramApi.downloadDocument(doc, progress, true).then(() => {
				const htmlSaved = this.querySelector('.document-message__document').innerHTML;
				stopLoadingProgress(this.querySelector('.document-message__document'));
				this.querySelector('.document-message__document').innerHTML = htmlSaved;
				this.querySelector('.document-message__document')
					.querySelector('.progress-ring')
					.remove();
			});
			startLoadingProgress(this.querySelector('.document-message__document'), false, 54, false, 'black');
		});

		return `<div class='document-message__document'>${docIcon(mime)} <p>${doc.attributes[0].file_name ||
			doc.attributes.filter(el => el._ === 'documentAttributeFilename')[0].file_name}</p></div>`;
	}

	getVideoDocument(doc) {
		const attrs = doc.attributes.filter(el => el._ === 'documentAttributeVideo')[0];
		const isRound = telegramApi._checkFlag(attrs.flags, 0);
		setZeroTimeout(() => {
			if (isRound) {
				this.querySelector('.document-message__video').classList.add('document-message__video_round');
			}
		});
		this.addEventListener('click', () => {
			if (!this.loading) {
				this.loading = true;
			} else {
				return;
			}

			const videoPlaceholder = this.querySelector('.document-message__video');
			const handleProgress = (offset, size) => {
				setLoadingProgress(videoPlaceholder, (offset / size) * 100);
			};

			startLoadingProgress(videoPlaceholder);
			telegramApi.downloadDocument(doc, handleProgress).then(data => {
				telegramApi._getVideoData(data.bytes, doc.id).then(video_data => {
					const vid = document.createElement('video');
					vid.src = video_data;
					vid.width = 300;
					vid.height = 300;
					vid.controls = isRound ? '' : 'controls';
					vid.autoplay = false;
					stopLoadingProgress(videoPlaceholder);
					videoPlaceholder.appendChild(vid);

					if (isRound) {
						const progressContainer = document.createElement('div');
						progressContainer.style = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0;';
						videoPlaceholder.appendChild(progressContainer);
						startLoadingProgress(progressContainer, false, vid.width, false);
						vid.ontimeupdate = () => {
							setLoadingProgress(progressContainer, (vid.currentTime / vid.duration) * 100);
						};
						let isPlaying = false;
						progressContainer.addEventListener('click', () => {
							if (isPlaying) {
								vid.pause();
								isPlaying = false;
							} else {
								vid.play();
								isPlaying = true;
							}
						});
						vid.onended = () => {
							isPlaying = false;
						};
					}
				});
			});
		});
		return `<div style='position: relative; width: 300px; height: 300px;background: url("https://riggswealth.com/wp-content/uploads/2016/06/Riggs-Video-Placeholder.jpg"); background-position: center center;' class='document-message__video'></div>`;
	}

	getAnimatedSticker(doc) {
		const { id, file_reference: fileReference, date, size, thumbs, attributes } = doc;
		const { type, w, h, bytes } = thumbs[0];
		const [{ w: width, h: height }, { alt: altEmoji, stickerset: stickerSet }] = attributes;
		const stickerPreviewUrl = window.URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
		telegramApi.downloadDocument(doc).then(data => {
			telegramApi
				.setStickerToContainer(data, this.querySelector(`.chat-message_animated-sticker`), id)
				.then(anim => {
					const sticker = this.querySelector(`.chat-message_animated-sticker`);
					sticker.addEventListener('mouseenter', () => {
						clearTimeout(sticker.stopped);
						anim.play();
					});
					sticker.addEventListener('mouseleave', () => {
						sticker.stopped = setTimeout(() => {
							anim.stop();
						}, 500);
					});
				});
			this.querySelector('.chat-message_animated-sticker img').remove();
		});
		return `<div class="chat-message_animated-sticker"><img src="${stickerPreviewUrl}" alt=${altEmoji}></div>`;
	}

	getSticker(doc) {
		const { id, attributes, thumbs } = doc;
		const { bytes } = thumbs[0];
		const scale = 300 / 512;
		let { w, h } = attributes[0];
		const { alt: altEmoji } = attributes[1];
		w *= scale;
		h *= scale;
		// const stickerUrl = window.URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
		// if (!bytes) {
		telegramApi.getDocumentPreview(doc).then(res => {
			let img = this.querySelector('img');
			if (!img) {
				img = document.createElement('img');
				this.querySelector('.chat-message_sticker').innerHTML = '';
				this.querySelector('.chat-message_sticker').appendChild(img);
			}
			if (img.classList.contains('chat-message_sticker_full')) {
				return;
			}

			img.src = res;
			img.style = `width: ${w}px; height: ${h}px`;
		});
		return `<div id='${id}' class="chat-message_sticker">${`<div style='width: ${w}px; height: ${h}px;'></div>`}</div>`;
	}

	getAnimationItem = (data, options) => () =>
		lottie.loadAnimation({
			container: this,
			renderer: 'svg',
			loop: options.loop || false,
			autoplay: options.auto || false,
			animationData: data,
		});
}
