

const checkRequired = (r, o) => {
	if ('required' in r && r.required) {
		return !!o;
	}
	return true;
}

const _validate = (key, r, o) => {

	if (r.type == Array || r.type == Object) {
		if (!checkRequired(r, o)) {
			return {
				hasError: true,
				errors: { 
					$: `${key} is required`
				}
			};
		}
		let errors = {};
		let hasError = false;
		if (r.type == Array) {
			for(let i = 0; i < o.length; i++) {
				let _ret = _validate(`${key}:${i}`, r.rule, o[i]);
				if (_ret.hasError) {
					errors[""+i] = _ret.errors;
					hasError = true;
				}
			}
			return {
				hasError,
				errors,
			};
		} else {
			Object.keys(r.rule).forEach(_k => {
				const _r = r.rule[_k];
				const _o = _k in o ? o[_k] : undefined;
				let _ret = _validate(_k, _r, _o);
				if (_ret.hasError) {
					errors[_k] = _ret.errors;
					hasError = true;
				}
			});
			return {
				hasError,
				errors,
			};
		}
	}
	if (!checkRequired(r, o)) {
		return {
			hasError: true,
			errors: `${key} is required`
		};
	}
	switch (r.type) {
	case String: 
		break;
	case Number:
		break;
	default:

	}
	return {
		hasError: false,
		errors: "",
	};
}


const validate = (rules, obj) => {
	let result = {
		hasError: false,
		errors: {}
	};
	Object.keys(rules).forEach((key) => {
		const r = rules[key];
		const o = key in obj ? obj[key] : undefined;

		let _ret = _validate(key, r, o);
		if (_ret.hasError) {
			result.hasError = true;
			result.errors[key] = _ret.errors;
		}
	});
	return result;
}

var result = {
	a: {
		$: "must not be null",
		0: {
			aa: "must not be null",
		}
	},
	b: {
		cc: "must not be null",
	},
	d: "must not be null",
	e: {
		$: "size 3",
		1: "must be number"
	}
}


var o = {
	a: [
		{ aa: 1, bb: null},
		{ aa: 2, bb: 3}
	],
	b: {
		bb: 3,
		cc: null,
	},
	c: 3,
	d: null,
	e: [
		3, 4, null
	]
}

var r = {
	a: {
		type: Array,
		required: true,
		rule: {
			type: Object,
			rule: {
				aa: {
					type: Number,
					required: true,
				},
				bb: {
					type: Number,
					required: true,
				}
			}
		}
	},
	b: {
		type: Object,
		required: true,
		rule: {
			bb: {
				type: Number,
				required: true,
			},
			cc: {
				type: Number,
				required: true,
			}
		}
	},
	c: {
		type: Number,
		required: true,
	},
	d: {
		type: Number,
		required: true,
	},
	e: {
		type: Array,
		rule: {
			type: Number,
			required: true
		}
	},
	f: {
		type: Object,
		required: true,
	}
}

console.log(validate(r, o));