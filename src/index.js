/**
 * Lightbox for Bootstrap 5
 *
 * @file Creates a modal with a lightbox carousel.
 * @module bs5-lightbox
 */

import { Carousel, Modal } from 'bootstrap';

const bootstrap = {
	Modal,
	Carousel
};

class Lightbox {
	constructor(el, options = {}) {
		this.settings = Object.assign(Object.assign(Object.assign({}, bootstrap.Modal.Default), bootstrap.Carousel.Default), {
			interval: false,
			target: '[data-toggle="lightbox"]',
			gallery: '',
			size: 'override-size',
			constrain: true
		});
		this.settings = Object.assign(Object.assign({}, this.settings), options);
		this.modalOptions = (() => this.setOptionsFromSettings(bootstrap.Modal.Default))();
		this.carouselOptions = (() => this.setOptionsFromSettings(bootstrap.Carousel.Default))();

		if (typeof el === 'string') {
			this.settings.target = el;
			el = document.querySelector(this.settings.target);
		}
		this.el = el;
		this.type = el.dataset.type || '';
		this.src = this.getSrc(el);
		this.sources = this.getGalleryItems();
		this.hash = this.randomHash();

		this.createCarousel();
		this.createModal();
	}

	show() {
		document.body.appendChild(this.modalElement);
		this.modal.show();
	}

	hide() {
		this.modal.hide();
	}

	setOptionsFromSettings(obj) {
		return Object.keys(obj).reduce((p, c) => Object.assign(p, { [c]: this.settings[c] }), {});
	}

	getSrc(el) {
		let src = el.dataset.src || el.dataset.remote || el.href;
		if (el.dataset.type === 'html') {
			return src;
		}
		if (!/\:\/\//.test(src)) {
			src = window.location.origin + src;
		}

		return new URL(src).toString();
	}

	getGalleryItems() {
		let galleryTarget;
		if (this.settings.gallery) {
			if (Array.isArray(this.settings.gallery)) {
				return this.settings.gallery;
			}
			galleryTarget = this.settings.gallery;
		} else if (this.el.dataset.gallery) {
			galleryTarget = this.el.dataset.gallery;
		}
		return galleryTarget
			? [...new Set(Array.from(document.querySelectorAll(`[data-gallery="${galleryTarget}"]`), (v) => `${v.dataset.type ? v.dataset.type : ''}${this.getSrc(v)}`))]
			: [`${this.type ? this.type : ''}${this.src}`];
	}

	getYoutubeLink(src) {
		if (!src) {
			return false;
		}
		const matches = src.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);

		if (!matches || matches[2].length !== 11) {
			return false;
		}

		const youtubeId = matches[2];
		const arr = src.split('?');
		let params = arr.length > 1 ? '?' + arr[1] : '';

