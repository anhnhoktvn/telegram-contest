import { clsx } from '../../../helpers/index';
import { mapId } from '../../../store/store';

export const saved = `<svg fill="#fff" xmlns="http://www.w3.org/2000/svg">
    <path d="M17,2 C19.209139,2 21,3.790861 21,6 L21,20.2543508 C21,21.3589203 20.1045695,22.2543871 19,22.2543871 C18.5225775,22.2543871 18.0609035,22.0835665 17.6984173,21.772864 L12,16.8885064 L6.30158275,21.772864 C5.46293106,22.4917083 4.2003311,22.3945852 3.4814868,21.5559335 C3.17078432,21.1934473 3,20.7317733 3,20.2543508 L3,6 C3,3.790861 4.790861,2 7,2 L17,2 Z M17,4 L7,4 C5.8954305,4 5,4.8954305 5,6 L5,20.2543508 L10.6984173,15.3699931 C11.4473967,14.7280108 12.5526033,14.7280108 13.3015827,15.3699931 L19,20.2543508 L19,6 C19,4.8954305 18.1045695,4 17,4 Z"/>
    </svg>
`;

const pinnedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
<path d="M15.5076746,5.43106151 C15.6360364,5.50807857 15.7544683,5.60054738 15.8603181,5.70639721 L18.293754,8.13983316 C19.0087487,8.85482776 19.0087487,10.0140631 18.293754,10.7290577 C18.1879042,10.8349075 18.0694723,10.9273763 17.9411106,11.0043934 L16.0271139,12.1527914 C16.2818698,13.6727594 15.6636956,15.1719619 14.2486077,16.5870499 C13.9244725,16.911185 13.3989456,16.911185 13.0748104,16.5870499 L10.83,14.3428746 L7.58689863,17.5868986 C7.28977473,17.8840225 6.8234258,17.9087829 6.49809773,17.6611796 L6.41310137,17.5868986 C6.11597747,17.2897747 6.09121715,16.8234258 6.3388204,16.4980977 L6.41310137,16.4131014 L9.657,13.1688746 L7.41310137,10.9253408 C7.08896621,10.6012057 7.08896621,10.0756787 7.41310137,9.75154358 C8.75743492,8.40721003 10.1776819,7.78209116 11.6195283,7.94136145 L11.8473599,7.97303736 L12.9957579,6.05904069 C13.5159929,5.19198237 14.6406163,4.91082651 15.5076746,5.43106151 Z M14.4191961,6.91310365 L12.9555748,9.35247255 C12.7554257,9.68605435 12.3504433,9.8358671 11.9813866,9.71284821 C11.0837094,9.41362247 10.1767406,9.61176673 9.20691373,10.3715587 L13.6285926,14.7932375 L13.7730814,14.6000944 C14.4125932,13.7025228 14.5665804,12.8565967 14.287303,12.0187646 C14.1642842,11.649708 14.3140969,11.2447255 14.6476787,11.0445765 L17.10429,9.56911679 L17.1199568,9.55526042 C17.1866811,9.48853613 17.1866811,9.3803547 17.1199568,9.31363041 L14.6865208,6.88019447 L14.6536117,6.85449976 C14.5726966,6.80595071 14.4677452,6.83218857 14.4191961,6.91310365 Z"/>
</svg>
`;

const outNotReadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 14 14">
  <path d="M7.96833846,10.0490996 L14.5108251,2.571972 C14.7472185,2.30180819 15.1578642,2.27443181 15.428028,2.51082515 C15.6711754,2.72357915 15.717665,3.07747757 15.5522007,3.34307913 L15.4891749,3.428028 L8.48917485,11.428028 C8.2663359,11.6827011 7.89144111,11.7199091 7.62486888,11.5309823 L7.54038059,11.4596194 L4.54038059,8.45961941 C4.2865398,8.20577862 4.2865398,7.79422138 4.54038059,7.54038059 C4.7688373,7.31192388 5.12504434,7.28907821 5.37905111,7.47184358 L5.45961941,7.54038059 L7.96833846,10.0490996 L14.5108251,2.571972 L7.96833846,10.0490996 Z"/>

</svg>
`;

export const outSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14">
  <path d="M4.96833846,10.0490996 L11.5108251,2.571972 C11.7472185,2.30180819 12.1578642,2.27443181 12.428028,2.51082515 C12.6711754,2.72357915 12.717665,3.07747757 12.5522007,3.34307913 L12.4891749,3.428028 L5.48917485,11.428028 C5.2663359,11.6827011 4.89144111,11.7199091 4.62486888,11.5309823 L4.54038059,11.4596194 L1.54038059,8.45961941 C1.2865398,8.20577862 1.2865398,7.79422138 1.54038059,7.54038059 C1.7688373,7.31192388 2.12504434,7.28907821 2.37905111,7.47184358 L2.45961941,7.54038059 L4.96833846,10.0490996 L11.5108251,2.571972 L4.96833846,10.0490996 Z M9.96833846,10.0490996 L16.5108251,2.571972 C16.7472185,2.30180819 17.1578642,2.27443181 17.428028,2.51082515 C17.6711754,2.72357915 17.717665,3.07747757 17.5522007,3.34307913 L17.4891749,3.428028 L10.4891749,11.428028 C10.2663359,11.6827011 9.89144111,11.7199091 9.62486888,11.5309823 L9.54038059,11.4596194 L8.54038059,10.4596194 C8.2865398,10.2057786 8.2865398,9.79422138 8.54038059,9.54038059 C8.7688373,9.31192388 9.12504434,9.28907821 9.37905111,9.47184358 L9.45961941,9.54038059 L9.96833846,10.0490996 L16.5108251,2.571972 L9.96833846,10.0490996 Z"/>
</svg>
`;

export default ({
	avatar = 'https://pcentr.by/assets/images/users/7756f7da389c7a20eab610d826a25ec7.jpg',
	unreadCount,
	title,
	isOnline,
	message_info,
	text,
	time,
	savedMessages,
	muted,
	id,
	photo,
	pinned,
}) => {
	if (!(photo instanceof Promise) && photo) {
		avatar = photo;
	}
	const icon = savedMessages
		? saved
		: `<img src="${avatar}" alt="avatar" class="dialog__avatar avatar avatar_medium">`;

	const { out } = message_info;

	const rightBottom =
		unreadCount > 0
			? `<div class="${clsx(
					'dialog_right_bottom',
					'dialog__unread-count',
					muted && 'dialog_muted'
			  )}"><div class="count">${unreadCount}</div></div>`
			: pinned
			? `<div class="${clsx('dialog_right_bottom', 'dialog__pinned')}">${pinnedSvg}</div>`
			: '';
	return `
            <div class="${clsx(
				'dialog__avatar-wrapper',
				isOnline && 'dialog__avatar_online',
				savedMessages && 'dialog__saved'
			)}">
                ${icon}
            </div>
            <div class="dialog__name">${title}</div>
			<div class="dialog__short-msg">${text}</div>
			<div class="dialog__info">
				${out ? `<div class="dialog__out">${outSvg}</div>` : ''}
            	<div class="${clsx('dialog__time', !out && 'full')}">${time}</div>
			</div>
            ${rightBottom}

    `;
};
