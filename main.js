const { fromEvent, merge } = rxjs;
const { throttleTime } = rxjs.operators;
function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
var Ctrl = {
	hunberger: null,
	close: null,
	menu: null,
	overlay: null,
	toTop: null,
	init() {
		Ctrl.hunberger = $(".humberger");
		Ctrl.close = $(".close");
		Ctrl.menu = $(".menu");
		Ctrl.overlay = $("header .overlay");
		Ctrl.hunberger.onclick = Ctrl.toggleMenu;
		Ctrl.close.onclick = () => {
			Ctrl.toggleMenu();
		}
		Ctrl.toTop = $("#to-top");
		Ctrl.toTop.onclick = () => {
			Ctrl.toTop.classList.remove("show");
			Ctrl.smoothScroll(window.scrollY > window.innerHeight * 2 ? -30 : -20);
		};
		fromEvent(window, "scroll").pipe(throttleTime(30)).subscribe(e => {
			if (window.scrollY > window.innerHeight / 2) {
				if (!Ctrl.toTop.classList.contains("show")) {
					Ctrl.toTop.style.display = "block";
					Ctrl.toTop.classList.add("show");
				}
			} else if (Ctrl.toTop.classList.contains("show")) {
				Ctrl.toTop.classList.remove("show");
				setTimeout(() => {Ctrl.toTop.style.display = "none";}, 300);
			}
		});
	},
	smoothScroll(move = -20) {
		window.scrollBy(0, move);
		let id = setTimeout(Ctrl.smoothScroll, 1);
		if (0 === window.scrollY) {
			clearTimeout(id);
			Ctrl.toTop.style.display = "none";
		}
	},
	toggleMenu() {
		if (Ctrl.menu.classList.contains("show")) {
			Ctrl.menu.classList.remove("show")
			Ctrl.overlayHide();
		} else {
			Ctrl.overlayShow();
			Ctrl.menu.classList.add("show");
		}
	},
	overlayShow() {
		Ctrl.overlay.style.display = "block";
	},
	overlayHide() {
		Ctrl.overlay.style.display = "none";
	},
	isSp() {
		return window.screen.width <= 480;
	}
}
var Menu = {
	menus: [],
	contents: [],
	mask: null,
	init() {
		Menu.mask = $(".mask")
		Menu.contents = Array.from($$("#content article")).map(elm => elm);
		let obs = Array.from($$(".menu li:not(.menu-title)")).map((elm, i) => {
			elm.dataset.index = i;
			Menu.menus.push(elm);
			return fromEvent(elm, "click");
		});
		merge(...obs).pipe(throttleTime(1600)).subscribe(ev => {
			if (ev.target.classList.contains("sel")) {
				return;
			}
			if (Ctrl.isSp()) {
				Ctrl.toggleMenu();
			}
			Menu.mask.classList.add("on");
			setTimeout(() => {
				Menu.change(ev.target.dataset.index);
				window.scrollTo(0, 0);
			}, 800);
			setTimeout(() => {Menu.mask.classList.remove("on");}, 1600);
		});
	},
	change(page) {
		for(let i = 0; i < Menu.menus.length; i++) {
			Menu.menus[i].classList.remove("sel");
			Menu.contents[i].classList.remove("sel");
		}
		Menu.menus[page].classList.add("sel");
		Menu.contents[page].classList.add("sel");
	}
};

var Skill = {
	init() {
		Array.from($$(".skill .header")).forEach(elm => {
			fromEvent(elm, "click").pipe(throttleTime(500)).subscribe(ev => {
				let sec = ev.target.parentNode;
				while (sec.tagName.toLowerCase() != "section" || !sec.parentNode) {
					sec = sec.parentNode;
				}
				if (sec.classList.contains("open")) {
					sec.classList.remove("open");
				} else {
					sec.classList.add("open");
				}
			});
		});
	}
}
var Works = {
	init() {
		Array.from($$(".works .header")).forEach(elm => {
			fromEvent(elm, "click").pipe(throttleTime(500)).subscribe(ev => {
				let sec = ev.target.parentNode;
				while (sec.tagName.toLowerCase() != "section" || !sec.parentNode) {
					sec = sec.parentNode;
				}
				if (sec.classList.contains("open")) {
					sec.classList.remove("open");
				} else {
					sec.classList.add("open");
				}
			});
		});
	}
}
window.onload = function() {
	[Ctrl, Menu, Skill, Works].forEach(m => {m.init();});
};