		return `https://www.youtube.com/embed/${youtubeId}${params}`;
	}

	getInstagramEmbed(src) {
		if (/instagram/.test(src)) {
			src += /\/embed$/.test(src) ? '' : '/embed';
			return `<iframe src="${src}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
		}
		return false; // Return false if the URL is not an Instagram link
	}

	isEmbed(src) {
		const regex = new RegExp('(' + Lightbox.allowedEmbedTypes.join('|') + ')');
		return regex.test(src);
	}

	getFileExtension(src) {
		return src.split('.').pop().split('?')[0].toLowerCase();
	}

	isImage(src) {
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
		const extension = this.getFileExtension(src);
		return imageExtensions.includes(extension);
	}

	isVideo(src) {
		const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
		const extension = this.getFileExtension(src);
		return /video/.test(src) || videoExtensions.includes(extension);
	}

	createCarousel() {
		const template = document.createElement('template');
		const slidesHtml = this.sources
			.map((src, i) => {
				src = src.replace(/\/$/, '');

				const imgClasses = this.settings.constrain ? 'mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0' : 'h-100 w-100';
				let inner = `<img src="${src}" class="d-block ${imgClasses} img-fluid" style="z-index: 1; object-fit: contain;" loading="lazy"/>`;

				if (this.isEmbed(src)) {
					let attributes = '';
					const instagramEmbed = this.getInstagramEmbed(src);
					const embedYoutubeLink = this.getYoutubeLink(src);

					if (embedYoutubeLink) {
						src = embedYoutubeLink;
						attributes = 'title="YouTube video player" frameborder="0"';
					}
					inner = instagramEmbed || `<iframe src="${src}" ${attributes} allowfullscreen></iframe>`;
				}
				if (this.isVideo(src)) {
					inner = `<video controls>
                        <source src="${src}" ${this.getFileExtension(src) === src ? '' : 'type="video/mp4'}"/>
                        <p>Your browser doesn't support HTML video.</p>
                    </video>`;
				}

				return `<div class="carousel-item ${!i ? 'active' : ''}" style="min-height: 100px">
					<div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem height: 3rem" role="status"></div></div>
					<div class="ratio ratio-16x9" style="background-color: #000;">${inner}</div>
				</div>`;
			})
			.join('');

		const controlsHtml =
			this.sources.length < 2
				? ''
				: `
			<button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control carousel-control-prev h-75 m-auto" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button id="#lightboxCarousel-${this.hash}-next" class="carousel-control carousel-control-next h-75 m-auto" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>`;

		let classes = 'lightbox-carousel carousel slide';
		if (this.settings.size === 'fullscreen') {
			classes += ' position-absolute w-100 translate-middle top-50 start-50';
		}
		const html = `
			<div id="lightboxCarousel-${this.hash}" class="${classes}" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
				<div class="carousel-inner">
					${slidesHtml}
				</div>
				${controlsHtml}
			</div>`;
		template.innerHTML = html.trim();
		this.carouselElement = template.content.firstChild;
		const carouselOptions = Object.assign(Object.assign({}, this.carouselOptions), { keyboard: false });
		this.carousel = new bootstrap.Carousel(this.carouselElement, carouselOptions);
		const elSrc = this.type && this.type !== 'image' ? this.type + this.src : this.src;
		this.carousel.to(this.findGalleryItemIndex(this.sources, elSrc));
		if (this.carouselOptions.keyboard === true) {
			document.addEventListener('keydown', (e) => {
				if (e.code === 'ArrowLeft') {
					const prev = document.getElementById(`#lightboxCarousel-${this.hash}-prev`);
					if (prev) {
						prev.click();
					}
					return false;
				}
				if (e.code === 'ArrowRight') {
					const next = document.getElementById(`#lightboxCarousel-${this.hash}-next`);
					if (next) {
						next.click();
					}
					return false;
				}
			});
		}
		return this.carousel;
	}

	findGalleryItemIndex(haystack, needle) {
		let index = 0;
		for (const item of haystack) {
			if (item.includes(needle)) {
				return index;
			}
			index++;
		}
		return 0;
	}

	createModal() {
		const template = document.createElement('template');
		const btnInner =
			'<svg xmlns="http://www.w3.org/2000/svg" style="position: relative; top: -5px;" viewBox="0 0 16 16" fill="#fff"><path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z"/></svg>';
		const html = `
			<div class="modal lightbox fade" id="lightboxModal-${this.hash}" tabindex="-1" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered ${this.settings.size ? 'modal-' + this.settings.size : ''}">
					<div class="modal-content border-0 bg-transparent">
						<div class="modal-body p-0">
							<button type="button" class="btn-close position-absolute top-0 end-0 p-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 2; background: none;">${btnInner}</button>
						</div>
					</div>
				</div>
			</div>`;
		template.innerHTML = html.trim();
		this.modalElement = template.content.firstChild;
		this.modalElement.querySelector('.modal-body').appendChild(this.carouselElement);
		this.modalElement.addEventListener('hidden.bs.modal', () => this.modalElement.remove());
		this.modalElement.querySelector('[data-bs-dismiss]').addEventListener('click', () => this.modal.hide());
		this.modal = new bootstrap.Modal(this.modalElement, this.modalOptions);
		return this.modal;
	}

	randomHash(length = 8) {
		return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('');
	}
}

Lightbox.allowedEmbedTypes = ['embed', 'youtube', 'vimeo', 'instagram', 'url'];
Lightbox.initialize = function (e) {
	e.preventDefault();
	const lightbox = new Lightbox(this);
	lightbox.show();

	// video play fix
	document.getElementById('lightboxCarousel-' + lightbox.hash).addEventListener('slid.bs.carousel', () => {
		document.querySelectorAll('video').forEach((video) => {
			video.pause();
			video.currentTime = 0;
		});
		const video = document.querySelector('.carousel-item.active').querySelector('video');
		if (video) {
			video.play();
		}
	});
};
document.querySelectorAll('[data-toggle="lightbox"]').forEach((el) => el.addEventListener('click', Lightbox.initialize));

if (typeof window !== 'undefined' && window.bootstrap) {
	window.bootstrap.Lightbox = Lightbox;
}

export default Lightbox;
