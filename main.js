const { fromEvent, merge } = rxjs;
const { throttleTime, distinctUntilChanged } = rxjs.operators;
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
	init() {
		Ctrl.hunberger = $(".humberger");
		Ctrl.close = $(".close");
		Ctrl.menu = $(".menu");
		Ctrl.overlay = $("header .overlay");
		Ctrl.hunberger.onclick = Ctrl.toggleMenu;
		Ctrl.close.onclick = () => {
			Ctrl.toggleMenu();
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
		merge(...obs).pipe(distinctUntilChanged(),throttleTime(1000)).subscribe(ev => {
			if (Ctrl.isSp()) {
				Ctrl.toggleMenu();
			}
			Menu.mask.style.display = "block";
			Menu.mask.classList.add("on");
			setTimeout(() => {
				Menu.change(ev.target.dataset.index);
				Menu.mask.classList.remove("on");
				setTimeout(() => {Menu.mask.style.display = "none"}, 400);
			}, 500);
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
window.onload = function() {
	[Ctrl, Menu].forEach(m => {m.init();});
};
