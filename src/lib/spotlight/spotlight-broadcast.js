// Vendored from paritytech/spotlight-mesh@54458b8 (`bun run build:sdk`). Do not edit; rebuild and copy.
import { requestResourceAllocation as Qd, HostResponseDecodeError as Jd, getHostLocalStorage as el, isInsideContainer as tl, getStatementStore as Ha, requestPermission as sl, requestDevicePermission as nl, toHex as an, fromHex as il, getAccountsProvider as rl, formatHostError as ol } from "@parity/product-sdk/host";
var al = Object.defineProperty, cl = (s, e, t) => e in s ? al(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ro = (s, e, t) => (cl(s, typeof e != "symbol" ? e + "" : e, t), t), ni = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15
};
function dl(s) {
  const e = s.length % 2, t = (s[1] === "x" ? 2 : 0) + e, n = (s.length - t) / 2 + e, i = new Uint8Array(n);
  e && (i[0] = 0 | ni[s[2]]);
  for (let r = 0; r < n; ) {
    const o = t + r * 2, a = ni[s[o]], d = ni[s[o + 1]];
    i[e + r++] = a << 4 | d;
  }
  return i;
}
var oo = class extends Uint8Array {
  constructor(s) {
    super(s), ro(this, "i", 0), ro(this, "v"), this.v = new DataView(s);
  }
}, Ts = (s) => (e) => s(e instanceof oo ? e : new oo(e instanceof Uint8Array ? e.buffer : typeof e == "string" ? dl(e).buffer : e)), br = (s) => {
  const e = s.length;
  let t = 0;
  for (let i = 0; i < e; i++)
    t += s[i].length;
  const n = new Uint8Array(t);
  for (let i = 0, r = 0; i < e; i++) {
    const o = s[i];
    n.set(o, r), r += o.byteLength;
  }
  return n;
}, st = (s, e) => {
  const t = [s, e];
  return t.enc = s, t.dec = e, t;
}, ll = (s, e) => (t) => s(e(t)), ul = (s, e) => (t) => e(s(t)), ja = ([s, e], t, n) => st(ll(s, t), ul(e, n));
function hl(s, e) {
  return Ts((t) => {
    const n = t.v[e](t.i, !0);
    return t.i += s, n;
  });
}
function fl(s, e) {
  return (t) => {
    const n = new Uint8Array(s);
    return new DataView(n.buffer)[e](0, t, !0), n;
  };
}
function Nt(s, e, t) {
  return st(fl(s, t), hl(s, e));
}
var js = Nt(1, "getUint8", "setUint8"), kn = Nt(2, "getUint16", "setUint16"), xn = Nt(4, "getUint32", "setUint32"), qa = Nt(8, "getBigUint64", "setBigUint64");
Nt(1, "getInt8", "setInt8");
Nt(2, "getInt16", "setInt16");
Nt(4, "getInt32", "setInt32");
Nt(8, "getBigInt64", "setBigInt64");
var Wa = (s) => {
  const e = new Uint8Array(16), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), e;
}, Ga = (s) => Ts((e) => {
  const { v: t, i: n } = e, i = t.getBigUint64(n, !0), r = t[s](n + 8, !0);
  return e.i += 16, r << 64n | i;
});
st(Wa, Ga("getBigUint64"));
st(Wa, Ga("getBigInt64"));
var Za = (s) => {
  const e = new Uint8Array(32), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), t.setBigInt64(16, s >> 128n, !0), t.setBigInt64(24, s >> 192n, !0), e;
}, Ka = (s) => Ts((e) => {
  let t = e.v.getBigUint64(e.i, !0);
  return e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 64n, e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 128n, e.i += 8, t |= e.v[s](e.i, !0) << 192n, e.i += 8, t;
});
st(Za, Ka("getBigUint64"));
st(Za, Ka("getBigInt64"));
ja(js, (s) => s ? 1 : 0, Boolean);
var pl = [js[1], kn[1], xn[1]], ml = Ts((s) => {
  const e = s[s.i], t = e & 3;
  if (t < 3)
    return pl[t](s) >>> 2;
  const n = (e >>> 2) + 4;
  s.i++;
  let i = 0n;
  const r = n / 8 | 0;
  let o = 0n;
  for (let d = 0; d < r; d++)
    i = qa[1](s) << o | i, o += 64n;
  let a = n % 8;
  return a > 3 && (i = BigInt(xn[1](s)) << o | i, o += 32n, a -= 4), a > 1 && (i = BigInt(kn[1](s)) << o | i, o += 16n, a -= 2), a && (i = BigInt(js[1](s)) << o | i), i;
}), gl = 1n << 56n, yl = 1 << 24, wl = 256, bl = 4294967295n, vl = 64, Sl = 16384, _l = 1 << 30, kl = (s) => {
  if (s < 0)
    throw new Error(`Wrong compact input (${s})`);
  const e = Number(s) << 2;
  if (s < vl)
    return js[0](e);
  if (s < Sl)
    return kn[0](e | 1);
  if (s < _l)
    return xn[0](e | 2);
  let t = [new Uint8Array(1)], n = BigInt(s);
  for (; n >= gl; )
    t.push(qa[0](n)), n >>= 64n;
  n >= yl && (t.push(xn[0](Number(n & bl))), n >>= 32n);
  let i = Number(n);
  i >= wl && (t.push(kn[0](i)), i >>= 16), i && t.push(js[0](i));
  const r = br(t);
  return r[0] = r.length - 5 << 2 | 3, r;
}, Xn = st(kl, ml), xl = new TextEncoder(), Tl = (s) => {
  const e = xl.encode(s);
  return br([Xn.enc(e.length), e]);
}, El = new TextDecoder(), Cl = Ts((s) => {
  let e = Xn.dec(s);
  const t = new DataView(s.buffer, s.i, e);
  return s.i += e, El.decode(t);
});
st(Tl, Cl);
var Al = () => {
}, Bl = new Uint8Array(0);
st(() => Bl, Al);
var Xa = (s) => s === void 0 ? (e) => br([Xn.enc(e.length), e]) : (e) => e.length === s ? e : e.slice(0, s), Ya = (s) => Ts((e) => {
  const t = s === void 0 ? Xn.dec(e) : s !== 1 / 0 ? s : e.byteLength - e.i, n = new Uint8Array(e.buffer.slice(e.i, e.i + t));
  return e.i += t, n;
}), vr = (s) => st(Xa(s), Ya(s));
vr.enc = Xa;
vr.dec = Ya;
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ml(s) {
  return s instanceof Uint8Array || ArrayBuffer.isView(s) && s.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in s && s.BYTES_PER_ELEMENT === 1;
}
function Qa(s, e) {
  return Array.isArray(e) ? e.length === 0 ? !0 : s ? e.every((t) => typeof t == "string") : e.every((t) => Number.isSafeInteger(t)) : !1;
}
function Di(s, e) {
  if (typeof e != "string")
    throw new TypeError(`${s}: string expected`);
  return !0;
}
function Ja(s) {
  if (typeof s != "number")
    throw new TypeError(`number expected, got ${typeof s}`);
  if (!Number.isSafeInteger(s))
    throw new RangeError(`invalid integer: ${s}`);
}
function Vi(s) {
  if (!Array.isArray(s))
    throw new TypeError("array expected");
}
function ec(s, e) {
  if (!Qa(!0, e))
    throw new TypeError(`${s}: array of strings expected`);
}
function Il(s, e) {
  if (!Qa(!1, e))
    throw new TypeError(`${s}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Ol(...s) {
  const e = (r) => r, t = (r, o) => (a) => r(o(a)), n = s.map((r) => r.encode).reduceRight(t, e), i = s.map((r) => r.decode).reduce(t, e);
  return { encode: n, decode: i };
}
// @__NO_SIDE_EFFECTS__
function Rl(s) {
  const e = typeof s == "string" ? s.split("") : s, t = e.length;
  ec("alphabet", e);
  const n = new Map(e.map((i, r) => [i, r]));
  return {
    encode: (i) => (Vi(i), i.map((r) => {
      if (!Number.isSafeInteger(r) || r < 0 || r >= t)
        throw new Error(`alphabet.encode: digit index outside alphabet "${r}". Allowed: ${s}`);
      return e[r];
    })),
    decode: (i) => (Vi(i), i.map((r) => {
      Di("alphabet.decode", r);
      const o = n.get(r);
      if (o === void 0)
        throw new Error(`Unknown letter: "${r}". Allowed: ${s}`);
      return o;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Pl(s = "") {
  return Di("join", s), {
    encode: (e) => (ec("join.decode", e), e.join(s)),
    decode: (e) => (Di("join.decode", e), e.split(s))
  };
}
function ao(s, e, t) {
  if (e < 2)
    throw new RangeError(`convertRadix: invalid from=${e}, base cannot be less than 2`);
  if (t < 2)
    throw new RangeError(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (Vi(s), !s.length)
    return [];
  let n = 0;
  const i = [], r = Array.from(s, (a) => {
    if (Ja(a), a < 0 || a >= e)
      throw new Error(`invalid integer: ${a}`);
    return a;
  }), o = r.length;
  for (; ; ) {
    let a = 0, d = !0;
    for (let c = n; c < o; c++) {
      const l = r[c], u = e * a, h = u + l;
      if (!Number.isSafeInteger(h) || u / e !== a || h - l !== u)
        throw new Error("convertRadix: carry overflow");
      const f = h / t;
      a = h % t;
      const m = Math.floor(f);
      if (r[c] = m, !Number.isSafeInteger(m) || m * t + a !== h)
        throw new Error("convertRadix: carry overflow");
      if (d)
        m ? d = !1 : n = c;
      else continue;
    }
    if (i.push(a), d)
      break;
  }
  for (let a = 0; a < s.length - 1 && s[a] === 0; a++)
    i.push(0);
  return i.reverse();
}
// @__NO_SIDE_EFFECTS__
function Fl(s) {
  Ja(s);
  const e = 2 ** 8;
  return {
    encode: (t) => {
      if (!Ml(t))
        throw new TypeError("radix.encode input should be Uint8Array");
      return ao(Array.from(t), e, s);
    },
    decode: (t) => (Il("radix.decode", t), Uint8Array.from(ao(t, s, e)))
  };
}
const Ll = /* @__NO_SIDE_EFFECTS__ */ (s) => /* @__PURE__ */ Ol(/* @__PURE__ */ Fl(58), /* @__PURE__ */ Rl(s), /* @__PURE__ */ Pl("")), tc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Ll("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
function sc(s) {
  return s instanceof Uint8Array || ArrayBuffer.isView(s) && s.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in s && s.BYTES_PER_ELEMENT === 1;
}
function ft(s, e = "") {
  if (typeof s != "number") {
    const t = e && `"${e}" `;
    throw new TypeError(`${t}expected number, got ${typeof s}`);
  }
  if (!Number.isSafeInteger(s) || s < 0) {
    const t = e && `"${e}" `;
    throw new RangeError(`${t}expected integer >= 0, got ${s}`);
  }
}
function Be(s, e, t = "") {
  const n = sc(s), i = s?.length, r = e !== void 0;
  if (!n || r && i !== e) {
    const o = t && `"${t}" `, a = r ? ` of length ${e}` : "", d = n ? `length=${i}` : `type=${typeof s}`, c = o + "expected Uint8Array" + a + ", got " + d;
    throw n ? new RangeError(c) : new TypeError(c);
  }
  return s;
}
function Sr(s) {
  if (typeof s != "function" || typeof s.create != "function")
    throw new TypeError("Hash must wrapped by utils.createHasher");
  if (ft(s.outputLen), ft(s.blockLen), s.outputLen < 1)
    throw new Error('"outputLen" must be >= 1');
  if (s.blockLen < 1)
    throw new Error('"blockLen" must be >= 1');
}
function gs(s, e = !0) {
  if (s.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && s.finished)
    throw new Error("Hash#digest() has already been called");
}
function _r(s, e) {
  Be(s, void 0, "digestInto() output");
  const t = e.outputLen;
  if (s.length < t)
    throw new RangeError('"digestInto() output" expected to be of length >=' + t);
}
function Tn(s) {
  return new Uint32Array(s.buffer, s.byteOffset, Math.floor(s.byteLength / 4));
}
function Je(...s) {
  for (let e = 0; e < s.length; e++)
    s[e].fill(0);
}
function ii(s) {
  return new DataView(s.buffer, s.byteOffset, s.byteLength);
}
function He(s, e) {
  return s << 32 - e | s >>> e;
}
const nc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ic(s) {
  return s << 24 & 4278190080 | s << 8 & 16711680 | s >>> 8 & 65280 | s >>> 24 & 255;
}
const rt = nc ? (s) => s : (s) => ic(s) >>> 0;
function Ul(s) {
  for (let e = 0; e < s.length; e++)
    s[e] = ic(s[e]);
  return s;
}
const ss = nc ? (s) => s : Ul, rc = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Nl = /* @__PURE__ */ Array.from({ length: 256 }, (s, e) => e.toString(16).padStart(2, "0"));
function Ve(s) {
  if (Be(s), rc)
    return s.toHex();
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += Nl[s[t]];
  return e;
}
const nt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function co(s) {
  if (s >= nt._0 && s <= nt._9)
    return s - nt._0;
  if (s >= nt.A && s <= nt.F)
    return s - (nt.A - 10);
  if (s >= nt.a && s <= nt.f)
    return s - (nt.a - 10);
}
function Ie(s) {
  if (typeof s != "string")
    throw new TypeError("hex string expected, got " + typeof s);
  if (rc)
    try {
      return Uint8Array.fromHex(s);
    } catch (i) {
      throw i instanceof SyntaxError ? new RangeError(i.message) : i;
    }
  const e = s.length, t = e / 2;
  if (e % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + e);
  const n = new Uint8Array(t);
  for (let i = 0, r = 0; i < t; i++, r += 2) {
    const o = co(s.charCodeAt(r)), a = co(s.charCodeAt(r + 1));
    if (o === void 0 || a === void 0) {
      const d = s[r] + s[r + 1];
      throw new RangeError('hex string expected, got non-hex character "' + d + '" at index ' + r);
    }
    n[i] = o * 16 + a;
  }
  return n;
}
function Dl(...s) {
  let e = 0;
  for (let n = 0; n < s.length; n++) {
    const i = s[n];
    Be(i), e += i.length;
  }
  const t = new Uint8Array(e);
  for (let n = 0, i = 0; n < s.length; n++) {
    const r = s[n];
    t.set(r, i), i += r.length;
  }
  return t;
}
function kr(s, e = {}) {
  const t = (i, r) => s(r).update(i).digest(), n = s(void 0);
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.canXOF = n.canXOF, t.create = (i) => s(i), Object.assign(t, e), Object.freeze(t);
}
function Vl(s = 32) {
  ft(s, "bytesLength");
  const e = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof e?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (s > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${s}`);
  return e.getRandomValues(new Uint8Array(s));
}
const oc = (s) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, s])
}), $l = /* @__PURE__ */ Uint8Array.from([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9,
  12,
  5,
  1,
  15,
  14,
  13,
  4,
  10,
  0,
  7,
  6,
  3,
  9,
  2,
  8,
  11,
  13,
  11,
  7,
  14,
  12,
  1,
  3,
  9,
  5,
  0,
  15,
  4,
  8,
  6,
  2,
  10,
  6,
  15,
  14,
  9,
  11,
  3,
  0,
  8,
  12,
  2,
  13,
  7,
  1,
  4,
  10,
  5,
  10,
  2,
  8,
  4,
  7,
  6,
  1,
  5,
  15,
  11,
  9,
  14,
  3,
  12,
  13,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  // Blake1, unused in others
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9
]);
function zl(s, e, t) {
  return s & e ^ ~s & t;
}
function Hl(s, e, t) {
  return s & e ^ s & t ^ e & t;
}
class ac {
  blockLen;
  outputLen;
  canXOF = !1;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = !1;
  length = 0;
  pos = 0;
  destroyed = !1;
  constructor(e, t, n, i) {
    this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = i, this.buffer = new Uint8Array(e), this.view = ii(this.buffer);
  }
  update(e) {
    gs(this), Be(e);
    const { view: t, buffer: n, blockLen: i } = this, r = e.length;
    for (let o = 0; o < r; ) {
      const a = Math.min(i - this.pos, r - o);
      if (a === i) {
        const d = ii(e);
        for (; i <= r - o; o += i)
          this.process(d, o);
        continue;
      }
      n.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    gs(this), _r(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: i, isLE: r } = this;
    let { pos: o } = this;
    t[o++] = 128, Je(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(n, 0), o = 0);
    for (let u = o; u < i; u++)
      t[u] = 0;
    n.setBigUint64(i - 8, BigInt(this.length * 8), r), this.process(n, 0);
    const a = ii(e), d = this.outputLen;
    if (d % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const c = d / 4, l = this.get();
    if (c > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < c; u++)
      a.setUint32(4 * u, l[u], r);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e ||= new this.constructor(), e.set(...this.get());
    const { blockLen: t, buffer: n, length: i, finished: r, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = r, e.length = i, e.pos = a, i % t && e.buffer.set(n), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const mt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ce = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]), cn = /* @__PURE__ */ BigInt(2 ** 32 - 1), lo = /* @__PURE__ */ BigInt(32);
function cc(s, e = !1) {
  return e ? { h: Number(s & cn), l: Number(s >> lo & cn) } : { h: Number(s >> lo & cn) | 0, l: Number(s & cn) | 0 };
}
function jl(s, e = !1) {
  const t = s.length;
  let n = new Uint32Array(t), i = new Uint32Array(t);
  for (let r = 0; r < t; r++) {
    const { h: o, l: a } = cc(s[r], e);
    [n[r], i[r]] = [o, a];
  }
  return [n, i];
}
const uo = (s, e, t) => s >>> t, ho = (s, e, t) => s << 32 - t | e >>> t, Et = (s, e, t) => s >>> t | e << 32 - t, Ct = (s, e, t) => s << 32 - t | e >>> t, Fs = (s, e, t) => s << 64 - t | e >>> t - 32, Ls = (s, e, t) => s >>> t - 32 | e << 64 - t, ql = (s, e) => e, Wl = (s, e) => s;
function Ne(s, e, t, n) {
  const i = (e >>> 0) + (n >>> 0);
  return { h: s + t + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const xr = (s, e, t) => (s >>> 0) + (e >>> 0) + (t >>> 0), Tr = (s, e, t, n) => e + t + n + (s / 2 ** 32 | 0) | 0, Gl = (s, e, t, n) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0), Zl = (s, e, t, n, i) => e + t + n + i + (s / 2 ** 32 | 0) | 0, Kl = (s, e, t, n, i) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0) + (i >>> 0), Xl = (s, e, t, n, i, r) => e + t + n + i + r + (s / 2 ** 32 | 0) | 0, be = /* @__PURE__ */ Uint32Array.from([
  4089235720,
  1779033703,
  2227873595,
  3144134277,
  4271175723,
  1013904242,
  1595750129,
  2773480762,
  2917565137,
  1359893119,
  725511199,
  2600822924,
  4215389547,
  528734635,
  327033209,
  1541459225
]), T = /* @__PURE__ */ new Uint32Array(32);
function gt(s, e, t, n, i, r) {
  const o = i[r], a = i[r + 1];
  let d = T[2 * s], c = T[2 * s + 1], l = T[2 * e], u = T[2 * e + 1], h = T[2 * t], f = T[2 * t + 1], m = T[2 * n], g = T[2 * n + 1], p = xr(d, l, o);
  c = Tr(p, c, u, a), d = p | 0, { Dh: g, Dl: m } = { Dh: g ^ c, Dl: m ^ d }, { Dh: g, Dl: m } = { Dh: ql(g, m), Dl: Wl(g) }, { h: f, l: h } = Ne(f, h, g, m), { Bh: u, Bl: l } = { Bh: u ^ f, Bl: l ^ h }, { Bh: u, Bl: l } = { Bh: Et(u, l, 24), Bl: Ct(u, l, 24) }, T[2 * s] = d, T[2 * s + 1] = c, T[2 * e] = l, T[2 * e + 1] = u, T[2 * t] = h, T[2 * t + 1] = f, T[2 * n] = m, T[2 * n + 1] = g;
}
function yt(s, e, t, n, i, r) {
  const o = i[r], a = i[r + 1];
  let d = T[2 * s], c = T[2 * s + 1], l = T[2 * e], u = T[2 * e + 1], h = T[2 * t], f = T[2 * t + 1], m = T[2 * n], g = T[2 * n + 1], p = xr(d, l, o);
  c = Tr(p, c, u, a), d = p | 0, { Dh: g, Dl: m } = { Dh: g ^ c, Dl: m ^ d }, { Dh: g, Dl: m } = { Dh: Et(g, m, 16), Dl: Ct(g, m, 16) }, { h: f, l: h } = Ne(f, h, g, m), { Bh: u, Bl: l } = { Bh: u ^ f, Bl: l ^ h }, { Bh: u, Bl: l } = { Bh: Fs(u, l, 63), Bl: Ls(u, l, 63) }, T[2 * s] = d, T[2 * s + 1] = c, T[2 * e] = l, T[2 * e + 1] = u, T[2 * t] = h, T[2 * t + 1] = f, T[2 * n] = m, T[2 * n + 1] = g;
}
function Yl(s, e = {}, t, n, i) {
  if (ft(t), s <= 0 || s > t)
    throw new Error("outputLen bigger than keyLen");
  const { key: r, salt: o, personalization: a } = e;
  if (r !== void 0 && (r.length < 1 || r.length > t))
    throw new Error('"key" expected to be undefined or of length=1..' + t);
  o !== void 0 && Be(o, n, "salt"), a !== void 0 && Be(a, i, "personalization");
}
class Ql {
  buffer;
  buffer32;
  finished = !1;
  destroyed = !1;
  length = 0;
  pos = 0;
  blockLen;
  outputLen;
  canXOF = !1;
  constructor(e, t) {
    ft(e), ft(t), this.blockLen = e, this.outputLen = t, this.buffer = new Uint8Array(e), this.buffer32 = Tn(this.buffer);
  }
  update(e) {
    gs(this), Be(e);
    const { blockLen: t, buffer: n, buffer32: i } = this, r = e.length, o = e.byteOffset, a = e.buffer;
    for (let d = 0; d < r; ) {
      this.pos === t && (ss(i), this.compress(i, 0, !1), ss(i), this.pos = 0);
      const c = Math.min(t - this.pos, r - d), l = o + d;
      if (c === t && !(l % 4) && d + c < r) {
        const u = new Uint32Array(a, l, Math.floor((r - d) / 4));
        ss(u);
        for (let h = 0; d + t < r; h += i.length, d += t)
          this.length += t, this.compress(u, h, !1);
        ss(u);
        continue;
      }
      n.set(e.subarray(d, d + c), this.pos), this.pos += c, this.length += c, d += c;
    }
    return this;
  }
  digestInto(e) {
    gs(this), _r(e, this);
    const { pos: t, buffer32: n } = this;
    if (this.finished = !0, Je(this.buffer.subarray(t)), ss(n), this.compress(n, 0, !0), ss(n), e.byteOffset & 3)
      throw new RangeError('"digestInto() output" expected 4-byte aligned byteOffset, got ' + e.byteOffset);
    const i = this.get(), r = Tn(e), o = Math.floor(this.outputLen / 4);
    for (let l = 0; l < o; l++)
      r[l] = rt(i[l]);
    const a = this.outputLen % 4;
    if (!a)
      return;
    const d = o * 4, c = i[o];
    for (let l = 0; l < a; l++)
      e[d + l] = c >>> 8 * l;
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    const { buffer: t, length: n, finished: i, destroyed: r, outputLen: o, pos: a } = this;
    return e ||= new this.constructor({ dkLen: o }), e.set(...this.get()), e.buffer.set(t), e.destroyed = r, e.finished = i, e.length = n, e.pos = a, e.outputLen = o, e;
  }
  clone() {
    return this._cloneInto();
  }
}
class Jl extends Ql {
  // Same IV words as SHA-512 / BLAKE2b, encoded as LE u32 low/high halves.
  v0l = be[0] | 0;
  v0h = be[1] | 0;
  v1l = be[2] | 0;
  v1h = be[3] | 0;
  v2l = be[4] | 0;
  v2h = be[5] | 0;
  v3l = be[6] | 0;
  v3h = be[7] | 0;
  v4l = be[8] | 0;
  v4h = be[9] | 0;
  v5l = be[10] | 0;
  v5h = be[11] | 0;
  v6l = be[12] | 0;
  v6h = be[13] | 0;
  v7l = be[14] | 0;
  v7h = be[15] | 0;
  constructor(e = {}) {
    const t = e.dkLen === void 0 ? 64 : e.dkLen;
    super(128, t), Yl(t, e, 64, 16, 16);
    let { key: n, personalization: i, salt: r } = e, o = 0;
    if (n !== void 0 && (Be(n, void 0, "key"), o = n.length), this.v0l ^= this.outputLen | o << 8 | 65536 | 1 << 24, r !== void 0) {
      Be(r, void 0, "salt");
      const a = Tn(r);
      this.v4l ^= rt(a[0]), this.v4h ^= rt(a[1]), this.v5l ^= rt(a[2]), this.v5h ^= rt(a[3]);
    }
    if (i !== void 0) {
      Be(i, void 0, "personalization");
      const a = Tn(i);
      this.v6l ^= rt(a[0]), this.v6h ^= rt(a[1]), this.v7l ^= rt(a[2]), this.v7h ^= rt(a[3]);
    }
    if (n !== void 0) {
      const a = new Uint8Array(this.blockLen);
      a.set(n), this.update(a);
    }
  }
  // prettier-ignore
  get() {
    let { v0l: e, v0h: t, v1l: n, v1h: i, v2l: r, v2h: o, v3l: a, v3h: d, v4l: c, v4h: l, v5l: u, v5h: h, v6l: f, v6h: m, v7l: g, v7h: p } = this;
    return [e, t, n, i, r, o, a, d, c, l, u, h, f, m, g, p];
  }
  // prettier-ignore
  set(e, t, n, i, r, o, a, d, c, l, u, h, f, m, g, p) {
    this.v0l = e | 0, this.v0h = t | 0, this.v1l = n | 0, this.v1h = i | 0, this.v2l = r | 0, this.v2h = o | 0, this.v3l = a | 0, this.v3h = d | 0, this.v4l = c | 0, this.v4h = l | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = f | 0, this.v6h = m | 0, this.v7l = g | 0, this.v7h = p | 0;
  }
  compress(e, t, n) {
    this.get().forEach((d, c) => T[c] = d), T.set(be, 16);
    let { h: i, l: r } = cc(BigInt(this.length));
    T[24] = be[8] ^ r, T[25] = be[9] ^ i, n && (T[28] = ~T[28], T[29] = ~T[29]);
    let o = 0;
    const a = $l;
    for (let d = 0; d < 12; d++)
      gt(0, 4, 8, 12, e, t + 2 * a[o++]), yt(0, 4, 8, 12, e, t + 2 * a[o++]), gt(1, 5, 9, 13, e, t + 2 * a[o++]), yt(1, 5, 9, 13, e, t + 2 * a[o++]), gt(2, 6, 10, 14, e, t + 2 * a[o++]), yt(2, 6, 10, 14, e, t + 2 * a[o++]), gt(3, 7, 11, 15, e, t + 2 * a[o++]), yt(3, 7, 11, 15, e, t + 2 * a[o++]), gt(0, 5, 10, 15, e, t + 2 * a[o++]), yt(0, 5, 10, 15, e, t + 2 * a[o++]), gt(1, 6, 11, 12, e, t + 2 * a[o++]), yt(1, 6, 11, 12, e, t + 2 * a[o++]), gt(2, 7, 8, 13, e, t + 2 * a[o++]), yt(2, 7, 8, 13, e, t + 2 * a[o++]), gt(3, 4, 9, 14, e, t + 2 * a[o++]), yt(3, 4, 9, 14, e, t + 2 * a[o++]);
    this.v0l ^= T[0] ^ T[16], this.v0h ^= T[1] ^ T[17], this.v1l ^= T[2] ^ T[18], this.v1h ^= T[3] ^ T[19], this.v2l ^= T[4] ^ T[20], this.v2h ^= T[5] ^ T[21], this.v3l ^= T[6] ^ T[22], this.v3h ^= T[7] ^ T[23], this.v4l ^= T[8] ^ T[24], this.v4h ^= T[9] ^ T[25], this.v5l ^= T[10] ^ T[26], this.v5h ^= T[11] ^ T[27], this.v6l ^= T[12] ^ T[28], this.v6h ^= T[13] ^ T[29], this.v7l ^= T[14] ^ T[30], this.v7h ^= T[15] ^ T[31], Je(T);
  }
  destroy() {
    this.destroyed = !0, Je(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const Yn = /* @__PURE__ */ kr((s) => new Jl(s)), dc = new TextEncoder().encode("SS58PRE"), $i = 2, eu = (s) => {
  try {
    const e = tc.decode(s), t = e.subarray(0, e[0] & 64 ? 2 : 1), n = e.subarray(
      t.length,
      e.length - $i
    ), i = e.subarray(t.length + n.length), r = Yn(
      Uint8Array.of(...dc, ...t, ...n),
      {
        dkLen: 64
      }
    ).subarray(0, $i);
    return i[0] === r[0] && i[1] === r[1] ? {
      isValid: !0,
      ss58Format: tu(t),
      publicKey: n.slice()
    } : { isValid: !1 };
  } catch {
    return { isValid: !1 };
  }
}, tu = (s) => {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  return e.byteLength === 1 ? e.getUint8(0) : e.getUint16(0);
}, su = (s) => {
  let e = 0n;
  const t = new DataView(s.buffer), n = Math.floor(s.length / 8);
  for (let i = 0; i < n; i++)
    e = e << 64n | t.getBigUint64(i * 8);
  for (let i = n * 8; i < s.length; i++)
    e = e << 8n | BigInt(t.getUint8(i));
  return e;
}, nu = (s) => {
  let e = /* @__PURE__ */ new Map(), t = 0, n = 0;
  const i = () => {
    t === n ? (e.clear(), t = n = 0) : (n = t, setTimeout(i, 0));
  };
  return (r) => {
    ++t === 1 && i();
    const o = su(r);
    return e.has(o) || e.set(o, s(r)), e.get(o);
  };
}, iu = (s) => {
  const e = s < 64 ? Uint8Array.of(s) : Uint8Array.of(
    (s & 252) >> 2 | 64,
    s >> 8 | (s & 3) << 6
  );
  return nu((t) => {
    const n = Yn(
      Uint8Array.of(...dc, ...e, ...t),
      {
        dkLen: 64
      }
    ).subarray(0, $i);
    return tc.encode(
      Uint8Array.of(...e, ...t, ...n)
    );
  });
};
function ru(s, e) {
  return (t) => {
    const n = eu(t);
    if (!n.isValid) throw new Error("Invalid checksum");
    const { publicKey: i } = n;
    if (i.length !== s)
      throw new Error("Invalid public key length");
    return i;
  };
}
const lc = (s = 42, e = 32) => ja(
  vr(e),
  ru(e),
  iu(s)
), ou = { dkLen: 32 }, au = (s) => Yn(s, ou);
function cu(s) {
  return s === "Domain" || /^V\d+$/.test(s);
}
function du(s) {
  let e = s;
  for (let t = 0; t < 4; t++) {
    if (typeof e != "object" || e === null || !("tag" in e)) return null;
    const n = e, i = String(n.tag);
    if (!cu(i)) {
      const r = n.value?.reason;
      return r ? `${i}: ${r}` : i;
    }
    if (n.value === void 0) return i;
    e = n.value;
  }
  return null;
}
const lu = Date.now(), fo = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", po = 5;
function uu() {
  const s = new Uint8Array(po);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(s);
  else
    for (let t = 0; t < po; t += 1) s[t] = Math.floor(Math.random() * 256);
  let e = "";
  for (const t of s) e += fo[t % fo.length];
  return e;
}
const uc = uu(), hu = "spotlight-broadcast-sdk · 54458b8 · 2026-10-26", fu = 4, ri = 2e3, mo = 8, pu = "[circular]", mu = "[deep]";
function oi(s) {
  return s.length <= ri ? s : `${s.slice(0, ri)}…(${s.length - ri} more)`;
}
function gu(s) {
  const e = s.subarray(0, mo);
  let t = "";
  for (const n of e) t += n.toString(16).padStart(2, "0");
  return `0x${t}${s.length > mo ? "…" : ""}`;
}
function yu(s) {
  return `[fn ${s.name || "(anonymous)"}]`;
}
function cs(s, e, t) {
  if (e > fu) return mu;
  if (s === null) return null;
  switch (typeof s) {
    case "string":
      return oi(s);
    case "number":
      return Number.isFinite(s) ? s : String(s);
    case "boolean":
      return s;
    case "undefined":
      return;
    case "bigint":
      return `${s.toString()}n`;
    case "function":
      return yu(s);
    case "symbol":
      return s.toString();
  }
  const n = s;
  if (t.has(n)) return pu;
  if (n instanceof Error)
    return {
      name: n.name,
      message: oi(n.message),
      stack: typeof n.stack == "string" ? oi(n.stack) : void 0
    };
  if (n instanceof Uint8Array) return gu(n);
  if (n instanceof Date) return n.toISOString();
  t.add(n);
  try {
    if (Array.isArray(n))
      return n.map((r) => cs(r, e + 1, t));
    if (n instanceof Map) {
      const r = {};
      for (const [o, a] of n)
        r[typeof o == "string" ? o : String(cs(o, e + 1, t))] = cs(
          a,
          e + 1,
          t
        );
      return r;
    }
    if (n instanceof Set)
      return [...n].map((r) => cs(r, e + 1, t));
    const i = {};
    for (const [r, o] of Object.entries(n))
      i[r] = cs(o, e + 1, t);
    return i;
  } finally {
    t.delete(n);
  }
}
function wu(s, e = 0) {
  try {
    return cs(s, e, /* @__PURE__ */ new Set());
  } catch {
    return "[unserializable]";
  }
}
function bu(s) {
  if (s === void 0) return;
  const e = wu(s);
  return typeof e != "object" || e === null ? { value: e } : e;
}
const go = 5e3, En = { debug: 0, info: 1, warn: 2, error: 3 };
let Us = [], vu = 0, hc = "debug";
const fc = /* @__PURE__ */ new Set();
let Ds = null, fs = null;
function ai() {
  Ds !== null && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(Ds), Ds = null, fs !== null && (clearTimeout(fs), fs = null);
  for (const s of fc)
    try {
      s();
    } catch {
    }
}
function Su() {
  fc.size !== 0 && (Ds !== null || fs !== null || (typeof requestAnimationFrame == "function" ? (Ds = requestAnimationFrame(ai), fs = setTimeout(ai, 100)) : fs = setTimeout(ai, 0)));
}
function dn(s, e, t, n) {
  if (En[s] < En[hc]) return;
  const i = { seq: ++vu, sid: uc, ts: Date.now(), level: s, ns: e, msg: String(t) }, r = bu(n);
  r !== void 0 && (i.data = r), Us.length >= go && Us.splice(0, Us.length - go + 1), Us.push(i), Su();
}
function _u(s) {
  return En[s] >= En[hc];
}
function ku() {
  return Us.slice();
}
function ne(s) {
  return {
    ns: s,
    debug(e, t) {
      dn("debug", s, e, t);
    },
    info(e, t) {
      dn("info", s, e, t);
    },
    warn(e, t) {
      dn("warn", s, e, t);
    },
    error(e, t) {
      dn("error", s, e, t);
    },
    on(e) {
      return _u(e);
    }
  };
}
const yo = 8, xu = 8;
function b(s) {
  return s == null ? String(s) : s.length > yo ? `${s.slice(0, yo)}…` : s;
}
function Te(s) {
  const e = s.startsWith("0x") ? s.slice(2) : s, t = e.slice(0, xu * 2);
  return `0x${t}${e.length > t.length ? "…" : ""}`;
}
function re(s) {
  const e = /* @__PURE__ */ new Map();
  return {
    allow(t = "") {
      const n = (e.get(t) ?? 0) + 1;
      return e.set(t, n), n <= s;
    },
    count(t = "") {
      return e.get(t) ?? 0;
    },
    reset() {
      e.clear();
    }
  };
}
const Tu = 18, ln = 120, Eu = 13;
function Cu(s) {
  return s.toUpperCase().padEnd(5);
}
function Au(s) {
  if (typeof s == "string") return s;
  if (typeof s == "number" || typeof s == "boolean" || s === null)
    return String(s);
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return "[unserializable]";
  }
}
function Bu(s) {
  const e = [];
  for (const [i, r] of Object.entries(s))
    e.push(`${i}=${Au(r)}`);
  if (e.length === 0) return [];
  const t = [];
  let n = "";
  for (const i of e)
    for (n !== "" && n.length + 1 + i.length > ln && (t.push(n), n = ""), n = n === "" ? `    ${i}` : `${n} ${i}`; n.length > ln; )
      t.push(n.slice(0, ln)), n = `    ${n.slice(ln)}`;
  return n !== "" && t.push(n), t;
}
function Mu(s) {
  const t = `${new Date(s.ts).toISOString()}  ${Cu(s.level)}  ${s.sid}  ${s.ns.padEnd(Tu)}${s.msg}`;
  return !s.data || Object.keys(s.data).length === 0 ? [t] : [t, ...Bu(s.data)];
}
function Iu() {
  return typeof location > "u" ? "(unknown)" : location.href;
}
function Ou() {
  return typeof navigator > "u" ? "(unknown)" : navigator.userAgent;
}
function Ru(s, e = {}) {
  const t = e.page ?? Iu(), n = e.userAgent ?? Ou(), i = e.sessionStartMs ?? lu, r = e.build ?? hu, o = (c) => `${c} `.padEnd(Math.max(Eu, c.length + 1), " "), a = [
    "# spotlight debug log",
    `# ${o("build")}${r}`,
    `# ${o("session start")}${new Date(i).toISOString()}`,
    `# ${o("page")}${t}`,
    `# ${o("user agent")}${n}`,
    `# ${o("entries")}${s.length}`,
    `# ${o("session id")}${e.sessionId ?? uc} (this page load)`
  ];
  for (const c of e.earlier ?? [])
    a.push(
      `# ${o("earlier")}${c.sid}  start ${new Date(c.startMs).toISOString()}  entries ${c.entries}  build ${c.build}  page ${c.page}`
    );
  const d = [];
  for (const c of s) d.push(...Mu(c));
  return `${[...a, ...d].join(`
`)}
`;
}
const Pu = ne("triangle"), pc = {
  // paseo-next-v2 Asset Hub — the network the dotns deploy targets
  // (.github/workflows/deploy-dotns.yml passes `--env paseo-next-v2`).
  // Verified against wss://paseo-asset-hub-next-rpc.polkadot.io on 2026-09-07,
  // after the chain was re-genesised AGAIN (third hash in a month:
  // 0xbf0488db… → 0x23e730eb… → this one). Each wipe also destroys the
  // deployed tip contract at CONTRACT_ADDRESS.
  // Testnets get re-genesised: if the host answers "chain not supported",
  // re-read the hash with chainSpec_v1_genesisHash before you debug anything else.
  "paseo-asset-hub-next": "0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a"
}, wo = pc["paseo-asset-hub-next"], Fu = {
  [pc["paseo-asset-hub-next"]]: "paseo"
};
function Lu() {
  const s = Fu[wo.toLowerCase()];
  return s || (Pu.error(
    "no DotNS TLD known for this genesis — the host will refuse the product account with DomainNotValid, and there will be no wallet, no statements and no tips. Set VITE_DOTNS_SUFFIX to this network's TLD, or add the genesis to DOTNS_SUFFIX_BY_GENESIS in src/lib/triangle/constants.ts.",
    { genesis: Te(wo), fallback: "paseo" }
  ), "paseo");
}
const Er = Lu(), Uu = ne("wallet");
function mc(s, e = Er) {
  const t = s.hostname.toLowerCase(), n = s.host.toLowerCase();
  if (s.protocol === "dot:") return t;
  if (t === "localhost" || t === "127.0.0.1" || t.endsWith(".localhost"))
    return n;
  const i = t.split(".");
  if (t.endsWith(`.${e}`))
    return i.length > 2 ? i.slice(-2).join(".") : t;
  if (i.length >= 3) {
    let r = i.slice(0, -2);
    if (r[r.length - 1] === "app" && (r = r.slice(0, -1)), r[0] === "app" && (r = r.slice(1)), r.length > 0) return `${r.join(".")}.${e}`;
  }
  return n;
}
const Nu = typeof window > "u" ? "" : mc(window.location);
typeof window < "u" && Uu.info("product identifier derived", {
  identifier: Nu,
  origin: `${window.location.protocol}//${window.location.host}`,
  suffix: `.${Er}`
});
class gc extends Error {
  constructor(e, t) {
    super(`${e} timed out after ${t}ms`), this.label = e, this.elapsedMs = t, this.name = "DeadlineError";
  }
  kind = "DeadlineError";
}
function yc(s) {
  return s instanceof gc;
}
const ys = {
  /** Quick chain read (ReviveApi.call dry-run, Assets.Account balance, ...). */
  read: 45e3,
  /** Submit + best-block inclusion via signSubmitAndWatch. */
  submit: 6e4,
  /** User-gated sign action — mobile wallet round-trip + user finding the app. */
  sign: 9e4,
  /** Host-bridge permission / allowance dialog. */
  hostDialog: 9e4
};
async function Rt(s, e, t) {
  const n = Date.now(), i = typeof s == "function" ? s() : s;
  let r;
  const o = new Promise((a, d) => {
    r = setTimeout(() => d(new gc(t, Date.now() - n)), e);
  });
  try {
    return await Promise.race([i, o]);
  } finally {
    r && clearTimeout(r);
  }
}
const un = ne("statement.alloc");
async function Du(s, e, t) {
  try {
    const n = await Rt(
      async () => Qd(s),
      e,
      `requestResourceAllocation(${t})`
    );
    if (!n.ok) {
      const o = bo(n.error), a = Vu(n.error);
      return un.warn("resource allocation failed", { label: t, detail: o, answered: a }), { status: "error", detail: o, answered: a };
    }
    const i = {}, r = [];
    return n.value.forEach((o, a) => {
      const d = s[a]?.tag;
      r.push(`${d ?? a}=${o}`), d && (i[d] = o);
    }), un.info("allowance outcomes", { label: t, outcomes: r.join(" ") }), { status: "ok", outcomes: i };
  } catch (n) {
    if (yc(n))
      return un.warn("resource allocation: no answer inside the deadline", { label: t, timeoutMs: e }), { status: "timeout" };
    const i = bo(n);
    return un.warn("resource allocation threw", { label: t, detail: i }), { status: "error", detail: i, answered: !1 };
  }
}
function Vu(s) {
  return !(s instanceof Jd);
}
function bo(s) {
  if (s instanceof Error) return s.message;
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return String(s);
  }
}
const Cr = ne("host.grants"), Qs = "spotlight/host-grants/v1", $u = 864e5;
function Ar(s = Date.now()) {
  return Math.floor(s / $u);
}
function zu(s, e, t = Ar()) {
  return s ? e === "forever" || s.slot === t : !1;
}
let Ke = null, ci = null, di = null;
function Br() {
  return di ??= el().catch((s) => (di = null, Cr.warn("host local storage unavailable — falling back to page storage", { err: s }), null)), di;
}
function Hu(s) {
  if (!s) return {};
  try {
    const e = JSON.parse(s);
    return e && typeof e == "object" ? e : {};
  } catch {
    return {};
  }
}
function ju() {
  try {
    return localStorage.getItem(Qs);
  } catch {
    return null;
  }
}
function wc(s) {
  try {
    localStorage.setItem(Qs, s);
  } catch {
  }
}
function bc() {
  return Ke ? Promise.resolve(Ke) : (ci ??= (async () => {
    const s = await Rt(
      (async () => {
        const e = await Br();
        return (e ? await e.readString(Qs).catch(() => null) : null) ?? ju();
      })(),
      ys.read,
      "loadGrants"
    ).catch((e) => (Cr.warn("could not read remembered grants — asking as if nothing were", { err: e }), null));
    return Ke = Hu(s), Ke;
  })().finally(() => {
    ci = null;
  }), ci);
}
function Mr(s, e) {
  const t = { ...Ke ?? {}, [s]: { outcome: e, slot: Ar() } };
  Ke = t;
  const n = JSON.stringify(t);
  wc(n), (async () => await (await Br())?.writeString(Qs, n).catch((r) => {
    Cr.warn("could not persist a grant to host storage", { grant: s, err: r });
  }))();
}
function qu(s) {
  if (!Ke || !(s in Ke)) return;
  const e = { ...Ke };
  delete e[s], Ke = e;
  const t = JSON.stringify(e);
  wc(t), (async () => await (await Br())?.writeString(Qs, t).catch(() => {
  }))();
}
let Bs = null, vc = 0;
const Wu = /* @__PURE__ */ new Set();
function Sc(s) {
  if (Bs !== s && !(Bs && s && Bs.outcome === s.outcome && Bs.message === s.message)) {
    Bs = s;
    for (const e of Wu)
      try {
        e();
      } catch {
      }
  }
}
function Gu(s = Date.now()) {
  vc = s, Sc(null);
}
function Zu() {
  return vc;
}
const vo = [6e4, 12e4, 24e4, 48e4, 9e5];
class zi extends Error {
  until;
  constructor(e, t) {
    super(
      `Signaling is paused until ${Xu(e)}: the Polkadot app could not sign for Spotlight.`,
      t
    ), this.name = "SignalingPausedError", this.until = e;
  }
}
function Ku(s) {
  return s instanceof zi;
}
function Xu(s) {
  return new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
let Ze = null;
const Yu = /* @__PURE__ */ new Set();
function Qu(s = Date.now()) {
  return Ze && s < Ze.until ? Ze.until : null;
}
function _c(s = Date.now()) {
  if (Ze && s < Ze.until) return Ze;
  const e = (Ze?.strikes ?? 0) + 1, t = vo[Math.min(e, vo.length) - 1];
  return kc({ until: s + t, strikes: e }), Ze;
}
function Ju() {
  Ze && kc(null);
}
function kc(s) {
  Ze = s;
  for (const e of Yu)
    try {
      e();
    } catch {
    }
}
const Ye = ne("host.grants"), eh = {
  statements: "day-slot",
  contracts: "day-slot",
  "statement-submit": "session",
  "chain-submit": "session",
  camera: "forever",
  microphone: "forever"
}, wn = ["contracts"], th = {
  contracts: "SmartContractAllowance"
}, sh = {
  "statement-submit": { tag: "StatementSubmit", value: void 0 },
  "chain-submit": { tag: "ChainSubmit", value: void 0 }
}, nh = {
  camera: "Camera",
  microphone: "Microphone"
}, ih = [
  { tag: "SmartContractAllowance", value: { tag: "Index", value: 0 } },
  { tag: "AutoSigning", value: void 0 }
];
function rh() {
  return {
    proof: void 0,
    decryptionKey: void 0,
    expiry: BigInt(Math.floor(Date.now() / 1e3) + 60) << 32n,
    channel: void 0,
    topics: [],
    data: "0x00"
  };
}
const Cn = 12e4, Hi = 6e4, xc = {
  // The host reports a refusal, a phone with no free slot and an offline phone
  // as the same `UnableToSign`, so this line has to cover all three.
  declined: "The Polkadot app did not let Spotlight publish to the Statement Store — the approval was declined, or no slot is free — so streams cannot be announced or joined. Try again to ask once more.",
  timeout: "The approval is still waiting in the Polkadot app. Answer it, then try again.",
  unavailable: "The host could not grant Spotlight permission to publish. Try again in a moment — if it keeps failing, reopen Spotlight from Polkadot Desktop or the browser host."
}, ws = /* @__PURE__ */ new Map(), Ir = /* @__PURE__ */ new Map();
let ji = 0, So = Promise.resolve(), li = null;
function oh() {
  return li ??= Rt(tl(), ys.read, "isInsideContainer").catch(
    (s) => (Ye.warn("could not tell whether this is a host — treating grants as unavailable", { err: s }), li = null, "unknown")
  ), li;
}
function ah(...s) {
  return Tc(s, !1);
}
function Tc(s, e) {
  const t = So.then(
    () => _o(s, e),
    () => _o(s, e)
    // one gate's failure must not poison the chain
  );
  return So = t.catch(() => {
  }), t;
}
function ch(...s) {
  return Tc(s, !0);
}
async function dh(s) {
  const e = await bc();
  for (const t of s)
    e[t] && e[t].outcome !== "granted" && qu(t), ws.get(t) !== "granted" && ws.delete(t), Ir.delete(t);
  ji = 0;
}
async function _o(s, e) {
  const t = Date.now();
  e && await dh(s);
  const n = await bc(), i = Ar(), r = {}, o = [];
  for (const d of s) {
    const c = eh[d], l = ws.get(d) ?? (c !== "session" && zu(n[d], c, i) ? n[d].outcome : void 0);
    if (l) {
      r[d] = l;
      continue;
    }
    if (Date.now() < (Ir.get(d) ?? 0)) {
      r[d] = "unavailable";
      continue;
    }
    o.push(d);
  }
  if (o.length === 0) return Ms(r, t);
  if (Date.now() < ji) {
    for (const d of o) r[d] = "unavailable";
    return Ms(r, t);
  }
  const a = await oh();
  if (a === "unknown") {
    ji = Date.now() + Hi;
    for (const d of o) r[d] = "unavailable";
    return Ms(r, t);
  }
  if (!a) {
    for (const d of o) r[d] = "granted";
    return Ms(r, t);
  }
  Ye.info("asking the host for grants", { missing: o, slot: i }), o.includes("statements") && (r.statements = await lh()), o.some((d) => wn.includes(d)) && Object.assign(r, await uh());
  for (const d of o) {
    const c = sh[d];
    if (!c) continue;
    const l = await ko(d, () => sl(c));
    r[d] = l, (l === "granted" || l === "declined") && ws.set(d, l);
  }
  for (const d of o) {
    const c = nh[d];
    if (!c) continue;
    const l = await ko(d, () => nl(c));
    r[d] = l, (l === "granted" || l === "declined") && Mr(d, l);
  }
  return Ms(r, t);
}
function Ms(s, e) {
  const t = s.statements;
  return !t || t !== "granted" && Zu() >= e || Sc(
    t === "granted" ? null : { outcome: t, message: xc[t] }
  ), s;
}
async function lh() {
  let s;
  try {
    s = await Rt(Ha(), ys.read, "getStatementStore");
  } catch (e) {
    return Ye.warn("statement store unreachable for the allowance probe", { err: e }), It("statements"), "unavailable";
  }
  if (!s)
    return It("statements"), "unavailable";
  try {
    await Rt(
      s.createProofAuthorized(rh()),
      Cn,
      "createProofAuthorized (allowance probe)"
    );
  } catch (e) {
    if (yc(e))
      return Ye.warn("no answer from the host on the allowance probe", { timeoutMs: Cn }), It("statements"), "timeout";
    const t = e instanceof Error ? e.message : String(e), n = /\bUnableToSign\b/.test(t) ? "declined" : "unavailable";
    return Ye.warn("allowance probe failed", { outcome: n, err: e }), ws.set("statements", n), n === "declined" && _c(), n;
  }
  return Mr("statements", "granted"), "granted";
}
async function uh() {
  const s = await Du(ih, Cn, "grants"), e = {};
  if (s.status === "timeout") {
    Ye.warn("no answer from the host on the allowance batch", {
      timeoutMs: Cn
    });
    for (const t of wn)
      e[t] = "timeout", It(t);
    return e;
  }
  if (s.status === "error") {
    for (const t of wn)
      e[t] = "unavailable", s.answered ? ws.set(t, "unavailable") : It(t);
    return e;
  }
  for (const t of wn) {
    const n = hh(s.outcomes, t);
    e[t] = n, n === "timeout" ? It(t) : Mr(t, n);
  }
  return Ye.info("allowance batch settled", {
    outcomes: Object.entries(s.outcomes).map(([t, n]) => `${t}=${n}`).join(" "),
    autoSigning: s.outcomes.AutoSigning ?? "unanswered"
  }), e;
}
function hh(s, e) {
  const t = th[e], n = t ? s[t] : void 0;
  return n === "Allocated" ? "granted" : n === "Rejected" ? "declined" : n === "NotAvailable" ? "unavailable" : (Ye.warn("the host named no outcome for a requested resource", { grant: e, tag: t }), "timeout");
}
async function ko(s, e) {
  try {
    const t = await Rt(e, ys.hostDialog, `grant(${s})`);
    return t.ok ? t.value === !0 ? "granted" : "declined" : (It(s), "unavailable");
  } catch (t) {
    return Ye.warn("grant request did not settle", { grant: s, err: t }), It(s), "timeout";
  }
}
function It(s) {
  Ir.set(s, Date.now() + Hi), Ye.info("grant will be retried", { grant: s, inSecs: Hi / 1e3 });
}
const fh = ah, ph = ch, mh = xc, Bt = "avc1.64001f", An = "opus", Bn = "mp4a.40.2";
function Mn(s, e) {
  return `video/mp4; codecs="${s}, ${e}"`;
}
function gh() {
  const s = globalThis;
  return s.MediaSource ?? s.ManagedMediaSource;
}
function ui(s) {
  const e = gh();
  return !!e && e.isTypeSupported(s);
}
async function yh(s) {
  if (typeof VideoEncoder > "u") return !1;
  try {
    const { supported: e } = await VideoEncoder.isConfigSupported({
      codec: s,
      width: 1280,
      height: 720,
      bitrate: 12e5,
      framerate: 30,
      latencyMode: "realtime"
    });
    return e === !0;
  } catch {
    return !1;
  }
}
async function xo(s) {
  if (typeof AudioEncoder > "u") return !1;
  try {
    const { supported: e } = await AudioEncoder.isConfigSupported({
      codec: s,
      sampleRate: 48e3,
      numberOfChannels: 2,
      bitrate: 96e3
    });
    return e === !0;
  } catch {
    return !1;
  }
}
async function wh() {
  const s = globalThis, [e, t, n] = await Promise.all([
    yh(Bt),
    xo(An),
    xo(Bn)
  ]);
  return {
    userAgent: typeof navigator < "u" ? navigator.userAgent : "unknown",
    webCodecs: typeof VideoEncoder < "u" && typeof AudioEncoder < "u" && typeof VideoFrame < "u",
    managedMediaSource: typeof s.ManagedMediaSource < "u",
    mediaSource: typeof s.MediaSource < "u",
    videoEncoderAvc: e,
    audioEncoderOpus: t,
    audioEncoderAac: n,
    mseAvcOpus: ui(Mn(Bt, An)),
    mseAvcAac: ui(Mn(Bt, Bn)),
    mseAvcOnly: ui(`video/mp4; codecs="${Bt}"`)
  };
}
function bh(s) {
  return !s.webCodecs || !s.videoEncoderAvc ? null : s.audioEncoderAac && s.mseAvcAac ? {
    videoCodec: Bt,
    audioCodec: Bn,
    muxAudioCodec: "aac",
    mimeType: Mn(Bt, Bn)
  } : s.audioEncoderOpus && s.mseAvcOpus ? {
    videoCodec: Bt,
    audioCodec: An,
    muxAudioCodec: "opus",
    mimeType: Mn(Bt, An)
  } : null;
}
const vh = 8;
async function Sh(s) {
  const e = new TextEncoder().encode(`spotlight:room:v1:${s}`), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t)).slice(0, vh).map((i) => i.toString(16).padStart(2, "0")).join("");
}
const hi = " unchannelled", To = ne("statement.expiry"), Eo = 900;
function _h(s = Date.now) {
  const e = /* @__PURE__ */ new Map();
  let t = 0n;
  const n = () => BigInt(Math.floor(s() / 1e3));
  return {
    next(i, r = hi) {
      const o = n() + BigInt(i) << 32n | t++ & 0xffffffffn, a = e.get(r), d = a !== void 0 && o <= a ? a + 1n : o;
      return r !== hi && e.set(r, d), d;
    },
    raiseFloor(i, r = hi) {
      if (i >> 32n > n() + BigInt(Eo))
        return To.warn("ignoring an implausible priority floor — reading it as a misparse", {
          min: i,
          expiration: new Date(Number(i >> 32n) * 1e3).toISOString(),
          horizonSecs: Eo
        }), !1;
      const o = e.get(r);
      return o !== void 0 && i < o ? !1 : (e.set(r, i), To.debug("priority floor adopted", { channel: r, min: i }), !0);
    }
  };
}
const kh = /channel_?priority_?too_?low|expiry_?too_?low/i, xh = /account_?full/i;
function Th(s) {
  if (Ec(s) || !Eh(s)) return null;
  const e = /* @__PURE__ */ new Set(), t = (n, i) => {
    if (n == null || i > 4 || e.has(n)) return null;
    if (typeof n == "string") {
      const o = /"?min_?expiry"?\s*[:=]\s*"?(\d+)"?/i.exec(n);
      return o ? BigInt(o[1]) : null;
    }
    if (typeof n != "object") return null;
    e.add(n);
    const r = n;
    for (const o of ["min_expiry", "minExpiry"]) {
      const a = r[o];
      if (typeof a == "bigint") return a;
      if (typeof a == "number" || typeof a == "string")
        try {
          return BigInt(a);
        } catch {
        }
    }
    for (const o of Object.values(r)) {
      const a = t(o, i + 1);
      if (a !== null) return a;
    }
    return null;
  };
  return t(s instanceof Error ? s.message : s, 0) ?? t(s, 0);
}
function Ec(s) {
  return Cc(s, xh);
}
function Eh(s) {
  return Cc(s, kh);
}
function Cc(s, e) {
  const t = /* @__PURE__ */ new Set(), n = (i, r) => i == null || r > 4 || t.has(i) ? !1 : typeof i == "string" ? e.test(i) : typeof i != "object" ? !1 : (t.add(i), Object.entries(i).some(
    ([o, a]) => e.test(o) || n(a, r + 1)
  ));
  return s instanceof Error && e.test(s.message) ? !0 : n(s, 0);
}
function Ch() {
  const s = /* @__PURE__ */ new Set();
  return {
    begin(e) {
      const t = { type: e, overlapAll: 0 };
      for (const n of s)
        t.overlapAll++, n.overlapAll++;
      return s.add(t), {
        overlap: () => ({ overlapAll: t.overlapAll }),
        end: () => {
          s.delete(t);
        }
      };
    },
    snapshot() {
      const e = {};
      for (const { type: t } of s) e[t] = (e[t] ?? 0) + 1;
      return e;
    }
  };
}
var Q;
(function(s) {
  s.assertEqual = (i) => {
  };
  function e(i) {
  }
  s.assertIs = e;
  function t(i) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (i) => {
    const r = {};
    for (const o of i)
      r[o] = o;
    return r;
  }, s.getValidEnumValues = (i) => {
    const r = s.objectKeys(i).filter((a) => typeof i[i[a]] != "number"), o = {};
    for (const a of r)
      o[a] = i[a];
    return s.objectValues(o);
  }, s.objectValues = (i) => s.objectKeys(i).map(function(r) {
    return i[r];
  }), s.objectKeys = typeof Object.keys == "function" ? (i) => Object.keys(i) : (i) => {
    const r = [];
    for (const o in i)
      Object.prototype.hasOwnProperty.call(i, o) && r.push(o);
    return r;
  }, s.find = (i, r) => {
    for (const o of i)
      if (r(o))
        return o;
  }, s.isInteger = typeof Number.isInteger == "function" ? (i) => Number.isInteger(i) : (i) => typeof i == "number" && Number.isFinite(i) && Math.floor(i) === i;
  function n(i, r = " | ") {
    return i.map((o) => typeof o == "string" ? `'${o}'` : o).join(r);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (i, r) => typeof r == "bigint" ? r.toString() : r;
})(Q || (Q = {}));
var Co;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Co || (Co = {}));
const B = Q.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), At = (s) => {
  switch (typeof s) {
    case "undefined":
      return B.undefined;
    case "string":
      return B.string;
    case "number":
      return Number.isNaN(s) ? B.nan : B.number;
    case "boolean":
      return B.boolean;
    case "function":
      return B.function;
    case "bigint":
      return B.bigint;
    case "symbol":
      return B.symbol;
    case "object":
      return Array.isArray(s) ? B.array : s === null ? B.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? B.promise : typeof Map < "u" && s instanceof Map ? B.map : typeof Set < "u" && s instanceof Set ? B.set : typeof Date < "u" && s instanceof Date ? B.date : B.object;
    default:
      return B.unknown;
  }
}, v = Q.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class pt extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (n) => {
      this.issues = [...this.issues, n];
    }, this.addIssues = (n = []) => {
      this.issues = [...this.issues, ...n];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(r) {
      return r.message;
    }, n = { _errors: [] }, i = (r) => {
      for (const o of r.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(i);
        else if (o.code === "invalid_return_type")
          i(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          i(o.argumentsError);
        else if (o.path.length === 0)
          n._errors.push(t(o));
        else {
          let a = n, d = 0;
          for (; d < o.path.length; ) {
            const c = o.path[d];
            d === o.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(t(o))) : a[c] = a[c] || { _errors: [] }, a = a[c], d++;
          }
        }
    };
    return i(this), n;
  }
  static assert(e) {
    if (!(e instanceof pt))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Q.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const i of this.issues)
      if (i.path.length > 0) {
        const r = i.path[0];
        t[r] = t[r] || [], t[r].push(e(i));
      } else
        n.push(e(i));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
pt.create = (s) => new pt(s);
const qi = (s, e) => {
  let t;
  switch (s.code) {
    case v.invalid_type:
      s.received === B.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case v.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, Q.jsonStringifyReplacer)}`;
      break;
    case v.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${Q.joinValues(s.keys, ", ")}`;
      break;
    case v.invalid_union:
      t = "Invalid input";
      break;
    case v.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${Q.joinValues(s.options)}`;
      break;
    case v.invalid_enum_value:
      t = `Invalid enum value. Expected ${Q.joinValues(s.options)}, received '${s.received}'`;
      break;
    case v.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case v.invalid_return_type:
      t = "Invalid function return type";
      break;
    case v.invalid_date:
      t = "Invalid date";
      break;
    case v.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : Q.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case v.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case v.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case v.custom:
      t = "Invalid input";
      break;
    case v.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case v.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case v.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, Q.assertNever(s);
  }
  return { message: t };
};
let Ah = qi;
function Bh() {
  return Ah;
}
const Mh = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: i } = s, r = [...t, ...i.path || []], o = {
    ...i,
    path: r
  };
  if (i.message !== void 0)
    return {
      ...i,
      path: r,
      message: i.message
    };
  let a = "";
  const d = n.filter((c) => !!c).slice().reverse();
  for (const c of d)
    a = c(o, { data: e, defaultError: a }).message;
  return {
    ...i,
    path: r,
    message: a
  };
};
function E(s, e) {
  const t = Bh(), n = Mh({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === qi ? void 0 : qi
      // then global default map
    ].filter((i) => !!i)
  });
  s.common.issues.push(n);
}
class Me {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const n = [];
    for (const i of t) {
      if (i.status === "aborted")
        return N;
      i.status === "dirty" && e.dirty(), n.push(i.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const i of t) {
      const r = await i.key, o = await i.value;
      n.push({
        key: r,
        value: o
      });
    }
    return Me.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const i of t) {
      const { key: r, value: o } = i;
      if (r.status === "aborted" || o.status === "aborted")
        return N;
      r.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), r.value !== "__proto__" && (typeof o.value < "u" || i.alwaysSet) && (n[r.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const N = Object.freeze({
  status: "aborted"
}), Ns = (s) => ({ status: "dirty", value: s }), Pe = (s) => ({ status: "valid", value: s }), Ao = (s) => s.status === "aborted", Bo = (s) => s.status === "dirty", bs = (s) => s.status === "valid", In = (s) => typeof Promise < "u" && s instanceof Promise;
var I;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e?.message;
})(I || (I = {}));
class et {
  constructor(e, t, n, i) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = i;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Mo = (s, e) => {
  if (bs(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new pt(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function H(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: i } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: i } : { errorMap: (o, a) => {
    const { message: d } = s;
    return o.code === "invalid_enum_value" ? { message: d ?? a.defaultError } : typeof a.data > "u" ? { message: d ?? n ?? a.defaultError } : o.code !== "invalid_type" ? { message: a.defaultError } : { message: d ?? t ?? a.defaultError };
  }, description: i };
}
class G {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return At(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: At(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Me(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: At(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (In(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const n = this.safeParse(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, t) {
    const n = {
      common: {
        issues: [],
        async: t?.async ?? !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: At(e)
    }, i = this._parseSync({ data: e, path: n.path, parent: n });
    return Mo(n, i);
  }
  "~validate"(e) {
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: At(e)
    };
    if (!this["~standard"].async)
      try {
        const n = this._parseSync({ data: e, path: [], parent: t });
        return bs(n) ? {
          value: n.value
        } : {
          issues: t.common.issues
        };
      } catch (n) {
        n?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((n) => bs(n) ? {
      value: n.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const n = await this.safeParseAsync(e, t);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, t) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: At(e)
    }, i = this._parse({ data: e, path: n.path, parent: n }), r = await (In(i) ? i : Promise.resolve(i));
    return Mo(n, r);
  }
  refine(e, t) {
    const n = (i) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(i) : t;
    return this._refinement((i, r) => {
      const o = e(i), a = () => r.addIssue({
        code: v.custom,
        ...n(i)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((d) => d ? !0 : (a(), !1)) : o ? !0 : (a(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, i) => e(n) ? !0 : (i.addIssue(typeof t == "function" ? t(n, i) : t), !1));
  }
  _refinement(e) {
    return new Kt({
      schema: this,
      typeName: D.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return ut.create(this, this._def);
  }
  nullable() {
    return Xt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Qe.create(this);
  }
  promise() {
    return Un.create(this, this._def);
  }
  or(e) {
    return Rn.create([this, e], this._def);
  }
  and(e) {
    return Pn.create(this, e, this._def);
  }
  transform(e) {
    return new Kt({
      ...H(this._def),
      schema: this,
      typeName: D.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Nn({
      ...H(this._def),
      innerType: this,
      defaultValue: t,
      typeName: D.ZodDefault
    });
  }
  brand() {
    return new Ic({
      typeName: D.ZodBranded,
      type: this,
      ...H(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Dn({
      ...H(this._def),
      innerType: this,
      catchValue: t,
      typeName: D.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return Rr.create(this, e);
  }
  readonly() {
    return Vn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Ih = /^c[^\s-]{8,}$/i, Oh = /^[0-9a-z]+$/, Rh = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Ph = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Fh = /^[a-z0-9_-]{21}$/i, Lh = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Uh = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Nh = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Dh = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let fi;
const Vh = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, $h = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, zh = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Hh = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, jh = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, qh = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ac = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Wh = new RegExp(`^${Ac}$`);
function Bc(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Gh(s) {
  return new RegExp(`^${Bc(s)}$`);
}
function Zh(s) {
  let e = `${Ac}T${Bc(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Kh(s, e) {
  return !!((e === "v4" || !e) && Vh.test(s) || (e === "v6" || !e) && zh.test(s));
}
function Xh(s, e) {
  if (!Lh.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), i = JSON.parse(atob(n));
    return !(typeof i != "object" || i === null || "typ" in i && i?.typ !== "JWT" || !i.alg || e && i.alg !== e);
  } catch {
    return !1;
  }
}
function Yh(s, e) {
  return !!((e === "v4" || !e) && $h.test(s) || (e === "v6" || !e) && Hh.test(s));
}
class dt extends G {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== B.string) {
      const r = this._getOrReturnCtx(e);
      return E(r, {
        code: v.invalid_type,
        expected: B.string,
        received: r.parsedType
      }), N;
    }
    const n = new Me();
    let i;
    for (const r of this._def.checks)
      if (r.kind === "min")
        e.data.length < r.value && (i = this._getOrReturnCtx(e, i), E(i, {
          code: v.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "max")
        e.data.length > r.value && (i = this._getOrReturnCtx(e, i), E(i, {
          code: v.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: r.message
        }), n.dirty());
      else if (r.kind === "length") {
        const o = e.data.length > r.value, a = e.data.length < r.value;
        (o || a) && (i = this._getOrReturnCtx(e, i), o ? E(i, {
          code: v.too_big,
          maximum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }) : a && E(i, {
          code: v.too_small,
          minimum: r.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: r.message
        }), n.dirty());
      } else if (r.kind === "email")
        Nh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "email",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "emoji")
        fi || (fi = new RegExp(Dh, "u")), fi.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "emoji",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "uuid")
        Ph.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "uuid",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "nanoid")
        Fh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "nanoid",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid")
        Ih.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "cuid",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "cuid2")
        Oh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "cuid2",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "ulid")
        Rh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
          validation: "ulid",
          code: v.invalid_string,
          message: r.message
        }), n.dirty());
      else if (r.kind === "url")
        try {
          new URL(e.data);
        } catch {
          i = this._getOrReturnCtx(e, i), E(i, {
            validation: "url",
            code: v.invalid_string,
            message: r.message
          }), n.dirty();
        }
      else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "regex",
        code: v.invalid_string,
        message: r.message
      }), n.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: { includes: r.value, position: r.position },
        message: r.message
      }), n.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: { startsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: { endsWith: r.value },
        message: r.message
      }), n.dirty()) : r.kind === "datetime" ? Zh(r).test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: "datetime",
        message: r.message
      }), n.dirty()) : r.kind === "date" ? Wh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: "date",
        message: r.message
      }), n.dirty()) : r.kind === "time" ? Gh(r).test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.invalid_string,
        validation: "time",
        message: r.message
      }), n.dirty()) : r.kind === "duration" ? Uh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "duration",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "ip" ? Kh(e.data, r.version) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "ip",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "jwt" ? Xh(e.data, r.alg) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "jwt",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "cidr" ? Yh(e.data, r.version) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "cidr",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64" ? jh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "base64",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : r.kind === "base64url" ? qh.test(e.data) || (i = this._getOrReturnCtx(e, i), E(i, {
        validation: "base64url",
        code: v.invalid_string,
        message: r.message
      }), n.dirty()) : Q.assertNever(r);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((i) => e.test(i), {
      validation: t,
      code: v.invalid_string,
      ...I.errToObj(n)
    });
  }
  _addCheck(e) {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...I.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...I.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...I.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...I.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...I.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...I.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...I.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...I.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...I.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...I.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...I.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...I.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...I.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: e?.offset ?? !1,
      local: e?.local ?? !1,
      ...I.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...I.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...I.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...I.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...I.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...I.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...I.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...I.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...I.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...I.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, I.errToObj(e));
  }
  trim() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
dt.create = (s) => new dt({
  checks: [],
  typeName: D.ZodString,
  coerce: s?.coerce ?? !1,
  ...H(s)
});
function Qh(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, i = t > n ? t : n, r = Number.parseInt(s.toFixed(i).replace(".", "")), o = Number.parseInt(e.toFixed(i).replace(".", ""));
  return r % o / 10 ** i;
}
class vs extends G {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== B.number) {
      const r = this._getOrReturnCtx(e);
      return E(r, {
        code: v.invalid_type,
        expected: B.number,
        received: r.parsedType
      }), N;
    }
    let n;
    const i = new Me();
    for (const r of this._def.checks)
      r.kind === "int" ? Q.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.invalid_type,
        expected: "integer",
        received: "float",
        message: r.message
      }), i.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.too_small,
        minimum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.too_big,
        maximum: r.value,
        type: "number",
        inclusive: r.inclusive,
        exact: !1,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? Qh(e.data, r.value) !== 0 && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.not_finite,
        message: r.message
      }), i.dirty()) : Q.assertNever(r);
    return { status: i.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, I.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, I.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, I.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, I.toString(t));
  }
  setLimit(e, t, n, i) {
    return new vs({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: I.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new vs({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: I.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: I.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: I.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: I.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: I.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: I.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: I.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: I.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: I.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && Q.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
vs.create = (s) => new vs({
  checks: [],
  typeName: D.ZodNumber,
  coerce: s?.coerce || !1,
  ...H(s)
});
class qs extends G {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== B.bigint)
      return this._getInvalidInput(e);
    let n;
    const i = new Me();
    for (const r of this._def.checks)
      r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.too_small,
        type: "bigint",
        minimum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.too_big,
        type: "bigint",
        maximum: r.value,
        inclusive: r.inclusive,
        message: r.message
      }), i.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), E(n, {
        code: v.not_multiple_of,
        multipleOf: r.value,
        message: r.message
      }), i.dirty()) : Q.assertNever(r);
    return { status: i.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return E(t, {
      code: v.invalid_type,
      expected: B.bigint,
      received: t.parsedType
    }), N;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, I.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, I.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, I.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, I.toString(t));
  }
  setLimit(e, t, n, i) {
    return new qs({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: I.toString(i)
        }
      ]
    });
  }
  _addCheck(e) {
    return new qs({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: I.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: I.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: I.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: I.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: I.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
qs.create = (s) => new qs({
  checks: [],
  typeName: D.ZodBigInt,
  coerce: s?.coerce ?? !1,
  ...H(s)
});
class Wi extends G {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== B.boolean) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.boolean,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Wi.create = (s) => new Wi({
  typeName: D.ZodBoolean,
  coerce: s?.coerce || !1,
  ...H(s)
});
class On extends G {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== B.date) {
      const r = this._getOrReturnCtx(e);
      return E(r, {
        code: v.invalid_type,
        expected: B.date,
        received: r.parsedType
      }), N;
    }
    if (Number.isNaN(e.data.getTime())) {
      const r = this._getOrReturnCtx(e);
      return E(r, {
        code: v.invalid_date
      }), N;
    }
    const n = new Me();
    let i;
    for (const r of this._def.checks)
      r.kind === "min" ? e.data.getTime() < r.value && (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.too_small,
        message: r.message,
        inclusive: !0,
        exact: !1,
        minimum: r.value,
        type: "date"
      }), n.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (i = this._getOrReturnCtx(e, i), E(i, {
        code: v.too_big,
        message: r.message,
        inclusive: !0,
        exact: !1,
        maximum: r.value,
        type: "date"
      }), n.dirty()) : Q.assertNever(r);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new On({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: I.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: I.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
On.create = (s) => new On({
  checks: [],
  coerce: s?.coerce || !1,
  typeName: D.ZodDate,
  ...H(s)
});
class Io extends G {
  _parse(e) {
    if (this._getType(e) !== B.symbol) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.symbol,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Io.create = (s) => new Io({
  typeName: D.ZodSymbol,
  ...H(s)
});
class Gi extends G {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.undefined,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Gi.create = (s) => new Gi({
  typeName: D.ZodUndefined,
  ...H(s)
});
class Zi extends G {
  _parse(e) {
    if (this._getType(e) !== B.null) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.null,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Zi.create = (s) => new Zi({
  typeName: D.ZodNull,
  ...H(s)
});
class Oo extends G {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Pe(e.data);
  }
}
Oo.create = (s) => new Oo({
  typeName: D.ZodAny,
  ...H(s)
});
class Ki extends G {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Pe(e.data);
  }
}
Ki.create = (s) => new Ki({
  typeName: D.ZodUnknown,
  ...H(s)
});
class Pt extends G {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return E(t, {
      code: v.invalid_type,
      expected: B.never,
      received: t.parsedType
    }), N;
  }
}
Pt.create = (s) => new Pt({
  typeName: D.ZodNever,
  ...H(s)
});
class Ro extends G {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.void,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Ro.create = (s) => new Ro({
  typeName: D.ZodVoid,
  ...H(s)
});
class Qe extends G {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), i = this._def;
    if (t.parsedType !== B.array)
      return E(t, {
        code: v.invalid_type,
        expected: B.array,
        received: t.parsedType
      }), N;
    if (i.exactLength !== null) {
      const o = t.data.length > i.exactLength.value, a = t.data.length < i.exactLength.value;
      (o || a) && (E(t, {
        code: o ? v.too_big : v.too_small,
        minimum: a ? i.exactLength.value : void 0,
        maximum: o ? i.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: i.exactLength.message
      }), n.dirty());
    }
    if (i.minLength !== null && t.data.length < i.minLength.value && (E(t, {
      code: v.too_small,
      minimum: i.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.minLength.message
    }), n.dirty()), i.maxLength !== null && t.data.length > i.maxLength.value && (E(t, {
      code: v.too_big,
      maximum: i.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: i.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, a) => i.type._parseAsync(new et(t, o, t.path, a)))).then((o) => Me.mergeArray(n, o));
    const r = [...t.data].map((o, a) => i.type._parseSync(new et(t, o, t.path, a)));
    return Me.mergeArray(n, r);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new Qe({
      ...this._def,
      minLength: { value: e, message: I.toString(t) }
    });
  }
  max(e, t) {
    return new Qe({
      ...this._def,
      maxLength: { value: e, message: I.toString(t) }
    });
  }
  length(e, t) {
    return new Qe({
      ...this._def,
      exactLength: { value: e, message: I.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Qe.create = (s, e) => new Qe({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: D.ZodArray,
  ...H(e)
});
function ds(s) {
  if (s instanceof we) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = ut.create(ds(n));
    }
    return new we({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof Qe ? new Qe({
    ...s._def,
    type: ds(s.element)
  }) : s instanceof ut ? ut.create(ds(s.unwrap())) : s instanceof Xt ? Xt.create(ds(s.unwrap())) : s instanceof Gt ? Gt.create(s.items.map((e) => ds(e))) : s;
}
class we extends G {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = Q.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== B.object) {
      const c = this._getOrReturnCtx(e);
      return E(c, {
        code: v.invalid_type,
        expected: B.object,
        received: c.parsedType
      }), N;
    }
    const { status: n, ctx: i } = this._processInputParams(e), { shape: r, keys: o } = this._getCached(), a = [];
    if (!(this._def.catchall instanceof Pt && this._def.unknownKeys === "strip"))
      for (const c in i.data)
        o.includes(c) || a.push(c);
    const d = [];
    for (const c of o) {
      const l = r[c], u = i.data[c];
      d.push({
        key: { status: "valid", value: c },
        value: l._parse(new et(i, u, i.path, c)),
        alwaysSet: c in i.data
      });
    }
    if (this._def.catchall instanceof Pt) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const l of a)
          d.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: i.data[l] }
          });
      else if (c === "strict")
        a.length > 0 && (E(i, {
          code: v.unrecognized_keys,
          keys: a
        }), n.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const l of a) {
        const u = i.data[l];
        d.push({
          key: { status: "valid", value: l },
          value: c._parse(
            new et(i, u, i.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in i.data
        });
      }
    }
    return i.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const l of d) {
        const u = await l.key, h = await l.value;
        c.push({
          key: u,
          value: h,
          alwaysSet: l.alwaysSet
        });
      }
      return c;
    }).then((c) => Me.mergeObjectSync(n, c)) : Me.mergeObjectSync(n, d);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return I.errToObj, new we({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          const i = this._def.errorMap?.(t, n).message ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: I.errToObj(e).message ?? i
          } : {
            message: i
          };
        }
      } : {}
    });
  }
  strip() {
    return new we({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new we({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new we({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new we({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: D.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new we({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of Q.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new we({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of Q.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new we({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return ds(this);
  }
  partial(e) {
    const t = {};
    for (const n of Q.objectKeys(this.shape)) {
      const i = this.shape[n];
      e && !e[n] ? t[n] = i : t[n] = i.optional();
    }
    return new we({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of Q.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let r = this.shape[n];
        for (; r instanceof ut; )
          r = r._def.innerType;
        t[n] = r;
      }
    return new we({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Mc(Q.objectKeys(this.shape));
  }
}
we.create = (s, e) => new we({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
we.strictCreate = (s, e) => new we({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
we.lazycreate = (s, e) => new we({
  shape: s,
  unknownKeys: "strip",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
class Rn extends G {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function i(r) {
      for (const a of r)
        if (a.result.status === "valid")
          return a.result;
      for (const a of r)
        if (a.result.status === "dirty")
          return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = r.map((a) => new pt(a.ctx.common.issues));
      return E(t, {
        code: v.invalid_union,
        unionErrors: o
      }), N;
    }
    if (t.common.async)
      return Promise.all(n.map(async (r) => {
        const o = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await r._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      })).then(i);
    {
      let r;
      const o = [];
      for (const d of n) {
        const c = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, l = d._parseSync({
          data: t.data,
          path: t.path,
          parent: c
        });
        if (l.status === "valid")
          return l;
        l.status === "dirty" && !r && (r = { result: l, ctx: c }), c.common.issues.length && o.push(c.common.issues);
      }
      if (r)
        return t.common.issues.push(...r.ctx.common.issues), r.result;
      const a = o.map((d) => new pt(d));
      return E(t, {
        code: v.invalid_union,
        unionErrors: a
      }), N;
    }
  }
  get options() {
    return this._def.options;
  }
}
Rn.create = (s, e) => new Rn({
  options: s,
  typeName: D.ZodUnion,
  ...H(e)
});
const ot = (s) => s instanceof Yi ? ot(s.schema) : s instanceof Kt ? ot(s.innerType()) : s instanceof Ln ? [s.value] : s instanceof Zt ? s.options : s instanceof Qi ? Q.objectValues(s.enum) : s instanceof Nn ? ot(s._def.innerType) : s instanceof Gi ? [void 0] : s instanceof Zi ? [null] : s instanceof ut ? [void 0, ...ot(s.unwrap())] : s instanceof Xt ? [null, ...ot(s.unwrap())] : s instanceof Ic || s instanceof Vn ? ot(s.unwrap()) : s instanceof Dn ? ot(s._def.innerType) : [];
class Or extends G {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== B.object)
      return E(t, {
        code: v.invalid_type,
        expected: B.object,
        received: t.parsedType
      }), N;
    const n = this.discriminator, i = t.data[n], r = this.optionsMap.get(i);
    return r ? t.common.async ? r._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : r._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (E(t, {
      code: v.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), N);
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(e, t, n) {
    const i = /* @__PURE__ */ new Map();
    for (const r of t) {
      const o = ot(r.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const a of o) {
        if (i.has(a))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
        i.set(a, r);
      }
    }
    return new Or({
      typeName: D.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: i,
      ...H(n)
    });
  }
}
function Xi(s, e) {
  const t = At(s), n = At(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === B.object && n === B.object) {
    const i = Q.objectKeys(e), r = Q.objectKeys(s).filter((a) => i.indexOf(a) !== -1), o = { ...s, ...e };
    for (const a of r) {
      const d = Xi(s[a], e[a]);
      if (!d.valid)
        return { valid: !1 };
      o[a] = d.data;
    }
    return { valid: !0, data: o };
  } else if (t === B.array && n === B.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const i = [];
    for (let r = 0; r < s.length; r++) {
      const o = s[r], a = e[r], d = Xi(o, a);
      if (!d.valid)
        return { valid: !1 };
      i.push(d.data);
    }
    return { valid: !0, data: i };
  } else return t === B.date && n === B.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class Pn extends G {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = (r, o) => {
      if (Ao(r) || Ao(o))
        return N;
      const a = Xi(r.value, o.value);
      return a.valid ? ((Bo(r) || Bo(o)) && t.dirty(), { status: t.value, value: a.data }) : (E(n, {
        code: v.invalid_intersection_types
      }), N);
    };
    return n.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      }),
      this._def.right._parseAsync({
        data: n.data,
        path: n.path,
        parent: n
      })
    ]).then(([r, o]) => i(r, o)) : i(this._def.left._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }), this._def.right._parseSync({
      data: n.data,
      path: n.path,
      parent: n
    }));
  }
}
Pn.create = (s, e, t) => new Pn({
  left: s,
  right: e,
  typeName: D.ZodIntersection,
  ...H(t)
});
class Gt extends G {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.array)
      return E(n, {
        code: v.invalid_type,
        expected: B.array,
        received: n.parsedType
      }), N;
    if (n.data.length < this._def.items.length)
      return E(n, {
        code: v.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), N;
    !this._def.rest && n.data.length > this._def.items.length && (E(n, {
      code: v.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const r = [...n.data].map((o, a) => {
      const d = this._def.items[a] || this._def.rest;
      return d ? d._parse(new et(n, o, n.path, a)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(r).then((o) => Me.mergeArray(t, o)) : Me.mergeArray(t, r);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Gt({
      ...this._def,
      rest: e
    });
  }
}
Gt.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Gt({
    items: s,
    typeName: D.ZodTuple,
    rest: null,
    ...H(e)
  });
};
class Fn extends G {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.object)
      return E(n, {
        code: v.invalid_type,
        expected: B.object,
        received: n.parsedType
      }), N;
    const i = [], r = this._def.keyType, o = this._def.valueType;
    for (const a in n.data)
      i.push({
        key: r._parse(new et(n, a, n.path, a)),
        value: o._parse(new et(n, n.data[a], n.path, a)),
        alwaysSet: a in n.data
      });
    return n.common.async ? Me.mergeObjectAsync(t, i) : Me.mergeObjectSync(t, i);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof G ? new Fn({
      keyType: e,
      valueType: t,
      typeName: D.ZodRecord,
      ...H(n)
    }) : new Fn({
      keyType: dt.create(),
      valueType: e,
      typeName: D.ZodRecord,
      ...H(t)
    });
  }
}
class Po extends G {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.map)
      return E(n, {
        code: v.invalid_type,
        expected: B.map,
        received: n.parsedType
      }), N;
    const i = this._def.keyType, r = this._def.valueType, o = [...n.data.entries()].map(([a, d], c) => ({
      key: i._parse(new et(n, a, n.path, [c, "key"])),
      value: r._parse(new et(n, d, n.path, [c, "value"]))
    }));
    if (n.common.async) {
      const a = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const d of o) {
          const c = await d.key, l = await d.value;
          if (c.status === "aborted" || l.status === "aborted")
            return N;
          (c.status === "dirty" || l.status === "dirty") && t.dirty(), a.set(c.value, l.value);
        }
        return { status: t.value, value: a };
      });
    } else {
      const a = /* @__PURE__ */ new Map();
      for (const d of o) {
        const c = d.key, l = d.value;
        if (c.status === "aborted" || l.status === "aborted")
          return N;
        (c.status === "dirty" || l.status === "dirty") && t.dirty(), a.set(c.value, l.value);
      }
      return { status: t.value, value: a };
    }
  }
}
Po.create = (s, e, t) => new Po({
  valueType: e,
  keyType: s,
  typeName: D.ZodMap,
  ...H(t)
});
class Ws extends G {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.set)
      return E(n, {
        code: v.invalid_type,
        expected: B.set,
        received: n.parsedType
      }), N;
    const i = this._def;
    i.minSize !== null && n.data.size < i.minSize.value && (E(n, {
      code: v.too_small,
      minimum: i.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.minSize.message
    }), t.dirty()), i.maxSize !== null && n.data.size > i.maxSize.value && (E(n, {
      code: v.too_big,
      maximum: i.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: i.maxSize.message
    }), t.dirty());
    const r = this._def.valueType;
    function o(d) {
      const c = /* @__PURE__ */ new Set();
      for (const l of d) {
        if (l.status === "aborted")
          return N;
        l.status === "dirty" && t.dirty(), c.add(l.value);
      }
      return { status: t.value, value: c };
    }
    const a = [...n.data.values()].map((d, c) => r._parse(new et(n, d, n.path, c)));
    return n.common.async ? Promise.all(a).then((d) => o(d)) : o(a);
  }
  min(e, t) {
    return new Ws({
      ...this._def,
      minSize: { value: e, message: I.toString(t) }
    });
  }
  max(e, t) {
    return new Ws({
      ...this._def,
      maxSize: { value: e, message: I.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ws.create = (s, e) => new Ws({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: D.ZodSet,
  ...H(e)
});
class Yi extends G {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Yi.create = (s, e) => new Yi({
  getter: s,
  typeName: D.ZodLazy,
  ...H(e)
});
class Ln extends G {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return E(t, {
        received: t.data,
        code: v.invalid_literal,
        expected: this._def.value
      }), N;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Ln.create = (s, e) => new Ln({
  value: s,
  typeName: D.ZodLiteral,
  ...H(e)
});
function Mc(s, e) {
  return new Zt({
    values: s,
    typeName: D.ZodEnum,
    ...H(e)
  });
}
class Zt extends G {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return E(t, {
        expected: Q.joinValues(n),
        received: t.parsedType,
        code: v.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return E(t, {
        received: t.data,
        code: v.invalid_enum_value,
        options: n
      }), N;
    }
    return Pe(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return Zt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Zt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Zt.create = Mc;
class Qi extends G {
  _parse(e) {
    const t = Q.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== B.string && n.parsedType !== B.number) {
      const i = Q.objectValues(t);
      return E(n, {
        expected: Q.joinValues(i),
        received: n.parsedType,
        code: v.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(Q.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const i = Q.objectValues(t);
      return E(n, {
        received: n.data,
        code: v.invalid_enum_value,
        options: i
      }), N;
    }
    return Pe(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Qi.create = (s, e) => new Qi({
  values: s,
  typeName: D.ZodNativeEnum,
  ...H(e)
});
class Un extends G {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== B.promise && t.common.async === !1)
      return E(t, {
        code: v.invalid_type,
        expected: B.promise,
        received: t.parsedType
      }), N;
    const n = t.parsedType === B.promise ? t.data : Promise.resolve(t.data);
    return Pe(n.then((i) => this._def.type.parseAsync(i, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Un.create = (s, e) => new Un({
  type: s,
  typeName: D.ZodPromise,
  ...H(e)
});
class Kt extends G {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === D.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), i = this._def.effect || null, r = {
      addIssue: (o) => {
        E(n, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (r.addIssue = r.addIssue.bind(r), i.type === "preprocess") {
      const o = i.transform(n.data, r);
      if (n.common.async)
        return Promise.resolve(o).then(async (a) => {
          if (t.value === "aborted")
            return N;
          const d = await this._def.schema._parseAsync({
            data: a,
            path: n.path,
            parent: n
          });
          return d.status === "aborted" ? N : d.status === "dirty" || t.value === "dirty" ? Ns(d.value) : d;
        });
      {
        if (t.value === "aborted")
          return N;
        const a = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? N : a.status === "dirty" || t.value === "dirty" ? Ns(a.value) : a;
      }
    }
    if (i.type === "refinement") {
      const o = (a) => {
        const d = i.refinement(a, r);
        if (n.common.async)
          return Promise.resolve(d);
        if (d instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return a;
      };
      if (n.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? N : (a.status === "dirty" && t.dirty(), o(a.value), { status: t.value, value: a.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((a) => a.status === "aborted" ? N : (a.status === "dirty" && t.dirty(), o(a.value).then(() => ({ status: t.value, value: a.value }))));
    }
    if (i.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!bs(o))
          return N;
        const a = i.transform(o.value, r);
        if (a instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: a };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => bs(o) ? Promise.resolve(i.transform(o.value, r)).then((a) => ({
          status: t.value,
          value: a
        })) : N);
    Q.assertNever(i);
  }
}
Kt.create = (s, e, t) => new Kt({
  schema: s,
  typeName: D.ZodEffects,
  effect: e,
  ...H(t)
});
Kt.createWithPreprocess = (s, e, t) => new Kt({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: D.ZodEffects,
  ...H(t)
});
class ut extends G {
  _parse(e) {
    return this._getType(e) === B.undefined ? Pe(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ut.create = (s, e) => new ut({
  innerType: s,
  typeName: D.ZodOptional,
  ...H(e)
});
class Xt extends G {
  _parse(e) {
    return this._getType(e) === B.null ? Pe(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Xt.create = (s, e) => new Xt({
  innerType: s,
  typeName: D.ZodNullable,
  ...H(e)
});
class Nn extends G {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === B.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Nn.create = (s, e) => new Nn({
  innerType: s,
  typeName: D.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...H(e)
});
class Dn extends G {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, i = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return In(i) ? i.then((r) => ({
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new pt(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new pt(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Dn.create = (s, e) => new Dn({
  innerType: s,
  typeName: D.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...H(e)
});
class Fo extends G {
  _parse(e) {
    if (this._getType(e) !== B.nan) {
      const n = this._getOrReturnCtx(e);
      return E(n, {
        code: v.invalid_type,
        expected: B.nan,
        received: n.parsedType
      }), N;
    }
    return { status: "valid", value: e.data };
  }
}
Fo.create = (s) => new Fo({
  typeName: D.ZodNaN,
  ...H(s)
});
class Ic extends G {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = t.data;
    return this._def.type._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class Rr extends G {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const r = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return r.status === "aborted" ? N : r.status === "dirty" ? (t.dirty(), Ns(r.value)) : this._def.out._parseAsync({
          data: r.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const i = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return i.status === "aborted" ? N : i.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: i.value
      }) : this._def.out._parseSync({
        data: i.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new Rr({
      in: e,
      out: t,
      typeName: D.ZodPipeline
    });
  }
}
class Vn extends G {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (i) => (bs(i) && (i.value = Object.freeze(i.value)), i);
    return In(t) ? t.then((i) => n(i)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Vn.create = (s, e) => new Vn({
  innerType: s,
  typeName: D.ZodReadonly,
  ...H(e)
});
var D;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(D || (D = {}));
const he = dt.create, ae = vs.create, Ji = Wi.create, Jh = Ki.create;
Pt.create;
const Jt = Qe.create, J = we.create;
Rn.create;
const ef = Or.create;
Pn.create;
Gt.create;
const Oc = Fn.create, de = Ln.create, Es = Zt.create;
Un.create;
ut.create;
Xt.create;
const tf = 32 * 1024, sf = Math.ceil(tf / 3) * 4, nf = ["video/mp4", "image/jpeg"], rf = { BASE_URL: "/", DEV: !1, MODE: "production", PROD: !0, SSR: !1 };
function Rc(s) {
  const t = rf?.[s];
  return t === void 0 || t === "" ? void 0 : t;
}
function Fe(s, e) {
  const t = Rc(s);
  if (t === void 0) return e;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : e;
}
function of(s, e) {
  const t = Rc(s);
  if (t === void 0) return e;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) && n > 0 ? n : e;
}
const Wt = Fe("VITE_CHUNK_MS", 2e3), Pc = Fe("VITE_VIDEO_BITRATE", 12e5), Fc = 96e3, af = 30, cf = 48e3, df = 960, lf = 3;
Fe("VITE_LAG_DECAY_CHUNKS", 30);
const er = 30, ht = 16 * 1024, uf = 3, hf = 6, ff = 12, $n = 3e4, pf = 0.3, Lo = 0.9, mf = 0.7, Uo = $n, pi = 2 * $n, No = 20, gf = Fe("VITE_HOST_FANOUT", 4), yf = 3, wf = Fe("VITE_UPLOAD_BUDGET", 4e6), bf = 1, vf = 1, Sf = 0.25, _f = 3, kf = of("VITE_PROGRESS_TIMEOUT_CHUNKS", 0.5), xf = 0.5, Tf = 1, Ef = 1, mi = 1.25, Cf = 0.25, Af = 0.9, Bf = 1.1, Lc = 4, Mf = 3, If = 2, Of = 6, Uc = 4e3, Rf = 2, Pf = Fe("VITE_SUMMARY_MISS_SLACK_MS", 1500), Nc = Uc * Rf + Pf, Ff = 3e4, Lf = 9e4;
Fe("VITE_JOIN_WATCHDOG_MS", 22e3);
Fe("VITE_ORPHAN_REJOIN_MS", 3e3);
const Do = 2e3, Uf = 2, Dc = 1024 * 1024, Vc = 60, $c = 32, Vo = 8, Nf = 4096, Df = 12e4, Vf = 30, $f = 5, zf = 50, tr = 2, Pr = 16, Hf = Fe("VITE_JOIN_GATHER_MS", 3e3), jf = 3e4, $o = Fe("VITE_ICE_DISCONNECT_GRACE_MS", 3e3), sr = 250, zc = 1e4, Is = 3 * zc, zo = 1e4, qf = 2, Wf = 4, Gf = Fe("VITE_HOST_ONLY_SLOTS", 1), Zf = 2, nr = 3, Kf = Fe("VITE_MESH_DIAL_BACKOFF_CHUNKS", 30), Ft = ne("swarm.wire"), Fr = 5, zn = re(Fr), Ho = re(Fr), ye = 1, ps = he().min(1).max(64), Qn = he().max(64), Cs = ae().int().min(0).max(2 ** 32 - 1), Jn = ae().int().min(0), ir = ae().int().min(0), Xf = he().min(1).max(32), Lt = he().regex(/^[0-9a-f]*$/), Yf = J({
  base: Cs,
  bitmapHex: Lt.max(256)
  // ≤128 bytes ⇒ ≤1024-chunk window
}), Qf = J({
  epoch: Jn,
  seq: Cs,
  tsUs: ae().int().min(0),
  durUs: ae().int().min(0),
  size: ae().int().min(1).max(32 * 1024 * 1024),
  hash: Lt.length(64),
  sig: Lt.length(128)
}), es = Lt.length(64), Lr = J({
  epk: es,
  iv: Lt.length(24),
  ct: Lt.min(2).max(102400)
}), Dt = { from: ps, ts: ir, nonce: Xf }, ke = { v: de(ye) }, Jf = J({
  ...ke,
  t: de("hello"),
  addr: ps,
  name: Qn,
  epoch: Jn,
  edgeSeq: ae().int().min(-1),
  have: Yf,
  /** Opt-in flag: willing to act as a delegated join responder (§6.2a). */
  responder: Ji().optional(),
  /** Sender's session box pubkey — lets neighbors seal SDP to us and lets
   *  PEX/heartbeats redistribute the key. Optional for wire compat only;
   *  peers without one are never mesh-dialed. */
  boxPub: es.optional(),
  /** Sender's neighbor count, this link included: the host's first
   *  host-only report (summary.degree carries the next ones). */
  degree: ae().int().min(0).max(256).optional(),
  /** Sender reaches only the host (PeerBook.relayOnly). Absent = false. */
  relayOnly: Ji().optional()
}), ep = J({
  ...ke,
  t: de("have"),
  seq: Cs,
  edgeSeq: ae().int().min(-1)
}), tp = J({
  ...ke,
  t: de("summary"),
  base: Cs,
  bitmapHex: Lt.max(256),
  edgeSeq: ae().int().min(-1),
  /** Sender's current neighbor count. Drives the host's §6.2 bootstrap
   *  prune: a joiner is only re-homed once it reports enough links. */
  degree: ae().int().min(0).max(256).optional(),
  /** As in hello: the sender reaches only the host. Absent = false. */
  relayOnly: Ji().optional()
}), sp = J({
  ...ke,
  t: de("want"),
  seq: Cs,
  /** ms until the requester's playhead reaches this seq (serve priority). */
  deadlineMs: ae().int().min(0).max(6e5)
}), Hc = Es(["busy", "missing", "fanout", "budget"]), np = Es(["host-full"]), ip = J({
  ...ke,
  t: de("deny"),
  seq: Cs,
  reason: Hc,
  /** 'host-full': a fanout deny to a host-only viewer the host has no seat for. */
  detail: np.optional().catch(void 0)
}), rp = J({
  ...ke,
  t: de("meta"),
  meta: Qf
}), op = J({
  ...ke,
  t: de("pex"),
  peers: Jt(J({ addr: ps, name: Qn, boxPub: es.optional() })).max(Pr)
}), ap = J({
  ...ke,
  t: de("sig"),
  target: ps,
  from: ps,
  kind: Es(["offer", "answer"]),
  /** SDP sealed to the target's session box key — relaying peers carry
   *  ciphertext, so they can't harvest the endpoints' IP addresses. */
  sealed: Lr,
  /** Sender's session box pubkey — the answer is sealed back to this. */
  boxPub: es,
  /** Addresses this message has traversed; forwarding stops at SIG_MAX_HOPS. */
  path: Jt(ps).max(tr + 1)
}), cp = J({ ...ke, t: de("presence"), ...Dt, name: Qn }), jc = J({
  ...ke,
  t: de("chat"),
  ...Dt,
  senderName: Qn,
  text: he().min(1).max(500)
}), dp = jc.extend({
  t: de("chat-backlog"),
  epoch: Jn
}), lp = J({
  ...ke,
  t: de("reaction"),
  ...Dt,
  emoji: he().min(1).max(16)
}), up = J({
  ...ke,
  t: de("poll-open"),
  ...Dt,
  pollId: he().min(1).max(64),
  question: he().min(1).max(200),
  options: Jt(he().min(1).max(100)).min(2).max(4),
  openedAt: ir,
  closesAt: ir.optional()
}), hp = J({
  ...ke,
  t: de("poll-vote"),
  ...Dt,
  pollId: he().min(1).max(64),
  optionIdx: ae().int().min(0).max(3)
}), fp = J({
  ...ke,
  t: de("poll-tally"),
  ...Dt,
  pollId: he().min(1).max(64),
  tallies: Jt(ae().int().min(0)).max(4),
  totalVotes: ae().int().min(0)
}), pp = J({
  ...ke,
  t: de("poll-close"),
  ...Dt,
  pollId: he().min(1).max(64)
}), mp = J({
  ...ke,
  t: de("end"),
  ...Dt,
  epoch: Jn,
  sig: Lt.length(128)
}), gp = J({
  ...ke,
  t: de("prune"),
  reason: Es(["bootstrap-rotation", "over-degree", "scoring"])
}), yp = J({ ...ke, t: de("bye") }), qc = ef("t", [
  Jf,
  ep,
  tp,
  sp,
  ip,
  rp,
  op,
  ap,
  cp,
  jc,
  dp,
  lp,
  up,
  hp,
  fp,
  pp,
  mp,
  gp,
  yp
]), wp = new Set(qc.options.map((s) => s.shape.t.value));
function wt(s) {
  return `${s.from}:${s.ts}:${s.nonce}`;
}
function bp(s) {
  return JSON.stringify(s);
}
function vp(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return gi("not-json");
  }
  if (!e || typeof e != "object") return gi("not-object");
  const { v: t, t: n } = e;
  if (t !== ye || typeof n != "string" || !wp.has(n)) {
    const r = `v=${String(t)} t=${String(n)}`;
    return zn.allow(r) && Ft.debug("ctrl ignored: unknown version or type", { v: t, type: n, seen: zn.count(r) }), { kind: "ignore" };
  }
  const i = qc.safeParse(e);
  return i.success ? { kind: "ok", msg: i.data } : gi(i.error.issues[0]?.message ?? "invalid", String(n));
}
function gi(s, e) {
  return zn.allow(s) && Ft.warn("ctrl message dropped: decode failed", { error: s, type: e, seen: zn.count(s) }), { kind: "invalid", error: s };
}
function Sp(s, e, t) {
  const n = new Uint8Array(Math.ceil(t / 8));
  for (const r of e) {
    const o = r - s;
    o < 0 || o >= t || (n[o >> 3] |= 128 >> (o & 7));
  }
  let i = "";
  for (const r of n) i += r.toString(16).padStart(2, "0");
  return { base: s, bitmapHex: i };
}
function jo(s) {
  const e = /* @__PURE__ */ new Set(), { base: t, bitmapHex: n } = s;
  for (let i = 0; i * 2 < n.length; i++) {
    const r = Number.parseInt(n.slice(i * 2, i * 2 + 2), 16);
    if (r)
      for (let o = 0; o < 8; o++)
        r & 128 >> o && e.add(t + i * 8 + o);
  }
  return e;
}
const Vs = 24, Wc = 21328;
function bn(s) {
  return s % 4294967296;
}
function _p(s) {
  if (s.payload.length === 0 || s.payload.length > ht)
    throw Ft.error("slice encode failed: payload out of range", {
      seq: s.seq,
      bytes: s.payload.length,
      max: ht
    }), new Error(`slice payload ${s.payload.length} outside (0, ${ht}]`);
  if (s.sliceIdx >= s.sliceCount)
    throw Ft.error("slice encode failed: index past the count", {
      seq: s.seq,
      sliceIdx: s.sliceIdx,
      sliceCount: s.sliceCount
    }), new Error(`sliceIdx ${s.sliceIdx} >= sliceCount ${s.sliceCount}`);
  const e = new Uint8Array(Vs + s.payload.length), t = new DataView(e.buffer);
  return t.setUint16(0, Wc, !0), t.setUint8(2, ye), t.setUint8(3, 0), t.setUint32(4, s.seq, !0), t.setUint16(8, s.sliceIdx, !0), t.setUint16(10, s.sliceCount, !0), t.setUint32(12, s.payload.length, !0), t.setUint32(16, s.epochLow, !0), t.setUint32(20, 0, !0), e.set(s.payload, Vs), e;
}
function kp(s) {
  if (s.length < Vs) return ns("short-header");
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  if (e.getUint16(0, !0) !== Wc) return ns("bad-magic");
  if (e.getUint8(2) !== ye) return ns("bad-version");
  const t = e.getUint32(4, !0), n = e.getUint16(8, !0), i = e.getUint16(10, !0), r = e.getUint32(12, !0), o = e.getUint32(16, !0);
  return i === 0 || n >= i ? ns("bad-slice-index", t) : r === 0 || r > ht ? ns("bad-payload-len", t) : s.length !== Vs + r ? ns("length-mismatch", t) : {
    kind: "ok",
    frame: {
      epochLow: o,
      seq: t,
      sliceIdx: n,
      sliceCount: i,
      payload: s.subarray(Vs)
    }
  };
}
function ns(s, e) {
  return Ho.allow(s) && Ft.warn("slice dropped: decode failed", { error: s, seq: e, seen: Ho.count(s) }), { kind: "invalid", error: s };
}
function xp(s, e, t) {
  if (t.length === 0)
    throw Ft.error("chunk slicing failed: empty payload", { seq: e, epoch: s }), new Error("empty chunk payload");
  const n = Math.ceil(t.length / ht);
  if (n > 65535)
    throw Ft.error("chunk slicing failed: too many slices", { seq: e, sliceCount: n, bytes: t.length }), new Error(`chunk needs ${n} slices > u16`);
  const i = bn(s), r = [];
  for (let o = 0; o < n; o++)
    r.push({
      epochLow: i,
      seq: e,
      sliceIdx: o,
      sliceCount: n,
      payload: t.subarray(o * ht, Math.min((o + 1) * ht, t.length))
    });
  return r;
}
class Tp {
  partials = /* @__PURE__ */ new Map();
  assembleCap = re(Fr);
  key(e, t) {
    return `${e}:${t}`;
  }
  add(e) {
    const t = this.key(e.epochLow, e.seq);
    let n = this.partials.get(t);
    if (n || (n = { sliceCount: e.sliceCount, received: 0, slices: new Array(e.sliceCount) }, this.partials.set(t, n)), e.sliceCount !== n.sliceCount)
      return this.partials.delete(t), this.bad("slice-count-mismatch", e.seq);
    if (e.sliceIdx < e.sliceCount - 1 && e.payload.length !== ht)
      return this.partials.delete(t), this.bad("short-interior-slice", e.seq);
    const i = n.received === 0;
    if (n.slices[e.sliceIdx] || (n.slices[e.sliceIdx] = e.payload, n.received++), n.received < n.sliceCount)
      return { kind: "progress", received: n.received, total: n.sliceCount, firstSlice: i };
    this.partials.delete(t);
    const r = n.slices.reduce((d, c) => d + (c?.length ?? 0), 0), o = new Uint8Array(r);
    let a = 0;
    for (const d of n.slices)
      o.set(d, a), a += d.length;
    return { kind: "done", payload: o };
  }
  bad(e, t) {
    return this.assembleCap.allow(e) && Ft.warn("chunk reassembly failed", { error: e, seq: t, seen: this.assembleCap.count(e) }), { kind: "invalid", error: e };
  }
  /** Discard a partial (deadline expiry, cancelled want, epoch reset). */
  drop(e, t) {
    this.partials.delete(this.key(e, t));
  }
  clear() {
    this.partials.clear();
  }
  get pendingCount() {
    return this.partials.size;
  }
}
const rr = ne("statement.schema"), ls = re(5), Ep = Es([
  "heartbeat",
  "swarm-join",
  "welcome-board"
]), Cp = J({
  type: Ep,
  from: he(),
  to: he().optional(),
  timestamp: ae(),
  payload: Oc(Jh()).optional()
}), Yt = he().min(1).max(64), Ur = he().max(64), Ap = he().regex(/^[0-9a-f]*$/), Bp = J({
  /** Ephemeral per-stream ed25519 public key, hex (plan §4). */
  streamPubKey: Ap.length(64),
  /** Stream session id (go-live timestamp ms); resets the chunk seq space. */
  epoch: ae().int().min(0),
  chunkMs: ae().int().min(200).max(1e4),
  /** MSE codec string, e.g. `video/mp4; codecs="avc1.64001f, mp4a.40.2"`. */
  codecs: he().min(1).max(200),
  edgeSeq: ae().int().min(-1),
  /** Delegated join responders (§6.2a), host always implicitly included. */
  responders: Jt(Yt).max(8).optional(),
  /**
   * X25519 session box pubkeys by address — the host plus every listed
   * responder. A joiner seals its swarm-join SDP to its chosen responder's
   * key: statements on the signal topic are publicly subscribable, and a
   * cleartext non-trickle SDP would publish the joiner's IP next to its
   * on-chain address. The heartbeat statement is host-signed, so these keys
   * share the streamPubKey trust anchor.
   */
  boxPubs: Oc(Yt, es).optional()
}), Mp = J({
  mime: Es(nf),
  data: he().min(4).max(sf).regex(/^[A-Za-z0-9+/]+={0,2}$/)
});
J({
  roomHash: he().min(1).max(128),
  hostAddress: Yt,
  hostName: Ur,
  title: he().max(200),
  viewerCount: ae().int().min(0).max(1e4),
  startedAt: ae(),
  /** Tip goal for this session, in whole PAS. 0/absent = no goal set. */
  tipGoal: ae().int().min(0).max(1e6).optional(),
  /** Host's authoritative session tip total, in PAS planck (string — JSON has
   *  no bigint). Viewers render the goal bar from this so it's identical for
   *  everyone regardless of join time. */
  tippedPlanck: he().max(40).optional(),
  /** Swarm join/trust info. Optional so the lobby stays tolerant of hosts
   *  running builds without the mesh (and vice versa). */
  mesh: Bp.optional(),
  /** The lobby card preview. Absent = no preview. */
  clip: Mp.optional(),
  /** The host ended this stream. Absent = live. */
  ended: de(!0).optional()
});
const Ip = J({
  viewerAddress: Yt,
  viewerName: Ur,
  /** The peer this join is addressed to; others on the topic ignore it. */
  responder: Yt,
  /** Viewer's session box pubkey — the welcome answer is sealed back to it. */
  boxPub: es,
  sealedSdp: Lr,
  sdpType: de("offer")
}), Op = J({
  /** The joiner this answer is for. */
  to: Yt,
  sealedSdp: Lr,
  sdpType: de("answer"),
  /** Sample of live peers to dial for additional mesh links. `boxPub` lets
   *  the joiner seal its mesh-dial offers to them (§6.3). */
  seeds: Jt(J({ addr: Yt, name: Ur, boxPub: es.optional() })).max(8),
  edgeSeq: ae().int().min(-1),
  epoch: ae().int().min(0)
});
J({
  answers: Jt(Op).max($c)
});
function Rp(s, e) {
  const t = e.safeParse(s.payload);
  return t.success ? t.data : (ls.allow(`payload:${s.type}`) && rr.warn("dropping a message: invalid payload", {
    type: s.type,
    from: b(s.from),
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: ls.count(`payload:${s.type}`)
  }), null);
}
function Pp(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return ls.allow("envelope:json") && rr.debug("dropping a statement: the data is not JSON", {
      bytes: s.length,
      seen: ls.count("envelope:json")
    }), null;
  }
  const t = Cp.safeParse(e);
  return t.success ? t.data : (ls.allow("envelope:schema") && rr.debug("dropping a statement: the envelope does not match the schema", {
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: ls.count("envelope:schema")
  }), null);
}
const Fp = new TextEncoder();
function Js(s) {
  return au(Fp.encode(s));
}
function Lp() {
  return Js("spotlight:lobby:v1");
}
function Up(s) {
  return Js(`spotlight:signal:v1:${s}`);
}
function Np() {
  return Js("spotlight:heartbeat-channel:v1");
}
function Dp() {
  return Js("spotlight:join-channel:v1");
}
function Vp() {
  return Js("spotlight:welcome-board-channel:v1");
}
function is(s) {
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += s[t].toString(16).padStart(2, "0");
  return e;
}
const le = ne("statement.client"), qo = lc();
function $p(s) {
  if (!s) return null;
  try {
    switch (s.tag) {
      case "Sr25519":
      case "Ed25519":
      case "Ecdsa":
        return qo.dec(s.value.signer);
      case "OnChain":
        return qo.dec(s.value.who);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
const zp = new TextEncoder(), Hp = new TextDecoder(), jp = 300, qp = {
  timeout: "The host has not confirmed permission to publish signaling, so streams cannot be announced or joined. If an approval is waiting in the Polkadot app, answer it — this clears on its own.",
  declined: "Permission to publish signaling was declined, so streams cannot be announced or joined. Start a stream or rejoin the room to be asked again.",
  unavailable: "The host did not grant Spotlight permission to publish signaling, so streams cannot be announced or joined. Retrying — if this persists, reopen Spotlight from Polkadot Desktop or the browser host."
};
class Wp {
  store = null;
  productAccount = null;
  subscribers = /* @__PURE__ */ new Map();
  routes = /* @__PURE__ */ new Map();
  nextSubId = 0;
  disposed = !1;
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements can't tie (see ./expiry.ts). */
  expiry = _h();
  /** Submits in flight by type, so each submit line says what it shared the
   *  bridge with. Observability only. */
  inflight = Ch();
  /** Last grant outcome shown to the user, so one condition reports once. */
  reportedGrantOutcome = null;
  _ready = !1;
  onConnectionChange;
  onSubmitError;
  /** Signaling cannot work at all, and will not recover without a reload:
   *  no store on this host, or the grants the store needs were refused. */
  onFatalError;
  /**
   * Initialise the host-side statement-store adapter. The host owns the chain
   * transport, and reaching it is a round-trip: `getStatementStore()` is
   * ASYNC and resolves null outside a host container.
   *
   * Both failure modes report through `onFatalError`. Neither can be left to
   * `markReady(false)` alone — the client starts not-ready, so that call is a
   * no-op and nothing downstream ever learns. The surface would sit on
   * "connecting" with no error anywhere, which is the opposite of the
   * degrade-visibly rule.
   *
   * Rejections are returned, not thrown: the caller is a React effect, and an
   * unhandled rejection there is invisible.
   */
  async connect() {
    if (this.disposed) return;
    let e;
    try {
      e = await Ha();
    } catch (t) {
      if (this.disposed) return;
      const n = t instanceof Error ? t.message : String(t);
      le.error("host statement store unavailable", { detail: n, err: t }), this.onFatalError?.(
        new Error(`Statement Store unavailable: ${n}. Reload to try again.`)
      );
      return;
    }
    if (!this.disposed) {
      if (!e) {
        le.warn("no host statement store — not inside a host container"), this.onFatalError?.(
          new Error(
            "No Statement Store on this host. Spotlight needs Polkadot Desktop or the browser host to publish and receive signaling."
          )
        );
        return;
      }
      this.store = e, this.markReady(!0);
    }
  }
  /**
   * Wire the product-account tuple used as the signer identity for
   * `createProof`. Subscribe still works without this — only `submit`
   * needs it. Pass `null` when the user signs out.
   */
  setProductAccount(e) {
    this.productAccount = e, le.info(e ? "product account wired" : "product account cleared"), e && this.primeGrants();
  }
  /**
   * Re-establish the host permission that gates the submit itself, without
   * blocking the caller.
   *
   * ONLY that permission. The RFC-0010 allowance behind `createProofAuthorized`
   * is a phone approval, and this runs on connect and on every submit — a
   * heartbeat loop that can open a phone notification is exactly the
   * re-prompting the redesign removed. The allowance is asked for once, from a
   * deliberate user action, by `lib/host`'s gate (see `HostPage`'s Open camera
   * and `useViewer`'s join). By the time anything submits it is held.
   *
   * The permission itself is worth re-asking here because an "Allow once" is
   * spent by a single submit; an "Always allow" the host has stored answers
   * without UI. It is a host-local dialog, never a phone notification.
   *
   * The outcome is observed rather than discarded: without it the host refuses
   * every submit, and the only difference the user could see between "declined"
   * and "nothing was ever published" was a console line. Reported once per
   * distinct outcome, since the memo means a repeat says the same thing.
   */
  primeGrants() {
    fh("statement-submit").then(({ "statement-submit": e }) => {
      e && (e === "granted" || this.disposed || this.reportedGrantOutcome !== e && (this.reportedGrantOutcome = e, le.error("statement grants not available", { outcome: e }), this.onFatalError?.(new Error(qp[e]))));
    });
  }
  get isConnected() {
    return this._ready;
  }
  /**
   * Subscribe a handler to a topic. Multiple handlers on the same topic
   * share a single upstream subscription.
   */
  async subscribe(e, t) {
    if (this.disposed || !this.store) throw new Error("Signaling not ready");
    const n = `sub-${++this.nextSubId}`;
    this.subscribers.set(n, { topic: e, handler: t });
    const i = is(e), r = this.routes.get(i);
    if (le.debug("subscribe", {
      subId: n,
      topic: Te(i),
      route: r ? "shared" : "new"
    }), r)
      r.handlers.add(t);
    else {
      const o = /* @__PURE__ */ new Set([t]), a = () => {
        if (!this.store || this.disposed) return { unsubscribe: () => {
        } };
        const c = this.store.subscribe(
          { matchAll: [an(e)] },
          (l) => {
            let u = 0, h = 0;
            for (const m of l.statements) {
              const g = Zp(m);
              if (!g) {
                h++;
                continue;
              }
              u++;
              for (const p of o)
                try {
                  p(g.envelope, g.signedBy);
                } catch (y) {
                  le.error("handler threw", { topic: Te(i), err: y });
                }
            }
            const f = this.routes.get(i);
            f && (f.lastPageAt = Date.now()), le.debug("page received", {
              topic: Te(i),
              statements: l.statements.length,
              decoded: u,
              dropped: h
            });
          }
        );
        return c.onInterrupt((l) => {
          le.warn("upstream subscription interrupted — resubscribing", {
            topic: Te(i),
            payload: l
          });
          const u = this.routes.get(i);
          if (!u || this.disposed) return;
          const h = a();
          u.unsubscribe = h.unsubscribe, u.lastPageAt = Date.now();
        }), { unsubscribe: c.unsubscribe };
      }, d = a();
      this.routes.set(i, {
        topic: e,
        handlers: o,
        unsubscribe: d.unsubscribe,
        lastPageAt: Date.now(),
        resubscribe: () => {
          const c = this.routes.get(i);
          if (!c || this.disposed) return;
          try {
            c.unsubscribe();
          } catch {
          }
          const l = a();
          c.unsubscribe = l.unsubscribe, c.lastPageAt = Date.now();
        }
      });
    }
    return n;
  }
  /** Milliseconds since this topic last delivered a page, or null when no
   *  route is open for it. Null means "cannot answer" — never "silent". */
  silentMsFor(e) {
    const t = this.routes.get(is(e));
    return t ? Date.now() - t.lastPageAt : null;
  }
  /** Reopen ONE topic's upstream, leaving every other route untouched.
   *
   *  `refreshAllSubscriptions` is the blunt instrument: it reopens everything,
   *  which is why useLobby fires it only on a real hidden→visible transition —
   *  churning a viewer's signal route mid-handshake drops the offer and strands
   *  it on "Connecting…". Repairing a single stalled route needs neither that
   *  blast radius nor that caution. */
  reopenTopic(e) {
    const t = is(e), n = this.routes.get(t);
    if (!n || this.disposed) return !1;
    le.info("reopening one topic", { topic: Te(t) });
    try {
      n.resubscribe();
    } catch (i) {
      return le.warn("reopen failed", { topic: Te(t), err: i }), !1;
    }
    return !0;
  }
  /** Force every active topic subscription to reopen. Use after a tab
   *  visibility / focus change to recover from a possibly-stale upstream. */
  refreshAllSubscriptions() {
    le.info("refreshing every subscription", { routes: this.routes.size });
    for (const e of this.routes.values())
      try {
        e.resubscribe();
      } catch (t) {
        le.warn("subscription refresh failed", { topic: Te(is(e.topic)), err: t });
      }
  }
  unsubscribe(e) {
    const t = this.subscribers.get(e);
    if (!t) return;
    this.subscribers.delete(e);
    const n = is(t.topic), i = this.routes.get(n);
    if (i && (i.handlers.delete(t.handler), le.debug("unsubscribe", {
      subId: e,
      topic: Te(n),
      handlers: i.handlers.size
    }), i.handlers.size === 0)) {
      try {
        i.unsubscribe();
      } catch {
      }
      this.routes.delete(n);
    }
  }
  /**
   * Submit a signed SignalEnvelope on a topic.
   *
   * Requires a product account to have been wired via `setProductAccount`.
   * The host signs the statement (using a cached allowance slot, prompting
   * the paired mobile signer the first time) and we submit the result.
   *
   * `opts` tunes quota hygiene per statement (plan §6.1): a shorter expiry
   * frees the allowance slot sooner, and a `channel` makes successive
   * statements REPLACE each other instead of accumulating against
   * `max_count` (the heartbeat, the join and the welcome board). `quiet` keeps a failure
   * away from `onSubmitError` (the app-wide banner): for an optional statement
   * whose caller shows its own failure.
   */
  async submit(e, t, n) {
    const i = (h) => {
      n?.quiet || this.onSubmitError?.(h);
    };
    if (this.disposed) throw new Error("Signaling disposed");
    if (!this.store) throw new Error("Statement store not initialised");
    if (!this.productAccount)
      throw new Error(
        "No product account — sign in via the host before broadcasting."
      );
    const r = Qu();
    if (r !== null) throw new zi(r);
    this.primeGrants();
    const o = zp.encode(JSON.stringify(t)), a = n?.expirySecs ?? jp, d = n?.channel ? an(n.channel) : void 0, c = Date.now(), l = this.inflight.snapshot();
    le.debug("submit started", {
      type: t.type,
      to: b(t.to),
      topic: Te(is(e)),
      bytes: o.length,
      expirySecs: a,
      channel: d ? Te(d) : null,
      inflight: l
    });
    const u = this.inflight.begin(t.type);
    try {
      for (let h = 0; ; h++) {
        const f = {
          proof: void 0,
          decryptionKey: void 0,
          expiry: this.expiry.next(a, d),
          channel: d,
          topics: [an(e)],
          data: an(o)
        };
        let m;
        const g = Date.now();
        try {
          m = await this.store.createProofAuthorized(f);
        } catch (y) {
          const k = y instanceof Error ? y : new Error(String(y));
          if (Gp(k)) {
            const A = _c();
            throw le.error("createProof failed with UnableToSign — submits paused", {
              type: t.type,
              attempt: h,
              strikes: A.strikes,
              pauseS: Math.round((A.until - Date.now()) / 1e3),
              err: k,
              proofMs: Date.now() - g,
              ...u.overlap()
            }), new zi(A.until, { cause: k });
          }
          throw le.error("createProof failed", {
            type: t.type,
            attempt: h,
            err: k,
            proofMs: Date.now() - g,
            ...u.overlap()
          }), i(k), k;
        }
        const p = Date.now() - g;
        try {
          await this.store.submit({ ...f, proof: m }), Gu(), Ju(), le.debug("submit succeeded", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap()
          });
          return;
        } catch (y) {
          const k = y instanceof Error ? y : new Error(String(y)), A = h === 0 ? Th(y) : null;
          if (A !== null && this.expiry.raiseFloor(A, d)) {
            le.warn("statement rejected below the priority floor — re-minting above it", {
              type: t.type,
              min: A,
              channel: d ? Te(d) : null
            });
            continue;
          }
          throw Ec(y) ? (le.error("statement store account is full — submits rejected until slots free", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap(),
            err: k
          }), i(k), k) : (le.error("statement submit rejected", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap(),
            err: k
          }), i(k), k);
        }
      }
    } finally {
      u.end();
    }
  }
  destroy() {
    le.info("client destroyed", {
      routes: this.routes.size,
      subscribers: this.subscribers.size
    }), this.disposed = !0;
    for (const e of this.routes.values())
      try {
        e.unsubscribe();
      } catch {
      }
    this.routes.clear(), this.subscribers.clear(), this.store = null, this.productAccount = null, this.markReady(!1);
  }
  markReady(e) {
    e !== this._ready && (this._ready = e, le.info(e ? "store connected" : "store disconnected"), this.onConnectionChange?.(e));
  }
}
function Gp(s) {
  return /\bUnableToSign\b/.test(s.message);
}
function Zp(s) {
  if (!s.data || s.data.length <= 2) return null;
  try {
    const e = Hp.decode(il(s.data)), t = Pp(e);
    return t ? { envelope: t, signedBy: $p(s.proof) } : null;
  } catch {
    return null;
  }
}
const zt = ne("swarm.transport"), Ht = /* @__PURE__ */ new Map(), or = 600 * 1e3, yi = 1e3;
function Kp() {
  Ht.clear(), $s.clear();
}
function Xp(s) {
  let e = 0;
  for (const [t, n] of Ht)
    s - n.seenAt >= or && (Ht.delete(t), $s.delete(t), e++);
  return e;
}
const $s = /* @__PURE__ */ new Set();
function Yp(s, e, t) {
  const n = Date.now(), i = Ht.get(s);
  if (i && n - i.seenAt < or) {
    if (i.signer === e)
      return i.seenAt = n, !0;
    if (!$s.has(s)) {
      $s.add(s);
      const r = Math.round((or - (n - i.seenAt)) / 1e3);
      zt.warn("sender binding mismatch — statement dropped", {
        type: t,
        from: b(s),
        boundSigner: b(i.signer),
        signedBy: b(e),
        lapsesInSec: r
      });
    }
    return !1;
  }
  if (!i && Ht.size >= yi) {
    const r = Xp(n);
    if (Ht.size >= yi)
      return zt.warn("sender binding table full", {
        type: t,
        from: b(s),
        cap: yi
      }), !1;
    zt.debug("sender bindings swept", { swept: r, from: b(s) });
  }
  return Ht.set(s, { signer: e, seenAt: n }), $s.delete(s), !0;
}
function Qp(s, e) {
  return {
    submit(t) {
      if (t.type === "welcome-board") {
        const i = { expirySecs: Vc, channel: Vp() };
        return zt.debug("tx", { type: t.type, channel: i.channel }), s.submit(e, t, i);
      }
      const n = { channel: Dp() };
      return zt.debug("tx", { type: t.type, channel: n.channel, to: b(t.to) }), s.submit(e, t, n);
    },
    subscribe(t) {
      let n = !0, i = null;
      return s.subscribe(e, (r, o) => {
        n && (o !== null && !Yp(r.from, o, r.type) || (zt.debug("rx", {
          type: r.type,
          from: b(r.from),
          signedBy: b(o)
        }), t(r, o)));
      }).then((r) => {
        n ? i = r : s.unsubscribe(r);
      }).catch((r) => {
        zt.error("transport subscribe failed", { err: r });
      }), () => {
        n = !1, i !== null && s.unsubscribe(i);
      };
    }
  };
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
function x(s) {
  if (!s)
    throw new Error("Assertion failed.");
}
const us = (s) => s && s[s.length - 1], Ut = (s) => s >= 0 && s < 2 ** 32, _ = (s) => {
  let e = 0;
  for (; s.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + s.readBits(e);
}, lt = (s) => {
  const e = _(s);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, en = (s) => s.constructor === Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s), Gc = (s) => s.constructor === DataView ? s : ArrayBuffer.isView(s) ? new DataView(s.buffer, s.byteOffset, s.byteLength) : new DataView(s), Xe = /* @__PURE__ */ new TextEncoder(), Nr = {
  bt709: 1,
  // ITU-R BT.709
  bt470bg: 5,
  // ITU-R BT.470BG
  smpte170m: 6,
  // ITU-R BT.601 525 - SMPTE 170M
  bt2020: 9,
  // ITU-R BT.202
  smpte432: 12
  // SMPTE EG 432-1
}, Dr = {
  bt709: 1,
  // ITU-R BT.709
  smpte170m: 6,
  // SMPTE 170M
  linear: 8,
  // Linear transfer characteristics
  "iec61966-2-1": 13,
  // IEC 61966-2-1
  pq: 16,
  // Rec. ITU-R BT.2100-2 perceptual quantization (PQ) system
  hlg: 18
  // Rec. ITU-R BT.2100-2 hybrid loggamma (HLG) system
}, Vr = {
  rgb: 0,
  // Identity
  bt709: 1,
  // ITU-R BT.709
  bt470bg: 5,
  // ITU-R BT.470BG
  smpte170m: 6,
  // SMPTE 170M
  "bt2020-ncl": 9
  // ITU-R BT.2020-2 (non-constant luminance)
}, Jp = (s) => !!s && !!s.primaries && !!s.transfer && !!s.matrix && s.fullRange !== void 0, Zc = (s) => s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer || ArrayBuffer.isView(s);
class Kc {
  constructor() {
    this.currentPromise = Promise.resolve(), this.pending = 0;
  }
  async acquire() {
    let e;
    const t = new Promise((i) => {
      let r = !1;
      e = () => {
        r || (i(), this.pending--, r = !0);
      };
    }), n = this.currentPromise;
    return this.currentPromise = t, this.pending++, await n, e;
  }
}
const em = () => {
  let s, e;
  return { promise: new Promise((n, i) => {
    s = n, e = i;
  }), resolve: s, reject: e };
}, Xc = (s) => {
  throw new Error(`Unexpected value: ${s}`);
}, tm = (s, e, t, n) => {
  t = t >>> 0, t = t & 16777215, s.setUint8(e, t >>> 16 & 255), s.setUint8(e + 1, t >>> 8 & 255), s.setUint8(e + 2, t & 255);
}, sm = "und", nm = /^[a-z]{3}$/, im = (s) => nm.test(s), Wo = 1e6 * (1 + Number.EPSILON), rm = (s, e) => {
  const t = s < 0 ? -1 : 1;
  s = Math.abs(s);
  let n = 0, i = 1, r = 1, o = 0, a = s;
  for (; ; ) {
    const d = Math.floor(a), c = d * r + n, l = d * o + i;
    if (l > e)
      return {
        num: t * r,
        den: o
      };
    if (n = r, i = o, r = c, o = l, a = 1 / (a - d), !isFinite(a))
      break;
  }
  return {
    num: t * r,
    den: o
  };
}, Yc = function* (s) {
  for (const e in s) {
    const t = s[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, om = (s) => {
  x(Number.isInteger(s.num)), x(Number.isInteger(s.den)), x(s.den !== 0);
  let e = Math.abs(s.num), t = Math.abs(s.den);
  for (; t !== 0; ) {
    const i = e % t;
    e = t, t = i;
  }
  const n = e || 1;
  return {
    num: s.num / n,
    den: s.den / n
  };
}, Go = (s) => Array.isArray(s) ? s : [s];
class $r {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
  on(e, t, n) {
    this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set());
    const i = { fn: t, once: n?.once ?? !1 };
    return this._listeners.get(e).add(i), () => {
      this._listeners.get(e)?.delete(i);
    };
  }
  /** @internal */
  _emit(...e) {
    const [t, n] = e, i = this._listeners.get(t);
    if (i)
      for (const r of i) {
        try {
          r.fn(n);
        } catch (o) {
          console.error(o);
        }
        r.once && i.delete(r);
      }
  }
}
const am = (s) => s !== null && typeof s == "object" && Object.getPrototypeOf(s) === Object.prototype && Object.values(s).every((e) => typeof e == "string");
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Ge;
(function(s) {
  s[s.Silent = 0] = "Silent", s[s.Errors = 1] = "Errors", s[s.Warnings = 2] = "Warnings", s[s.Info = 3] = "Info";
})(Ge || (Ge = {}));
class fe {
  constructor() {
  }
  /** The current log level. Defaults to {@link LogLevel.Info}. */
  static get level() {
    return fe._level;
  }
  static set level(e) {
    if (e !== Ge.Silent && e !== Ge.Errors && e !== Ge.Warnings && e !== Ge.Info)
      throw new TypeError("Invalid log level. Use one of the values of the LogLevel enum.");
    fe._level = e;
  }
  /** @internal */
  static get _emitter() {
    return fe._emitterInstance ??= new $r();
  }
  /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
  static on(e, t, n) {
    return fe._emitter.on(e, t, n);
  }
  /** @internal */
  static _error(...e) {
    fe._emitter._emit("error", e), fe._level >= Ge.Errors && console.error(...e);
  }
  /** @internal */
  static _warn(...e) {
    fe._emitter._emit("warn", e), fe._level >= Ge.Warnings && console.warn(...e);
  }
  /** @internal */
  static _info(...e) {
    fe._emitter._emit("info", e), fe._level >= Ge.Info && console.info(...e);
  }
}
fe._level = Ge.Info;
fe._emitterInstance = null;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Qc {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class cm {
  /** Creates a new {@link AttachedFile}. */
  constructor(e, t, n, i) {
    if (this.data = e, this.mimeType = t, this.name = n, this.description = i, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== void 0 && typeof t != "string")
      throw new TypeError("mimeType, when provided, must be a string.");
    if (n !== void 0 && typeof n != "string")
      throw new TypeError("name, when provided, must be a string.");
    if (i !== void 0 && typeof i != "string")
      throw new TypeError("description, when provided, must be a string.");
  }
}
const dm = (s) => {
  if (!s || typeof s != "object")
    throw new TypeError("tags must be an object.");
  if (s.title !== void 0 && typeof s.title != "string")
    throw new TypeError("tags.title, when provided, must be a string.");
  if (s.description !== void 0 && typeof s.description != "string")
    throw new TypeError("tags.description, when provided, must be a string.");
  if (s.artist !== void 0 && typeof s.artist != "string")
    throw new TypeError("tags.artist, when provided, must be a string.");
  if (s.album !== void 0 && typeof s.album != "string")
    throw new TypeError("tags.album, when provided, must be a string.");
  if (s.albumArtist !== void 0 && typeof s.albumArtist != "string")
    throw new TypeError("tags.albumArtist, when provided, must be a string.");
  if (s.trackNumber !== void 0 && (!Number.isInteger(s.trackNumber) || s.trackNumber <= 0))
    throw new TypeError("tags.trackNumber, when provided, must be a positive integer.");
  if (s.tracksTotal !== void 0 && (!Number.isInteger(s.tracksTotal) || s.tracksTotal <= 0))
    throw new TypeError("tags.tracksTotal, when provided, must be a positive integer.");
  if (s.discNumber !== void 0 && (!Number.isInteger(s.discNumber) || s.discNumber <= 0))
    throw new TypeError("tags.discNumber, when provided, must be a positive integer.");
  if (s.discsTotal !== void 0 && (!Number.isInteger(s.discsTotal) || s.discsTotal <= 0))
    throw new TypeError("tags.discsTotal, when provided, must be a positive integer.");
  if (s.genre !== void 0 && typeof s.genre != "string")
    throw new TypeError("tags.genre, when provided, must be a string.");
  if (s.date !== void 0 && (!(s.date instanceof Date) || Number.isNaN(s.date.getTime())))
    throw new TypeError("tags.date, when provided, must be a valid Date.");
  if (s.lyrics !== void 0 && typeof s.lyrics != "string")
    throw new TypeError("tags.lyrics, when provided, must be a string.");
  if (s.images !== void 0) {
    if (!Array.isArray(s.images))
      throw new TypeError("tags.images, when provided, must be an array.");
    for (const e of s.images) {
      if (!e || typeof e != "object")
        throw new TypeError("Each image in tags.images must be an object.");
      if (!(e.data instanceof Uint8Array))
        throw new TypeError("Each image.data must be a Uint8Array.");
      if (typeof e.mimeType != "string")
        throw new TypeError("Each image.mimeType must be a string.");
      if (!["coverFront", "coverBack", "unknown"].includes(e.kind))
        throw new TypeError("Each image.kind must be 'coverFront', 'coverBack', or 'unknown'.");
    }
  }
  if (s.comment !== void 0 && typeof s.comment != "string")
    throw new TypeError("tags.comment, when provided, must be a string.");
  if (s.raw !== void 0) {
    if (!s.raw || typeof s.raw != "object")
      throw new TypeError("tags.raw, when provided, must be an object.");
    for (const e of Object.values(s.raw))
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof Qc) && !(e instanceof cm) && !am(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, lm = (s) => {
  if (!s || typeof s != "object")
    throw new TypeError("disposition must be an object.");
  if (s.default !== void 0 && typeof s.default != "boolean")
    throw new TypeError("disposition.default must be a boolean.");
  if (s.primary !== void 0 && typeof s.primary != "boolean")
    throw new TypeError("disposition.primary must be a boolean.");
  if (s.forced !== void 0 && typeof s.forced != "boolean")
    throw new TypeError("disposition.forced must be a boolean.");
  if (s.original !== void 0 && typeof s.original != "boolean")
    throw new TypeError("disposition.original must be a boolean.");
  if (s.commentary !== void 0 && typeof s.commentary != "boolean")
    throw new TypeError("disposition.commentary must be a boolean.");
  if (s.hearingImpaired !== void 0 && typeof s.hearingImpaired != "boolean")
    throw new TypeError("disposition.hearingImpaired must be a boolean.");
  if (s.visuallyImpaired !== void 0 && typeof s.visuallyImpaired != "boolean")
    throw new TypeError("disposition.visuallyImpaired must be a boolean.");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class ze {
  constructor(e) {
    this.bytes = e, this.pos = 0;
  }
  seekToByte(e) {
    this.pos = 8 * e;
  }
  readBit() {
    const e = Math.floor(this.pos / 8), t = this.bytes[e] ?? 0, n = 7 - (this.pos & 7), i = (t & 1 << n) >> n;
    return this.pos++, i;
  }
  readBits(e) {
    if (e === 1)
      return this.readBit();
    let t = 0;
    for (let n = 0; n < e; n++)
      t <<= 1, t |= this.readBit();
    return t;
  }
  writeBits(e, t) {
    const n = this.pos + e;
    for (let i = this.pos; i < n; i++) {
      const r = Math.floor(i / 8);
      let o = this.bytes[r];
      const a = 7 - (i & 7);
      o &= ~(1 << a), o |= (t & 1 << n - i - 1) >> n - i - 1 << a, this.bytes[r] = o;
    }
    this.pos = n;
  }
  readAlignedByte() {
    if (this.pos % 8 !== 0)
      throw new Error("Bitstream is not byte-aligned.");
    const e = this.pos / 8, t = this.bytes[e] ?? 0;
    return this.pos += 8, t;
  }
  skipBits(e) {
    this.pos += e;
  }
  getBitsLeft() {
    return this.bytes.length * 8 - this.pos;
  }
  clone() {
    const e = new ze(this.bytes);
    return e.pos = this.pos, e;
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Jc = [
  96e3,
  88200,
  64e3,
  48e3,
  44100,
  32e3,
  24e3,
  22050,
  16e3,
  12e3,
  11025,
  8e3,
  7350
], ed = [-1, 1, 2, 3, 4, 5, 6, 8], um = (s) => {
  let e = Jc.indexOf(s.sampleRate), t = null;
  e === -1 && (e = 15, t = s.sampleRate);
  const n = ed.indexOf(s.numberOfChannels);
  if (n === -1)
    throw new TypeError(`Unsupported number of channels: ${s.numberOfChannels}`);
  let i = 13;
  s.objectType >= 32 && (i += 6), e === 15 && (i += 24);
  const r = Math.ceil(i / 8), o = new Uint8Array(r), a = new ze(o);
  return s.objectType < 32 ? a.writeBits(5, s.objectType) : (a.writeBits(5, 31), a.writeBits(6, s.objectType - 32)), a.writeBits(4, e), e === 15 && a.writeBits(24, t), a.writeBits(4, n), o;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Ss = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8",
  "prores"
], _s = [
  "pcm-s16",
  // We don't prefix 'le' so we're compatible with the WebCodecs-registered PCM codec strings
  "pcm-s16be",
  "pcm-s24",
  "pcm-s24be",
  "pcm-s32",
  "pcm-s32be",
  "pcm-f32",
  "pcm-f32be",
  "pcm-f64",
  "pcm-f64be",
  "pcm-u8",
  "pcm-s8",
  "ulaw",
  "alaw"
], zr = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3"
], Hn = [
  ...zr,
  ..._s
], Gs = [
  "webvtt"
], Zo = [
  { maxMacroblocks: 99, maxBitrate: 64e3, maxDpbMbs: 396, level: 10 },
  // Level 1
  { maxMacroblocks: 396, maxBitrate: 192e3, maxDpbMbs: 900, level: 11 },
  // Level 1.1
  { maxMacroblocks: 396, maxBitrate: 384e3, maxDpbMbs: 2376, level: 12 },
  // Level 1.2
  { maxMacroblocks: 396, maxBitrate: 768e3, maxDpbMbs: 2376, level: 13 },
  // Level 1.3
  { maxMacroblocks: 396, maxBitrate: 2e6, maxDpbMbs: 2376, level: 20 },
  // Level 2
  { maxMacroblocks: 792, maxBitrate: 4e6, maxDpbMbs: 4752, level: 21 },
  // Level 2.1
  { maxMacroblocks: 1620, maxBitrate: 4e6, maxDpbMbs: 8100, level: 22 },
  // Level 2.2
  { maxMacroblocks: 1620, maxBitrate: 1e7, maxDpbMbs: 8100, level: 30 },
  // Level 3
  { maxMacroblocks: 3600, maxBitrate: 14e6, maxDpbMbs: 18e3, level: 31 },
  // Level 3.1
  { maxMacroblocks: 5120, maxBitrate: 2e7, maxDpbMbs: 20480, level: 32 },
  // Level 3.2
  { maxMacroblocks: 8192, maxBitrate: 2e7, maxDpbMbs: 32768, level: 40 },
  // Level 4
  { maxMacroblocks: 8192, maxBitrate: 5e7, maxDpbMbs: 32768, level: 41 },
  // Level 4.1
  { maxMacroblocks: 8704, maxBitrate: 5e7, maxDpbMbs: 34816, level: 42 },
  // Level 4.2
  { maxMacroblocks: 22080, maxBitrate: 135e6, maxDpbMbs: 110400, level: 50 },
  // Level 5
  { maxMacroblocks: 36864, maxBitrate: 24e7, maxDpbMbs: 184320, level: 51 },
  // Level 5.1
  { maxMacroblocks: 36864, maxBitrate: 24e7, maxDpbMbs: 184320, level: 52 },
  // Level 5.2
  { maxMacroblocks: 139264, maxBitrate: 24e7, maxDpbMbs: 696320, level: 60 },
  // Level 6
  { maxMacroblocks: 139264, maxBitrate: 48e7, maxDpbMbs: 696320, level: 61 },
  // Level 6.1
  { maxMacroblocks: 139264, maxBitrate: 8e8, maxDpbMbs: 696320, level: 62 }
  // Level 6.2
], vn = [
  "ap4x",
  // ProRes 4444 XQ
  "ap4h",
  // ProRes 4444
  "apch",
  // ProRes 422 High Quality
  "apcn",
  // ProRes 422 Standard Definition
  "apcs",
  // ProRes 422 LT
  "apco"
  // ProRes 422 Proxy
], hm = (s) => {
  const e = s.split("."), i = (1 << 7) + 1, r = Number(e[1]), o = e[2], a = Number(o.slice(0, -1)), d = (r << 5) + a, c = o.slice(-1) === "H" ? 1 : 0, u = Number(e[3]) === 8 ? 0 : 1, h = 0, f = e[4] ? Number(e[4]) : 0, m = e[5] ? Number(e[5][0]) : 1, g = e[5] ? Number(e[5][1]) : 1, p = e[5] ? Number(e[5][2]) : 0, y = (c << 7) + (u << 6) + (h << 5) + (f << 4) + (m << 3) + (g << 2) + p;
  return [i, d, y, 0];
}, fm = /^pcm-([usf])(\d+)(be)?$/, ks = (s) => {
  if (x(_s.includes(s)), s === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (s === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = fm.exec(s);
  x(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const n = Number(e[2]) / 8, i = e[3] !== "be", r = s === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: n, littleEndian: i, silentValue: r };
}, pm = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01", ...vn], mm = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, gm = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, ym = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, wm = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, bm = (s) => {
  if (!s)
    throw new TypeError("Video chunk metadata must be provided.");
  if (typeof s != "object")
    throw new TypeError("Video chunk metadata must be an object.");
  if (!s.decoderConfig)
    throw new TypeError("Video chunk metadata must include a decoder configuration.");
  if (typeof s.decoderConfig != "object")
    throw new TypeError("Video chunk metadata decoder configuration must be an object.");
  if (typeof s.decoderConfig.codec != "string")
    throw new TypeError("Video chunk metadata decoder configuration must specify a codec string.");
  if (!pm.some((e) => s.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(s.decoderConfig.codedWidth) || s.decoderConfig.codedWidth <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).");
  if (!Number.isInteger(s.decoderConfig.codedHeight) || s.decoderConfig.codedHeight <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).");
  if (s.decoderConfig.displayAspectWidth !== void 0 && (!Number.isInteger(s.decoderConfig.displayAspectWidth) || s.decoderConfig.displayAspectWidth <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectWidth, when defined, must be a positive integer.");
  if (s.decoderConfig.displayAspectHeight !== void 0 && (!Number.isInteger(s.decoderConfig.displayAspectHeight) || s.decoderConfig.displayAspectHeight <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectHeight, when defined, must be a positive integer.");
  if (s.decoderConfig.displayAspectWidth !== void 0 != (s.decoderConfig.displayAspectHeight !== void 0))
    throw new TypeError("Video chunk metadata decoder configuration must specify both displayAspectWidth and displayAspectHeight, or neither.");
  if (s.decoderConfig.description !== void 0 && !Zc(s.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (s.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = s.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const t = Object.keys(Nr);
    if (e.primaries != null && !t.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${t.join(", ")}.`);
    const n = Object.keys(Dr);
    if (e.transfer != null && !n.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${n.join(", ")}.`);
    const i = Object.keys(Vr);
    if (e.matrix != null && !i.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${i.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (s.decoderConfig.codec.startsWith("avc1") || s.decoderConfig.codec.startsWith("avc3")) {
    if (!mm.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (s.decoderConfig.codec.startsWith("hev1") || s.decoderConfig.codec.startsWith("hvc1")) {
    if (!gm.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (s.decoderConfig.codec.startsWith("vp8")) {
    if (s.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (s.decoderConfig.codec.startsWith("vp09")) {
    if (!ym.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (s.decoderConfig.codec.startsWith("av01")) {
    if (!wm.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
  } else if (vn.some((e) => s.decoderConfig.codec.startsWith(e)) && !vn.some((e) => s.decoderConfig.codec === e))
    throw new TypeError(`Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes four-character codes: ${vn.join(", ")}.`);
}, vm = [
  "mp4a",
  "mp3",
  "opus",
  "vorbis",
  "flac",
  "ulaw",
  "alaw",
  "pcm",
  "ac-3",
  "ec-3"
], Sm = (s) => {
  if (!s)
    throw new TypeError("Audio chunk metadata must be provided.");
  if (typeof s != "object")
    throw new TypeError("Audio chunk metadata must be an object.");
  if (!s.decoderConfig)
    throw new TypeError("Audio chunk metadata must include a decoder configuration.");
  if (typeof s.decoderConfig != "object")
    throw new TypeError("Audio chunk metadata decoder configuration must be an object.");
  if (typeof s.decoderConfig.codec != "string")
    throw new TypeError("Audio chunk metadata decoder configuration must specify a codec string.");
  if (!vm.some((e) => s.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(s.decoderConfig.sampleRate) || s.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(s.decoderConfig.numberOfChannels) || s.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (s.decoderConfig.description !== void 0 && !Zc(s.decoderConfig.description))
    throw new TypeError("Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (s.decoderConfig.codec.startsWith("mp4a") && s.decoderConfig.codec !== "mp4a.69" && s.decoderConfig.codec !== "mp4a.6B" && s.decoderConfig.codec !== "mp4a.6b") {
    if (!["mp4a.40.2", "mp4a.40.02", "mp4a.40.5", "mp4a.40.05", "mp4a.40.29", "mp4a.67"].includes(s.decoderConfig.codec))
      throw new TypeError("Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.");
  } else if (s.decoderConfig.codec.startsWith("mp3") || s.decoderConfig.codec.startsWith("mp4a")) {
    if (s.decoderConfig.codec !== "mp3" && s.decoderConfig.codec !== "mp4a.69" && s.decoderConfig.codec !== "mp4a.6B" && s.decoderConfig.codec !== "mp4a.6b")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".');
  } else if (s.decoderConfig.codec.startsWith("opus")) {
    if (s.decoderConfig.codec !== "opus")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Opus must be "opus".');
    if (s.decoderConfig.description && s.decoderConfig.description.byteLength < 18)
      throw new TypeError("Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.");
  } else if (s.decoderConfig.codec.startsWith("vorbis")) {
    if (s.decoderConfig.codec !== "vorbis")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".');
    if (!s.decoderConfig.description)
      throw new TypeError("Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.");
  } else if (s.decoderConfig.codec.startsWith("flac")) {
    if (s.decoderConfig.codec !== "flac")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for FLAC must be "flac".');
    if (!s.decoderConfig.description || s.decoderConfig.description.byteLength < 42)
      throw new TypeError("Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.");
  } else if (s.decoderConfig.codec.startsWith("ac-3") || s.decoderConfig.codec.startsWith("ac3")) {
    if (s.decoderConfig.codec !== "ac-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for AC-3 must be "ac-3".');
  } else if (s.decoderConfig.codec.startsWith("ec-3") || s.decoderConfig.codec.startsWith("eac3")) {
    if (s.decoderConfig.codec !== "ec-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for EC-3 must be "ec-3".');
  } else if ((s.decoderConfig.codec.startsWith("pcm") || s.decoderConfig.codec.startsWith("ulaw") || s.decoderConfig.codec.startsWith("alaw")) && !_s.includes(s.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${_s.join(", ")}).`);
}, _m = (s) => {
  if (!s)
    throw new TypeError("Subtitle metadata must be provided.");
  if (typeof s != "object")
    throw new TypeError("Subtitle metadata must be an object.");
  if (!s.config)
    throw new TypeError("Subtitle metadata must include a config object.");
  if (typeof s.config != "object")
    throw new TypeError("Subtitle metadata config must be an object.");
  if (typeof s.config.description != "string")
    throw new TypeError("Subtitle metadata config description must be a string.");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const km = [48e3, 44100, 32e3], xm = [24e3, 22050, 16e3];
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var zs;
(function(s) {
  s[s.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", s[s.SLICE_DPA = 2] = "SLICE_DPA", s[s.SLICE_DPB = 3] = "SLICE_DPB", s[s.SLICE_DPC = 4] = "SLICE_DPC", s[s.IDR = 5] = "IDR", s[s.SEI = 6] = "SEI", s[s.SPS = 7] = "SPS", s[s.PPS = 8] = "PPS", s[s.AUD = 9] = "AUD", s[s.SPS_EXT = 13] = "SPS_EXT";
})(zs || (zs = {}));
var We;
(function(s) {
  s[s.RASL_N = 8] = "RASL_N", s[s.RASL_R = 9] = "RASL_R", s[s.BLA_W_LP = 16] = "BLA_W_LP", s[s.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", s[s.VPS_NUT = 32] = "VPS_NUT", s[s.SPS_NUT = 33] = "SPS_NUT", s[s.PPS_NUT = 34] = "PPS_NUT", s[s.AUD_NUT = 35] = "AUD_NUT", s[s.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", s[s.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(We || (We = {}));
const Hr = function* (s) {
  let e = 0, t = -1;
  for (; e < s.length - 2; ) {
    const n = s.indexOf(0, e);
    if (n === -1 || n >= s.length - 2)
      break;
    e = n;
    let i = 0;
    if (e + 3 < s.length && s[e + 1] === 0 && s[e + 2] === 0 && s[e + 3] === 1 ? i = 4 : s[e + 1] === 0 && s[e + 2] === 1 && (i = 3), i === 0) {
      e++;
      continue;
    }
    t !== -1 && e > t && (yield {
      offset: t,
      length: e - t
    }), t = e + i, e = t;
  }
  t !== -1 && t < s.length && (yield {
    offset: t,
    length: s.length - t
  });
}, Tm = (s) => s & 31, jr = (s) => {
  const e = [], t = s.length;
  for (let n = 0; n < t; n++)
    n + 2 < t && s[n] === 0 && s[n + 1] === 0 && s[n + 2] === 3 ? (e.push(0, 0), n += 2) : e.push(s[n]);
  return new Uint8Array(e);
}, Em = (s, e) => {
  const t = s.reduce((r, o) => r + e + o.byteLength, 0), n = new Uint8Array(t);
  let i = 0;
  for (const r of s) {
    const o = new DataView(n.buffer, n.byteOffset, n.byteLength);
    switch (e) {
      case 1:
        o.setUint8(i, r.byteLength);
        break;
      case 2:
        o.setUint16(i, r.byteLength, !1);
        break;
      case 3:
        tm(o, i, r.byteLength);
        break;
      case 4:
        o.setUint32(i, r.byteLength, !1);
        break;
    }
    i += e, n.set(r, i), i += r.byteLength;
  }
  return n;
}, Cm = (s) => {
  try {
    const e = [], t = [], n = [];
    for (const a of Hr(s)) {
      const d = s.subarray(a.offset, a.offset + a.length), c = Tm(d[0]);
      c === zs.SPS ? e.push(d) : c === zs.PPS ? t.push(d) : c === zs.SPS_EXT && n.push(d);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const i = e[0], r = Bm(i);
    x(r !== null);
    const o = r.profileIdc === 100 || r.profileIdc === 110 || r.profileIdc === 122 || r.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: r.profileIdc,
      profileCompatibility: r.constraintFlags,
      avcLevelIndication: r.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: e,
      pictureParameterSets: t,
      chromaFormat: o ? r.chromaFormatIdc : null,
      bitDepthLumaMinus8: o ? r.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: o ? r.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: o ? n : null
    };
  } catch (e) {
    return fe._error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, Am = (s) => {
  const e = [];
  e.push(s.configurationVersion), e.push(s.avcProfileIndication), e.push(s.profileCompatibility), e.push(s.avcLevelIndication), e.push(252 | s.lengthSizeMinusOne & 3), e.push(224 | s.sequenceParameterSets.length & 31);
  for (const t of s.sequenceParameterSets) {
    const n = t.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let i = 0; i < n; i++)
      e.push(t[i]);
  }
  e.push(s.pictureParameterSets.length);
  for (const t of s.pictureParameterSets) {
    const n = t.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let i = 0; i < n; i++)
      e.push(t[i]);
  }
  if (s.avcProfileIndication === 100 || s.avcProfileIndication === 110 || s.avcProfileIndication === 122 || s.avcProfileIndication === 144) {
    x(s.chromaFormat !== null), x(s.bitDepthLumaMinus8 !== null), x(s.bitDepthChromaMinus8 !== null), x(s.sequenceParameterSetExt !== null), e.push(252 | s.chromaFormat & 3), e.push(248 | s.bitDepthLumaMinus8 & 7), e.push(248 | s.bitDepthChromaMinus8 & 7), e.push(s.sequenceParameterSetExt.length);
    for (const t of s.sequenceParameterSetExt) {
      const n = t.byteLength;
      e.push(n >> 8), e.push(n & 255);
      for (let i = 0; i < n; i++)
        e.push(t[i]);
    }
  }
  return new Uint8Array(e);
}, td = {
  1: { num: 1, den: 1 },
  2: { num: 12, den: 11 },
  3: { num: 10, den: 11 },
  4: { num: 16, den: 11 },
  5: { num: 40, den: 33 },
  6: { num: 24, den: 11 },
  7: { num: 20, den: 11 },
  8: { num: 32, den: 11 },
  9: { num: 80, den: 33 },
  10: { num: 18, den: 11 },
  11: { num: 15, den: 11 },
  12: { num: 64, den: 33 },
  13: { num: 160, den: 99 },
  14: { num: 4, den: 3 },
  15: { num: 3, den: 2 },
  16: { num: 2, den: 1 }
}, Bm = (s) => {
  try {
    const e = new ze(jr(s));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const n = e.readAlignedByte(), i = e.readAlignedByte(), r = e.readAlignedByte();
    _(e);
    let o = 1, a = 0, d = 0, c = 0;
    if ((n === 100 || n === 110 || n === 122 || n === 244 || n === 44 || n === 83 || n === 86 || n === 118 || n === 128) && (o = _(e), o === 3 && (c = e.readBits(1)), a = _(e), d = _(e), e.skipBits(1), e.readBits(1))) {
      for (let S = 0; S < (o !== 3 ? 8 : 12); S++)
        if (e.readBits(1)) {
          const C = S < 6 ? 16 : 64;
          let R = 8, U = 8;
          for (let K = 0; K < C; K++) {
            if (U !== 0) {
              const ee = lt(e);
              U = (R + ee + 256) % 256;
            }
            R = U === 0 ? R : U;
          }
        }
    }
    _(e);
    const l = _(e);
    if (l === 0)
      _(e);
    else if (l === 1) {
      e.skipBits(1), lt(e), lt(e);
      const W = _(e);
      for (let S = 0; S < W; S++)
        lt(e);
    }
    _(e), e.skipBits(1);
    const u = _(e), h = _(e), f = 16 * (u + 1), m = 16 * (h + 1);
    let g = f, p = m;
    const y = e.readBits(1);
    if (y || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const W = _(e), S = _(e), M = _(e), C = _(e);
      let R, U;
      if ((c === 0 ? o : 0) === 0)
        R = 1, U = 2 - y;
      else {
        const ee = o === 3 ? 1 : 2, ie = o === 1 ? 2 : 1;
        R = ee, U = ie * (2 - y);
      }
      g -= R * (W + S), p -= U * (M + C);
    }
    let A = 2, F = 2, j = 2, Z = 0, L = { num: 1, den: 1 }, q = null, $ = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const ie = e.readBits(8);
        if (ie === 255)
          L = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const X = td[ie];
          X && (L = X);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), Z = e.readBits(1), e.readBits(1) && (A = e.readBits(8), F = e.readBits(8), j = e.readBits(8))), e.readBits(1) && (_(e), _(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const U = e.readBits(1);
      U && Ko(e);
      const K = e.readBits(1);
      K && Ko(e), (U || K) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), _(e), _(e), _(e), _(e), q = _(e), $ = _(e));
    }
    if (q === null) {
      x($ === null);
      const W = i & 16;
      if ((n === 44 || n === 86 || n === 100 || n === 110 || n === 122 || n === 244) && W)
        q = 0, $ = 0;
      else {
        const S = u + 1, M = h + 1, C = (2 - y) * M, R = Zo.find((K) => K.level >= r) ?? us(Zo), U = Math.min(Math.floor(R.maxDpbMbs / (S * C)), 16);
        q = U, $ = U;
      }
    }
    return x($ !== null), {
      profileIdc: n,
      constraintFlags: i,
      levelIdc: r,
      frameMbsOnlyFlag: y,
      chromaFormatIdc: o,
      bitDepthLumaMinus8: a,
      bitDepthChromaMinus8: d,
      codedWidth: f,
      codedHeight: m,
      displayWidth: g,
      displayHeight: p,
      pixelAspectRatio: L,
      colourPrimaries: A,
      matrixCoefficients: j,
      transferCharacteristics: F,
      fullRangeFlag: Z,
      numReorderFrames: q,
      maxDecFrameBuffering: $
    };
  } catch (e) {
    return fe._error("Error parsing AVC SPS:", e), null;
  }
}, Ko = (s) => {
  const e = _(s);
  s.skipBits(4), s.skipBits(4);
  for (let t = 0; t <= e; t++)
    _(s), _(s), s.skipBits(1);
  s.skipBits(5), s.skipBits(5), s.skipBits(5), s.skipBits(5);
}, Xo = (s) => s >> 1 & 63, Mm = (s) => {
  try {
    const e = new ze(jr(s));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), n = e.readBits(1), { general_profile_space: i, general_tier_flag: r, general_profile_idc: o, general_profile_compatibility_flags: a, general_constraint_indicator_flags: d, general_level_idc: c } = Om(e, t);
    _(e);
    const l = _(e);
    let u = 0;
    l === 3 && (u = e.readBits(1));
    const h = _(e), f = _(e);
    let m = h, g = f;
    if (e.readBits(1)) {
      const S = _(e), M = _(e), C = _(e), R = _(e);
      let U = 1, K = 1;
      const ee = u === 0 ? l : 0;
      ee === 1 ? (U = 2, K = 2) : ee === 2 && (U = 2, K = 1), m -= (S + M) * U, g -= (C + R) * K;
    }
    const p = _(e), y = _(e);
    _(e);
    const A = e.readBits(1) ? 0 : t;
    let F = 0;
    for (let S = A; S <= t; S++)
      _(e), F = _(e), _(e);
    _(e), _(e), _(e), _(e), _(e), _(e), e.readBits(1) && e.readBits(1) && Rm(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), _(e), _(e), e.skipBits(1));
    const j = _(e);
    if (Pm(e, j), e.readBits(1)) {
      const S = _(e);
      for (let M = 0; M < S; M++)
        _(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let Z = 2, L = 2, q = 2, $ = 0, te = 0, W = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const S = Lm(e, t);
      W = S.pixelAspectRatio, Z = S.colourPrimaries, L = S.transferCharacteristics, q = S.matrixCoefficients, $ = S.fullRangeFlag, te = S.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: m,
      displayHeight: g,
      pixelAspectRatio: W,
      colourPrimaries: Z,
      transferCharacteristics: L,
      matrixCoefficients: q,
      fullRangeFlag: $,
      maxDecFrameBuffering: F + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: n,
      generalProfileSpace: i,
      generalTierFlag: r,
      generalProfileIdc: o,
      generalProfileCompatibilityFlags: a,
      generalConstraintIndicatorFlags: d,
      generalLevelIdc: c,
      chromaFormatIdc: l,
      bitDepthLumaMinus8: p,
      bitDepthChromaMinus8: y,
      minSpatialSegmentationIdc: te
    };
  } catch (e) {
    return fe._error("Error parsing HEVC SPS:", e), null;
  }
}, Im = (s) => {
  try {
    const e = [], t = [], n = [], i = [];
    for (const c of Hr(s)) {
      const l = s.subarray(c.offset, c.offset + c.length), u = Xo(l[0]);
      u === We.VPS_NUT ? e.push(l) : u === We.SPS_NUT ? t.push(l) : u === We.PPS_NUT ? n.push(l) : (u === We.PREFIX_SEI_NUT || u === We.SUFFIX_SEI_NUT) && i.push(l);
    }
    if (t.length === 0 || n.length === 0)
      return null;
    const r = Mm(t[0]);
    if (!r)
      return null;
    let o = 0;
    if (n.length > 0) {
      const c = n[0], l = new ze(jr(c));
      l.skipBits(16), _(l), _(l), l.skipBits(1), l.skipBits(1), l.skipBits(3), l.skipBits(1), l.skipBits(1), _(l), _(l), lt(l), l.skipBits(1), l.skipBits(1), l.readBits(1) && _(l), lt(l), lt(l), l.skipBits(1), l.skipBits(1), l.skipBits(1), l.skipBits(1);
      const u = l.readBits(1), h = l.readBits(1);
      !u && !h ? o = 0 : u && !h ? o = 2 : !u && h ? o = 3 : o = 0;
    }
    const a = [
      ...e.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: We.VPS_NUT,
          nalUnits: e
        }
      ] : [],
      ...t.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: We.SPS_NUT,
          nalUnits: t
        }
      ] : [],
      ...n.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: We.PPS_NUT,
          nalUnits: n
        }
      ] : [],
      ...i.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Xo(i[0][0]),
          nalUnits: i
        }
      ] : []
    ];
    return {
      configurationVersion: 1,
      generalProfileSpace: r.generalProfileSpace,
      generalTierFlag: r.generalTierFlag,
      generalProfileIdc: r.generalProfileIdc,
      generalProfileCompatibilityFlags: r.generalProfileCompatibilityFlags,
      generalConstraintIndicatorFlags: r.generalConstraintIndicatorFlags,
      generalLevelIdc: r.generalLevelIdc,
      minSpatialSegmentationIdc: r.minSpatialSegmentationIdc,
      parallelismType: o,
      chromaFormatIdc: r.chromaFormatIdc,
      bitDepthLumaMinus8: r.bitDepthLumaMinus8,
      bitDepthChromaMinus8: r.bitDepthChromaMinus8,
      avgFrameRate: 0,
      constantFrameRate: 0,
      numTemporalLayers: r.spsMaxSubLayersMinus1 + 1,
      temporalIdNested: r.spsTemporalIdNestingFlag,
      lengthSizeMinusOne: 3,
      arrays: a
    };
  } catch (e) {
    return fe._error("Error building HEVC Decoder Configuration Record:", e), null;
  }
}, Om = (s, e) => {
  const t = s.readBits(2), n = s.readBits(1), i = s.readBits(5);
  let r = 0;
  for (let l = 0; l < 32; l++)
    r = r << 1 | s.readBits(1);
  const o = new Uint8Array(6);
  for (let l = 0; l < 6; l++)
    o[l] = s.readBits(8);
  const a = s.readBits(8), d = [], c = [];
  for (let l = 0; l < e; l++)
    d.push(s.readBits(1)), c.push(s.readBits(1));
  if (e > 0)
    for (let l = e; l < 8; l++)
      s.skipBits(2);
  for (let l = 0; l < e; l++)
    d[l] && s.skipBits(88), c[l] && s.skipBits(8);
  return {
    general_profile_space: t,
    general_tier_flag: n,
    general_profile_idc: i,
    general_profile_compatibility_flags: r,
    general_constraint_indicator_flags: o,
    general_level_idc: a
  };
}, Rm = (s) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!s.readBits(1))
        _(s);
      else {
        const i = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && lt(s);
        for (let r = 0; r < i; r++)
          lt(s);
      }
}, Pm = (s, e) => {
  const t = [];
  for (let n = 0; n < e; n++)
    t[n] = Fm(s, n, e, t);
}, Fm = (s, e, t, n) => {
  let i = 0, r = 0, o = 0;
  if (e !== 0 && (r = s.readBits(1)), r) {
    if (e === t) {
      const d = _(s);
      o = e - (d + 1);
    } else
      o = e - 1;
    s.readBits(1), _(s);
    const a = n[o] ?? 0;
    for (let d = 0; d <= a; d++)
      s.readBits(1) || s.readBits(1);
    i = n[o];
  } else {
    const a = _(s), d = _(s);
    for (let c = 0; c < a; c++)
      _(s), s.readBits(1);
    for (let c = 0; c < d; c++)
      _(s), s.readBits(1);
    i = a + d;
  }
  return i;
}, Lm = (s, e) => {
  let t = 2, n = 2, i = 2, r = 0, o = 0, a = { num: 1, den: 1 };
  if (s.readBits(1)) {
    const d = s.readBits(8);
    if (d === 255)
      a = {
        num: s.readBits(16),
        den: s.readBits(16)
      };
    else {
      const c = td[d];
      c && (a = c);
    }
  }
  return s.readBits(1) && s.readBits(1), s.readBits(1) && (s.readBits(3), r = s.readBits(1), s.readBits(1) && (t = s.readBits(8), n = s.readBits(8), i = s.readBits(8))), s.readBits(1) && (_(s), _(s)), s.readBits(1), s.readBits(1), s.readBits(1), s.readBits(1) && (_(s), _(s), _(s), _(s)), s.readBits(1) && (s.readBits(32), s.readBits(32), s.readBits(1) && _(s), s.readBits(1) && Um(s, !0, e)), s.readBits(1) && (s.readBits(1), s.readBits(1), s.readBits(1), o = _(s), _(s), _(s), _(s), _(s)), {
    pixelAspectRatio: a,
    colourPrimaries: t,
    transferCharacteristics: n,
    matrixCoefficients: i,
    fullRangeFlag: r,
    minSpatialSegmentationIdc: o
  };
}, Um = (s, e, t) => {
  let n = !1, i = !1, r = !1;
  n = s.readBits(1) === 1, i = s.readBits(1) === 1, (n || i) && (r = s.readBits(1) === 1, r && (s.readBits(8), s.readBits(5), s.readBits(1), s.readBits(5)), s.readBits(4), s.readBits(4), r && s.readBits(4), s.readBits(5), s.readBits(5), s.readBits(5));
  for (let o = 0; o <= t; o++) {
    const a = s.readBits(1) === 1;
    let d = !0;
    a || (d = s.readBits(1) === 1);
    let c = !1;
    d ? _(s) : c = s.readBits(1) === 1;
    let l = 1;
    c || (l = _(s) + 1), n && Yo(s, l, r), i && Yo(s, l, r);
  }
}, Yo = (s, e, t) => {
  for (let n = 0; n < e; n++)
    _(s), _(s), t && (_(s), _(s)), s.readBits(1);
}, Nm = (s) => {
  const e = [];
  e.push(s.configurationVersion), e.push((s.generalProfileSpace & 3) << 6 | (s.generalTierFlag & 1) << 5 | s.generalProfileIdc & 31), e.push(s.generalProfileCompatibilityFlags >>> 24 & 255), e.push(s.generalProfileCompatibilityFlags >>> 16 & 255), e.push(s.generalProfileCompatibilityFlags >>> 8 & 255), e.push(s.generalProfileCompatibilityFlags & 255), e.push(...s.generalConstraintIndicatorFlags), e.push(s.generalLevelIdc & 255), e.push(240 | s.minSpatialSegmentationIdc >> 8 & 15), e.push(s.minSpatialSegmentationIdc & 255), e.push(252 | s.parallelismType & 3), e.push(252 | s.chromaFormatIdc & 3), e.push(248 | s.bitDepthLumaMinus8 & 7), e.push(248 | s.bitDepthChromaMinus8 & 7), e.push(s.avgFrameRate >> 8 & 255), e.push(s.avgFrameRate & 255), e.push((s.constantFrameRate & 3) << 6 | (s.numTemporalLayers & 7) << 3 | (s.temporalIdNested & 1) << 2 | s.lengthSizeMinusOne & 3), e.push(s.arrays.length & 255);
  for (const t of s.arrays) {
    e.push((t.arrayCompleteness & 1) << 7 | 0 | t.nalUnitType & 63), e.push(t.nalUnits.length >> 8 & 255), e.push(t.nalUnits.length & 255);
    for (const n of t.nalUnits) {
      e.push(n.length >> 8 & 255), e.push(n.length & 255);
      for (let i = 0; i < n.length; i++)
        e.push(n[i]);
    }
  }
  return new Uint8Array(e);
};
var Qo;
(function(s) {
  s[s.audAllowed = 0] = "audAllowed", s[s.beforeFirstVcl = 1] = "beforeFirstVcl", s[s.afterFirstVcl = 2] = "afterFirstVcl", s[s.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", s[s.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(Qo || (Qo = {}));
const Dm = (s) => {
  const e = Gc(s), t = e.getUint8(9), n = e.getUint16(10, !0), i = e.getUint32(12, !0), r = e.getInt16(16, !0), o = e.getUint8(18);
  let a = null;
  return o && (a = s.subarray(19, 21 + t)), {
    outputChannelCount: t,
    preSkip: n,
    inputSampleRate: i,
    outputGain: r,
    channelMappingFamily: o,
    channelMappingTable: a
  };
};
var Jo;
(function(s) {
  s[s.STREAMINFO = 0] = "STREAMINFO", s[s.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", s[s.PICTURE = 6] = "PICTURE";
})(Jo || (Jo = {}));
const Vm = (s) => {
  if (s.length < 7 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new ze(s);
  e.skipBits(16), e.skipBits(16);
  const t = e.readBits(2);
  if (t === 3)
    return null;
  const n = e.readBits(6), i = e.readBits(5);
  if (i > 8)
    return null;
  const r = e.readBits(3), o = e.readBits(3);
  (o & 1) !== 0 && o !== 1 && e.skipBits(2), (o & 4) !== 0 && e.skipBits(2), o === 2 && e.skipBits(2);
  const a = e.readBits(1), d = Math.floor(n / 2);
  return { fscod: t, bsid: i, bsmod: r, acmod: o, lfeon: a, bitRateCode: d };
}, $m = [1, 2, 3, 6], zm = (s) => {
  if (s.length < 6 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new ze(s);
  e.skipBits(16);
  const t = e.readBits(2);
  if (e.skipBits(3), t !== 0 && t !== 2)
    return null;
  const n = e.readBits(11), i = e.readBits(2);
  let r = 0, o;
  i === 3 ? (r = e.readBits(2), o = 3) : o = e.readBits(2);
  const a = e.readBits(3), d = e.readBits(1), c = e.readBits(5);
  if (c < 11 || c > 16)
    return null;
  const l = $m[o];
  let u;
  return i < 3 ? u = km[i] / 1e3 : u = xm[r] / 1e3, {
    dataRate: Math.round((n + 1) * u / (l * 16)),
    substreams: [{
      fscod: i,
      fscod2: r,
      bsid: c,
      bsmod: 0,
      acmod: a,
      lfeon: d,
      numDepSub: 0,
      chanLoc: 0
    }]
  };
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const ea = /* @__PURE__ */ new Uint8Array(0);
class Ot {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, n, i, r = -1, o, a) {
    if (this.data = e, this.type = t, this.timestamp = n, this.duration = i, this.sequenceNumber = r, e === ea && o === void 0)
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    if (o === void 0 && (o = e.byteLength), !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== "key" && t !== "delta")
      throw new TypeError('type must be either "key" or "delta".');
    if (!Number.isFinite(n))
      throw new TypeError("timestamp must be a number.");
    if (!Number.isFinite(i) || i < 0)
      throw new TypeError("duration must be a non-negative number.");
    if (!Number.isFinite(r))
      throw new TypeError("sequenceNumber must be a number.");
    if (!Number.isInteger(o) || o < 0)
      throw new TypeError("byteLength must be a non-negative integer.");
    if (a !== void 0 && (typeof a != "object" || !a))
      throw new TypeError("sideData, when provided, must be an object.");
    if (a?.alpha !== void 0 && !(a.alpha instanceof Uint8Array))
      throw new TypeError("sideData.alpha, when provided, must be a Uint8Array.");
    if (a?.alphaByteLength !== void 0 && (!Number.isInteger(a.alphaByteLength) || a.alphaByteLength < 0))
      throw new TypeError("sideData.alphaByteLength, when provided, must be a non-negative integer.");
    this.byteLength = o, this.sideData = a ?? {}, this.sideData.alpha && this.sideData.alphaByteLength === void 0 && (this.sideData.alphaByteLength = this.sideData.alpha.byteLength);
  }
  /**
   * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
   * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
   */
  get isMetadataOnly() {
    return this.data === ea;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(Wo * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(Wo * this.duration);
  }
  /** Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API. */
  toEncodedVideoChunk() {
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    if (typeof EncodedVideoChunk > "u")
      throw new Error("Your browser does not support EncodedVideoChunk.");
    return new EncodedVideoChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
   */
  alphaToEncodedVideoChunk(e = this.type) {
    if (!this.sideData.alpha)
      throw new TypeError("This packet does not contain alpha side data.");
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    if (typeof EncodedVideoChunk > "u")
      throw new Error("Your browser does not support EncodedVideoChunk.");
    return new EncodedVideoChunk({
      data: this.sideData.alpha,
      type: e,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /** Converts this packet to an
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
   * WebCodecs API. */
  toEncodedAudioChunk() {
    if (this.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be converted to an audio chunk.");
    if (typeof EncodedAudioChunk > "u")
      throw new Error("Your browser does not support EncodedAudioChunk.");
    return new EncodedAudioChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Creates an {@link EncodedPacket} from an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
   * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
   */
  static fromEncodedChunk(e, t) {
    if (!(e instanceof EncodedVideoChunk || e instanceof EncodedAudioChunk))
      throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
    const n = new Uint8Array(e.byteLength);
    return e.copyTo(n), new Ot(n, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, t);
  }
  /** Clones this packet while optionally modifying the new packet's data. */
  clone(e) {
    if (e !== void 0 && (typeof e != "object" || e === null))
      throw new TypeError("options, when provided, must be an object.");
    if (e?.data !== void 0 && !(e.data instanceof Uint8Array))
      throw new TypeError("options.data, when provided, must be a Uint8Array.");
    if (e?.type !== void 0 && e.type !== "key" && e.type !== "delta")
      throw new TypeError('options.type, when provided, must be either "key" or "delta".');
    if (e?.timestamp !== void 0 && !Number.isFinite(e.timestamp))
      throw new TypeError("options.timestamp, when provided, must be a number.");
    if (e?.duration !== void 0 && !Number.isFinite(e.duration))
      throw new TypeError("options.duration, when provided, must be a number.");
    if (e?.sequenceNumber !== void 0 && !Number.isFinite(e.sequenceNumber))
      throw new TypeError("options.sequenceNumber, when provided, must be a number.");
    if (e?.sideData !== void 0 && (typeof e.sideData != "object" || e.sideData === null))
      throw new TypeError("options.sideData, when provided, must be an object.");
    return new Ot(e?.data ?? this.data, e?.type ?? this.type, e?.timestamp ?? this.timestamp, e?.duration ?? this.duration, e?.sequenceNumber ?? this.sequenceNumber, this.byteLength, e?.sideData ?? this.sideData);
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Hm = (s) => {
  let t = (s.hasVideo ? "video/" : s.hasAudio ? "audio/" : "application/") + (s.isQuickTime ? "quicktime" : "mp4");
  if (s.codecStrings.length > 0) {
    const n = [...new Set(s.codecStrings)];
    t += `; codecs="${n.join(", ")}"`;
  }
  return t;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const wi = 8, ta = 16;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const jm = 7, qm = 9, sa = (s) => {
  const e = s.filePos, t = Gm(s, 9), n = new ze(t);
  if (n.readBits(12) !== 4095 || (n.skipBits(1), n.readBits(2) !== 0))
    return null;
  const o = n.readBits(1), a = n.readBits(2) + 1, d = n.readBits(4);
  if (d === 15)
    return null;
  n.skipBits(1);
  const c = n.readBits(3);
  if (c === 0)
    throw new Error("ADTS frames with channel configuration 0 are not supported.");
  n.skipBits(1), n.skipBits(1), n.skipBits(1), n.skipBits(1);
  const l = n.readBits(13);
  n.skipBits(11);
  const u = n.readBits(2) + 1;
  if (u !== 1)
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  let h = null;
  return o === 1 ? s.filePos -= 2 : h = n.readBits(16), {
    objectType: a,
    samplingFrequencyIndex: d,
    channelConfiguration: c,
    frameLength: l,
    numberOfAacFrames: u,
    crcCheck: h,
    startPos: e
  };
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Zs {
  constructor(e, t, n, i, r) {
    this.bytes = e, this.view = t, this.offset = n, this.start = i, this.end = r, this.bufferPos = i - n;
  }
  static tempFromBytes(e) {
    return new Zs(e, Gc(e), 0, 0, e.length);
  }
  get length() {
    return this.end - this.start;
  }
  get filePos() {
    return this.offset + this.bufferPos;
  }
  set filePos(e) {
    this.bufferPos = e - this.offset;
  }
  /** The number of bytes left from the current pos to the end of the slice. */
  get remainingLength() {
    return Math.max(this.end - this.filePos, 0);
  }
  skip(e) {
    this.bufferPos += e;
  }
  /** Creates a new subslice of this slice whose byte range must be contained within this slice. */
  slice(e, t = this.end - e) {
    if (e < this.start || e + t > this.end)
      throw new RangeError("Slicing outside of original slice.");
    return new Zs(this.bytes, this.view, this.offset, e, e + t);
  }
}
const Wm = (s, e) => {
  if (s.filePos < s.start || s.filePos + e > s.end)
    throw new RangeError(`Tried reading [${s.filePos}, ${s.filePos + e}), but slice is [${s.start}, ${s.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, Gm = (s, e) => {
  Wm(s, e);
  const t = s.bytes.subarray(s.bufferPos, s.bufferPos + e);
  return s.bufferPos += e, t;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Zm {
  constructor(e) {
    this.mutex = new Kc(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackClose(e) {
  }
  validateTimestamp(e, t, n) {
    if (t < 0)
      throw new Error(`Timestamps must be non-negative (got ${t}s).`);
    let i = this.trackTimestampInfo.get(e);
    if (i) {
      if (n && (i.maxTimestampBeforeLastKeyPacket = i.maxTimestamp), i.maxTimestampBeforeLastKeyPacket !== null && t < i.maxTimestampBeforeLastKeyPacket)
        throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${t}s, but largest timestamp is ${i.maxTimestampBeforeLastKeyPacket}s.`);
      i.maxTimestamp = Math.max(i.maxTimestamp, t);
    } else {
      if (!n)
        throw new Error("First packet must be a key packet.");
      i = {
        maxTimestamp: t,
        maxTimestampBeforeLastKeyPacket: null
      }, this.trackTimestampInfo.set(e, i);
    }
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const na = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, Km = (s) => {
  const e = Math.floor(s / 36e5), t = Math.floor(s % (3600 * 1e3) / (60 * 1e3)), n = Math.floor(s % (60 * 1e3) / 1e3), i = s % 1e3;
  return e.toString().padStart(2, "0") + ":" + t.toString().padStart(2, "0") + ":" + n.toString().padStart(2, "0") + "." + i.toString().padStart(3, "0");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class hn {
  constructor(e) {
    this.writer = e, this.helper = new Uint8Array(8), this.helperView = new DataView(this.helper.buffer), this.offsets = /* @__PURE__ */ new WeakMap();
  }
  writeU32(e) {
    this.helperView.setUint32(0, e, !1), this.writer.write(this.helper.subarray(0, 4));
  }
  writeU64(e) {
    this.helperView.setUint32(0, Math.floor(e / 2 ** 32), !1), this.helperView.setUint32(4, e, !1), this.writer.write(this.helper.subarray(0, 8));
  }
  writeAscii(e) {
    for (let t = 0; t < e.length; t++)
      this.helperView.setUint8(t % 8, e.charCodeAt(t)), t % 8 === 7 && this.writer.write(this.helper);
    e.length % 8 !== 0 && this.writer.write(this.helper.subarray(0, e.length % 8));
  }
  writeBox(e) {
    if (this.offsets.set(e, this.writer.getPos()), e.contents && !e.children)
      this.writeBoxHeader(e, e.size ?? e.contents.byteLength + 8), this.writer.write(e.contents);
    else {
      const t = this.writer.getPos();
      if (this.writeBoxHeader(e, 0), e.contents && this.writer.write(e.contents), e.children)
        for (const r of e.children)
          r && this.writeBox(r);
      const n = this.writer.getPos(), i = e.size ?? n - t;
      this.writer.seek(t), this.writeBoxHeader(e, i), this.writer.seek(n);
    }
  }
  writeBoxHeader(e, t) {
    this.writeU32(e.largeSize ? 1 : t), this.writeAscii(e.type), e.largeSize && this.writeU64(t);
  }
  measureBoxHeader(e) {
    return 8 + (e.largeSize ? 8 : 0);
  }
  patchBox(e) {
    const t = this.offsets.get(e);
    x(t !== void 0);
    const n = this.writer.getPos();
    this.writer.seek(t), this.writeBox(e), this.writer.seek(n);
  }
  measureBox(e) {
    if (e.contents && !e.children)
      return this.measureBoxHeader(e) + e.contents.byteLength;
    {
      let t = this.measureBoxHeader(e);
      if (e.contents && (t += e.contents.byteLength), e.children)
        for (const n of e.children)
          n && (t += this.measureBox(n));
      return t;
    }
  }
}
const z = /* @__PURE__ */ new Uint8Array(8), Re = /* @__PURE__ */ new DataView(z.buffer), ue = (s) => [(s % 256 + 256) % 256], P = (s) => (Re.setUint16(0, s, !1), [z[0], z[1]]), qr = (s) => (Re.setInt16(0, s, !1), [z[0], z[1]]), sd = (s) => (Re.setUint32(0, s, !1), [z[1], z[2], z[3]]), w = (s) => (Re.setUint32(0, s, !1), [z[0], z[1], z[2], z[3]]), ct = (s) => (Re.setInt32(0, s, !1), [z[0], z[1], z[2], z[3]]), tt = (s) => (Re.setUint32(0, Math.floor(s / 2 ** 32), !1), Re.setUint32(4, s, !1), [z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7]]), Xm = (s) => (Re.setInt32(0, Math.floor(s / 2 ** 32), !1), Re.setUint32(4, s, !1), [z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7]]), nd = (s) => (Re.setInt16(0, 2 ** 8 * s, !1), [z[0], z[1]]), De = (s) => (Re.setInt32(0, 2 ** 16 * s, !1), [z[0], z[1], z[2], z[3]]), bi = (s) => (Re.setInt32(0, 2 ** 30 * s, !1), [z[0], z[1], z[2], z[3]]), vi = (s, e) => {
  const t = [];
  let n = s;
  do {
    let i = n & 127;
    n >>= 7, t.length > 0 && (i |= 128), t.push(i);
  } while (n > 0 || e);
  return t.reverse();
}, se = (s, e = !1) => {
  const t = Array(s.length).fill(null).map((n, i) => s.charCodeAt(i));
  return e && t.push(0), t;
}, id = (s) => {
  const e = s * (Math.PI / 180), t = Math.round(Math.cos(e)), n = Math.round(Math.sin(e));
  return [
    t,
    n,
    0,
    -n,
    t,
    0,
    0,
    0,
    1
  ];
}, rd = /* @__PURE__ */ id(0), od = (s) => [
  De(s[0]),
  De(s[1]),
  bi(s[2]),
  De(s[3]),
  De(s[4]),
  bi(s[5]),
  De(s[6]),
  De(s[7]),
  bi(s[8])
], O = (s, e, t) => ({
  type: s,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), Y = (s, e, t, n, i) => O(s, [ue(e), sd(t), n ?? []], i), Ym = (s) => s.isQuickTime ? O("ftyp", [
  se("qt  "),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("qt  ")
]) : s.fragmented ? s.cmaf ? O("ftyp", [
  se("iso5"),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41"),
  se("cmfc"),
  se("dash")
]) : O("ftyp", [
  se("iso5"),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41")
]) : O("ftyp", [
  se("isom"),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("isom"),
  s.holdsAvc ? se("avc1") : [],
  se("mp41")
]), ia = () => O("styp", [
  se("iso5"),
  // Major brand
  w(0),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41"),
  se("cmfc"),
  se("dash")
]), ra = (s, e) => {
  let t = s.maxWrittenEndTimestamp - s.minWrittenTimestamp;
  return Number.isFinite(t) || (t = 0), Y("sidx", 1, 0, [
    w(1),
    // Reference ID
    w($e),
    // Timescale
    tt(oe(s.minWrittenTimestamp, $e)),
    // Earliest presentation time
    tt(0),
    // First offset
    P(0),
    // Reserved
    P(1),
    // Reference count
    w(e & 2147483647),
    // Reference type (0) + referenced size
    w(oe(t, $e)),
    // Subsegment duration
    w(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, fn = (s) => ({ type: "mdat", largeSize: s }), Qm = (s) => ({ type: "free", size: s }), Os = (s) => O("moov", void 0, [
  Jm(s.creationTime, s.trackDatas),
  ...s.trackDatas.map((e) => eg(e, s.creationTime)),
  s.isFragmented ? Dg(s.trackDatas) : null,
  Qg(s)
]), Jm = (s, e) => {
  const t = Math.max(0, ...e.map((o) => oe(ei(o), $e) + oe(o.startTimestampOffset ?? 0, $e))), n = Math.max(0, ...e.map((o) => o.track.id)) + 1, i = !Ut(s) || !Ut(t), r = i ? tt : w;
  return Y("mvhd", +i, 0, [
    r(s),
    // Creation time
    r(s),
    // Modification time
    w($e),
    // Timescale
    r(t),
    // Duration
    De(1),
    // Preferred rate
    nd(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    od(rd),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    w(n)
    // Next track ID
  ]);
}, ei = (s) => {
  if (s.samples.length === 0)
    return 0;
  let e = 1 / 0, t = -1 / 0;
  for (let n = 0; n < s.samples.length; n++) {
    const i = s.samples[n];
    i.timestamp < e && (e = i.timestamp), i.timestamp + i.duration > t && (t = i.timestamp + i.duration);
  }
  return e === 1 / 0 ? 0 : t - e;
}, eg = (s, e) => {
  const t = dy(s), n = s.startTimestampOffset !== null && s.startTimestampOffset > 0;
  return O("trak", void 0, [
    tg(s, e),
    n ? sg(s, s.startTimestampOffset) : null,
    ng(s, e),
    t.name !== void 0 ? O("udta", void 0, [
      O("name", [
        ...Xe.encode(t.name)
      ])
    ]) : null
  ]);
}, tg = (s, e) => {
  const t = oe(ei(s), $e) + oe(s.startTimestampOffset ?? 0, $e), n = !Ut(e) || !Ut(t), i = n ? tt : w;
  let r;
  if (s.type === "video") {
    const a = s.track.metadata.rotation;
    r = id(a ?? 0);
  } else
    r = rd;
  let o = 2;
  return s.track.metadata.disposition?.default !== !1 && (o |= 1), Y("tkhd", +n, o, [
    i(e),
    // Creation time
    i(e),
    // Modification time
    w(s.track.id),
    // Track ID
    w(0),
    // Reserved
    i(t),
    // Duration
    Array(8).fill(0),
    // Reserved
    P(0),
    // Layer
    P(s.track.id),
    // Alternate group
    nd(s.type === "audio" ? 1 : 0),
    // Volume
    P(0),
    // Reserved
    od(r),
    // Matrix
    De(s.type === "video" ? s.info.width : 0),
    // Track width
    De(s.type === "video" ? s.info.height : 0)
    // Track height
  ]);
}, sg = (s, e) => {
  const t = oe(e, $e), n = oe(ei(s), $e), i = !Ut(t) || !Ut(n), r = i ? tt : w, o = i ? Xm : ct;
  return O("edts", void 0, [
    Y("elst", i ? 1 : 0, 0, [
      w(2),
      // Entry count
      // #1
      r(t),
      // Segment duration
      o(-1),
      // Media time
      De(1),
      // Media rate
      // #2
      r(n),
      // Segment duration
      o(0),
      // Media time
      De(1)
      // Media rate
    ])
  ]);
}, ng = (s, e) => O("mdia", void 0, [
  ig(s, e),
  Wr(!0, rg[s.type], og[s.type]),
  ag(s)
]), ig = (s, e) => {
  const t = oe(ei(s), s.timescale), n = !Ut(e) || !Ut(t), i = n ? tt : w;
  return Y("mdhd", +n, 0, [
    i(e),
    // Creation time
    i(e),
    // Modification time
    w(s.timescale),
    // Timescale
    i(t),
    // Duration
    P(ld(s.track.metadata.languageCode ?? sm)),
    // Language
    P(0)
    // Quality
  ]);
}, rg = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, og = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, Wr = (s, e, t, n = "\0\0\0\0") => Y("hdlr", 0, 0, [
  s ? se("mhlr") : w(0),
  // Component type
  se(e),
  // Component subtype
  se(n),
  // Component manufacturer
  w(0),
  // Component flags
  w(0),
  // Component flags mask
  se(t, !0)
  // Component name
]), ag = (s) => O("minf", void 0, [
  ug[s.type](),
  hg(),
  mg(s)
]), cg = () => Y("vmhd", 0, 1, [
  P(0),
  // Graphics mode
  P(0),
  // Opcolor R
  P(0),
  // Opcolor G
  P(0)
  // Opcolor B
]), dg = () => Y("smhd", 0, 0, [
  P(0),
  // Balance
  P(0)
  // Reserved
]), lg = () => Y("nmhd", 0, 0), ug = {
  video: cg,
  audio: dg,
  subtitle: lg
}, hg = () => O("dinf", void 0, [
  fg()
]), fg = () => Y("dref", 0, 0, [
  w(1)
  // Entry count
], [
  pg()
]), pg = () => Y("url ", 0, 1), mg = (s) => {
  const e = s.compositionTimeOffsetTable.length > 1 || s.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return O("stbl", void 0, [
    gg(s),
    Og(s),
    e ? Ug(s) : null,
    e ? Ng(s) : null,
    Pg(s),
    Fg(s),
    Lg(s),
    Rg(s)
  ]);
}, gg = (s) => {
  let e;
  if (s.type === "video")
    e = yg(sy(s.track.source._codec, s.info.decoderConfig.codec), s);
  else if (s.type === "audio") {
    const t = dd(s.track.source._codec, s.muxer.isQuickTime);
    x(t), e = kg(t, s);
  } else s.type === "subtitle" && (e = Mg(ry[s.track.source._codec], s));
  return x(e), Y("stsd", 0, 0, [
    w(1)
    // Entry count
  ], [
    e
  ]);
}, yg = (s, e) => O(s, [
  Array(6).fill(0),
  // Reserved
  P(1),
  // Data reference index
  P(0),
  // Pre-defined
  P(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  P(e.info.width),
  // Width
  P(e.info.height),
  // Height
  w(4718592),
  // Horizontal resolution
  w(4718592),
  // Vertical resolution
  w(0),
  // Reserved
  P(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  P(24),
  // Depth
  qr(65535)
  // Pre-defined
], [
  ny[e.track.source._codec]?.(e) ?? null,
  wg(e),
  Jp(e.info.decoderConfig.colorSpace) ? bg(e) : null
]), wg = (s) => s.info.pixelAspectRatio.num === s.info.pixelAspectRatio.den ? null : O("pasp", [
  w(s.info.pixelAspectRatio.num),
  w(s.info.pixelAspectRatio.den)
]), bg = (s) => O("colr", [
  se(s.muxer.isQuickTime ? "nclc" : "nclx"),
  // Colour type
  P(Nr[s.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  P(Dr[s.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  P(Vr[s.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  s.muxer.isQuickTime ? [] : ue((s.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), vg = (s) => s.info.decoderConfig && O("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...en(s.info.decoderConfig.description)
]), Sg = (s) => s.info.decoderConfig && O("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...en(s.info.decoderConfig.description)
]), oa = (s) => {
  if (!s.info.decoderConfig)
    return null;
  const e = s.info.decoderConfig, t = e.codec.split("."), n = Number(t[1]), i = Number(t[2]), r = Number(t[3]), o = t[4] ? Number(t[4]) : 1, a = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), d = (r << 4) + (o << 1) + a, c = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? Nr[e.colorSpace.primaries] : 2, l = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? Dr[e.colorSpace.transfer] : 2, u = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? Vr[e.colorSpace.matrix] : 2;
  return Y("vpcC", 1, 0, [
    ue(n),
    // Profile
    ue(i),
    // Level
    ue(d),
    // Bit depth, chroma subsampling, full range
    ue(c),
    // Colour primaries
    ue(l),
    // Transfer characteristics
    ue(u),
    // Matrix coefficients
    P(0)
    // Codec initialization data size
  ]);
}, _g = (s) => O("av1C", hm(s.info.decoderConfig.codec)), kg = (s, e) => {
  let t = 0, n, i = 16;
  const r = _s.includes(e.track.source._codec);
  if (r) {
    const o = e.track.source._codec, { sampleSize: a } = ks(o);
    i = 8 * a, i > 16 && (t = 1);
  }
  if (e.muxer.isQuickTime && (t = 1), t === 0)
    n = [
      Array(6).fill(0),
      // Reserved
      P(1),
      // Data reference index
      P(t),
      // Version
      P(0),
      // Revision level
      w(0),
      // Vendor
      P(e.info.numberOfChannels),
      // Number of channels
      P(i),
      // Sample size (bits)
      P(0),
      // Compression ID
      P(0),
      // Packet size
      P(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      P(0)
      // Sample rate (lower)
    ];
  else {
    const o = r ? 0 : -2;
    n = [
      Array(6).fill(0),
      // Reserved
      P(1),
      // Data reference index
      P(t),
      // Version
      P(0),
      // Revision level
      w(0),
      // Vendor
      P(e.info.numberOfChannels),
      // Number of channels
      P(Math.min(i, 16)),
      // Sample size (bits)
      qr(o),
      // Compression ID
      P(0),
      // Packet size
      P(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      P(0),
      // Sample rate (lower)
      r ? [
        w(1),
        // Samples per packet (must be 1 for uncompressed formats)
        w(i / 8),
        // Bytes per packet
        w(e.info.numberOfChannels * i / 8)
        // Bytes per frame
      ] : [
        w(0),
        // Samples per packet (don't bother, still works with 0)
        w(0),
        // Bytes per packet (variable)
        w(0)
        // Bytes per frame (variable)
      ],
      w(2)
      // Bytes per sample (constant in FFmpeg)
    ];
  }
  return O(s, n, [
    iy(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Si = (s) => {
  let e;
  switch (s.track.source._codec) {
    case "aac":
      e = 64;
      break;
    case "mp3":
      e = 107;
      break;
    case "vorbis":
      e = 221;
      break;
    default:
      throw new Error(`Unhandled audio codec: ${s.track.source._codec}`);
  }
  let t = [
    ...ue(e),
    // Object type indication
    ...ue(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...sd(0),
    // 24bit buffer size
    ...w(0),
    // max bitrate
    ...w(0)
    // avg bitrate
  ];
  if (s.info.decoderConfig.description) {
    const n = en(s.info.decoderConfig.description);
    t = [
      ...t,
      ...ue(5),
      // TAG(5) = DecoderSpecificInfo
      ...vi(n.byteLength),
      ...n
    ];
  }
  return t = [
    ...P(1),
    // ES_ID = 1
    ...ue(0),
    // flags etc = 0
    ...ue(4),
    // TAG(4) = ES Descriptor
    ...vi(t.length),
    ...t,
    ...ue(6),
    // TAG(6)
    ...ue(1),
    // length
    ...ue(2)
    // data
  ], t = [
    ...ue(3),
    // TAG(3) = Object Descriptor
    ...vi(t.length),
    ...t
  ], Y("esds", 0, 0, t);
}, bt = (s) => O("wave", void 0, [
  xg(s),
  Tg(s),
  O("\0\0\0\0")
  // NULL tag at the end
]), xg = (s) => O("frma", [
  se(dd(s.track.source._codec, s.muxer.isQuickTime))
]), Tg = (s) => {
  const { littleEndian: e } = ks(s.track.source._codec);
  return O("enda", [
    P(+e)
  ]);
}, Eg = (s) => {
  let e = s.info.numberOfChannels, t = 3840, n = s.info.sampleRate, i = 0, r = 0, o = new Uint8Array(0);
  const a = s.info.decoderConfig?.description;
  if (a) {
    x(a.byteLength >= 18);
    const d = en(a), c = Dm(d);
    e = c.outputChannelCount, t = c.preSkip, n = c.inputSampleRate, i = c.outputGain, r = c.channelMappingFamily, c.channelMappingTable && (o = c.channelMappingTable);
  }
  return O("dOps", [
    ue(0),
    // Version
    ue(e),
    // OutputChannelCount
    P(t),
    // PreSkip
    w(n),
    // InputSampleRate
    qr(i),
    // OutputGain
    ue(r),
    // ChannelMappingFamily
    ...o
  ]);
}, Cg = (s) => {
  const e = s.info.decoderConfig?.description;
  x(e);
  const t = en(e);
  return Y("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, je = (s) => {
  const { littleEndian: e, sampleSize: t } = ks(s.track.source._codec), n = +e;
  return Y("pcmC", 0, 0, [
    ue(n),
    ue(8 * t)
  ]);
}, Ag = (s) => {
  const e = Vm(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const t = new Uint8Array(3), n = new ze(t);
  return n.writeBits(2, e.fscod), n.writeBits(5, e.bsid), n.writeBits(3, e.bsmod), n.writeBits(3, e.acmod), n.writeBits(1, e.lfeon), n.writeBits(5, e.bitRateCode), n.writeBits(5, 0), O("dac3", [...t]);
}, Bg = (s) => {
  const e = zm(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let t = 16;
  for (const o of e.substreams)
    t += 23, o.numDepSub > 0 ? t += 9 : t += 1;
  const n = Math.ceil(t / 8), i = new Uint8Array(n), r = new ze(i);
  r.writeBits(13, e.dataRate), r.writeBits(3, e.substreams.length - 1);
  for (const o of e.substreams)
    r.writeBits(2, o.fscod), r.writeBits(5, o.bsid), r.writeBits(1, 0), r.writeBits(1, 0), r.writeBits(3, o.bsmod), r.writeBits(3, o.acmod), r.writeBits(1, o.lfeon), r.writeBits(3, 0), r.writeBits(4, o.numDepSub), o.numDepSub > 0 ? r.writeBits(9, o.chanLoc) : r.writeBits(1, 0);
  return O("dec3", [...i]);
}, Mg = (s, e) => O(s, [
  Array(6).fill(0),
  // Reserved
  P(1)
  // Data reference index
], [
  oy[e.track.source._codec](e)
]), Ig = (s) => O("vttC", [
  ...Xe.encode(s.info.config.description)
]), Og = (s) => Y("stts", 0, 0, [
  w(s.timeToSampleTable.length),
  // Number of entries
  s.timeToSampleTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    w(e.sampleDelta)
    // Sample duration
  ])
]), Rg = (s) => {
  if (s.samples.every((t) => t.type === "key"))
    return null;
  const e = [...s.samples.entries()].filter(([, t]) => t.type === "key");
  return Y("stss", 0, 0, [
    w(e.length),
    // Number of entries
    e.map(([t]) => w(t + 1))
    // Sync sample table
  ]);
}, Pg = (s) => Y("stsc", 0, 0, [
  w(s.compactlyCodedChunkTable.length),
  // Number of entries
  s.compactlyCodedChunkTable.map((e) => [
    w(e.firstChunk),
    // First chunk
    w(e.samplesPerChunk),
    // Samples per chunk
    w(1)
    // Sample description index
  ])
]), Fg = (s) => {
  if (s.type === "audio" && s.info.requiresPcmTransformation) {
    const { sampleSize: e } = ks(s.track.source._codec);
    return Y("stsz", 0, 0, [
      w(e * s.info.numberOfChannels),
      // Sample size
      w(s.samples.reduce((t, n) => t + oe(n.duration, s.timescale), 0))
    ]);
  }
  return Y("stsz", 0, 0, [
    w(0),
    // Sample size (0 means non-constant size)
    w(s.samples.length),
    // Number of entries
    s.samples.map((e) => w(e.size))
    // Sample size table
  ]);
}, Lg = (s) => s.finalizedChunks.length > 0 && us(s.finalizedChunks).offset >= 2 ** 32 ? Y("co64", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => tt(e.offset))
  // Chunk offset table
]) : Y("stco", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => w(e.offset))
  // Chunk offset table
]), Ug = (s) => Y("ctts", 1, 0, [
  w(s.compositionTimeOffsetTable.length),
  // Number of entries
  s.compositionTimeOffsetTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    ct(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), Ng = (s) => {
  let e = 1 / 0, t = -1 / 0, n = 1 / 0, i = -1 / 0;
  x(s.compositionTimeOffsetTable.length > 0), x(s.samples.length > 0);
  for (let o = 0; o < s.compositionTimeOffsetTable.length; o++) {
    const a = s.compositionTimeOffsetTable[o];
    e = Math.min(e, a.sampleCompositionTimeOffset), t = Math.max(t, a.sampleCompositionTimeOffset);
  }
  for (let o = 0; o < s.samples.length; o++) {
    const a = s.samples[o];
    n = Math.min(n, oe(a.timestamp, s.timescale)), i = Math.max(i, oe(a.timestamp + a.duration, s.timescale));
  }
  const r = Math.max(-e, 0);
  return i >= 2 ** 31 ? null : Y("cslg", 0, 0, [
    ct(r),
    // Composition to DTS shift
    ct(e),
    // Least decode to display delta
    ct(t),
    // Greatest decode to display delta
    ct(n),
    // Composition start time
    ct(i)
    // Composition end time
  ]);
}, Dg = (s) => O("mvex", void 0, s.map(Vg)), Vg = (s) => Y("trex", 0, 0, [
  w(s.track.id),
  // Track ID
  w(1),
  // Default sample description index
  w(0),
  // Default sample duration
  w(0),
  // Default sample size
  w(0)
  // Default sample flags
]), aa = (s, e) => O("moof", void 0, [
  $g(s),
  ...e.map(zg)
]), $g = (s) => Y("mfhd", 0, 0, [
  w(s)
  // Sequence number
]), ad = (s) => {
  let e = 0, t = 0;
  const n = 0, i = 0, r = s.type === "delta";
  return t |= +r, r ? e |= 1 : e |= 2, e << 24 | t << 16 | n << 8 | i;
}, zg = (s) => O("traf", void 0, [
  Hg(s),
  jg(s),
  qg(s)
]), Hg = (s) => {
  x(s.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = s.currentChunk.samples[1] ?? s.currentChunk.samples[0], n = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: ad(t)
  };
  return Y("tfhd", 0, e, [
    w(s.track.id),
    // Track ID
    w(n.duration),
    // Default sample duration
    w(n.size),
    // Default sample size
    w(n.flags)
    // Default sample flags
  ]);
}, jg = (s) => (x(s.currentChunk), Y("tfdt", 1, 0, [
  tt(oe(s.currentChunk.startTimestamp, s.timescale))
  // Base Media Decode Time
])), qg = (s) => {
  x(s.currentChunk);
  const e = s.currentChunk.samples.map((g) => g.timescaleUnitsToNextSample), t = s.currentChunk.samples.map((g) => g.size), n = s.currentChunk.samples.map(ad), i = s.currentChunk.samples.map((g) => oe(g.timestamp - g.decodeTimestamp, s.timescale)), r = new Set(e), o = new Set(t), a = new Set(n), d = new Set(i), c = a.size === 2 && n[0] !== n[1], l = r.size > 1, u = o.size > 1, h = !c && a.size > 1, f = d.size > 1 || [...d].some((g) => g !== 0);
  let m = 0;
  return m |= 1, m |= 4 * +c, m |= 256 * +l, m |= 512 * +u, m |= 1024 * +h, m |= 2048 * +f, Y("trun", 1, m, [
    w(s.currentChunk.samples.length),
    // Sample count
    w(s.currentChunk.offset - s.currentChunk.moofOffset || 0),
    // Data offset
    c ? w(n[0]) : [],
    s.currentChunk.samples.map((g, p) => [
      l ? w(e[p]) : [],
      // Sample duration
      u ? w(t[p]) : [],
      // Sample size
      h ? w(n[p]) : [],
      // Sample flags
      // Sample composition time offsets
      f ? ct(i[p]) : []
    ])
  ]);
}, Wg = (s) => O("mfra", void 0, [
  ...s.map(Gg),
  Zg()
]), Gg = (s, e) => Y("tfra", 1, 0, [
  w(s.track.id),
  // Track ID
  w(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((n) => [
    tt(oe(n.samples[0].timestamp, s.timescale)),
    // Time (in presentation time)
    tt(n.moofOffset),
    // moof offset
    w(e + 1),
    // traf number
    w(1),
    // trun number
    w(1)
    // Sample number
  ])
]), Zg = () => Y("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  w(0)
  // Size
]), Kg = () => O("vtte"), Xg = (s, e, t, n, i) => O("vttc", void 0, [
  i !== null ? O("vsid", [ct(i)]) : null,
  t !== null ? O("iden", [...Xe.encode(t)]) : null,
  e !== null ? O("ctim", [...Xe.encode(Km(e))]) : null,
  n !== null ? O("sttg", [...Xe.encode(n)]) : null,
  O("payl", [...Xe.encode(s)])
]), Yg = (s) => O("vtta", [...Xe.encode(s)]), Qg = (s) => {
  const e = [], t = s.format._options.metadataFormat ?? "auto", n = s.output._metadataTags;
  if (t === "mdir" || t === "auto" && !s.isQuickTime) {
    const i = ey(n);
    i && e.push(i);
  } else if (t === "mdta") {
    const i = ty(n);
    i && e.push(i);
  } else (t === "udta" || t === "auto" && s.isQuickTime) && Jg(e, s.output._metadataTags);
  return e.length === 0 ? null : O("udta", void 0, e);
}, Jg = (s, e) => {
  for (const { key: t, value: n } of Yc(e))
    switch (t) {
      case "title":
        s.push(qe("©nam", n));
        break;
      case "description":
        s.push(qe("©des", n));
        break;
      case "artist":
        s.push(qe("©ART", n));
        break;
      case "album":
        s.push(qe("©alb", n));
        break;
      case "albumArtist":
        s.push(qe("albr", n));
        break;
      case "genre":
        s.push(qe("©gen", n));
        break;
      case "date":
        s.push(qe("©day", n.toISOString().slice(0, 10)));
        break;
      case "comment":
        s.push(qe("©cmt", n));
        break;
      case "lyrics":
        s.push(qe("©lyr", n));
        break;
      case "raw":
        break;
      case "discNumber":
      case "discsTotal":
      case "trackNumber":
      case "tracksTotal":
      case "images":
        break;
      default:
        Xc(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const n = e.raw[t];
      n == null || t.length !== 4 || s.some((i) => i.type === t) || (typeof n == "string" ? s.push(qe(t, n)) : n instanceof Uint8Array && s.push(O(t, Array.from(n))));
    }
}, qe = (s, e) => {
  const t = Xe.encode(e);
  return O(s, [
    P(t.length),
    P(ld("und")),
    Array.from(t)
  ]);
}, ca = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, cd = (s, e) => {
  const t = [];
  for (const { key: n, value: i } of Yc(s))
    switch (n) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: Le(i) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: Le(i) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: Le(i) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: Le(i) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: Le(i) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: Le(i) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: Le(i) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: Le(i) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: Le(i.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const r of i)
          r.kind === "coverFront" && t.push({ key: "covr", value: O("data", [
            w(ca[r.mimeType] ?? 0),
            // Type indicator
            w(0),
            // Locale indicator
            Array.from(r.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const r = s.tracksTotal !== void 0 ? `${i}/${s.tracksTotal}` : i.toString();
          t.push({ key: "track", value: Le(r) });
        } else
          t.push({ key: "trkn", value: O("data", [
            w(0),
            // 8 bytes empty
            w(0),
            P(0),
            // Empty
            P(i),
            P(s.tracksTotal ?? 0),
            P(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || t.push({ key: "disc", value: O("data", [
          w(0),
          // 8 bytes empty
          w(0),
          P(0),
          // Empty
          P(i),
          P(s.discsTotal ?? 0),
          P(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        Xc(n);
    }
  if (s.raw)
    for (const n in s.raw) {
      const i = s.raw[n];
      i == null || !e && n.length !== 4 || t.some((r) => r.key === n) || (typeof i == "string" ? t.push({ key: n, value: Le(i) }) : i instanceof Uint8Array ? t.push({ key: n, value: O("data", [
        w(0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(i)
      ]) }) : i instanceof Qc && t.push({ key: n, value: O("data", [
        w(ca[i.mimeType] ?? 0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(i.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, ey = (s) => {
  const e = cd(s, !1);
  return e.length === 0 ? null : Y("meta", 0, 0, void 0, [
    Wr(!1, "mdir", "", "appl"),
    // mdir handler
    O("ilst", void 0, e.map((t) => O(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, ty = (s) => {
  const e = cd(s, !0);
  return e.length === 0 ? null : O("meta", void 0, [
    Wr(!1, "mdta", ""),
    // mdta handler
    Y("keys", 0, 0, [
      w(e.length)
    ], e.map((t) => O("mdta", [
      ...Xe.encode(t.key)
    ]))),
    O("ilst", void 0, e.map((t, n) => {
      const i = String.fromCharCode(...w(n + 1));
      return O(i, void 0, [t.value]);
    }))
  ]);
}, Le = (s) => O("data", [
  w(1),
  // Type indicator (UTF-8)
  w(0),
  // Locale indicator
  ...Xe.encode(s)
]), sy = (s, e) => {
  switch (s) {
    case "avc":
      return e.startsWith("avc3") ? "avc3" : "avc1";
    case "hevc":
      return "hvc1";
    case "vp8":
      return "vp08";
    case "vp9":
      return "vp09";
    case "av1":
      return "av01";
    case "prores":
      return e;
  }
}, ny = {
  avc: vg,
  hevc: Sg,
  vp8: oa,
  vp9: oa,
  av1: _g,
  prores: null
}, dd = (s, e) => {
  switch (s) {
    case "aac":
      return "mp4a";
    case "mp3":
      return "mp4a";
    case "opus":
      return "Opus";
    case "vorbis":
      return "mp4a";
    case "flac":
      return "fLaC";
    case "ulaw":
      return "ulaw";
    case "alaw":
      return "alaw";
    case "pcm-u8":
      return "raw ";
    case "pcm-s8":
      return "sowt";
    case "ac3":
      return "ac-3";
    case "eac3":
      return "ec-3";
  }
  if (e)
    switch (s) {
      case "pcm-s16":
        return "sowt";
      case "pcm-s16be":
        return "twos";
      case "pcm-s24":
        return "in24";
      case "pcm-s24be":
        return "in24";
      case "pcm-s32":
        return "in32";
      case "pcm-s32be":
        return "in32";
      case "pcm-f32":
        return "fl32";
      case "pcm-f32be":
        return "fl32";
      case "pcm-f64":
        return "fl64";
      case "pcm-f64be":
        return "fl64";
    }
  else
    switch (s) {
      case "pcm-s16":
        return "ipcm";
      case "pcm-s16be":
        return "ipcm";
      case "pcm-s24":
        return "ipcm";
      case "pcm-s24be":
        return "ipcm";
      case "pcm-s32":
        return "ipcm";
      case "pcm-s32be":
        return "ipcm";
      case "pcm-f32":
        return "fpcm";
      case "pcm-f32be":
        return "fpcm";
      case "pcm-f64":
        return "fpcm";
      case "pcm-f64be":
        return "fpcm";
    }
}, iy = (s, e) => {
  switch (s) {
    case "aac":
      return Si;
    case "mp3":
      return Si;
    case "opus":
      return Eg;
    case "vorbis":
      return Si;
    case "flac":
      return Cg;
    case "ac3":
      return Ag;
    case "eac3":
      return Bg;
  }
  if (e)
    switch (s) {
      case "pcm-s24":
        return bt;
      case "pcm-s24be":
        return bt;
      case "pcm-s32":
        return bt;
      case "pcm-s32be":
        return bt;
      case "pcm-f32":
        return bt;
      case "pcm-f32be":
        return bt;
      case "pcm-f64":
        return bt;
      case "pcm-f64be":
        return bt;
    }
  else
    switch (s) {
      case "pcm-s16":
        return je;
      case "pcm-s16be":
        return je;
      case "pcm-s24":
        return je;
      case "pcm-s24be":
        return je;
      case "pcm-s32":
        return je;
      case "pcm-s32be":
        return je;
      case "pcm-f32":
        return je;
      case "pcm-f32be":
        return je;
      case "pcm-f64":
        return je;
      case "pcm-f64be":
        return je;
    }
  return null;
}, ry = {
  webvtt: "wvtt"
}, oy = {
  webvtt: Ig
}, ld = (s) => {
  x(s.length === 3);
  let e = 0;
  for (let t = 0; t < 3; t++)
    e <<= 5, e += s.charCodeAt(t) - 96;
  return e;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class ar {
  constructor(e, t) {
    if (this.finalized = !1, this.started = !1, this.pos = 0, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1, e._writerAcquired)
      throw new Error("Can't have multiple Writers for the same Target.");
    this.target = e, e._setMonotonicity(t), e._writerAcquired = !0;
  }
  start() {
    x(!this.started), this.target._start(), this.started = !0;
  }
  /** Writes the given data to the target, at the current position. */
  write(e) {
    x(this.started && !this.finalized), this.maybeTrackWrites(e), this.target._write(e, this.pos), this.pos += e.byteLength;
  }
  /** Sets the current position for future writes to a new one. */
  seek(e) {
    this.pos = e;
  }
  /** Returns the current position. */
  getPos() {
    return this.pos;
  }
  /** Signals to the writer that it may be time to flush. */
  async flush() {
    return x(this.started && !this.finalized), this.target._flush();
  }
  /** Called after muxing has finished. */
  async finalize() {
    x(this.started && !this.finalized), await this.target._finalize(), this.finalized = !0;
  }
  maybeTrackWrites(e) {
    if (!this.trackedWrites)
      return;
    let t = this.getPos();
    if (t < this.trackedStart) {
      if (t + e.byteLength <= this.trackedStart)
        return;
      e = e.subarray(this.trackedStart - t), t = 0;
    }
    const n = t + e.byteLength - this.trackedStart;
    let i = this.trackedWrites.byteLength;
    for (; i < n; )
      i *= 2;
    if (i !== this.trackedWrites.byteLength) {
      const r = new Uint8Array(i);
      r.set(this.trackedWrites, 0), this.trackedWrites = r;
    }
    this.trackedWrites.set(e, t - this.trackedStart), this.trackedEnd = Math.max(this.trackedEnd, t + e.byteLength);
  }
  startTrackingWrites() {
    this.trackedWrites = new Uint8Array(2 ** 10), this.trackedStart = this.getPos(), this.trackedEnd = this.trackedStart;
  }
  stopTrackingWrites() {
    if (!this.trackedWrites)
      throw new Error("Internal error: Can't get tracked writes since nothing was tracked.");
    const t = {
      data: this.trackedWrites.subarray(0, this.trackedEnd - this.trackedStart),
      start: this.trackedStart,
      end: this.trackedEnd
    };
    return this.trackedWrites = null, t;
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class at extends $r {
  constructor() {
    super(...arguments), this._writerAcquired = !1, this._monotonicity = null, this.onwrite = null;
  }
  /** @internal */
  _setMonotonicity(e) {
    this._monotonicity !== !1 && (this._monotonicity = e);
  }
  /** @internal */
  _dispatchWrite(e, t) {
    this.onwrite?.(e, t), this._emit("write", { start: e, end: t });
  }
  /**
   * Returns a new {@link RangedTarget} that writes data to this target using the given offset.
   *
   * Useful for writing a file into a section of a larger file.
   */
  slice(e) {
    if (!Number.isInteger(e) || e < 0)
      throw new TypeError("offset must be a non-negative integer.");
    return new ay(this, e);
  }
}
const _i = 2 ** 16, ki = 2 ** 32;
class Sn extends at {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer(_i, { maxByteLength: ki });
      } catch {
        this._buffer = new ArrayBuffer(_i), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer(_i);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let t = this._buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this._buffer.byteLength) {
      if (t > ki)
        throw new Error(`ArrayBuffer exceeded maximum size of ${ki} bytes. Please consider using another target.`);
      if (this._supportsResize)
        this._buffer.resize(t);
      else {
        const n = new ArrayBuffer(t), i = new Uint8Array(n);
        i.set(this._bytes, 0), this._buffer = n, this._bytes = i;
      }
    }
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, t) {
    this._ensureSize(t + e.byteLength), this._bytes.set(e, t), this._maxPos = Math.max(this._maxPos, t + e.byteLength), this._dispatchWrite(t, t + e.byteLength);
  }
  /** @internal */
  async _flush() {
  }
  /** @internal */
  async _finalize() {
    this.buffer = this._buffer.slice(0, this._maxPos), this._options.onFinalize && await this._options.onFinalize(this.buffer), this._emit("finalized");
  }
  /** @internal */
  async _close() {
  }
  /** @internal */
  _getSlice(e, t) {
    return this._bytes.slice(e, t);
  }
}
class ay extends at {
  /** @internal */
  constructor(e, t) {
    super(), this._baseTarget = e, this._offset = t;
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, t) {
    this._baseTarget._write(e, this._offset + t), this._dispatchWrite(t, t + e.byteLength);
  }
  /** @internal */
  _flush() {
    return this._baseTarget._flush();
  }
  /** @internal */
  async _finalize() {
    this._emit("finalized");
  }
  /** @internal */
  async _close() {
  }
  /** @internal */
  _setMonotonicity(e) {
    super._setMonotonicity(e), this._baseTarget._setMonotonicity(e);
  }
}
class xi {
  /** Creates a new {@link PathedTarget} from a root path and a callback. */
  constructor(e, t) {
    if (this.rootPath = e, this.getTarget = t, typeof e != "string")
      throw new TypeError("rootPath must be a string.");
    if (typeof t != "function")
      throw new TypeError("getTarget must be a function.");
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const $e = 57600, cy = 2082844800, dy = (s) => {
  const e = {}, t = s.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, oe = (s, e, t = !0) => {
  const n = s * e;
  return t ? Math.round(n) : n;
};
class ly extends Zm {
  constructor(e, t) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Sn(), this.auxWriter = new ar(this.auxTarget, !1), this.auxBoxWriter = new hn(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = em(), this.creationTime = Math.floor(Date.now() / 1e3) + cy, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = t, this.isQuickTime = t instanceof md, this.isCmaf = t instanceof da, this.minimumFragmentDuration = t._options.minimumFragmentDuration ?? (t instanceof da ? 1 / 0 : 1), this.auxWriter.start();
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((n) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : n instanceof Sn), this.boxWriter = new hn(this.writer), this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof Sn ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const n = await this.output._getInitTarget(), i = new ar(n, !0);
      i.start(), this.initWriter = i, this.initBoxWriter = new hn(i);
    }
    const t = this.output._tracks.some((n) => n.isVideoTrack() && n.source._codec === "avc");
    {
      const n = this.initBoxWriter ?? this.boxWriter;
      if (x(n), this.format._options.onFtyp && n.writer.startTrackingWrites(), n.writeBox(Ym({
        isQuickTime: this.isQuickTime,
        holdsAvc: t,
        fragmented: this.isFragmented,
        cmaf: this.isCmaf
      })), this.format._options.onFtyp) {
        const { data: i, start: r } = n.writer.stopTrackingWrites();
        this.format._options.onFtyp(i, r);
      }
      this.ftypSize = n.writer.getPos(), this.isCmaf && await this.initWriter.flush();
    }
    if (this.fastStart !== "in-memory") if (this.fastStart === "reserve") {
      for (const n of this.output._tracks)
        if (n.metadata.maximumPacketCount === void 0)
          throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
    } else this.isFragmented || (x(this.writer), x(this.boxWriter), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = fn(!0), this.boxWriter.writeBox(this.mdat));
    await this.writer?.flush(), e();
  }
  allTracksAreKnown() {
    for (const e of this.output._tracks)
      if (!e.source._closed && !this.trackDatas.some((t) => t.track === e))
        return !1;
    return !0;
  }
  async getMimeType() {
    await this.allTracksKnown.promise;
    const e = this.trackDatas.map((t) => t.type === "video" || t.type === "audio" ? t.info.decoderConfig.codec : {
      webvtt: "wvtt"
    }[t.track.source._codec]);
    return Hm({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((t) => t.type === "video"),
      hasAudio: this.trackDatas.some((t) => t.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, t, n) {
    const i = this.trackDatas.find((h) => h.track === e);
    if (i)
      return i;
    bm(n), x(n), x(n.decoderConfig);
    const r = { ...n.decoderConfig };
    x(r.codedWidth !== void 0), x(r.codedHeight !== void 0);
    let o = !1;
    if (e.source._codec === "avc" && !r.description) {
      const h = Cm(t.data);
      if (!h)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      r.description = Am(h), o = !0;
    } else if (e.source._codec === "hevc" && !r.description) {
      const h = Im(t.data);
      if (!h)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      r.description = Nm(h), o = !0;
    }
    const a = rm(1 / (e.metadata.frameRate ?? $e), 1e6).den, d = r.displayAspectWidth, c = r.displayAspectHeight, l = d === void 0 || c === void 0 ? { num: 1, den: 1 } : om({
      num: d * r.codedHeight,
      den: c * r.codedWidth
    }), u = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: r.codedWidth,
        height: r.codedHeight,
        pixelAspectRatio: l,
        decoderConfig: r,
        requiresAnnexBTransformation: o
      },
      timescale: a,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1
    };
    return this.trackDatas.push(u), this.trackDatas.sort((h, f) => h.track.id - f.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), u;
  }
  getAudioTrackData(e, t, n) {
    const i = this.trackDatas.find((d) => d.track === e);
    if (i)
      return i;
    Sm(n), x(n), x(n.decoderConfig);
    const r = { ...n.decoderConfig };
    let o = !1;
    if (e.source._codec === "aac" && !r.description) {
      const d = sa(Zs.tempFromBytes(t.data));
      if (!d)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const c = Jc[d.samplingFrequencyIndex], l = ed[d.channelConfiguration];
      if (c === void 0 || l === void 0)
        throw new Error("Invalid ADTS frame header.");
      r.description = um({
        objectType: d.objectType,
        sampleRate: c,
        numberOfChannels: l
      }), o = !0;
    }
    const a = {
      muxer: this,
      track: e,
      type: "audio",
      info: {
        numberOfChannels: n.decoderConfig.numberOfChannels,
        sampleRate: n.decoderConfig.sampleRate,
        decoderConfig: r,
        requiresPcmTransformation: !this.isFragmented && _s.includes(e.source._codec),
        expectedNextPcmPacketTimestamp: null,
        requiresAdtsStripping: o,
        firstPacket: t
      },
      timescale: r.sampleRate,
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1
    };
    return this.trackDatas.push(a), this.trackDatas.sort((d, c) => d.track.id - c.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), a;
  }
  getSubtitleTrackData(e, t) {
    const n = this.trackDatas.find((r) => r.track === e);
    if (n)
      return n;
    _m(t), x(t), x(t.config);
    const i = {
      muxer: this,
      track: e,
      type: "subtitle",
      info: {
        config: t.config
      },
      timescale: 1e3,
      // Reasonable
      samples: [],
      sampleQueue: [],
      timestampProcessingQueue: [],
      timeToSampleTable: [],
      compositionTimeOffsetTable: [],
      lastTimescaleUnits: null,
      lastSample: null,
      startTimestampOffset: null,
      finalizedChunks: [],
      currentChunk: null,
      compactlyCodedChunkTable: [],
      closed: !1,
      lastCueEndTimestamp: 0,
      cueQueue: [],
      nextSourceId: 0,
      cueToSourceId: /* @__PURE__ */ new WeakMap()
    };
    return this.trackDatas.push(i), this.trackDatas.sort((r, o) => r.track.id - o.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), i;
  }
  async addEncodedVideoPacket(e, t, n) {
    const i = await this.mutex.acquire();
    try {
      const r = this.getVideoTrackData(e, t, n);
      let o = t.data;
      if (r.info.requiresAnnexBTransformation) {
        const d = [...Hr(o)].map((c) => o.subarray(c.offset, c.offset + c.length));
        if (d.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        o = Em(d, 4);
      }
      this.validateTimestamp(r.track, t.timestamp, t.type === "key");
      const a = this.createSampleForTrack(r, o, t.timestamp, t.duration, t.type);
      await this.registerSample(r, a);
    } finally {
      i();
    }
  }
  async addEncodedAudioPacket(e, t, n) {
    const i = await this.mutex.acquire();
    try {
      const r = this.getAudioTrackData(e, t, n);
      let o = t.data;
      if (r.info.requiresAdtsStripping) {
        const l = sa(Zs.tempFromBytes(o));
        if (!l)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = l.crcCheck === null ? jm : qm;
        o = o.subarray(u);
      }
      this.validateTimestamp(r.track, t.timestamp, t.type === "key");
      let a = t.timestamp, d = t.duration;
      if (r.info.requiresPcmTransformation) {
        const u = ks(r.info.decoderConfig.codec).sampleSize * r.info.numberOfChannels;
        if (d = o.byteLength / u / r.info.sampleRate, r.info.expectedNextPcmPacketTimestamp !== null) {
          const h = a - r.info.expectedNextPcmPacketTimestamp;
          if (h < 0.01)
            a = r.info.expectedNextPcmPacketTimestamp;
          else {
            const f = await this.padWithSilence(r, r.info.expectedNextPcmPacketTimestamp, h);
            a = r.info.expectedNextPcmPacketTimestamp + f;
          }
        }
        r.info.expectedNextPcmPacketTimestamp = a + d;
      }
      const c = this.createSampleForTrack(r, o, a, d, t.type);
      await this.registerSample(r, c);
    } finally {
      i();
    }
  }
  async padWithSilence(e, t, n) {
    const i = oe(n, e.timescale);
    if (n = i / e.timescale, i > 0) {
      const { sampleSize: r, silentValue: o } = ks(e.info.decoderConfig.codec), a = i * e.info.numberOfChannels, d = new Uint8Array(r * a).fill(o), c = this.createSampleForTrack(e, new Uint8Array(d.buffer), t, n, "key");
      await this.registerSample(e, c);
    }
    return n;
  }
  async addSubtitleCue(e, t, n) {
    const i = await this.mutex.acquire();
    try {
      const r = this.getSubtitleTrackData(e, n);
      this.validateTimestamp(r.track, t.timestamp, !0), e.source._codec === "webvtt" && (r.cueQueue.push(t), await this.processWebVTTCues(r, t.timestamp));
    } finally {
      i();
    }
  }
  async processWebVTTCues(e, t) {
    for (; e.cueQueue.length > 0; ) {
      const n = /* @__PURE__ */ new Set([]);
      for (const c of e.cueQueue)
        x(c.timestamp <= t), x(e.lastCueEndTimestamp <= c.timestamp + c.duration), n.add(Math.max(c.timestamp, e.lastCueEndTimestamp)), n.add(c.timestamp + c.duration);
      const i = [...n].sort((c, l) => c - l), r = i[0], o = i[1] ?? r;
      if (t < o)
        break;
      if (e.lastCueEndTimestamp < r) {
        this.auxWriter.seek(0);
        const c = Kg();
        this.auxBoxWriter.writeBox(c);
        const l = this.auxTarget._getSlice(0, this.auxWriter.getPos()), u = this.createSampleForTrack(e, l, e.lastCueEndTimestamp, r - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, u), e.lastCueEndTimestamp = r;
      }
      this.auxWriter.seek(0);
      for (let c = 0; c < e.cueQueue.length; c++) {
        const l = e.cueQueue[c];
        if (l.timestamp >= o)
          break;
        na.lastIndex = 0;
        const u = na.test(l.text), h = l.timestamp + l.duration;
        let f = e.cueToSourceId.get(l);
        if (f === void 0 && o < h && (f = e.nextSourceId++, e.cueToSourceId.set(l, f)), l.notes) {
          const g = Yg(l.notes);
          this.auxBoxWriter.writeBox(g);
        }
        const m = Xg(l.text, u ? r : null, l.identifier ?? null, l.settings ?? null, f ?? null);
        this.auxBoxWriter.writeBox(m), h === o && e.cueQueue.splice(c--, 1);
      }
      const a = this.auxTarget._getSlice(0, this.auxWriter.getPos()), d = this.createSampleForTrack(e, a, r, o - r, "key");
      await this.registerSample(e, d), e.lastCueEndTimestamp = o;
    }
  }
  createSampleForTrack(e, t, n, i, r) {
    return {
      timestamp: n,
      decodeTimestamp: n,
      // This may be refined later
      duration: i,
      data: t,
      size: t.byteLength,
      type: r,
      timescaleUnitsToNextSample: oe(i, e.timescale)
      // Will be refined
    };
  }
  processTimestamps(e, t) {
    if (e.timestampProcessingQueue.length === 0)
      return;
    if (e.type === "audio" && e.info.requiresPcmTransformation) {
      this.isFragmented || (e.startTimestampOffset ??= e.timestampProcessingQueue[0].timestamp);
      let i = 0;
      for (let r = 0; r < e.timestampProcessingQueue.length; r++) {
        const o = e.timestampProcessingQueue[r], a = oe(o.duration, e.timescale);
        i += a;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: i,
          sampleDelta: 1
        });
      else {
        const r = us(e.timeToSampleTable);
        r.sampleCount += i;
      }
      e.timestampProcessingQueue.length = 0;
      return;
    }
    const n = e.timestampProcessingQueue.map((i) => i.timestamp).sort((i, r) => i - r);
    this.isFragmented || (e.startTimestampOffset ??= n[0]);
    for (let i = 0; i < e.timestampProcessingQueue.length; i++) {
      const r = e.timestampProcessingQueue[i];
      r.decodeTimestamp = n[i];
      const o = oe(r.timestamp - r.decodeTimestamp, e.timescale), a = oe(r.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        x(e.lastSample);
        const d = oe(r.decodeTimestamp, e.timescale, !1), c = Math.round(d - e.lastTimescaleUnits);
        if (x(c >= 0), e.lastTimescaleUnits += c, e.lastSample.timescaleUnitsToNextSample = c, !this.isFragmented) {
          let l = us(e.timeToSampleTable);
          if (x(l), l.sampleCount === 1) {
            l.sampleDelta = c;
            const h = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            h && h.sampleDelta === c && (h.sampleCount++, e.timeToSampleTable.pop(), l = h);
          } else l.sampleDelta !== c && (l.sampleCount--, e.timeToSampleTable.push(l = {
            sampleCount: 1,
            sampleDelta: c
          }));
          l.sampleDelta === a ? l.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: a
          });
          const u = us(e.compositionTimeOffsetTable);
          x(u), u.sampleCompositionTimeOffset === o ? u.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: o
          });
        }
      } else
        e.lastTimescaleUnits = oe(r.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
          sampleCount: 1,
          sampleDelta: a
        }), e.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset: o
        }));
      e.lastSample = r;
    }
    if (e.timestampProcessingQueue.length = 0, x(e.lastSample), x(e.lastTimescaleUnits !== null), t !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      x(t.type === "key");
      const i = oe(t.timestamp, e.timescale, !1), r = Math.round(i - e.lastTimescaleUnits);
      e.lastSample.timescaleUnitsToNextSample = r;
    }
  }
  async registerSample(e, t) {
    t.type === "key" && this.processTimestamps(e, t), e.timestampProcessingQueue.push(t), this.isFragmented ? (e.sampleQueue.push(t), await this.interleaveSamples()) : this.fastStart === "reserve" ? await this.registerSampleFastStartReserve(e, t) : await this.addSampleToTrack(e, t);
  }
  async addSampleToTrack(e, t) {
    if (!this.isFragmented && (e.samples.push(t), this.fastStart === "reserve")) {
      const i = e.track.metadata.maximumPacketCount;
      if (x(i !== void 0), e.samples.length > i)
        throw new Error(`Track #${e.track.id} has already reached the maximum packet count (${i}). Either add less packets or increase the maximum packet count.`);
    }
    let n = !1;
    if (!e.currentChunk)
      n = !0;
    else {
      e.currentChunk.startTimestamp = Math.min(e.currentChunk.startTimestamp, t.timestamp);
      const i = t.timestamp - e.currentChunk.startTimestamp;
      if (this.isFragmented) {
        const r = this.trackDatas.every((o) => {
          if (e === o)
            return t.type === "key";
          const a = o.sampleQueue[0];
          return a ? a.type === "key" : o.closed;
        });
        i >= this.minimumFragmentDuration && r && t.timestamp > this.maxWrittenTimestamp && (n = !0, await this.finalizeFragment());
      } else
        n = i >= 0.5;
    }
    n && (e.currentChunk && await this.finalizeCurrentChunk(e), e.currentChunk = {
      startTimestamp: t.timestamp,
      samples: [],
      offset: null,
      moofOffset: null
    }), x(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, t.timestamp + t.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (x(!this.isFragmented), x(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((n, i) => n + oe(i.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || us(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: t
    }), this.fastStart === "in-memory") {
      e.currentChunk.offset = 0;
      return;
    }
    e.currentChunk.offset = this.writer.getPos();
    for (const n of e.currentChunk.samples)
      x(n.data), this.writer.write(n.data), n.data = null;
    await this.writer.flush();
  }
  async interleaveSamples(e = !1) {
    if (x(this.isFragmented), !(!e && !this.allTracksAreKnown()))
      e: for (; ; ) {
        let t = null, n = 1 / 0;
        for (const r of this.trackDatas) {
          if (!e && r.sampleQueue.length === 0 && !r.closed)
            break e;
          r.sampleQueue.length > 0 && r.sampleQueue[0].timestamp < n && (t = r, n = r.sampleQueue[0].timestamp);
        }
        if (!t)
          break;
        const i = t.sampleQueue.shift();
        await this.addSampleToTrack(t, i);
      }
  }
  async finalizeFragment(e = !this.isCmaf) {
    x(this.isFragmented);
    const t = this.nextFragmentNumber++;
    if (t === 1) {
      const f = this.initBoxWriter ?? this.boxWriter;
      x(f), this.format._options.onMoov && f.writer.startTrackingWrites(), this.ensureOneEnabledTrack();
      const m = Os(this);
      if (f.writeBox(m), this.format._options.onMoov) {
        const { data: g, start: p } = f.writer.stopTrackingWrites();
        this.format._options.onMoov(g, p);
      }
      if (this.isCmaf) {
        x(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new hn(this.writer);
        const g = this.boxWriter.measureBox(ia()), p = this.boxWriter.measureBox(ra(this, 0));
        this.segmentHeaderSize = g + p, this.writer.seek(this.segmentHeaderSize);
      }
    }
    x(this.writer), x(this.boxWriter);
    const n = this.trackDatas.filter((f) => f.currentChunk), i = aa(t, n), r = this.writer.getPos(), o = r + this.boxWriter.measureBox(i);
    let a = o + wi, d = 1 / 0;
    for (const f of n) {
      f.currentChunk.offset = a, f.currentChunk.moofOffset = r;
      for (const m of f.currentChunk.samples)
        a += m.size;
      d = Math.min(d, f.currentChunk.startTimestamp);
    }
    const c = a - o, l = c >= 2 ** 32;
    if (l)
      for (const f of n)
        f.currentChunk.offset += ta - wi;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const u = aa(t, n);
    if (this.boxWriter.writeBox(u), this.format._options.onMoof) {
      const { data: f, start: m } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(f, m, d);
    }
    x(this.writer.getPos() === o), this.format._options.onMdat && this.writer.startTrackingWrites();
    const h = fn(l);
    h.size = c, this.boxWriter.writeBox(h), this.writer.seek(o + (l ? ta : wi));
    for (const f of n)
      for (const m of f.currentChunk.samples)
        this.writer.write(m.data), m.data = null;
    if (this.format._options.onMdat) {
      const { data: f, start: m } = this.writer.stopTrackingWrites();
      this.format._options.onMdat(f, m);
    }
    for (const f of n)
      f.finalizedChunks.push(f.currentChunk), this.finalizedChunks.push(f.currentChunk), f.currentChunk = null;
    e && await this.writer.flush();
  }
  async registerSampleFastStartReserve(e, t) {
    if (x(this.writer), x(this.boxWriter), this.allTracksAreKnown()) {
      if (!this.mdat) {
        this.ensureOneEnabledTrack();
        const n = Os(this), r = this.boxWriter.measureBox(n) + this.computeSampleTableSizeUpperBound() + 4096;
        x(this.ftypSize !== null), this.writer.seek(this.ftypSize + r), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = fn(!0), this.boxWriter.writeBox(this.mdat);
        for (const o of this.trackDatas) {
          for (const a of o.sampleQueue)
            await this.addSampleToTrack(o, a);
          o.sampleQueue.length = 0;
        }
      }
      await this.addSampleToTrack(e, t);
    } else
      e.sampleQueue.push(t);
  }
  computeSampleTableSizeUpperBound() {
    x(this.fastStart === "reserve");
    let e = 0;
    for (const t of this.trackDatas) {
      const n = t.track.metadata.maximumPacketCount;
      x(n !== void 0), e += 8 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * Math.ceil(2 / 3 * n), e += 12 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * n;
    }
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async onTrackClose(e) {
    const t = await this.mutex.acquire(), n = this.trackDatas.find((i) => i.track === e);
    n && (n.closed = !0, n.type === "subtitle" && e.source._codec === "webvtt" && await this.processWebVTTCues(n, 1 / 0), this.processTimestamps(n)), this.allTracksAreKnown() && this.allTracksKnown.resolve(), this.isFragmented && await this.interleaveSamples(), t();
  }
  ensureOneEnabledTrack() {
    for (const e of ["video", "audio", "subtitle"]) {
      const t = this.trackDatas.filter((i) => i.type === e);
      if (t.length === 0)
        continue;
      if (!t.some((i) => i.track.metadata.disposition?.default !== !1)) {
        const i = t[0];
        i.track.metadata.disposition = {
          ...i.track.metadata.disposition,
          default: !0
        };
      }
    }
  }
  /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */
  async finalize() {
    const e = await this.mutex.acquire();
    this.allTracksKnown.resolve(), this.ensureOneEnabledTrack();
    for (const t of this.trackDatas)
      t.closed = !0, t.type === "subtitle" && t.track.source._codec === "webvtt" && await this.processWebVTTCues(t, 1 / 0), this.processTimestamps(t);
    if (this.isFragmented)
      await this.interleaveSamples(!0), await this.finalizeFragment(!1);
    else
      for (const t of this.trackDatas) {
        await this.finalizeCurrentChunk(t), x(t.startTimestampOffset !== null);
        for (let n = 0; n < t.samples.length; n++) {
          const i = t.samples[n];
          i.timestamp -= t.startTimestampOffset, i.decodeTimestamp -= t.startTimestampOffset;
        }
      }
    if (x(this.writer), x(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = fn(!1);
      let t;
      for (let i = 0; i < 2; i++) {
        const r = Os(this), o = this.boxWriter.measureBox(r);
        t = this.boxWriter.measureBox(this.mdat);
        let a = this.writer.getPos() + o + t;
        for (const d of this.finalizedChunks) {
          d.offset = a;
          for (const { data: c } of d.samples)
            x(c), a += c.byteLength, t += c.byteLength;
        }
        if (a < 2 ** 32)
          break;
        t >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const n = Os(this);
      if (this.boxWriter.writeBox(n), this.format._options.onMoov) {
        const { data: i, start: r } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(i, r);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const i of this.finalizedChunks)
        for (const r of i.samples)
          x(r.data), this.writer.write(r.data), r.data = null;
      if (this.format._options.onMdat) {
        const { data: i, start: r } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(i, r);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const t = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(ia()), this.boxWriter.writeBox(ra(this, t));
      } else {
        const t = this.writer.getPos(), n = Wg(this.trackDatas);
        this.boxWriter.writeBox(n);
        const i = this.writer.getPos() - t;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(i);
      }
    else {
      x(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      x(t !== void 0);
      const n = this.writer.getPos() - t;
      if (this.mdat.size = n, this.mdat.largeSize = n >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: r, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(r, o);
      }
      const i = Os(this);
      if (this.fastStart === "reserve") {
        x(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(i);
        const r = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(Qm(r));
      } else
        this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(i);
      if (this.format._options.onMoov) {
        const { data: r, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(r, o);
      }
    }
    e();
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Gr {
  constructor() {
    this._connectedTrack = null, this._closingPromise = null, this._closed = !1;
  }
  /** @internal */
  _ensureValidAdd() {
    if (!this._connectedTrack)
      throw new Error("Source is not connected to an output track.");
    if (this._connectedTrack.output.state === "canceled")
      throw new Error("Output has been canceled.");
    if (this._connectedTrack.output.state === "finalizing" || this._connectedTrack.output.state === "finalized")
      throw new Error("Output has been finalized.");
    if (this._connectedTrack.output.state === "pending")
      throw new Error("Output has not started.");
    if (this._closed)
      throw new Error("Source is closed.");
  }
  /** @internal */
  async _start() {
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async _flushAndClose(e) {
  }
  /**
   * Closes this source. This prevents future samples from being added and signals to the output file that no further
   * samples will come in for this track. Calling `.close()` is optional but recommended after adding the
   * last sample - for improved performance and reduced memory usage.
   */
  close() {
    if (this._closingPromise)
      return;
    const e = this._connectedTrack;
    if (!e)
      throw new Error("Cannot call close without connecting the source to an output track.");
    if (e.output.state === "pending")
      throw new Error("Cannot call close before output has been started.");
    this._closingPromise = (async () => {
      await this._flushAndClose(!1), this._closed = !0, !(e.output.state === "finalizing" || e.output.state === "finalized") && e.output._muxer.onTrackClose(e);
    })();
  }
  /** @internal */
  async _flushOrWaitForOngoingClose(e) {
    return this._closingPromise ??= (async () => {
      await this._flushAndClose(e), this._closed = !0;
    })();
  }
}
class ud extends Gr {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ss.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${Ss.join(", ")}.`);
    this._codec = e;
  }
}
const uy = (s, e) => {
  if (s.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class hy extends ud {
  /** Creates a new {@link EncodedVideoPacketSource} whose packets are encoded using `codec`. */
  constructor(e) {
    super(e);
  }
  /**
   * Adds an encoded packet to the output video track. Packets must be added in *decode order*, while a packet's
   * timestamp must be its *presentation timestamp*. B-frames are handled automatically.
   *
   * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
   * decoder config.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof Ot))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), uy(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class hd extends Gr {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Hn.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${Hn.join(", ")}.`);
    this._codec = e;
  }
}
class fy extends hd {
  /** Creates a new {@link EncodedAudioPacketSource} whose packets are encoded using `codec`. */
  constructor(e) {
    super(e);
  }
  /**
   * Adds an encoded packet to the output audio track. Packets must be added in *decode order*.
   *
   * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
   * decoder config.
   *
   * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
   * to respect writer and encoder backpressure.
   */
  add(e, t) {
    if (!(e instanceof Ot))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, e, t);
  }
}
class py extends Gr {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Gs.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${Gs.join(", ")}.`);
    this._codec = e;
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class fd {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => Ss.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => Hn.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => Gs.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class Zr extends fd {
  /** Internal constructor. */
  constructor(e = {}) {
    if (!e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (e.fastStart !== void 0 && ![!1, "in-memory", "reserve", "fragmented"].includes(e.fastStart))
      throw new TypeError("options.fastStart, when provided, must be false, 'in-memory', 'reserve', or 'fragmented'.");
    if (e.minimumFragmentDuration !== void 0 && (!Number.isFinite(e.minimumFragmentDuration) || e.minimumFragmentDuration < 0))
      throw new TypeError("options.minimumFragmentDuration, when provided, must be a non-negative number.");
    if (e.onFtyp !== void 0 && typeof e.onFtyp != "function")
      throw new TypeError("options.onFtyp, when provided, must be a function.");
    if (e.onMoov !== void 0 && typeof e.onMoov != "function")
      throw new TypeError("options.onMoov, when provided, must be a function.");
    if (e.onMdat !== void 0 && typeof e.onMdat != "function")
      throw new TypeError("options.onMdat, when provided, must be a function.");
    if (e.onMoof !== void 0 && typeof e.onMoof != "function")
      throw new TypeError("options.onMoof, when provided, must be a function.");
    if (e.metadataFormat !== void 0 && !["mdir", "mdta", "udta", "auto"].includes(e.metadataFormat))
      throw new TypeError("options.metadataFormat, when provided, must be either 'auto', 'mdir', 'mdta', or 'udta'.");
    super(), this._options = e;
  }
  getSupportedTrackCounts() {
    return {
      video: { min: 0, max: 4294967295 },
      audio: { min: 0, max: 4294967295 },
      subtitle: { min: 0, max: 4294967295 },
      total: { min: 1, max: 4294967295 }
    };
  }
  get supportsVideoRotationMetadata() {
    return !0;
  }
  get supportsTimestampedMediaData() {
    return !0;
  }
  /** @internal */
  _createMuxer(e) {
    return new ly(e, this);
  }
}
class pd extends Zr {
  /** Creates a new {@link Mp4OutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "MP4";
  }
  get fileExtension() {
    return ".mp4";
  }
  get mimeType() {
    return "video/mp4";
  }
  getSupportedCodecs() {
    return [
      ...Ss,
      ...zr,
      // These are supported via ISO/IEC 23003-5:
      "pcm-s16",
      "pcm-s16be",
      "pcm-s24",
      "pcm-s24be",
      "pcm-s32",
      "pcm-s32be",
      "pcm-f32",
      "pcm-f32be",
      "pcm-f64",
      "pcm-f64be",
      ...Gs
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new md().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class da extends Zr {
  /** Creates a new {@link CmafOutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "CMAF";
  }
  get fileExtension() {
    return ".m4s";
  }
  get mimeType() {
    return "video/mp4";
  }
  getSupportedCodecs() {
    return [
      ...Ss,
      ...zr,
      // These are supported via ISO/IEC 23003-5:
      "pcm-s16",
      "pcm-s16be",
      "pcm-s24",
      "pcm-s24be",
      "pcm-s32",
      "pcm-s32be",
      "pcm-f32",
      "pcm-f32be",
      "pcm-f64",
      "pcm-f64be",
      ...Gs
    ];
  }
}
class md extends Zr {
  /** Creates a new {@link MovOutputFormat} configured with the specified `options`. */
  constructor(e) {
    super(e);
  }
  /** @internal */
  get _name() {
    return "MOV";
  }
  get fileExtension() {
    return ".mov";
  }
  get mimeType() {
    return "video/quicktime";
  }
  getSupportedCodecs() {
    return [
      ...Ss,
      ...Hn
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new pd().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const my = ["video", "audio", "subtitle"];
class tn {
  /** @internal */
  constructor(e, t, n, i, r) {
    this.id = e, this.output = t, this.type = n, this.source = i, this.metadata = r;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this.type === "video";
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this.type === "audio";
  }
  /** Returns true if and only if this track is a subtitle track. */
  isSubtitleTrack() {
    return this.type === "subtitle";
  }
  /**
   * Returns true if and only if this track can be paired with the given other track. Pairability can be set using
   * the {@link BaseTrackMetadata.group} option.
   */
  canBePairedWith(e) {
    if (!(e instanceof tn))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const t = Go(this.metadata.group), n = Go(e.metadata.group);
    for (const i of t)
      if (this.type !== e.type && n.some((a) => i === a) || n.some((a) => i._pairedGroups.has(a)))
        return !0;
    return !1;
  }
}
class gy extends tn {
  /** @internal */
  constructor(e, t, n, i) {
    super(e, t, "video", n, i);
  }
}
class yy extends tn {
  /** @internal */
  constructor(e, t, n, i) {
    super(e, t, "audio", n, i);
  }
}
class wy extends tn {
  /** @internal */
  constructor(e, t, n, i) {
    super(e, t, "subtitle", n, i);
  }
}
class Ks {
  /** Creates a new {@link OutputTrackGroup}. */
  constructor() {
    this._pairedGroups = /* @__PURE__ */ new Set();
  }
  /**
   * Marks this group as being pairable with another group, symmetrically. Output tracks where each track is assigned
   * to one half of a group pairing are then considered pairable.
   *
   * You cannot pair a group with itself.
   */
  pairWith(e) {
    if (!(e instanceof Ks))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const Ti = (s) => {
  if (!s || typeof s != "object")
    throw new TypeError("metadata must be an object.");
  if (s.languageCode !== void 0 && !im(s.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (s.name !== void 0 && typeof s.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (s.disposition !== void 0 && lm(s.disposition), s.maximumPacketCount !== void 0 && (!Number.isInteger(s.maximumPacketCount) || s.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (s.group !== void 0 && !(s.group instanceof Ks) && (!Array.isArray(s.group) || s.group.some((e) => !(e instanceof Ks))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class by extends $r {
  /**
   * The target to which the root file will be written. Throws when using {@link PathedTarget} with an async callback;
   * prefer the `'target'` event for those cases.
   */
  get target() {
    const e = "Output.target cannot be used when using PathedTarget with an async callback. Use the 'target' event instead.";
    if (this._rootTargetPromise)
      throw new TypeError(e);
    const t = this._getRootTarget();
    if (t instanceof Promise)
      throw new TypeError(e);
    return t;
  }
  /**
   * Creates a new instance of {@link Output} which can then be used to create a new media file according to the
   * specified {@link OutputOptions}.
   */
  constructor(e) {
    if (super(), this.state = "pending", this.defaultTrackGroup = new Ks(), this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new Kc(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof fd))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof at || e.target instanceof xi))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof at && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof at) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof at && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    x(this._target instanceof xi);
    const t = this._target.getTarget(e), n = (i) => {
      if (!(i instanceof at))
        throw new TypeError("getTarget must return a Target.");
      return i;
    };
    return t instanceof Promise ? t.then(n) : n(t);
  }
  /** @internal */
  async _getTarget(e) {
    x(this._target instanceof xi);
    const t = await this._getTargetValidated(e);
    return this._emit("target", { target: t, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await t._close() : this._rememberTarget(t), t;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (x(this._initTarget !== null), this._initTarget instanceof at)
      return this._initTarget;
    const e = await this._initTarget();
    return this.state === "canceled" ? await e._close() : this._rememberTarget(e), e;
  }
  /** @internal */
  _hasInitTarget() {
    return this._initTarget !== null;
  }
  /** @internal */
  _getRootTarget() {
    if (this._rootTarget)
      return this._rootTarget;
    if (this._rootTargetPromise)
      return this._rootTargetPromise;
    if (this._target instanceof at)
      return this._emit("target", { target: this._target, request: null, isRoot: !0 }), this._rootTarget = this._target, this._target;
    const e = {
      path: this._target.rootPath,
      isRoot: !0,
      mimeType: this.format.mimeType
    }, t = this._getTargetValidated(e), n = (i) => (this.state === "canceled" ? i._close() : this._rememberTarget(i), this._emit("target", { target: i, request: e, isRoot: !0 }), this._rootTarget = i, i);
    return t instanceof Promise ? this._rootTargetPromise = t.then(n) : n(t);
  }
  /** @internal */
  _getRootWriter(e) {
    return this._rootWriterPromise ??= (async () => {
      const t = await this._getRootTarget(), n = new ar(t, typeof e == "boolean" ? e : e(t));
      return n.start(), n;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof ud))
      throw new TypeError("source must be a VideoSource.");
    if (Ti(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new gy(this._tracks.length + 1, this, e, n));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof hd))
      throw new TypeError("source must be an AudioSource.");
    Ti(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new yy(this._tracks.length + 1, this, e, n));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof py))
      throw new TypeError("source must be a SubtitleSource.");
    Ti(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new wy(this._tracks.length + 1, this, e, n));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (dm(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (e.source._connectedTrack)
      throw new Error("Source is already used for a track.");
    const t = this.format.getSupportedTrackCounts(), n = this._tracks.reduce((o, a) => o + (a.type === e.type ? 1 : 0), 0), i = t[e.type].max;
    if (n === i)
      throw new Error(i === 0 ? `${this.format._name} does not support ${e.type} tracks.` : `${this.format._name} does not support more than ${i} ${e.type} track${i === 1 ? "" : "s"}.`);
    const r = t.total.max;
    if (this._tracks.length === r)
      throw new Error(`${this.format._name} does not support more than ${r} tracks${r === 1 ? "" : "s"} in total.`);
    if (e.isVideoTrack()) {
      const o = this.format.getSupportedVideoCodecs();
      if (o.length === 0)
        throw new Error(`${this.format._name} does not support video tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!o.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported video codecs are: ${o.map((a) => `'${a}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    } else if (e.isAudioTrack()) {
      const o = this.format.getSupportedAudioCodecs();
      if (o.length === 0)
        throw new Error(`${this.format._name} does not support audio tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!o.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported audio codecs are: ${o.map((a) => `'${a}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    } else if (e.isSubtitleTrack()) {
      const o = this.format.getSupportedSubtitleCodecs();
      if (o.length === 0)
        throw new Error(`${this.format._name} does not support subtitle tracks.` + this.format._codecUnsupportedHint(e.source._codec));
      if (!o.includes(e.source._codec))
        throw new Error(`Codec '${e.source._codec}' cannot be contained within ${this.format._name}. Supported subtitle codecs are: ${o.map((a) => `'${a}'`).join(", ")}.` + this.format._codecUnsupportedHint(e.source._codec));
    }
    return this._tracks.push(e), e.source._connectedTrack = e, e;
  }
  /**
   * Starts the creation of the output file. This method should be called after all tracks have been added. Only after
   * the output has started can media samples be added to the tracks.
   *
   * @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
   */
  async start() {
    const e = this.format.getSupportedTrackCounts();
    for (const n of my) {
      const i = this._tracks.reduce((o, a) => o + (a.type === n ? 1 : 0), 0), r = e[n].min;
      if (i < r)
        throw new Error(r === e[n].max ? `${this.format._name} requires exactly ${r} ${n} track${r === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${r} ${n} track${r === 1 ? "" : "s"}.`);
    }
    const t = e.total.min;
    if (this._tracks.length < t)
      throw new Error(t === e.total.max ? `${this.format._name} requires exactly ${t} track${t === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${t} track${t === 1 ? "" : "s"}.`);
    if (this.state === "canceled")
      throw new Error("Output has been canceled.");
    return this._startPromise ? (fe._warn("Output has already been started."), this._startPromise) : this._startPromise = (async () => {
      this.state = "started";
      const n = await this._mutex.acquire();
      try {
        await this._muxer.start();
        const i = this._tracks.map((r) => r.source._start());
        await Promise.all(i);
      } finally {
        n();
      }
    })();
  }
  /**
   * Resolves with the full MIME type of the output file, including track codecs.
   *
   * The returned promise will resolve only once the precise codec strings of all tracks are known.
   */
  getMimeType() {
    return this._muxer.getMimeType();
  }
  /**
   * Cancels the creation of the output file, releasing internal resources like encoders and preventing further
   * samples from being added.
   *
   * @returns A promise that resolves once all internal resources have been released.
   */
  async cancel() {
    if (this._cancelPromise)
      return fe._warn("Output has already been canceled."), this._cancelPromise;
    if (this.state === "finalizing" || this.state === "finalized") {
      this.state === "finalized" && fe._warn("Output has already been finalized.");
      return;
    }
    return this._cancelPromise = (async () => {
      this.state = "canceled";
      const e = await this._mutex.acquire();
      try {
        const t = this._tracks.map((n) => n.source._flushOrWaitForOngoingClose(!0));
        await Promise.all(t), await Promise.all([...this._unfinalizedTargets].map((n) => n._close())), this._unfinalizedTargets.clear();
      } finally {
        e();
      }
    })();
  }
  /**
   * Finalizes the output file. This method must be called after all media samples across all tracks have been added.
   * Once the Promise returned by this method completes, the output file is ready.
   */
  async finalize() {
    if (this.state === "pending")
      throw new Error("Cannot finalize before starting.");
    if (this.state === "canceled")
      throw new Error("Cannot finalize after canceling.");
    return this._finalizePromise ? (fe._warn("Output has already been finalized."), this._finalizePromise) : this._finalizePromise = (async () => {
      this.state = "finalizing";
      const e = await this._mutex.acquire();
      try {
        const t = this._tracks.map((n) => n.source._flushOrWaitForOngoingClose(!1));
        if (await Promise.all(t), await this._muxer.finalize(), this._rootWriterPromise) {
          const n = await this._rootWriterPromise;
          n.finalized || (await n.flush(), await n.finalize());
        }
        this._onFinalize && await this._onFinalize(), this.state = "finalized";
      } finally {
        e();
      }
    })();
  }
}
const la = 7, cr = 1.5, ua = 3, vy = 2, Sy = 0.05;
class gd {
  constructor(e) {
    this.chunkMs = e;
  }
  lastAtMs = null;
  gaps = 0;
  /** The first CADENCE_BASELINE_GAPS gaps. */
  warmup = [];
  ewmaGapMs = null;
  /** The newest CADENCE_SLOW_GAPS gaps, oldest first. */
  recent = [];
  /** A chunk was emitted at `atMs` (wall clock). `count` > 1 is an edge that
   *  jumped several seqs in one message (a summary after missed HAVEs): the
   *  gap is spread evenly over them and taken as one observation of that mean. */
  observe(e, t = 1) {
    if (this.lastAtMs !== null) {
      const n = Math.max(0, e - this.lastAtMs) / Math.max(1, t);
      if (this.gaps += 1, this.gaps <= la)
        this.warmup.push(n), this.ewmaGapMs = _y(this.warmup);
      else if (this.ewmaGapMs !== null && ky(n, this.ewmaGapMs)) {
        const i = Math.max(1 / this.gaps, Sy);
        this.ewmaGapMs += i * (n - this.ewmaGapMs);
      }
      this.recent.push(n), this.recent.length > ua && this.recent.shift();
    }
    this.lastAtMs = e;
  }
  /** Forget the baseline — a new epoch is a new stream. */
  reset() {
    this.lastAtMs = null, this.gaps = 0, this.warmup = [], this.ewmaGapMs = null, this.recent = [];
  }
  snapshot(e) {
    const t = this.lastAtMs === null ? 0 : Math.max(0, e - this.lastAtMs), n = this.ewmaGapMs ?? 0;
    let i = "ok";
    return this.lastAtMs !== null && t > vy * Math.max(n, this.chunkMs) ? i = "stalled" : this.established() && this.recent.length >= ua && this.recent.every((r) => r > cr * n) && (i = "slow"), {
      state: i,
      lastGapMs: this.recent.length > 0 ? this.recent[this.recent.length - 1] : 0,
      ewmaGapMs: n,
      sinceLastMs: t
    };
  }
  established() {
    return this.gaps >= la;
  }
}
function _y(s) {
  const e = [...s].sort((n, i) => n - i), t = e.length >> 1;
  return e.length % 2 === 1 ? e[t] : (e[t - 1] + e[t]) / 2;
}
function ky(s, e) {
  return s >= e / cr && s <= e * cr;
}
const xy = `
const FRAMES_PER_POST = ${df};

class PcmTapProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.channels = 0;
    this.buffer = null;
    this.filled = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0 || input[0].length === 0) {
      return true;
    }

    if (this.channels === 0) {
      this.channels = input.length;
    }

    let offset = 0;
    const quantum = input[0].length;
    while (offset < quantum) {
      if (this.buffer === null) {
        this.buffer = new Float32Array(FRAMES_PER_POST * this.channels);
        this.filled = 0;
      }

      const take = Math.min(quantum - offset, FRAMES_PER_POST - this.filled);
      for (let ch = 0; ch < this.channels; ch++) {
        const src = input[ch] || input[0];
        this.buffer.set(
          src.subarray(offset, offset + take),
          ch * FRAMES_PER_POST + this.filled,
        );
      }
      this.filled += take;
      offset += take;

      if (this.filled === FRAMES_PER_POST) {
        this.port.postMessage(
          {
            planar: this.buffer,
            numberOfFrames: FRAMES_PER_POST,
            numberOfChannels: this.channels,
          },
          [this.buffer.buffer],
        );
        this.buffer = null;
      }
    }

    return true;
  }
}

registerProcessor('pcm-tap', PcmTapProcessor);
`;
async function Ty(s, e, t) {
  const n = new Blob([xy], { type: "application/javascript" }), i = URL.createObjectURL(n);
  try {
    await s.audioWorklet.addModule(i);
  } finally {
    URL.revokeObjectURL(i);
  }
  const r = new AudioWorkletNode(s, "pcm-tap");
  r.port.onmessage = (a) => {
    t(a.data);
  };
  const o = s.createGain();
  return o.gain.value = 0, e.connect(r), r.connect(o), o.connect(s.destination), {
    node: r,
    stop: () => {
      r.port.onmessage = null, e.disconnect(r), r.disconnect(), o.disconnect();
    }
  };
}
const Ei = ne("media.timer");
function Ey() {
  return typeof Worker == "function" && typeof Blob == "function" && typeof URL < "u" && typeof URL.createObjectURL == "function";
}
function yd(s, e) {
  const t = Math.max(1, Math.round(e));
  let n = !1, i = "main", r = null, o = null, a = null, d = !1;
  const c = () => {
    n || s();
  }, l = () => {
    i = "main", r = setInterval(c, t);
  }, u = () => {
    o && (o.onmessage = null, o.onerror = null, o.terminate(), o = null), a && (URL.revokeObjectURL(a), a = null);
  };
  if (Ey())
    try {
      const h = `setInterval(() => postMessage(0), ${t});`;
      a = URL.createObjectURL(new Blob([h], { type: "application/javascript" })), o = new Worker(a), o.onmessage = () => {
        d || (d = !0, Ei.info("worker timer running", { period: t })), c();
      }, o.onerror = (f) => {
        Ei.warn("worker timer failed, falling back to the main-thread interval", {
          err: f.message,
          period: t,
          mode: "main"
        }), u(), n || l();
      }, i = "worker";
    } catch (h) {
      Ei.warn("worker timer unavailable, using the main-thread interval", {
        err: h,
        period: t,
        mode: "main"
      }), u(), l();
    }
  else
    l();
  return {
    get mode() {
      return i;
    },
    stop() {
      n || (n = !0, u(), r !== null && (clearInterval(r), r = null));
    }
  };
}
const ha = ne("media.encoder"), fa = re(5), Cy = 5, Ay = [
  96e3,
  88200,
  64e3,
  48e3,
  44100,
  32e3,
  24e3,
  22050,
  16e3,
  12e3,
  11025,
  8e3,
  7350
];
function By(s, e) {
  const n = Ay.indexOf(s);
  if (n === -1)
    throw new Error(`No AAC frequency index for sample rate ${s}`);
  return new Uint8Array([
    16 | n >> 1,
    (n & 1) << 7 | e << 3
  ]);
}
const My = /* @__PURE__ */ new Set(["ftyp", "styp", "moov", "moof", "mdat", "sidx"]);
function Iy(s) {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  let t = 0;
  for (; t + 8 <= s.byteLength; ) {
    let n = e.getUint32(t);
    const i = String.fromCharCode(
      s[t + 4],
      s[t + 5],
      s[t + 6],
      s[t + 7]
    );
    if (n === 1 ? n = Number(e.getBigUint64(t + 8)) : n === 0 && (n = s.byteLength - t), n < 8 || t + n > s.byteLength) break;
    if (!My.has(i))
      return s.subarray(0, t);
    t += n;
  }
  return s;
}
class Oy {
  opts;
  videoEncoder = null;
  audioEncoder = null;
  audioTap = null;
  /** Capture tick. Worker-hosted so a hidden tab keeps the 30 Hz cadence
   *  (the main-thread clamp would leave ~1 fps of a frozen canvas). */
  captureTimer = null;
  baseAudioTime = 0;
  nextBoundaryUs = 0;
  lastVideoTsUs = -1;
  audioSamplesSent = 0;
  audioChannels = 0;
  videoDecoderConfig = null;
  audioDecoderConfig = null;
  currentGroup = null;
  pendingGroups = [];
  audioQueue = [];
  lastAudioEndTsUs = 0;
  audioFlushed = !1;
  /** Last real encoded audio packet, kept to tile a starved chunk window. */
  lastAudioPacket = null;
  muxSerial = Promise.resolve();
  seq = 0;
  stopped = !1;
  failed = !1;
  counters = {
    chunksEmitted: 0,
    framesCaptured: 0,
    framesDropped: 0,
    lastChunkBytes: 0,
    audioPaddedChunks: 0
  };
  cadence;
  constructor(e) {
    this.opts = {
      chunkMs: Wt,
      fps: af,
      videoBitrate: Pc,
      audioBitrate: Fc,
      ...e
    }, this.cadence = new gd(this.opts.chunkMs);
  }
  /** Counters plus the cadence as of now — `stalled` is a reading of the clock. */
  get stats() {
    return { ...this.counters, cadence: this.cadence.snapshot(Date.now()) };
  }
  async start() {
    const { canvas: e, audioContext: t, audioSource: n, codecs: i } = this.opts;
    if (e.width % 2 !== 0 || e.height % 2 !== 0)
      throw new Error(`Canvas dimensions must be even, got ${e.width}x${e.height}`);
    this.videoEncoder = new VideoEncoder({
      output: (a, d) => this.onVideoOutput(a, d),
      error: (a) => this.fail(a)
    }), this.videoEncoder.configure({
      codec: i.videoCodec,
      width: e.width,
      height: e.height,
      bitrate: this.opts.videoBitrate,
      framerate: this.opts.fps,
      latencyMode: "realtime",
      avc: { format: "avc" }
    }), this.audioTap = await Ty(
      t,
      n,
      (a) => this.onPcm(a)
    ), this.baseAudioTime = t.currentTime, this.nextBoundaryUs = 0;
    const r = Math.round(1e6 / this.opts.fps), o = () => {
      if (this.stopped || this.failed || !this.videoEncoder) return;
      const a = Math.round((t.currentTime - this.baseAudioTime) * 1e6);
      if (a <= this.lastVideoTsUs) return;
      if (this.videoEncoder.encodeQueueSize > Cy) {
        this.counters.framesDropped += 1;
        return;
      }
      const d = a >= this.nextBoundaryUs;
      d && (this.nextBoundaryUs = a + this.opts.chunkMs * 1e3);
      const c = new VideoFrame(e, { timestamp: a, duration: r });
      this.lastVideoTsUs = a, this.counters.framesCaptured += 1;
      try {
        this.videoEncoder.encode(c, { keyFrame: d });
      } finally {
        c.close();
      }
    };
    this.captureTimer = yd(o, 1e3 / this.opts.fps), ha.info("capture timer started", { timer: this.captureTimer.mode, fps: this.opts.fps }), o();
  }
  /** Flush encoders, emit the final partial chunk, release everything. */
  async stop() {
    if (!this.stopped) {
      this.stopped = !0, this.captureTimer?.stop(), this.captureTimer = null, this.audioTap?.stop(), this.audioTap = null;
      try {
        this.videoEncoder && this.videoEncoder.state === "configured" && await this.videoEncoder.flush(), this.audioEncoder && this.audioEncoder.state === "configured" && await this.audioEncoder.flush();
      } catch {
      }
      if (this.audioFlushed = !0, this.currentGroup && this.currentGroup.video.length > 0) {
        const e = this.currentGroup.video[this.currentGroup.video.length - 1];
        this.currentGroup.endTsUs = e.timestamp + (e.duration ?? 0), this.pendingGroups.push(this.currentGroup), this.currentGroup = null;
      }
      this.drainPendingGroups(), await this.muxSerial, this.videoEncoder?.close(), this.audioEncoder?.close(), this.videoEncoder = null, this.audioEncoder = null;
    }
  }
  fail(e) {
    this.failed || this.stopped || (this.failed = !0, this.opts.onError(e instanceof Error ? e : new Error(String(e))));
  }
  // ── Audio path ────────────────────────────────────────────────────────────
  onPcm(e) {
    if (this.stopped || this.failed) return;
    if (!this.audioEncoder) {
      this.audioChannels = e.numberOfChannels, this.audioEncoder = new AudioEncoder({
        output: (o, a) => this.onAudioOutput(o, a),
        error: (o) => this.fail(o)
      });
      const r = {
        codec: this.opts.codecs.audioCodec,
        sampleRate: this.opts.audioContext.sampleRate,
        numberOfChannels: this.audioChannels,
        bitrate: this.opts.audioBitrate
      };
      this.opts.codecs.muxAudioCodec === "aac" && (r.aac = { format: "aac" }), this.audioEncoder.configure(r);
    }
    const t = this.opts.audioContext.sampleRate, n = Math.round(this.audioSamplesSent / t * 1e6);
    this.audioSamplesSent += e.numberOfFrames;
    const i = new AudioData({
      format: "f32-planar",
      sampleRate: t,
      numberOfFrames: e.numberOfFrames,
      numberOfChannels: e.numberOfChannels,
      timestamp: n,
      data: e.planar
    });
    try {
      this.audioEncoder.encode(i);
    } finally {
      i.close();
    }
  }
  onAudioOutput(e, t) {
    t?.decoderConfig && (this.audioDecoderConfig = t.decoderConfig), this.audioQueue.push(e), this.lastAudioEndTsUs = e.timestamp + (e.duration ?? 0), this.drainPendingGroups();
  }
  // ── Video path + chunk assembly ───────────────────────────────────────────
  onVideoOutput(e, t) {
    if (t?.decoderConfig && (this.videoDecoderConfig = t.decoderConfig), e.type === "key" && this.currentGroup && this.currentGroup.video.length > 0 && (this.currentGroup.endTsUs = e.timestamp, this.pendingGroups.push(this.currentGroup), this.currentGroup = null), !this.currentGroup) {
      if (e.type !== "key") {
        this.fail(new Error("Video group must start with a keyframe"));
        return;
      }
      this.currentGroup = { startTsUs: e.timestamp, endTsUs: null, video: [] };
    }
    this.currentGroup.video.push(e), this.drainPendingGroups();
  }
  /**
   * A pending group muxes once its audio is complete: either audio for its
   * whole span has been produced, or audio is done for good (flushed / never
   * configured).
   */
  drainPendingGroups() {
    for (; this.pendingGroups.length > 0; ) {
      const e = this.pendingGroups[0], t = e.endTsUs;
      if (t === null || !(this.audioFlushed || this.audioEncoder === null || this.lastAudioEndTsUs >= t)) return;
      this.pendingGroups.shift();
      const i = [];
      for (; this.audioQueue.length > 0 && this.audioQueue[0].timestamp < t; )
        i.push(this.audioQueue.shift());
      if (i.length === 0 && this.lastAudioPacket === null && this.audioEncoder !== null) {
        fa.allow() && ha.warn("dropping leading chunk: audio has not started yet", {
          drops: fa.count()
        });
        continue;
      }
      const r = this.seq++;
      this.muxSerial = this.muxSerial.then(() => this.muxGroup(r, e, i)).catch((o) => this.fail(o));
    }
  }
  async muxGroup(e, t, n) {
    if (this.failed) return;
    const i = t.endTsUs, r = new by({
      format: new pd({ fastStart: "fragmented", minimumFragmentDuration: 3600 }),
      target: new Sn()
    }), o = new hy("avc");
    r.addVideoTrack(o);
    const a = n.length === 0 ? this.lastAudioPacket : null;
    let d = null;
    if ((n.length > 0 || a) && (d = new fy(this.opts.codecs.muxAudioCodec), r.addAudioTrack(d)), await r.start(), !this.videoDecoderConfig)
      throw new Error("Video decoder config missing before first chunk");
    for (let u = 0; u < t.video.length; u++)
      await o.add(
        Ot.fromEncodedChunk(t.video[u]),
        u === 0 ? { decoderConfig: this.videoDecoderConfig } : void 0
      );
    if (d) {
      let u = this.audioDecoderConfig ?? {
        codec: this.opts.codecs.audioCodec,
        sampleRate: this.opts.audioContext.sampleRate,
        numberOfChannels: this.audioChannels
      };
      if (this.opts.codecs.muxAudioCodec === "aac" && (u = {
        ...u,
        description: By(
          this.opts.audioContext.sampleRate,
          this.audioChannels
        )
      }), a) {
        for (let h = t.startTsUs, f = !0; h < i; h += a.durUs)
          await d.add(
            new Ot(a.data, "key", h / 1e6, a.durUs / 1e6),
            f ? { decoderConfig: u } : void 0
          ), f = !1;
        this.counters.audioPaddedChunks += 1;
      } else {
        for (let g = 0; g < n.length; g++)
          await d.add(
            Ot.fromEncodedChunk(n[g]),
            g === 0 ? { decoderConfig: u } : void 0
          );
        const h = n[n.length - 1], f = new Uint8Array(h.byteLength);
        h.copyTo(f);
        const m = this.opts.codecs.muxAudioCodec === "aac" ? Math.round(1024e6 / this.opts.audioContext.sampleRate) : 2e4;
        this.lastAudioPacket = { data: f, durUs: h.duration || m };
      }
    }
    await r.finalize();
    const c = r.target.buffer;
    if (!c)
      throw new Error(`Muxer produced no output for chunk ${e}`);
    const l = {
      seq: e,
      tsUs: t.startTsUs,
      durUs: i - t.startTsUs,
      payload: Iy(new Uint8Array(c))
    };
    this.counters.chunksEmitted += 1, this.counters.lastChunkBytes = l.payload.byteLength, this.cadence.observe(Date.now()), this.opts.onChunk(l);
  }
}
const Ry = {}, pa = ne("ice");
function wd(s) {
  const e = Ry ?? {};
  return {
    VITE_TURN_ISSUER_URL: e.VITE_TURN_ISSUER_URL ?? "",
    VITE_TURN_URL: e.VITE_TURN_URL ?? "",
    VITE_TURN_USER: e.VITE_TURN_USER ?? "",
    VITE_TURN_PASS: e.VITE_TURN_PASS ?? "",
    VITE_DISABLE_STUN: e.VITE_DISABLE_STUN ?? "",
    VITE_DISABLE_TURN: e.VITE_DISABLE_TURN ?? ""
  };
}
const Py = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" }
], Fy = 5e3, Ly = 10 * 6e4, Uy = 6e4;
let ms = null, Rs = null, ma = 0;
function Ny(s, e) {
  if (!s || typeof s != "object") return null;
  const { iceServers: t, ttl: n } = s;
  if (!Array.isArray(t) || typeof n != "number" || n <= 0) return null;
  const i = t.filter(
    (r) => !!r && typeof r == "object" && typeof r.username == "string" && typeof r.credential == "string" && [r.urls].flat().some((o) => typeof o == "string" && /^turns?:/.test(o))
  );
  return i.length === 0 ? null : { servers: i, expiresAt: e + n * 1e3 };
}
function Dy(s) {
  return s.VITE_DISABLE_TURN !== "1" && !s.VITE_TURN_URL && !!s.VITE_TURN_ISSUER_URL;
}
function ga(s) {
  const e = wd();
  if (!Dy(e)) return Promise.resolve();
  const t = Date.now();
  return ms && t < ms.expiresAt - Ly ? Promise.resolve() : Rs || (t - ma < Uy ? Promise.resolve() : (Rs = (async () => {
    try {
      const n = await fetch(e.VITE_TURN_ISSUER_URL, {
        signal: AbortSignal.timeout(Fy),
        cache: "no-store"
      });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const i = Ny(await n.json(), Date.now());
      if (!i) throw new Error("bad response shape");
      ms = i, pa.info("turn credentials issued", {
        servers: i.servers.length,
        expiresInS: Math.round((i.expiresAt - Date.now()) / 1e3)
      });
    } catch (n) {
      ma = Date.now(), pa.warn("turn issuer failed, using STUN only", {
        url: e.VITE_TURN_ISSUER_URL,
        error: n instanceof Error ? n.message : String(n)
      });
    } finally {
      Rs = null;
    }
  })(), Rs));
}
const Vy = "spotlight.iceRelayOnly";
function $y() {
  try {
    return localStorage.getItem(Vy) === "1";
  } catch {
    return !1;
  }
}
function zy(s) {
  const {
    VITE_TURN_ISSUER_URL: e,
    VITE_TURN_URL: t,
    VITE_TURN_USER: n,
    VITE_TURN_PASS: i,
    VITE_DISABLE_STUN: r,
    VITE_DISABLE_TURN: o
  } = wd(), a = r === "1" ? [] : [...Py], d = [t, n, i].filter(Boolean).length;
  if (d > 0 && d < 3)
    throw new Error(
      "Incomplete TURN config: set VITE_TURN_URL, VITE_TURN_USER, and VITE_TURN_PASS together."
    );
  return o === "1" || (t && n && i ? a.push({
    urls: t,
    username: n,
    credential: i
  }) : e && ms && Date.now() < ms.expiresAt ? (a.push(...ms.servers), ga()) : e && ga()), a;
}
const Hy = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), vt = /* @__PURE__ */ new Uint32Array(64);
class jy extends ac {
  constructor(e) {
    super(64, e, 8, !1);
  }
  get() {
    const { A: e, B: t, C: n, D: i, E: r, F: o, G: a, H: d } = this;
    return [e, t, n, i, r, o, a, d];
  }
  // prettier-ignore
  set(e, t, n, i, r, o, a, d) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = i | 0, this.E = r | 0, this.F = o | 0, this.G = a | 0, this.H = d | 0;
  }
  process(e, t) {
    for (let u = 0; u < 16; u++, t += 4)
      vt[u] = e.getUint32(t, !1);
    for (let u = 16; u < 64; u++) {
      const h = vt[u - 15], f = vt[u - 2], m = He(h, 7) ^ He(h, 18) ^ h >>> 3, g = He(f, 17) ^ He(f, 19) ^ f >>> 10;
      vt[u] = g + vt[u - 7] + m + vt[u - 16] | 0;
    }
    let { A: n, B: i, C: r, D: o, E: a, F: d, G: c, H: l } = this;
    for (let u = 0; u < 64; u++) {
      const h = He(a, 6) ^ He(a, 11) ^ He(a, 25), f = l + h + zl(a, d, c) + Hy[u] + vt[u] | 0, g = (He(n, 2) ^ He(n, 13) ^ He(n, 22)) + Hl(n, i, r) | 0;
      l = c, c = d, d = a, a = o + f | 0, o = r, r = i, i = n, n = f + g | 0;
    }
    n = n + this.A | 0, i = i + this.B | 0, r = r + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, d = d + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, i, r, o, a, d, c, l);
  }
  roundClean() {
    Je(vt);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), Je(this.buffer);
  }
}
class qy extends jy {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = mt[0] | 0;
  B = mt[1] | 0;
  C = mt[2] | 0;
  D = mt[3] | 0;
  E = mt[4] | 0;
  F = mt[5] | 0;
  G = mt[6] | 0;
  H = mt[7] | 0;
  constructor() {
    super(32);
  }
}
const bd = jl([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((s) => BigInt(s))), Wy = bd[0], Gy = bd[1], St = /* @__PURE__ */ new Uint32Array(80), _t = /* @__PURE__ */ new Uint32Array(80);
class Zy extends ac {
  constructor(e) {
    super(128, e, 16, !1);
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: n, Bl: i, Ch: r, Cl: o, Dh: a, Dl: d, Eh: c, El: l, Fh: u, Fl: h, Gh: f, Gl: m, Hh: g, Hl: p } = this;
    return [e, t, n, i, r, o, a, d, c, l, u, h, f, m, g, p];
  }
  // prettier-ignore
  set(e, t, n, i, r, o, a, d, c, l, u, h, f, m, g, p) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = i | 0, this.Ch = r | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = d | 0, this.Eh = c | 0, this.El = l | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = f | 0, this.Gl = m | 0, this.Hh = g | 0, this.Hl = p | 0;
  }
  process(e, t) {
    for (let A = 0; A < 16; A++, t += 4)
      St[A] = e.getUint32(t), _t[A] = e.getUint32(t += 4);
    for (let A = 16; A < 80; A++) {
      const F = St[A - 15] | 0, j = _t[A - 15] | 0, Z = Et(F, j, 1) ^ Et(F, j, 8) ^ uo(F, j, 7), L = Ct(F, j, 1) ^ Ct(F, j, 8) ^ ho(F, j, 7), q = St[A - 2] | 0, $ = _t[A - 2] | 0, te = Et(q, $, 19) ^ Fs(q, $, 61) ^ uo(q, $, 6), W = Ct(q, $, 19) ^ Ls(q, $, 61) ^ ho(q, $, 6), S = Gl(L, W, _t[A - 7], _t[A - 16]), M = Zl(S, Z, te, St[A - 7], St[A - 16]);
      St[A] = M | 0, _t[A] = S | 0;
    }
    let { Ah: n, Al: i, Bh: r, Bl: o, Ch: a, Cl: d, Dh: c, Dl: l, Eh: u, El: h, Fh: f, Fl: m, Gh: g, Gl: p, Hh: y, Hl: k } = this;
    for (let A = 0; A < 80; A++) {
      const F = Et(u, h, 14) ^ Et(u, h, 18) ^ Fs(u, h, 41), j = Ct(u, h, 14) ^ Ct(u, h, 18) ^ Ls(u, h, 41), Z = u & f ^ ~u & g, L = h & m ^ ~h & p, q = Kl(k, j, L, Gy[A], _t[A]), $ = Xl(q, y, F, Z, Wy[A], St[A]), te = q | 0, W = Et(n, i, 28) ^ Fs(n, i, 34) ^ Fs(n, i, 39), S = Ct(n, i, 28) ^ Ls(n, i, 34) ^ Ls(n, i, 39), M = n & r ^ n & a ^ r & a, C = i & o ^ i & d ^ o & d;
      y = g | 0, k = p | 0, g = f | 0, p = m | 0, f = u | 0, m = h | 0, { h: u, l: h } = Ne(c | 0, l | 0, $ | 0, te | 0), c = a | 0, l = d | 0, a = r | 0, d = o | 0, r = n | 0, o = i | 0;
      const R = xr(te, S, C);
      n = Tr(R, $, W, M), i = R | 0;
    }
    ({ h: n, l: i } = Ne(this.Ah | 0, this.Al | 0, n | 0, i | 0)), { h: r, l: o } = Ne(this.Bh | 0, this.Bl | 0, r | 0, o | 0), { h: a, l: d } = Ne(this.Ch | 0, this.Cl | 0, a | 0, d | 0), { h: c, l } = Ne(this.Dh | 0, this.Dl | 0, c | 0, l | 0), { h: u, l: h } = Ne(this.Eh | 0, this.El | 0, u | 0, h | 0), { h: f, l: m } = Ne(this.Fh | 0, this.Fl | 0, f | 0, m | 0), { h: g, l: p } = Ne(this.Gh | 0, this.Gl | 0, g | 0, p | 0), { h: y, l: k } = Ne(this.Hh | 0, this.Hl | 0, y | 0, k | 0), this.set(n, i, r, o, a, d, c, l, u, h, f, m, g, p, y, k);
  }
  roundClean() {
    Je(St, _t);
  }
  destroy() {
    this.destroyed = !0, Je(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Ky extends Zy {
  Ah = Ce[0] | 0;
  Al = Ce[1] | 0;
  Bh = Ce[2] | 0;
  Bl = Ce[3] | 0;
  Ch = Ce[4] | 0;
  Cl = Ce[5] | 0;
  Dh = Ce[6] | 0;
  Dl = Ce[7] | 0;
  Eh = Ce[8] | 0;
  El = Ce[9] | 0;
  Fh = Ce[10] | 0;
  Fl = Ce[11] | 0;
  Gh = Ce[12] | 0;
  Gl = Ce[13] | 0;
  Hh = Ce[14] | 0;
  Hl = Ce[15] | 0;
  constructor() {
    super(64);
  }
}
const Xy = /* @__PURE__ */ kr(
  () => new qy(),
  /* @__PURE__ */ oc(1)
), Yy = /* @__PURE__ */ kr(
  () => new Ky(),
  /* @__PURE__ */ oc(3)
);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _e = (s, e, t) => Be(s, e, t), vd = ft, Sd = Ve, ya = (...s) => Dl(...s), Qy = (s) => Ie(s), Jy = sc, _d = (s) => Vl(s), jn = /* @__PURE__ */ BigInt(0), dr = /* @__PURE__ */ BigInt(1);
function qn(s, e = "") {
  if (typeof s != "boolean") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected boolean, got type=" + typeof s);
  }
  return s;
}
function e0(s) {
  if (typeof s == "bigint") {
    if (!_n(s))
      throw new RangeError("positive bigint expected, got " + s);
  } else
    vd(s);
  return s;
}
function lr(s, e = "") {
  if (typeof s != "number") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected number, got type=" + typeof s);
  }
  if (!Number.isSafeInteger(s)) {
    const t = e && `"${e}" `;
    throw new RangeError(t + "expected safe integer, got " + s);
  }
}
function kd(s) {
  if (typeof s != "string")
    throw new TypeError("hex string expected, got " + typeof s);
  return s === "" ? jn : BigInt("0x" + s);
}
function t0(s) {
  return kd(Ve(s));
}
function Qt(s) {
  return kd(Ve(Xs(Be(s)).reverse()));
}
function xd(s, e) {
  if (ft(e), e === 0)
    throw new RangeError("zero length");
  s = e0(s);
  const t = s.toString(16);
  if (t.length > e * 2)
    throw new RangeError("number too large");
  return Ie(t.padStart(e * 2, "0"));
}
function Td(s, e) {
  return xd(s, e).reverse();
}
function s0(s, e) {
  if (s = _e(s), e = _e(e), s.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < s.length; n++)
    t |= s[n] ^ e[n];
  return t === 0;
}
function Xs(s) {
  return Uint8Array.from(_e(s));
}
const _n = (s) => typeof s == "bigint" && jn <= s;
function n0(s, e, t) {
  return _n(s) && _n(e) && _n(t) && e <= s && s < t;
}
function Wn(s, e, t, n) {
  if (!n0(e, t, n))
    throw new RangeError("expected valid " + s + ": " + t + " <= n < " + n + ", got " + e);
}
function i0(s) {
  if (s < jn)
    throw new Error("expected non-negative bigint, got " + s);
  let e;
  for (e = 0; s > jn; s >>= dr, e += 1)
    ;
  return e;
}
const r0 = (s) => (dr << BigInt(s)) - dr;
function ti(s, e = {}, t = {}) {
  if (Object.prototype.toString.call(s) !== "[object Object]")
    throw new TypeError("expected valid options object");
  function n(r, o, a) {
    if (!a && o !== "function" && !Object.hasOwn(s, r))
      throw new TypeError(`param "${r}" is invalid: expected own property`);
    const d = s[r];
    if (a && d === void 0)
      return;
    const c = typeof d;
    if (c !== o || d === null)
      throw new TypeError(`param "${r}" is invalid: expected ${o}, got ${c}`);
  }
  const i = (r, o) => Object.entries(r).forEach(([a, d]) => n(a, d, o));
  i(e, !1), i(t, !0);
}
const wa = () => {
  throw new Error("not implemented");
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ae = /* @__PURE__ */ BigInt(0), Ee = /* @__PURE__ */ BigInt(1), jt = /* @__PURE__ */ BigInt(2), Ed = /* @__PURE__ */ BigInt(3), Cd = /* @__PURE__ */ BigInt(4), Ad = /* @__PURE__ */ BigInt(5), o0 = /* @__PURE__ */ BigInt(7), Bd = /* @__PURE__ */ BigInt(8), a0 = /* @__PURE__ */ BigInt(9), Md = /* @__PURE__ */ BigInt(16);
function pe(s, e) {
  if (e <= Ae)
    throw new Error("mod: expected positive modulus, got " + e);
  const t = s % e;
  return t >= Ae ? t : e + t;
}
function Ue(s, e, t) {
  if (e < Ae)
    throw new Error("pow2: expected non-negative exponent, got " + e);
  let n = s;
  for (; e-- > Ae; )
    n *= n, n %= t;
  return n;
}
function ba(s, e) {
  if (s === Ae)
    throw new Error("invert: expected non-zero number");
  if (e <= Ae)
    throw new Error("invert: expected positive modulus, got " + e);
  let t = pe(s, e), n = e, i = Ae, r = Ee;
  for (; t !== Ae; ) {
    const a = n / t, d = n - t * a, c = i - r * a;
    n = t, t = d, i = r, r = c;
  }
  if (n !== Ee)
    throw new Error("invert: does not exist");
  return pe(i, e);
}
function Kr(s, e, t) {
  const n = s;
  if (!n.eql(n.sqr(e), t))
    throw new Error("Cannot find square root");
}
function Id(s, e) {
  const t = s, n = (t.ORDER + Ee) / Cd, i = t.pow(e, n);
  return Kr(t, i, e), i;
}
function c0(s, e) {
  const t = s, n = (t.ORDER - Ad) / Bd, i = t.mul(e, jt), r = t.pow(i, n), o = t.mul(e, r), a = t.mul(t.mul(o, jt), r), d = t.mul(o, t.sub(a, t.ONE));
  return Kr(t, d, e), d;
}
function d0(s) {
  const e = Xr(s), t = Od(s), n = t(e, e.neg(e.ONE)), i = t(e, n), r = t(e, e.neg(n)), o = (s + o0) / Md;
  return ((a, d) => {
    const c = a;
    let l = c.pow(d, o), u = c.mul(l, n);
    const h = c.mul(l, i), f = c.mul(l, r), m = c.eql(c.sqr(u), d), g = c.eql(c.sqr(h), d);
    l = c.cmov(l, u, m), u = c.cmov(f, h, g);
    const p = c.eql(c.sqr(u), d), y = c.cmov(l, u, p);
    return Kr(c, y, d), y;
  });
}
function Od(s) {
  if (s < Ed)
    throw new Error("sqrt is not defined for small field");
  let e = s - Ee, t = 0;
  for (; e % jt === Ae; )
    e /= jt, t++;
  let n = jt;
  const i = Xr(s);
  for (; va(i, n) === 1; )
    if (n++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (t === 1)
    return Id;
  let r = i.pow(n, e);
  const o = (e + Ee) / jt;
  return function(d, c) {
    const l = d;
    if (l.is0(c))
      return c;
    if (va(l, c) !== 1)
      throw new Error("Cannot find square root");
    let u = t, h = l.mul(l.ONE, r), f = l.pow(c, e), m = l.pow(c, o);
    for (; !l.eql(f, l.ONE); ) {
      if (l.is0(f))
        return l.ZERO;
      let g = 1, p = l.sqr(f);
      for (; !l.eql(p, l.ONE); )
        if (g++, p = l.sqr(p), g === u)
          throw new Error("Cannot find square root");
      const y = Ee << BigInt(u - g - 1), k = l.pow(h, y);
      u = g, h = l.sqr(k), f = l.mul(f, h), m = l.mul(m, k);
    }
    return m;
  };
}
function l0(s) {
  return s % Cd === Ed ? Id : s % Bd === Ad ? c0 : s % Md === a0 ? d0(s) : Od(s);
}
const Vt = (s, e) => (pe(s, e) & Ee) === Ee, u0 = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function h0(s) {
  const e = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, t = u0.reduce((n, i) => (n[i] = "function", n), e);
  if (ti(s, t), lr(s.BYTES, "BYTES"), lr(s.BITS, "BITS"), s.BYTES < 1 || s.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (s.ORDER <= Ee)
    throw new Error("invalid field: expected ORDER > 1, got " + s.ORDER);
  return s;
}
function f0(s, e, t) {
  const n = s;
  if (t < Ae)
    throw new Error("invalid exponent, negatives unsupported");
  if (t === Ae)
    return n.ONE;
  if (t === Ee)
    return e;
  let i = n.ONE, r = e;
  for (; t > Ae; )
    t & Ee && (i = n.mul(i, r)), r = n.sqr(r), t >>= Ee;
  return i;
}
function Rd(s, e, t = !1) {
  const n = s, i = new Array(e.length).fill(t ? n.ZERO : void 0), r = e.reduce((a, d, c) => n.is0(d) ? a : (i[c] = a, n.mul(a, d)), n.ONE), o = n.inv(r);
  return e.reduceRight((a, d, c) => n.is0(d) ? a : (i[c] = n.mul(a, i[c]), n.mul(a, d)), o), i;
}
function va(s, e) {
  const t = s, n = (t.ORDER - Ee) / jt, i = t.pow(e, n), r = t.eql(i, t.ONE), o = t.eql(i, t.ZERO), a = t.eql(i, t.neg(t.ONE));
  if (!r && !o && !a)
    throw new Error("invalid Legendre symbol result");
  return r ? 1 : o ? 0 : -1;
}
function p0(s, e) {
  if (e !== void 0 && vd(e), s <= Ae)
    throw new Error("invalid n length: expected positive n, got " + s);
  if (e !== void 0 && e < 1)
    throw new Error("invalid n length: expected positive bit length, got " + e);
  const t = i0(s);
  if (e !== void 0 && e < t)
    throw new Error(`invalid n length: expected bit length (${t}) >= n.length (${e})`);
  const n = e !== void 0 ? e : t, i = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: i };
}
const Sa = /* @__PURE__ */ new WeakMap();
class Pd {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = Ae;
  ONE = Ee;
  _lengths;
  _mod;
  constructor(e, t = {}) {
    if (e <= Ee)
      throw new Error("invalid field: expected ORDER > 1, got " + e);
    let n;
    this.isLE = !1, t != null && typeof t == "object" && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: t.sqrt, enumerable: !0 }), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
    const { nBitLength: i, nByteLength: r } = p0(e, n);
    if (r > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = e, this.BITS = i, this.BYTES = r, Object.freeze(this);
  }
  create(e) {
    return pe(e, this.ORDER);
  }
  isValid(e) {
    if (typeof e != "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof e);
    return Ae <= e && e < this.ORDER;
  }
  is0(e) {
    return e === Ae;
  }
  // is valid and invertible
  isValidNot0(e) {
    return !this.is0(e) && this.isValid(e);
  }
  isOdd(e) {
    return (e & Ee) === Ee;
  }
  neg(e) {
    return pe(-e, this.ORDER);
  }
  eql(e, t) {
    return e === t;
  }
  sqr(e) {
    return pe(e * e, this.ORDER);
  }
  add(e, t) {
    return pe(e + t, this.ORDER);
  }
  sub(e, t) {
    return pe(e - t, this.ORDER);
  }
  mul(e, t) {
    return pe(e * t, this.ORDER);
  }
  pow(e, t) {
    return f0(this, e, t);
  }
  div(e, t) {
    return pe(e * ba(t, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(e) {
    return e * e;
  }
  addN(e, t) {
    return e + t;
  }
  subN(e, t) {
    return e - t;
  }
  mulN(e, t) {
    return e * t;
  }
  inv(e) {
    return ba(e, this.ORDER);
  }
  sqrt(e) {
    let t = Sa.get(this);
    return t || Sa.set(this, t = l0(this.ORDER)), t(this, e);
  }
  toBytes(e) {
    return this.isLE ? Td(e, this.BYTES) : xd(e, this.BYTES);
  }
  fromBytes(e, t = !1) {
    _e(e);
    const { _lengths: n, BYTES: i, isLE: r, ORDER: o, _mod: a } = this;
    if (n) {
      if (e.length < 1 || !n.includes(e.length) || e.length > i)
        throw new Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
      const c = new Uint8Array(i);
      c.set(e, r ? 0 : c.length - e.length), e = c;
    }
    if (e.length !== i)
      throw new Error("Field.fromBytes: expected " + i + " bytes, got " + e.length);
    let d = r ? Qt(e) : t0(e);
    if (a && (d = pe(d, o)), !t && !this.isValid(d))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return d;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(e) {
    return Rd(this, e);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(e, t, n) {
    return qn(n, "condition"), n ? t : e;
  }
}
Object.freeze(Pd.prototype);
function Xr(s, e = {}) {
  return new Pd(s, e);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Gn = /* @__PURE__ */ BigInt(0), ur = /* @__PURE__ */ BigInt(1);
function _a(s, e) {
  const t = e.negate();
  return s ? t : e;
}
function Ci(s, e) {
  const t = Rd(s.Fp, e.map((n) => n.Z));
  return e.map((n, i) => s.fromAffine(n.toAffine(t[i])));
}
function Fd(s, e) {
  if (!Number.isSafeInteger(s) || s <= 0 || s > e)
    throw new Error("invalid window size, expected [1.." + e + "], got W=" + s);
}
function Ai(s, e) {
  Fd(s, e);
  const t = Math.ceil(e / s) + 1, n = 2 ** (s - 1), i = 2 ** s, r = r0(s), o = BigInt(s);
  return { windows: t, windowSize: n, mask: r, maxNumber: i, shiftBy: o };
}
function ka(s, e, t) {
  const { windowSize: n, mask: i, maxNumber: r, shiftBy: o } = t;
  let a = Number(s & i), d = s >> o;
  a > n && (a -= r, d += ur);
  const c = e * n, l = c + Math.abs(a) - 1, u = a === 0, h = a < 0, f = e % 2 !== 0;
  return { nextN: d, offset: l, isZero: u, isNeg: h, isNegF: f, offsetF: c };
}
const Bi = /* @__PURE__ */ new WeakMap(), Ld = /* @__PURE__ */ new WeakMap();
function Mi(s) {
  return Ld.get(s) || 1;
}
function xa(s) {
  if (s !== Gn)
    throw new Error("invalid wNAF");
}
class m0 {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(e, t) {
    this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = t;
  }
  // non-const time multiplication ladder
  _unsafeLadder(e, t, n = this.ZERO) {
    let i = e;
    for (; t > Gn; )
      t & ur && (n = n.add(i)), i = i.double(), t >>= ur;
    return n;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point - Point instance
   * @param W - window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(e, t) {
    const { windows: n, windowSize: i } = Ai(t, this.bits), r = [];
    let o = e, a = o;
    for (let d = 0; d < n; d++) {
      a = o, r.push(a);
      for (let c = 1; c < i; c++)
        a = a.add(o), r.push(a);
      o = a.double();
    }
    return r;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(e, t, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let i = this.ZERO, r = this.BASE;
    const o = Ai(e, this.bits);
    for (let a = 0; a < o.windows; a++) {
      const { nextN: d, offset: c, isZero: l, isNeg: u, isNegF: h, offsetF: f } = ka(n, a, o);
      n = d, l ? r = r.add(_a(h, t[f])) : i = i.add(_a(u, t[c]));
    }
    return xa(n), { p: i, f: r };
  }
  /**
   * Implements unsafe EC multiplication using precomputed tables
   * and w-ary non-adjacent form.
   * @param acc - accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(e, t, n, i = this.ZERO) {
    const r = Ai(e, this.bits);
    for (let o = 0; o < r.windows && n !== Gn; o++) {
      const { nextN: a, offset: d, isZero: c, isNeg: l } = ka(n, o, r);
      if (n = a, !c) {
        const u = t[d];
        i = i.add(l ? u.negate() : u);
      }
    }
    return xa(n), i;
  }
  getPrecomputes(e, t, n) {
    let i = Bi.get(t);
    return i || (i = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (i = n(i)), Bi.set(t, i))), i;
  }
  cached(e, t, n) {
    const i = Mi(e);
    return this.wNAF(i, this.getPrecomputes(i, e, n), t);
  }
  unsafe(e, t, n, i) {
    const r = Mi(e);
    return r === 1 ? this._unsafeLadder(e, t, i) : this.wNAFUnsafe(r, this.getPrecomputes(r, e, n), t, i);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(e, t) {
    Fd(t, this.bits), Ld.set(e, t), Bi.delete(e);
  }
  hasCache(e) {
    return Mi(e) !== 1;
  }
}
function Ta(s, e, t) {
  if (e) {
    if (e.ORDER !== s)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return h0(e), e;
  } else
    return Xr(s, { isLE: t });
}
function g0(s, e, t = {}, n) {
  if (n === void 0 && (n = s === "edwards"), !e || typeof e != "object")
    throw new Error(`expected valid ${s} CURVE object`);
  for (const d of ["p", "n", "h"]) {
    const c = e[d];
    if (!(typeof c == "bigint" && c > Gn))
      throw new Error(`CURVE.${d} must be positive bigint`);
  }
  const i = Ta(e.p, t.Fp, n), r = Ta(e.n, t.Fn, n), a = ["Gx", "Gy", "a", "d"];
  for (const d of a)
    if (!i.isValid(e[d]))
      throw new Error(`CURVE.${d} must be valid field element of CURVE.Fp`);
  return e = Object.freeze(Object.assign({}, e)), { CURVE: e, Fp: i, Fn: r };
}
function Ud(s, e) {
  return function(n) {
    const i = s(n);
    return { secretKey: i, publicKey: e(i) };
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const kt = /* @__PURE__ */ BigInt(0), Se = /* @__PURE__ */ BigInt(1), Ii = /* @__PURE__ */ BigInt(2), y0 = /* @__PURE__ */ BigInt(8);
function w0(s, e, t, n) {
  const i = s.sqr(t), r = s.sqr(n), o = s.add(s.mul(e.a, i), r), a = s.add(s.ONE, s.mul(e.d, s.mul(i, r)));
  return s.eql(o, a);
}
function b0(s, e = {}) {
  const t = e, n = g0("edwards", s, t, t.FpFnLE), { Fp: i, Fn: r } = n;
  let o = n.CURVE;
  const { h: a } = o;
  ti(t, {}, { uvRatio: "function" });
  const d = Ii << BigInt(r.BYTES * 8) - Se, c = (g) => i.create(g), l = t.uvRatio === void 0 ? (g, p) => {
    try {
      return { isValid: !0, value: i.sqrt(i.div(g, p)) };
    } catch {
      return { isValid: !1, value: kt };
    }
  } : t.uvRatio;
  if (!w0(i, o, o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  function u(g, p, y = !1) {
    const k = y ? Se : kt;
    return Wn("coordinate " + g, p, k, d), p;
  }
  function h(g) {
    if (!(g instanceof f))
      throw new Error("EdwardsPoint expected");
  }
  class f {
    // base / generator point
    static BASE = new f(o.Gx, o.Gy, Se, c(o.Gx * o.Gy));
    // zero / infinity / identity point
    static ZERO = new f(kt, Se, Se, kt);
    // 0, 1, 1, 0
    // math field
    static Fp = i;
    // scalar field
    static Fn = r;
    X;
    Y;
    Z;
    T;
    constructor(p, y, k, A) {
      this.X = u("x", p), this.Y = u("y", y), this.Z = u("z", k, !0), this.T = u("t", A), Object.freeze(this);
    }
    static CURVE() {
      return o;
    }
    /**
     * Create one extended Edwards point from affine coordinates.
     * Does NOT validate that the point is on-curve or torsion-free.
     * Use `.assertValidity()` on adversarial inputs.
     */
    static fromAffine(p) {
      if (p instanceof f)
        throw new Error("extended point not allowed");
      const { x: y, y: k } = p || {};
      return u("x", y), u("y", k), new f(y, k, Se, c(y * k));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(p, y = !1) {
      const k = i.BYTES, { a: A, d: F } = o;
      p = Xs(_e(p, k, "point")), qn(y, "zip215");
      const j = Xs(p), Z = p[k - 1];
      j[k - 1] = Z & -129;
      const L = Qt(j), q = y ? d : i.ORDER;
      Wn("point.y", L, kt, q);
      const $ = c(L * L), te = c($ - Se), W = c(F * $ - A);
      let { isValid: S, value: M } = l(te, W);
      if (!S)
        throw new Error("bad point: invalid y coordinate");
      const C = (M & Se) === Se, R = (Z & 128) !== 0;
      if (!y && M === kt && R)
        throw new Error("bad point: x=0 and x_0=1");
      return R !== C && (M = c(-M)), f.fromAffine({ x: M, y: L });
    }
    static fromHex(p, y = !1) {
      return f.fromBytes(Qy(p), y);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(p = 8, y = !0) {
      return m.createCache(this, p), y || this.multiply(Ii), this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this, { a: y, d: k } = o;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X: A, Y: F, Z: j, T: Z } = p, L = c(A * A), q = c(F * F), $ = c(j * j), te = c($ * $), W = c(L * y), S = c($ * c(W + q)), M = c(te + c(k * c(L * q)));
      if (S !== M)
        throw new Error("bad point: equation left != right (1)");
      const C = c(A * F), R = c(j * Z);
      if (C !== R)
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(p) {
      h(p);
      const { X: y, Y: k, Z: A } = this, { X: F, Y: j, Z } = p, L = c(y * Z), q = c(F * A), $ = c(k * Z), te = c(j * A);
      return L === q && $ === te;
    }
    is0() {
      return this.equals(f.ZERO);
    }
    negate() {
      return new f(c(-this.X), this.Y, this.Z, c(-this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a: p } = o, { X: y, Y: k, Z: A } = this, F = c(y * y), j = c(k * k), Z = c(Ii * c(A * A)), L = c(p * F), q = y + k, $ = c(c(q * q) - F - j), te = L + j, W = te - Z, S = L - j, M = c($ * W), C = c(te * S), R = c($ * S), U = c(W * te);
      return new f(M, C, U, R);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(p) {
      h(p);
      const { a: y, d: k } = o, { X: A, Y: F, Z: j, T: Z } = this, { X: L, Y: q, Z: $, T: te } = p, W = c(A * L), S = c(F * q), M = c(Z * k * te), C = c(j * $), R = c((A + F) * (L + q) - W - S), U = C - M, K = C + M, ee = c(S - y * W), ie = c(R * U), X = c(K * ee), me = c(R * ee), xe = c(U * K);
      return new f(ie, X, xe, me);
    }
    subtract(p) {
      return h(p), this.add(p.negate());
    }
    // Constant-time multiplication.
    multiply(p) {
      if (!r.isValidNot0(p))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p: y, f: k } = m.cached(this, p, (A) => Ci(f, A));
      return Ci(f, [y, k])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(p) {
      if (!r.isValid(p))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      return p === kt ? f.ZERO : this.is0() || p === Se ? this : m.unsafe(this, p, (y) => Ci(f, y));
    }
    // Checks if point is of small order.
    // If you add something to small order point, you will have "dirty"
    // point with torsion component.
    // Clears cofactor and checks if the result is 0.
    isSmallOrder() {
      return this.clearCofactor().is0();
    }
    // Multiplies point by curve order and checks if the result is 0.
    // Returns `false` is the point is dirty.
    isTorsionFree() {
      return m.unsafe(this, o.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(p) {
      const y = this;
      let k = p;
      const { X: A, Y: F, Z: j } = y, Z = y.is0();
      k == null && (k = Z ? y0 : i.inv(j));
      const L = c(A * k), q = c(F * k), $ = i.mul(j, k);
      if (Z)
        return { x: kt, y: Se };
      if ($ !== Se)
        throw new Error("invZ was invalid");
      return { x: L, y: q };
    }
    clearCofactor() {
      return a === Se ? this : this.multiplyUnsafe(a);
    }
    toBytes() {
      const { x: p, y } = this.toAffine(), k = i.toBytes(y);
      return k[k.length - 1] |= p & Se ? 128 : 0, k;
    }
    toHex() {
      return Sd(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const m = new m0(f, r.BITS);
  return r.BITS >= 8 && f.BASE.precompute(8), Object.freeze(f.prototype), Object.freeze(f), f;
}
class v0 {
  static BASE;
  static ZERO;
  static Fp;
  static Fn;
  ep;
  /**
   * Wrap one internal Edwards representative directly.
   * This is not a canonical encoding boundary: alternate Edwards
   * representatives may still describe the same abstract wrapper element.
   */
  constructor(e) {
    this.ep = e;
  }
  // Static methods that must be implemented by subclasses
  static fromBytes(e) {
    wa();
  }
  static fromHex(e) {
    wa();
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  // Common implementations
  clearCofactor() {
    return this;
  }
  assertValidity() {
    this.ep.assertValidity();
  }
  /**
   * Return affine coordinates of the current internal Edwards representative.
   * This is a convenience helper, not a canonical Ristretto/Decaf encoding.
   * Equal abstract elements may expose different `x` / `y`; use
   * `toBytes()` / `fromBytes()` for canonical roundtrips.
   */
  toAffine(e) {
    return this.ep.toAffine(e);
  }
  toHex() {
    return Sd(this.toBytes());
  }
  toString() {
    return this.toHex();
  }
  isTorsionFree() {
    return !0;
  }
  isSmallOrder() {
    return !1;
  }
  add(e) {
    return this.assertSame(e), this.init(this.ep.add(e.ep));
  }
  subtract(e) {
    return this.assertSame(e), this.init(this.ep.subtract(e.ep));
  }
  multiply(e) {
    return this.init(this.ep.multiply(e));
  }
  multiplyUnsafe(e) {
    return this.init(this.ep.multiplyUnsafe(e));
  }
  double() {
    return this.init(this.ep.double());
  }
  negate() {
    return this.init(this.ep.negate());
  }
  precompute(e, t) {
    return this.ep.precompute(e, t), this;
  }
}
function S0(s, e, t = {}) {
  if (typeof e != "function")
    throw new Error('"hash" function param is required');
  const n = e, i = t;
  ti(i, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    zip215: "boolean",
    mapToCurve: "function"
  });
  const { prehash: r } = i, { BASE: o, Fp: a, Fn: d } = s, c = n.outputLen, l = 2 * a.BYTES;
  if (c !== void 0 && (lr(c, "hash.outputLen"), c !== l))
    throw new Error(`hash.outputLen must be ${l}, got ${c}`);
  const u = i.randomBytes === void 0 ? _d : i.randomBytes, h = i.adjustScalarBytes === void 0 ? (S) => S : i.adjustScalarBytes, f = i.domain === void 0 ? (S, M, C) => {
    if (qn(C, "phflag"), M.length || C)
      throw new Error("Contexts/pre-hash are not supported");
    return S;
  } : i.domain;
  function m(S) {
    return d.create(Qt(S));
  }
  function g(S) {
    const M = L.secretKey;
    _e(S, L.secretKey, "secretKey");
    const C = _e(n(S), 2 * M, "hashedSecretKey"), R = h(C.slice(0, M)), U = C.slice(M, 2 * M), K = m(R);
    return { head: R, prefix: U, scalar: K };
  }
  function p(S) {
    const { head: M, prefix: C, scalar: R } = g(S), U = o.multiply(R), K = U.toBytes();
    return { head: M, prefix: C, scalar: R, point: U, pointBytes: K };
  }
  function y(S) {
    return p(S).pointBytes;
  }
  function k(S = Uint8Array.of(), ...M) {
    const C = ya(...M);
    return m(n(f(C, _e(S, void 0, "context"), !!r)));
  }
  function A(S, M, C = {}) {
    S = _e(S, void 0, "message"), r && (S = r(S));
    const { prefix: R, scalar: U, pointBytes: K } = p(M), ee = k(C.context, R, S), ie = o.multiply(ee).toBytes(), X = k(C.context, ie, K, S), me = d.create(ee + X * U);
    if (!d.isValid(me))
      throw new Error("sign failed: invalid s");
    const xe = ya(ie, d.toBytes(me));
    return _e(xe, L.signature, "result");
  }
  const F = {
    zip215: i.zip215
  };
  function j(S, M, C, R = F) {
    const { context: U } = R, K = R.zip215 === void 0 ? !!F.zip215 : R.zip215, ee = L.signature;
    S = _e(S, ee, "signature"), M = _e(M, void 0, "message"), C = _e(C, L.publicKey, "publicKey"), K !== void 0 && qn(K, "zip215"), r && (M = r(M));
    const ie = ee / 2, X = S.subarray(0, ie), me = Qt(S.subarray(ie, ee));
    let xe, sn, ts;
    try {
      xe = s.fromBytes(C, K), sn = s.fromBytes(X, K), ts = o.multiplyUnsafe(me);
    } catch {
      return !1;
    }
    if (!K && xe.isSmallOrder())
      return !1;
    const nn = k(U, X, C, M);
    return sn.add(xe.multiplyUnsafe(nn)).subtract(ts).clearCofactor().is0();
  }
  const Z = a.BYTES, L = {
    secretKey: Z,
    publicKey: Z,
    signature: 2 * Z,
    seed: Z
  };
  function q(S) {
    return S = S === void 0 ? u(L.seed) : S, _e(S, L.seed, "seed");
  }
  function $(S) {
    return Jy(S) && S.length === L.secretKey;
  }
  function te(S, M) {
    try {
      return !!s.fromBytes(S, M === void 0 ? F.zip215 : M);
    } catch {
      return !1;
    }
  }
  const W = {
    getExtendedPublicKey: p,
    randomSecretKey: q,
    isValidSecretKey: $,
    isValidPublicKey: te,
    /**
     * Converts ed public key to x public key. Uses formula:
     * - ed25519:
     *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
     *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
     * - ed448:
     *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
     *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
     */
    toMontgomery(S) {
      const { y: M } = s.fromBytes(S), C = L.publicKey, R = C === 32;
      if (!R && C !== 57)
        throw new Error("only defined for 25519 and 448");
      const U = R ? a.div(Se + M, Se - M) : a.div(M - Se, M + Se);
      return a.toBytes(U);
    },
    toMontgomerySecret(S) {
      const M = L.secretKey;
      _e(S, M);
      const C = n(S.subarray(0, M));
      return h(C).subarray(0, M);
    }
  };
  return Object.freeze(L), Object.freeze(W), Object.freeze({
    keygen: Ud(q, y),
    getPublicKey: y,
    sign: A,
    verify: j,
    utils: W,
    Point: s,
    lengths: L
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ps = BigInt(0), rs = BigInt(1), pn = BigInt(2);
function _0(s) {
  return ti(s, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function"
  }), Object.freeze({ ...s });
}
function k0(s) {
  const e = _0(s), { P: t, type: n, adjustScalarBytes: i, powPminus2: r, randomBytes: o } = e, a = n === "x25519";
  if (!a && n !== "x448")
    throw new Error("invalid type");
  const d = o === void 0 ? _d : o, c = a ? 255 : 448, l = a ? 32 : 56, u = BigInt(a ? 9 : 5), h = BigInt(a ? 121665 : 39081), f = a ? pn ** BigInt(254) : pn ** BigInt(447), m = a ? BigInt(8) * pn ** BigInt(251) - rs : BigInt(4) * pn ** BigInt(445) - rs, g = f + m + rs, p = (C) => pe(C, t), y = k(u);
  function k(C) {
    return Td(p(C), l);
  }
  function A(C) {
    const R = Xs(_e(C, l, "uCoordinate"));
    return a && (R[31] &= 127), p(Qt(R));
  }
  function F(C) {
    return Qt(i(Xs(_e(C, l, "scalar"))));
  }
  function j(C, R) {
    const U = te(A(R), F(C));
    if (U === Ps)
      throw new Error("invalid private or public key received");
    return k(U);
  }
  function Z(C) {
    return j(C, y);
  }
  const L = Z, q = j;
  function $(C, R, U) {
    const K = p(C * (R - U));
    return R = p(R - K), U = p(U + K), { x_2: R, x_3: U };
  }
  function te(C, R) {
    Wn("u", C, Ps, t), Wn("scalar", R, f, g);
    const U = R, K = C;
    let ee = rs, ie = Ps, X = C, me = rs, xe = Ps;
    for (let ts = BigInt(c - 1); ts >= Ps; ts--) {
      const nn = U >> ts & rs;
      xe ^= nn, { x_2: ee, x_3: X } = $(xe, ee, X), { x_2: ie, x_3: me } = $(xe, ie, me), xe = nn;
      const rn = ee + ie, on = p(rn * rn), si = ee - ie, Jr = p(si * si), eo = on - Jr, Xd = X + me, Yd = X - me, to = p(Yd * rn), so = p(Xd * si), no = to + so, io = to - so;
      X = p(no * no), me = p(K * p(io * io)), ee = p(on * Jr), ie = p(eo * (on + p(h * eo)));
    }
    ({ x_2: ee, x_3: X } = $(xe, ee, X)), { x_2: ie, x_3: me } = $(xe, ie, me);
    const sn = r(ie);
    return p(ee * sn);
  }
  const W = {
    secretKey: l,
    publicKey: l,
    seed: l
  }, S = (C) => (C = C === void 0 ? d(l) : C, _e(C, W.seed, "seed"), C), M = { randomSecretKey: S };
  return Object.freeze(W), Object.freeze(M), Object.freeze({
    keygen: Ud(S, L),
    getSharedSecret: q,
    getPublicKey: L,
    scalarMult: j,
    scalarMultBase: Z,
    utils: M,
    GuBytes: y.slice(),
    lengths: W
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const x0 = /* @__PURE__ */ BigInt(0), Hs = /* @__PURE__ */ BigInt(1), Ea = /* @__PURE__ */ BigInt(2), T0 = /* @__PURE__ */ BigInt(3), E0 = /* @__PURE__ */ BigInt(5), C0 = /* @__PURE__ */ BigInt(8), xs = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), Nd = {
  p: xs,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: C0,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
};
function Dd(s) {
  const e = BigInt(10), t = BigInt(20), n = BigInt(40), i = BigInt(80), r = xs, a = s * s % r * s % r, d = Ue(a, Ea, r) * a % r, c = Ue(d, Hs, r) * s % r, l = Ue(c, E0, r) * c % r, u = Ue(l, e, r) * l % r, h = Ue(u, t, r) * u % r, f = Ue(h, n, r) * h % r, m = Ue(f, i, r) * f % r, g = Ue(m, i, r) * f % r, p = Ue(g, e, r) * l % r;
  return { pow_p_5_8: Ue(p, Ea, r) * s % r, b2: a };
}
function Vd(s) {
  return s[0] &= 248, s[31] &= 127, s[31] |= 64, s;
}
const hr = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function $d(s, e) {
  const t = xs, n = pe(e * e * e, t), i = pe(n * n * e, t), r = Dd(s * i).pow_p_5_8;
  let o = pe(s * n * r, t);
  const a = pe(e * o * o, t), d = o, c = pe(o * hr, t), l = a === s, u = a === pe(-s, t), h = a === pe(-s * hr, t);
  return l && (o = d), (u || h) && (o = c), Vt(o, t) && (o = pe(-o, t)), { isValid: l || u, value: o };
}
const qt = /* @__PURE__ */ b0(Nd, { uvRatio: $d }), $t = qt.Fp, A0 = qt.Fn;
function B0(s) {
  return S0(qt, Yy, Object.assign({ adjustScalarBytes: Vd, zip215: !0 }, s));
}
const As = /* @__PURE__ */ B0({}), Yr = /* @__PURE__ */ (() => {
  const s = xs;
  return k0({
    P: s,
    type: "x25519",
    powPminus2: (e) => {
      const { pow_p_5_8: t, b2: n } = Dd(e);
      return pe(Ue(t, T0, s) * n, s);
    },
    adjustScalarBytes: Vd
  });
})(), Ca = hr, M0 = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), Aa = (s) => $d(Hs, s), I0 = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), O0 = (s) => $t.create(Qt(s) & I0);
class Oe extends v0 {
  // Do NOT change syntax: the following gymnastics is done,
  // because typescript strips comments, which makes bundlers disable tree-shaking.
  // prettier-ignore
  static BASE = new Oe(qt.BASE);
  // prettier-ignore
  static ZERO = new Oe(qt.ZERO);
  // prettier-ignore
  static Fp = $t;
  // prettier-ignore
  static Fn = A0;
  constructor(e) {
    super(e);
  }
  /**
   * Create one Ristretto255 point from affine Edwards coordinates.
   * This wraps the internal Edwards representative directly and is not a
   * canonical ristretto255 decoding path.
   * Use `toBytes()` / `fromBytes()` if canonical ristretto255 bytes matter.
   */
  static fromAffine(e) {
    return new Oe(qt.fromAffine(e));
  }
  assertSame(e) {
    if (!(e instanceof Oe))
      throw new Error("RistrettoPoint expected");
  }
  init(e) {
    return new Oe(e);
  }
  static fromBytes(e) {
    Be(e, 32);
    const { a: t, d: n } = Nd, i = xs, r = (F) => $t.create(F), o = O0(e);
    if (!s0($t.toBytes(o), e) || Vt(o, i))
      throw new Error("invalid ristretto255 encoding 1");
    const a = r(o * o), d = r(Hs + t * a), c = r(Hs - t * a), l = r(d * d), u = r(c * c), h = r(t * n * l - u), { isValid: f, value: m } = Aa(r(h * u)), g = r(m * c), p = r(m * g * h);
    let y = r((o + o) * g);
    Vt(y, i) && (y = r(-y));
    const k = r(d * p), A = r(y * k);
    if (!f || Vt(A, i) || k === x0)
      throw new Error("invalid ristretto255 encoding 2");
    return new Oe(new qt(y, k, Hs, A));
  }
  /**
   * Converts ristretto-encoded string to ristretto point.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
   * @param hex - Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
   */
  static fromHex(e) {
    return Oe.fromBytes(Ie(e));
  }
  /**
   * Encodes ristretto point to Uint8Array.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
   */
  toBytes() {
    let { X: e, Y: t, Z: n, T: i } = this.ep;
    const r = xs, o = (p) => $t.create(p), a = o(o(n + t) * o(n - t)), d = o(e * t), c = o(d * d), { value: l } = Aa(o(a * c)), u = o(l * a), h = o(l * d), f = o(u * h * i);
    let m;
    if (Vt(i * f, r)) {
      let p = o(t * Ca), y = o(e * Ca);
      e = p, t = y, m = o(u * M0);
    } else
      m = h;
    Vt(e * f, r) && (t = o(-t));
    let g = o((n - t) * m);
    return Vt(g, r) && (g = o(-g)), $t.toBytes(g);
  }
  /**
   * Compares two Ristretto points.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
   */
  equals(e) {
    this.assertSame(e);
    const { X: t, Y: n } = this.ep, { X: i, Y: r } = e.ep, o = (c) => $t.create(c), a = o(t * r) === o(n * i), d = o(n * r) === o(t * i);
    return a || d;
  }
  is0() {
    return this.equals(Oe.ZERO);
  }
}
Object.freeze(Oe.BASE);
Object.freeze(Oe.ZERO);
Object.freeze(Oe.prototype);
Object.freeze(Oe);
class Ba {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = !1;
  finished = !1;
  destroyed = !1;
  constructor(e, t) {
    if (Sr(e), Be(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const n = this.blockLen, i = new Uint8Array(n);
    i.set(t.length > n ? e.create().update(t).digest() : t);
    for (let r = 0; r < i.length; r++)
      i[r] ^= 54;
    this.iHash.update(i), this.oHash = e.create();
    for (let r = 0; r < i.length; r++)
      i[r] ^= 106;
    this.oHash.update(i), Je(i);
  }
  update(e) {
    return gs(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    gs(this), _r(e, this), this.finished = !0;
    const t = e.subarray(0, this.outputLen);
    this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: t, iHash: n, finished: i, destroyed: r, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = r, e.blockLen = o, e.outputLen = a, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const zd = /* @__PURE__ */ (() => {
  const s = ((e, t, n) => new Ba(e, t).update(n).digest());
  return s.create = (e, t) => new Ba(e, t), s;
})();
function R0(s, e, t) {
  return Sr(s), t === void 0 && (t = new Uint8Array(s.outputLen)), zd(s, t, e);
}
const Oi = /* @__PURE__ */ Uint8Array.of(0), Ma = /* @__PURE__ */ Uint8Array.of();
function P0(s, e, t, n = 32) {
  Sr(s), ft(n, "length"), Be(e, void 0, "prk");
  const i = s.outputLen;
  if (e.length < i)
    throw new Error('"prk" must be at least HashLen octets');
  if (n > 255 * i)
    throw new Error("Length must be <= 255*HashLen");
  const r = Math.ceil(n / i);
  t === void 0 ? t = Ma : Be(t, void 0, "info");
  const o = new Uint8Array(r * i), a = zd.create(s, e), d = a._cloneInto(), c = new Uint8Array(a.outputLen);
  for (let l = 0; l < r; l++)
    Oi[0] = l + 1, d.update(l === 0 ? Ma : c).update(t).update(Oi).digestInto(c), o.set(c, i * l), a._cloneInto(d);
  return a.destroy(), d.destroy(), Je(c, Oi), o.slice(0, n);
}
const F0 = (s, e, t, n, i) => P0(s, R0(s, e, t), n, i), Hd = ne("swarm.seal"), mn = new TextEncoder().encode("spotlight:sdp-seal:v1"), Ri = 5e4;
function L0() {
  const { secretKey: s, publicKey: e } = Yr.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: Ve(e) };
}
function jd(s, e, t) {
  const n = new Uint8Array(mn.length + e.length + t.length);
  return n.set(mn, 0), n.set(e, mn.length), n.set(t, mn.length + e.length), F0(Xy, s, void 0, n, 32);
}
function qd(s, e) {
  const t = Yr.getSharedSecret(s, e);
  if (t.every((n) => n === 0)) throw new Error("low-order X25519 public key");
  return t;
}
async function Wd(s, e) {
  return crypto.subtle.importKey("raw", s, "AES-GCM", !1, [e]);
}
async function fr(s, e) {
  const t = new TextEncoder().encode(e);
  if (t.length === 0 || t.length > Ri)
    throw Hd.error("sdp seal failed: size out of range", {
      bytes: t.length,
      max: Ri,
      to: Te(s)
    }), new Error(`sdp size ${t.length} outside (0, ${Ri}]`);
  const n = Ie(s), i = Yr.keygen(), r = jd(
    qd(i.secretKey, n),
    i.publicKey,
    n
  ), o = await Wd(r, "encrypt"), a = crypto.getRandomValues(new Uint8Array(12)), d = await crypto.subtle.encrypt({ name: "AES-GCM", iv: a }, o, t);
  return {
    epk: Ve(i.publicKey),
    iv: Ve(a),
    ct: Ve(new Uint8Array(d))
  };
}
async function pr(s, e) {
  try {
    const t = Ie(e.epk), n = jd(
      qd(s.secretKey, t),
      t,
      s.publicKey
    ), i = await Wd(n, "decrypt"), r = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Ie(e.iv) },
      i,
      Ie(e.ct)
    );
    return new TextDecoder().decode(r);
  } catch (t) {
    throw Hd.warn("sealed sdp did not open", {
      epk: Te(e.epk),
      self: Te(s.publicKeyHex),
      ctBytes: e.ct.length / 2,
      err: t
    }), t;
  }
}
function mr() {
  return { host: 0, srflx: 0, prflx: 0, relay: 0, other: 0, udp: 0, tcp: 0, total: 0 };
}
function gr(s, e, t) {
  switch (s.total += 1, e) {
    case "host":
    case "srflx":
    case "prflx":
    case "relay":
      s[e] += 1;
      break;
    default:
      s.other += 1;
  }
  const n = t?.toLowerCase();
  n === "udp" ? s.udp += 1 : n === "tcp" && (s.tcp += 1);
}
function yr(s) {
  const e = mr();
  if (!s) return e;
  const t = /^a=candidate:\S+ \d+ (\S+) \d+ \S+ \d+ typ (\S+)/gm;
  let n;
  for (; (n = t.exec(s)) !== null; )
    gr(e, n[2], n[1]);
  return e;
}
function Ys(s) {
  return {
    total: s.total,
    host: s.host,
    srflx: s.srflx,
    relay: s.relay,
    prflx: s.prflx,
    udp: s.udp,
    tcp: s.tcp
  };
}
function U0(s) {
  const e = [];
  for (const n of s) {
    const i = Array.isArray(n.urls) ? n.urls : [n.urls];
    for (const r of i) typeof r == "string" && e.push(r);
  }
  const t = (n) => e.filter((i) => i.startsWith(`${n}:`)).length;
  return { stun: t("stun"), turn: t("turn"), turns: t("turns"), urls: e };
}
function N0(s) {
  const e = s;
  return {
    type: s.type ?? D0(s.candidate, "typ"),
    protocol: s.protocol ?? null,
    address: s.address ?? null,
    port: s.port ?? null,
    relatedAddress: s.relatedAddress ?? null,
    url: e.url ?? null
  };
}
function D0(s, e) {
  const t = s.split(" "), n = t.indexOf(e);
  return n >= 0 && n + 1 < t.length ? t[n + 1] : null;
}
function V0(s) {
  const e = s;
  return {
    url: e.url ?? null,
    errorCode: e.errorCode ?? null,
    errorText: e.errorText ?? null,
    address: e.address ?? null,
    port: e.port ?? null
  };
}
function $0(s, e) {
  if (s === null && e === null) return null;
  if (s === "relay" || e === "relay") return "turn";
  const t = (n) => n === "srflx" || n === "prflx";
  return t(s) || t(e) ? "stun" : "direct";
}
function z0(s) {
  const e = /* @__PURE__ */ new Map();
  s.forEach((r) => e.set(r.id, r));
  const t = mr(), n = mr(), i = [];
  for (const r of e.values()) {
    const o = typeof r.candidateType == "string" ? r.candidateType : void 0, a = typeof r.protocol == "string" ? r.protocol : void 0;
    if (r.type === "local-candidate") gr(t, o, a);
    else if (r.type === "remote-candidate") gr(n, o, a);
    else if (r.type === "candidate-pair") {
      const d = typeof r.localCandidateId == "string" ? e.get(r.localCandidateId) : void 0, c = typeof r.remoteCandidateId == "string" ? e.get(r.remoteCandidateId) : void 0;
      i.push({
        state: typeof r.state == "string" ? r.state : "unknown",
        local: Ia(d),
        remote: Ia(c),
        nominated: r.nominated === !0,
        requestsSent: typeof r.requestsSent == "number" ? r.requestsSent : 0,
        responsesReceived: typeof r.responsesReceived == "number" ? r.responsesReceived : 0
      });
    }
  }
  return { local: Ys(t), remote: Ys(n), pairs: i };
}
function Ia(s) {
  if (!s) return "?";
  const e = typeof s.candidateType == "string" ? s.candidateType : "?", t = typeof s.protocol == "string" ? s.protocol : "?";
  return `${e}/${t}`;
}
const ce = ne("swarm.peer"), Oa = new TextEncoder(), H0 = 3, j0 = Dc / 4;
class wr {
  /** Remote peer's claimed address (v1 trusts the claim — plan decision #4). */
  addr;
  pc;
  ctrl;
  bulk;
  handlers = null;
  gatherTimeoutMs;
  connectTimeoutMs;
  connectTimer = null;
  disconnectTimer = null;
  openFired = !1;
  closeFired = !1;
  closed = !1;
  closeReasonValue = null;
  sentBulkBytes = 0;
  openWaiters = [];
  createdAtMs = Date.now();
  invalidCap = re(H0);
  /** Result of the last `linkStats()` call that found a selected pair. */
  lastLink = null;
  openedAtMs = null;
  /** Payload bytes moved on both channels, for the `peer closed` record. */
  bytesIn = 0;
  bytesOut = 0;
  constructor(e, t) {
    this.addr = e, this.gatherTimeoutMs = t?.gatherTimeoutMs ?? Hf, this.connectTimeoutMs = t?.connectTimeoutMs ?? jf;
    const n = t?.iceServers ?? zy(), i = $y() ? "relay" : "all";
    this.pc = new RTCPeerConnection({ iceServers: n, iceTransportPolicy: i }), ce.debug("peer created", {
      peer: b(e),
      policy: i,
      ice: U0(n)
    }), this.pc.onicecandidate = (o) => {
      o.candidate ? ce.debug("local candidate", {
        peer: b(this.addr),
        ...N0(o.candidate)
      }) : ce.debug("local candidates complete", {
        peer: b(this.addr),
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.pc.onicecandidateerror = (o) => {
      ce.warn("ice candidate error", { peer: b(this.addr), ...V0(o) });
    }, this.pc.onicegatheringstatechange = () => {
      ce.debug("ice gathering state", {
        peer: b(this.addr),
        state: this.pc.iceGatheringState,
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.ctrl = this.pc.createDataChannel("ctrl", { negotiated: !0, id: 0, ordered: !0 }), this.bulk = this.pc.createDataChannel("bulk", { negotiated: !0, id: 1, ordered: !1 }), this.bulk.binaryType = "arraybuffer", this.bulk.bufferedAmountLowThreshold = j0, this.ctrl.onmessage = (o) => {
      if (typeof o.data != "string") {
        this.reportInvalid("binary-on-ctrl"), this.handlers?.onInvalidCtrl?.("binary-on-ctrl");
        return;
      }
      this.bytesIn += Oa.encode(o.data).byteLength;
      const a = vp(o.data);
      a.kind === "ok" ? this.handlers?.onCtrl(a.msg) : a.kind === "invalid" && (this.reportInvalid(a.error), this.handlers?.onInvalidCtrl?.(a.error));
    }, this.bulk.onmessage = (o) => {
      const a = o.data;
      if (!(a instanceof ArrayBuffer)) {
        this.reportInvalid("non-binary-on-bulk"), this.handlers?.onInvalidSlice?.("non-binary-on-bulk");
        return;
      }
      this.bytesIn += a.byteLength;
      const d = kp(new Uint8Array(a));
      d.kind === "ok" ? this.handlers?.onSlice(d.frame) : (this.reportInvalid(d.error), this.handlers?.onInvalidSlice?.(d.error));
    }, this.bulk.onbufferedamountlow = () => this.handlers?.onBulkDrain?.();
    const r = () => {
      if (!(this.openFired || this.closed) && this.ctrl.readyState === "open" && this.bulk.readyState === "open") {
        this.openFired = !0, this.openedAtMs = Date.now(), ce.info("channels open", {
          peer: b(this.addr),
          elapsedMs: Date.now() - this.createdAtMs
        }), this.clearConnectTimer(), this.linkStats().then((o) => {
          ce.info("selected ice pair", { peer: b(this.addr), ...o });
        });
        for (const o of this.openWaiters.splice(0)) o.resolve();
        this.handlers?.onOpen?.();
      }
    };
    this.ctrl.onopen = r, this.bulk.onopen = r, this.pc.onconnectionstatechange = () => {
      const o = this.pc.connectionState;
      if (ce.info("connection state", { peer: b(this.addr), state: o }), o === "failed" || o === "closed") {
        this.closeReasonValue ??= o === "failed" ? "ice-failed" : "local", this.close();
        return;
      }
      o === "disconnected" ? this.armDisconnectTimer() : this.clearDisconnectTimer();
    }, this.pc.oniceconnectionstatechange = () => {
      const o = this.pc.iceConnectionState;
      ce.debug("ice state", { peer: b(this.addr), state: o }), (o === "failed" || o === "disconnected") && this.dumpIceStats(`ice ${o}`);
    };
  }
  /** One line per bad-frame reason on this link, then a count only. */
  reportInvalid(e) {
    this.invalidCap.allow(e) && ce.warn("bad frame dropped", {
      peer: b(this.addr),
      error: e,
      seen: this.invalidCap.count(e)
    });
  }
  /** Wire the message/lifecycle handlers. Must be called before the link is
   *  relied on; messages arriving with no handlers are dropped. */
  setHandlers(e) {
    this.handlers = e;
  }
  // ── Non-trickle negotiation ──────────────────────────────────────────────
  /** Offerer side: local description with all ICE candidates embedded. */
  async createOffer() {
    if (this.closed) throw new Error(`peer ${this.addr} closed`);
    this.armConnectTimer();
    const e = await this.pc.createOffer();
    await this.pc.setLocalDescription(e), await Ra(this.pc, this.gatherTimeoutMs);
    const t = this.pc.localDescription ?? e;
    return this.logLocalSdp("offer", t), t;
  }
  /** Answerer side: consume the offer, return a fully-gathered answer. */
  async acceptOffer(e) {
    if (this.closed) throw new Error(`peer ${this.addr} closed`);
    this.armConnectTimer(), this.logRemoteSdp("offer", e), await this.pc.setRemoteDescription(e);
    const t = await this.pc.createAnswer();
    await this.pc.setLocalDescription(t), await Ra(this.pc, this.gatherTimeoutMs);
    const n = this.pc.localDescription ?? t;
    return this.logLocalSdp("answer", n), n;
  }
  /** Offerer side, step 2: consume the remote answer; ICE begins. */
  async acceptAnswer(e) {
    this.logRemoteSdp("answer", e), await this.pc.setRemoteDescription(e);
  }
  /** Candidate mix we are about to send. Zero srflx → STUN never answered
   *  inside the gather cap. Zero relay → expected unless VITE_TURN_* is set;
   *  with a relay configured, TURN never allocated. */
  logLocalSdp(e, t) {
    const n = yr(t.sdp), i = {
      peer: b(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      gatherState: this.pc.iceGatheringState,
      ...Ys(n)
    };
    n.total === 0 ? ce.warn("local sdp has no ice candidates", i) : n.srflx === 0 && n.relay === 0 ? ce.warn("local sdp has host candidates only", i) : ce.info("local sdp candidates", i);
  }
  /** Candidate mix the remote sent us — the other half of the picture. */
  logRemoteSdp(e, t) {
    const n = yr(t.sdp), i = {
      peer: b(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      ...Ys(n)
    };
    n.total === 0 ? ce.warn("remote sdp has no ice candidates", i) : n.srflx === 0 && n.relay === 0 ? ce.warn("remote sdp has host candidates only", i) : ce.info("remote sdp candidates", i);
  }
  /** Candidate pairs and their check states at the moment a link dies. */
  async dumpIceStats(e) {
    if (this.closed) return;
    let t;
    try {
      t = await this.pc.getStats();
    } catch (i) {
      ce.debug("ice stats unavailable", { peer: b(this.addr), reason: e, err: i });
      return;
    }
    const n = z0(t);
    ce.warn("ice pairs", {
      peer: b(this.addr),
      reason: e,
      iceState: this.pc.iceConnectionState,
      connState: this.pc.connectionState,
      gatherState: this.pc.iceGatheringState,
      local: n.local,
      remote: n.remote,
      pairs: n.pairs
    });
  }
  /** Resolves when both channels are open; rejects on close/timeout. */
  waitOpen() {
    return this.openFired ? Promise.resolve() : this.closed ? Promise.reject(new Error(`peer ${this.addr} closed`)) : new Promise((e, t) => {
      this.openWaiters.push({ resolve: e, reject: t });
    });
  }
  // ── Sending ──────────────────────────────────────────────────────────────
  sendCtrl(e) {
    if (this.ctrl.readyState !== "open") return !1;
    try {
      const t = bp(e);
      return this.ctrl.send(t), this.bytesOut += Oa.encode(t).byteLength, !0;
    } catch {
      return !1;
    }
  }
  sendSlice(e) {
    if (this.bulk.readyState !== "open") return !1;
    try {
      const t = _p(e);
      return this.bulk.send(t.buffer), this.sentBulkBytes += t.byteLength, this.bytesOut += t.byteLength, !0;
    } catch {
      return !1;
    }
  }
  // ── State ────────────────────────────────────────────────────────────────
  get isOpen() {
    return this.openFired && !this.closed;
  }
  /** Why the link closed; null while it is not closed. */
  get closeReason() {
    return this.closeReasonValue;
  }
  get connectionState() {
    return this.pc.connectionState;
  }
  /** Backpressure surface for the serve queue (plan §5). */
  get bulkBufferedAmount() {
    return this.bulk.bufferedAmount;
  }
  /** Bytes handed to the bulk channel, in bufferedAmount's units (encoded
   *  frames). Sent minus Δbuffered is what the link drained. */
  get bulkSentBytes() {
    return this.sentBulkBytes;
  }
  /** Read the selected ICE candidate pair from WebRTC stats: link path,
   *  candidate types, relay details and measured RTT. Best-effort — browsers
   *  differ in how they mark the active pair, and a closed pc reports nulls. */
  async linkStats() {
    const e = {
      path: null,
      candidateType: null,
      remoteCandidateType: null,
      relayProtocol: null,
      relayUrl: null,
      rttMs: null
    };
    if (this.closed) return e;
    let t;
    try {
      t = await this.pc.getStats();
    } catch {
      return e;
    }
    const n = /* @__PURE__ */ new Map();
    t.forEach((u) => n.set(u.id, u));
    let i;
    for (const u of n.values())
      if (u.type === "transport" && typeof u.selectedCandidatePairId == "string" && (i = n.get(u.selectedCandidatePairId), i))
        break;
    if (!i) {
      for (const u of n.values())
        if (u.type === "candidate-pair" && u.state === "succeeded" && (u.selected === !0 || u.nominated === !0)) {
          i = u;
          break;
        }
    }
    if (!i) return e;
    const r = typeof i.localCandidateId == "string" ? n.get(i.localCandidateId) : void 0, o = typeof i.remoteCandidateId == "string" ? n.get(i.remoteCandidateId) : void 0, a = (u) => typeof u == "string" ? u : null, d = a(r?.candidateType), c = a(o?.candidateType), l = {
      path: $0(d, c),
      candidateType: d,
      remoteCandidateType: c,
      relayProtocol: a(r?.relayProtocol),
      relayUrl: a(r?.url),
      rttMs: typeof i.currentRoundTripTime == "number" ? Math.round(i.currentRoundTripTime * 1e3) : null
    };
    return this.lastLink = l, l;
  }
  close() {
    if (!this.closed) {
      this.closed = !0, this.closeReasonValue ??= "local", ce.info("peer closed", {
        peer: b(this.addr),
        closeReason: this.closeReasonValue,
        wasOpen: this.openFired,
        state: this.pc.connectionState,
        elapsedMs: Date.now() - this.createdAtMs,
        path: this.lastLink?.path ?? null,
        openMs: this.openedAtMs === null ? null : Date.now() - this.openedAtMs,
        bytesIn: this.bytesIn,
        bytesOut: this.bytesOut,
        rttMs: this.lastLink?.rttMs ?? null
      }), this.clearConnectTimer(), this.clearDisconnectTimer();
      for (const e of this.openWaiters.splice(0))
        e.reject(new Error(`peer ${this.addr} closed before open`));
      try {
        this.ctrl.close(), this.bulk.close();
      } catch {
      }
      this.pc.close(), this.closeFired || (this.closeFired = !0, this.handlers?.onClose?.());
    }
  }
  armConnectTimer() {
    this.connectTimer || this.openFired || this.closed || (this.connectTimer = setTimeout(() => {
      this.connectTimer = null, this.openFired || (ce.warn("connect timed out before both channels opened", {
        peer: b(this.addr),
        timeoutMs: this.connectTimeoutMs,
        iceState: this.pc.iceConnectionState,
        connState: this.pc.connectionState
      }), this.closeReasonValue ??= "connect-timeout", this.dumpIceStats("connect timeout").finally(() => this.close()));
    }, this.connectTimeoutMs));
  }
  clearConnectTimer() {
    this.connectTimer && (clearTimeout(this.connectTimer), this.connectTimer = null);
  }
  armDisconnectTimer() {
    this.disconnectTimer || this.closed || (this.disconnectTimer = setTimeout(() => {
      this.disconnectTimer = null, !(this.closed || this.pc.connectionState !== "disconnected") && (ce.warn("link stayed disconnected past the grace — closing", {
        peer: b(this.addr),
        state: this.pc.connectionState,
        graceMs: $o
      }), this.closeReasonValue ??= "disconnected", this.close());
    }, $o));
  }
  clearDisconnectTimer() {
    this.disconnectTimer && (clearTimeout(this.disconnectTimer), this.disconnectTimer = null);
  }
}
function Ra(s, e) {
  if (s.iceGatheringState === "complete") return Promise.resolve();
  const t = Date.now();
  return new Promise((n) => {
    const i = () => {
      s.removeEventListener("icegatheringstatechange", r), clearTimeout(o);
      const a = s.iceGatheringState, d = {
        elapsedMs: Date.now() - t,
        state: a,
        timeoutMs: e,
        ...Ys(yr(s.localDescription?.sdp))
      };
      a === "complete" ? ce.debug("ice gathering done", d) : ce.warn("ice gathering cut by timeout", d), n();
    }, r = () => {
      s.iceGatheringState === "complete" && i();
    };
    s.addEventListener("icegatheringstatechange", r);
    const o = setTimeout(i, e);
  });
}
const ve = ne("swarm.join"), q0 = new TextEncoder();
function Pi(s) {
  return s === void 0 ? 0 : q0.encode(s).length;
}
class W0 {
  constructor(e) {
    this.opts = e, this.staleMs = e.staleMs ?? 6e4;
  }
  unsubscribe = null;
  /** Latest processed join timestamp per viewer (SignalFilter semantics). */
  lastJoinTs = /* @__PURE__ */ new Map();
  /** Viewers with a negotiation currently in flight, by the peer answering
   *  them — so a newer join can close exactly that peer and take its place. */
  pending = /* @__PURE__ */ new Map();
  /** Peers closed because a newer join from the same viewer took over;
   *  their `answer()` ends as an abandonment, not a failure. */
  superseded = /* @__PURE__ */ new WeakSet();
  /** Open answers by viewer. An answer leaves when its link opens or fails,
   *  when a newer join takes over, or when it is too old for the board. */
  board = /* @__PURE__ */ new Map();
  /** A board submit is in flight. */
  boardBusy = !1;
  /** The board changed: one more submit runs when the current one ends. */
  nextRound = null;
  staleMs;
  /** TEST HOOK (the JOINFAIL spec): close each answering peer right after
   *  the board with its answer is submitted, so the joiner's link can never open. */
  testFailAnsweredJoinsOn = !1;
  /** Viewers mid-negotiation right now. Anything that would disturb this
   *  topic's subscription must wait for this to be 0 — a reopen between the
   *  join and the welcome strands the viewer on "Connecting…". */
  get inFlight() {
    return this.pending.size;
  }
  start() {
    this.unsubscribe || (this.unsubscribe = this.opts.transport.subscribe((e) => {
      if (e.type !== "swarm-join") return;
      if (e.from === this.opts.selfAddr) {
        ve.debug("join dropped: from self", { from: b(e.from) });
        return;
      }
      if (e.timestamp < Date.now() - this.staleMs) {
        ve.warn("join dropped: stale", {
          ageMs: Date.now() - e.timestamp,
          staleMs: this.staleMs
        });
        return;
      }
      const t = Rp(e, Ip);
      if (!t) {
        ve.debug("join dropped: bad payload", { from: b(e.from) });
        return;
      }
      if (t.responder !== this.opts.selfAddr) {
        ve.debug("join dropped: responder mismatch", {
          joinResponder: b(t.responder),
          self: b(this.opts.selfAddr)
        });
        return;
      }
      const n = this.lastJoinTs.get(t.viewerAddress);
      if (n !== void 0 && e.timestamp <= n) {
        ve.warn("join dropped: replay", {
          viewer: b(t.viewerAddress),
          envTs: e.timestamp,
          lastTs: n
        });
        return;
      }
      const i = this.pending.get(t.viewerAddress);
      i && (ve.warn("join supersedes an answer still in flight", {
        viewer: b(t.viewerAddress),
        envTs: e.timestamp,
        lastTs: n
      }), this.superseded.add(i), i.close(), this.pending.delete(t.viewerAddress), this.board.delete(t.viewerAddress)), this.lastJoinTs.set(t.viewerAddress, e.timestamp), ve.info("join accepted", {
        viewer: b(t.viewerAddress),
        name: t.viewerName
      }), this.answer(t);
    }));
  }
  stop() {
    this.unsubscribe?.(), this.unsubscribe = null;
  }
  testFailAnsweredJoins(e) {
    this.testFailAnsweredJoinsOn = e, ve.warn("test hook set answered-join failure", { on: e });
  }
  async answer(e) {
    const n = (this.opts.createPeer ?? ((d, c) => new wr(d, c)))(e.viewerAddress, this.opts.peerOpts);
    this.pending.set(e.viewerAddress, n);
    const i = Date.now(), r = b(e.viewerAddress);
    let o = "open-offer", a = null;
    try {
      const d = await pr(this.opts.boxKey, e.sealedSdp);
      ve.debug("offer opened", { viewer: r, sdpBytes: Pi(d) }), o = "accept-offer";
      const c = await n.acceptOffer({ type: "offer", sdp: d });
      this.throwIfSuperseded(n), ve.debug("offer accepted", { viewer: r, sdpBytes: Pi(c.sdp) }), o = "submit-welcome";
      const l = await fr(e.boxPub, c.sdp ?? "");
      this.throwIfSuperseded(n), a = {
        at: Date.now(),
        answer: {
          to: e.viewerAddress,
          sealedSdp: l,
          sdpType: "answer",
          // The joiner dials these over relayed SDP to reach
          // TARGET_DEGREE without more statements.
          seeds: this.opts.getSeeds().filter((h) => h.addr !== e.viewerAddress),
          edgeSeq: this.opts.getEdgeSeq(),
          epoch: this.opts.getEpoch()
        }
      }, this.board.set(e.viewerAddress, a), ve.info("answer on the board", { to: r, sdpBytes: Pi(c.sdp) });
      const u = Date.now();
      await this.publishBoard(), ve.debug("board with the answer submitted", { to: r, latencyMs: Date.now() - u }), this.testFailAnsweredJoinsOn && (ve.warn("test hook closed the answered join link", { viewer: r }), n.close()), o = "wait-open", await n.waitOpen(), ve.info("viewer channels open", { viewer: r, totalMs: Date.now() - i }), this.opts.onPeer(n, e.viewerAddress, e.viewerName);
    } catch (d) {
      this.superseded.has(n) ? ve.info("join answer abandoned: a newer join took over", { viewer: r, stage: o }) : o === "open-offer" ? ve.error("join answer failed: offer did not open", { viewer: r, err: d }) : ve.error("join answer failed", { viewer: r, stage: o, err: d }), n.close();
    } finally {
      this.pending.get(e.viewerAddress) === n && this.pending.delete(e.viewerAddress), a && this.board.get(e.viewerAddress) === a && this.board.delete(e.viewerAddress);
    }
  }
  /** Resolves when a board submit that starts after this call has landed.
   *  At most one submit is in flight, so a board minted earlier can never
   *  land after a newer one. */
  publishBoard() {
    if (!this.nextRound) {
      let t, n;
      const i = new Promise((r, o) => {
        t = r, n = o;
      });
      this.nextRound = { done: i, resolve: t, reject: n };
    }
    const { done: e } = this.nextRound;
    return this.boardBusy || this.flushBoard(), e;
  }
  async flushBoard() {
    for (this.boardBusy = !0; this.nextRound; ) {
      const e = this.nextRound;
      this.nextRound = null;
      const t = this.boardAnswers(Date.now());
      ve.info("submitting welcome board", { answers: t.length });
      try {
        await this.opts.transport.submit({
          type: "welcome-board",
          from: this.opts.selfAddr,
          timestamp: Date.now(),
          payload: { answers: t }
        }), e.resolve();
      } catch (n) {
        e.reject(n);
      }
    }
    this.boardBusy = !1;
  }
  /** Drop answers older than the board expiry, then the oldest past the cap. */
  boardAnswers(e) {
    for (const [n, i] of this.board)
      e - i.at > Vc * 1e3 && this.board.delete(n);
    const t = [...this.board.entries()].sort((n, i) => n[1].at - i[1].at);
    for (const [n] of t.splice(0, Math.max(0, t.length - $c)))
      this.board.delete(n);
    return t.map(([, n]) => n.answer);
  }
  throwIfSuperseded(e) {
    if (this.superseded.has(e)) throw new Error("superseded by a newer join");
  }
}
const G0 = ne("swarm.seal"), Z0 = 5, Pa = re(Z0);
function Mt(s, e, t) {
  const n = `${s}:${e}`;
  return Pa.allow(n) && G0.warn(`${s} verification failed: ${e}`, { ...t, seen: Pa.count(n) }), !1;
}
function K0() {
  const { secretKey: s, publicKey: e } = As.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: Ve(e) };
}
function Gd(s) {
  return Ve(Yn(s, { dkLen: 32 }));
}
function Qr(s) {
  const e = new Uint8Array(64), t = new DataView(e.buffer);
  return t.setBigUint64(0, BigInt(s.epoch), !0), t.setUint32(8, s.seq, !0), t.setBigUint64(12, BigInt(s.tsUs), !0), t.setBigUint64(20, BigInt(s.durUs), !0), t.setUint32(28, s.size, !0), e.set(Ie(s.hash), 32), e;
}
function X0(s, e, t) {
  const n = {
    epoch: t,
    seq: e.seq,
    tsUs: e.tsUs,
    durUs: e.durUs,
    size: e.payload.length,
    hash: Gd(e.payload)
  }, i = Ve(As.sign(Qr(n), s.secretKey));
  return { ...n, sig: i };
}
function Y0(s, e) {
  try {
    return As.verify(Ie(e.sig), Qr(e), Ie(s)) || Mt("chunk meta", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Mt("chunk meta", "malformed key or signature", { seq: e.seq });
  }
}
function Q0(s, e, t) {
  try {
    return t.length !== e.size ? Mt("chunk", "wrong size", { seq: e.seq, got: t.length, want: e.size }) : Gd(t) !== e.hash ? Mt("chunk", "hash mismatch", { seq: e.seq, bytes: t.length }) : As.verify(Ie(e.sig), Qr(e), Ie(s)) || Mt("chunk", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Mt("chunk", "malformed key or signature", { seq: e.seq });
  }
}
function Zd(s) {
  const e = new Uint8Array(12), t = new DataView(e.buffer);
  return e.set([69, 78, 68, 33], 0), t.setBigUint64(4, BigInt(s), !0), e;
}
function J0(s, e) {
  return Ve(As.sign(Zd(e), s.secretKey));
}
function ew(s, e, t) {
  try {
    return As.verify(Ie(t), Zd(e), Ie(s)) || Mt("stream end", "bad signature", { epoch: e });
  } catch {
    return Mt("stream end", "malformed key or signature", { epoch: e });
  }
}
const gn = ne("swarm.chunk"), Fa = 5, tw = 25;
class sw {
  chunks = /* @__PURE__ */ new Map();
  capacity;
  currentEpoch = null;
  /** Highest seq ever stored this epoch, -1 when empty. */
  maxSeq = -1;
  rejectCap = re(Fa);
  missCap = re(Fa);
  storedSinceRollup = 0;
  evictedSinceRollup = 0;
  constructor(e = er) {
    if (e < 1) throw new Error("capacity must be >= 1");
    this.capacity = e;
  }
  get epoch() {
    return this.currentEpoch;
  }
  /** Highest stored seq, -1 when empty. */
  get edgeSeq() {
    return this.maxSeq;
  }
  /** Lowest retained seq, -1 when empty. */
  get lowestSeq() {
    if (this.chunks.size === 0) return -1;
    let e = 1 / 0;
    for (const t of this.chunks.keys()) t < e && (e = t);
    return e;
  }
  get size() {
    return this.chunks.size;
  }
  /** Wipe everything and re-key to a new stream session (host re-go-live). */
  reset(e) {
    gn.info("store reset", { epoch: e, from: this.currentEpoch, dropped: this.chunks.size }), this.chunks.clear(), this.currentEpoch = e, this.maxSeq = -1, this.rejectCap.reset(), this.missCap.reset(), this.storedSinceRollup = 0, this.evictedSinceRollup = 0;
  }
  /** One line per reject reason while it is new, then a count only. */
  rejected(e, t) {
    return this.rejectCap.allow(e) && gn.debug(`chunk rejected: ${e}`, { seq: t, epoch: this.currentEpoch, size: this.chunks.size }), !1;
  }
  /**
   * Insert a verified chunk. Returns true if newly stored; false when it's a
   * duplicate, from the wrong epoch, or already evicted-out-of-window (older
   * than edge - capacity).
   */
  insert(e) {
    const { meta: t } = e;
    if (this.currentEpoch === null && (this.currentEpoch = t.epoch), t.epoch !== this.currentEpoch) return this.rejected("wrong epoch", t.seq);
    if (this.chunks.has(t.seq)) return this.rejected("duplicate", t.seq);
    if (this.maxSeq >= 0 && t.seq <= this.maxSeq - this.capacity)
      return this.rejected("out of window", t.seq);
    this.chunks.set(t.seq, e), t.seq > this.maxSeq && (this.maxSeq = t.seq);
    const n = this.maxSeq - this.capacity;
    for (const i of this.chunks.keys())
      i <= n && (this.chunks.delete(i), this.evictedSinceRollup++);
    return this.storedSinceRollup++, this.storedSinceRollup >= tw && (gn.debug("chunks stored", {
      stored: this.storedSinceRollup,
      evicted: this.evictedSinceRollup,
      edgeSeq: this.maxSeq,
      lowestSeq: this.lowestSeq,
      size: this.chunks.size
    }), this.storedSinceRollup = 0, this.evictedSinceRollup = 0), !0;
  }
  has(e) {
    return this.chunks.has(e);
  }
  get(e) {
    const t = this.chunks.get(e);
    return !t && this.missCap.allow() && gn.debug("chunk requested but missing", {
      seq: e,
      lowestSeq: this.lowestSeq,
      edgeSeq: this.maxSeq,
      misses: this.missCap.count()
    }), t ?? null;
  }
  seqs() {
    return [...this.chunks.keys()].sort((e, t) => e - t);
  }
  /** HAVE window for hello/summary messages. */
  summary() {
    const e = this.lowestSeq;
    return e < 0 ? { base: 0, bitmapHex: "" } : Sp(e, this.chunks.keys(), this.capacity);
  }
}
const nw = 2;
class iw {
  votes = /* @__PURE__ */ new Map();
  /** `addr`'s hello named `epoch`. A newer vote replaces its older one; an
   *  older one is ignored. */
  record(e, t, n) {
    const i = this.votes.get(e);
    i && i.epoch > t || this.votes.set(e, { epoch: t, isHost: n });
  }
  /** The neighbor left — its vote goes with it. */
  forget(e) {
    this.votes.delete(e);
  }
  /**
   * The epoch above `currentEpoch` that the host link advertises; failing
   * that, the newest one that at least EPOCH_QUORUM distinct non-host
   * neighbors advertise — else null. The host link wins even against a
   * newer quorum: it is the stream we are attached to, and two colluding
   * neighbors must not be able to talk over it. Nothing at or below
   * `currentEpoch` qualifies, so once an epoch is adopted the same votes
   * cannot fire it again.
   */
  decide(e) {
    const t = /* @__PURE__ */ new Map();
    let n = null;
    for (const [r, o] of this.votes) {
      if (o.epoch <= e) continue;
      if (o.isHost) {
        (!n || o.epoch > n.epoch) && (n = { epoch: o.epoch, voters: [r], viaHost: !0 });
        continue;
      }
      const a = t.get(o.epoch) ?? [];
      a.push(r), t.set(o.epoch, a);
    }
    if (n) return n;
    let i = null;
    for (const [r, o] of t)
      o.length < nw || (!i || r > i.epoch) && (i = { epoch: r, voters: o, viaHost: !1 });
    return i;
  }
}
const Zn = ne("swarm.gossip"), rw = 50, Kd = 3;
class ow {
  /** Map preserves insertion order → oldest entry is first (LRU eviction). */
  seen = /* @__PURE__ */ new Map();
  capacity;
  ttlMs;
  duplicatesSinceRollup = 0;
  evictCap = re(1);
  constructor(e) {
    this.capacity = e?.capacity ?? Nf, this.ttlMs = e?.ttlMs ?? Df;
  }
  /**
   * True exactly once per id within the TTL: the caller should process and
   * re-forward the message. False → duplicate, drop silently.
   */
  firstSight(e, t) {
    const n = this.seen.get(e), i = n !== void 0 && t - n < this.ttlMs;
    if (this.seen.delete(e), this.seen.set(e, t), this.seen.size > this.capacity) {
      const r = this.seen.keys().next().value;
      r !== void 0 && this.seen.delete(r), this.evictCap.allow() && Zn.debug("dedup table at capacity", { capacity: this.capacity });
    }
    return i && (this.duplicatesSinceRollup++, this.duplicatesSinceRollup >= rw && (Zn.debug("flood duplicates dropped", {
      dropped: this.duplicatesSinceRollup,
      tracked: this.seen.size
    }), this.duplicatesSinceRollup = 0)), !i;
  }
  get size() {
    return this.seen.size;
  }
}
class aw {
  peers = /* @__PURE__ */ new Map();
  ttlMs;
  expiryCap = re(Kd);
  constructor(e) {
    this.ttlMs = e?.ttlMs ?? Lf;
  }
  touch(e, t, n, i) {
    this.peers.set(e, { addr: e, name: t, ts: n, lastSeenMs: i });
  }
  remove(e) {
    this.peers.delete(e);
  }
  /** Peers seen within the TTL. Prunes expired entries as a side effect. */
  live(e) {
    const t = [];
    for (const [n, i] of this.peers)
      e - i.lastSeenMs >= this.ttlMs ? (this.peers.delete(n), this.expiryCap.allow() && Zn.debug("presence expired", {
        peer: b(n),
        quietMs: e - i.lastSeenMs,
        expired: this.expiryCap.count()
      })) : t.push(i);
    return t;
  }
  liveCount(e) {
    return this.live(e).length;
  }
}
class cw {
  constructor(e, t, n = 1e3) {
    this.senderCap = e, this.aggregateCap = t, this.windowMs = n;
  }
  perSender = /* @__PURE__ */ new Map();
  aggregate = [];
  capReported = re(Kd);
  /** True if the message is within budget (and counts it), false → drop. */
  allow(e, t) {
    const n = t - this.windowMs;
    if (this.aggregate = this.aggregate.filter((r) => r > n), this.aggregate.length >= this.aggregateCap)
      return this.report("aggregate", e, this.aggregateCap), !1;
    const i = (this.perSender.get(e) ?? []).filter((r) => r > n);
    return i.length >= this.senderCap ? (this.perSender.set(e, i), this.report("sender", e, this.senderCap), !1) : (i.push(t), this.perSender.set(e, i), this.aggregate.push(t), !0);
  }
  report(e, t, n) {
    const i = `${e}:${t}`;
    this.capReported.allow(i) && Zn.warn("flood dropped: over the rate cap", {
      scope: e,
      sender: b(t),
      cap: n,
      windowMs: this.windowMs
    });
  }
}
const ge = ne("swarm.book"), dw = 3, lw = 0.3, uw = 0.5, hw = 0.2, fw = 1e6, pw = 0.2;
function os(s, e) {
  return s + lw * (e - s);
}
class La {
  neighbors = /* @__PURE__ */ new Map();
  candidates = /* @__PURE__ */ new Map();
  /** When each pooled candidate was last offered (PEX or welcome seed). */
  candidateSeenAt = /* @__PURE__ */ new Map();
  selfAddr;
  minDegree;
  targetDegree;
  maxDegree;
  strikeLimit;
  candidatePoolCap;
  hostAddr;
  poolFullCap = re(dw);
  dialCapLog = re(5);
  /** No replacement before this (cooldown after one, hold after an epoch reset). */
  replaceHoldUntilMs = 0;
  /** Addresses refused from the pool until the time given (scoring prunes). */
  bannedUntil = /* @__PURE__ */ new Map();
  keptCap = re(3);
  /** Distinct targets whose outbound dial was answered but never opened,
   *  counted while a host link was up. A link to another viewer opening, or
   *  the degree reaching 0, clears it. */
  failedTargets = /* @__PURE__ */ new Set();
  /** No mesh dials before this while a host link is open (0 = not paused). */
  dialPausedUntilMs = 0;
  /** Last relayOnly verdict, so the log line fires on a flip only. */
  relayOnlyLogged = !1;
  constructor(e, t) {
    this.selfAddr = e, this.minDegree = t?.minDegree ?? uf, this.targetDegree = t?.targetDegree ?? hf, this.maxDegree = t?.maxDegree ?? ff, this.strikeLimit = t?.badChunkStrikes ?? Uf, this.candidatePoolCap = t?.candidatePoolCap ?? 64, this.hostAddr = t?.hostAddr ?? null;
  }
  // ── Neighbor set ───────────────────────────────────────────────────────────
  addNeighbor(e, t, n, i) {
    const r = this.neighbors.get(e);
    if (r) return r;
    const o = {
      addr: e,
      name: t,
      connectedAtMs: n,
      isHostLink: i?.isHostLink ?? !1,
      responder: i?.responder ?? !1,
      boxPub: null,
      fulfillEwma: uw,
      denyEwma: 0,
      throughputBpsEwma: 0,
      firstSliceChunksEwma: 0,
      badChunkStrikes: 0,
      lastSummaryAtMs: n,
      remoteDegree: null,
      relayOnly: !1,
      lowDegreeReports: 0
    };
    this.neighbors.set(e, o);
    const a = this.candidates.delete(e);
    return this.candidateSeenAt.delete(e), ge.info("neighbor added", {
      peer: b(e),
      degree: this.neighbors.size,
      isHostLink: o.isHostLink,
      responder: o.responder,
      promoted: a
    }), this.noteRelayOnly(), o;
  }
  removeNeighbor(e) {
    this.neighbors.delete(e) && (ge.info("neighbor removed", { peer: b(e), degree: this.neighbors.size }), this.neighbors.size === 0 && this.clearDialFailures("mesh-dial failures dropped: no links left"), this.noteRelayOnly());
  }
  has(e) {
    return this.neighbors.has(e);
  }
  get(e) {
    return this.neighbors.get(e) ?? null;
  }
  get size() {
    return this.neighbors.size;
  }
  list() {
    return [...this.neighbors.values()];
  }
  // ── Scoring ────────────────────────────────────────────────────────────────
  /** A want to this peer completed with a verified chunk. */
  recordFulfilled(e) {
    const t = this.neighbors.get(e);
    t && (t.fulfillEwma = os(t.fulfillEwma, 1), t.denyEwma = os(t.denyEwma, 0));
  }
  /** A want to this peer timed out (no first slice / never completed). */
  recordTimeout(e) {
    const t = this.neighbors.get(e);
    t && (t.fulfillEwma = os(t.fulfillEwma, 0));
  }
  /** The peer denied a want. Cheap and honest — penalized far less than a timeout. */
  recordDeny(e) {
    const t = this.neighbors.get(e);
    t && (t.denyEwma = os(t.denyEwma, 1));
  }
  /** A completed chunk delivery: `bytes` over `elapsedMs`. */
  recordDelivery(e, t, n) {
    const i = this.neighbors.get(e);
    !i || n <= 0 || (i.throughputBpsEwma = os(i.throughputBpsEwma, t * 8 * 1e3 / n));
  }
  /** A want to this peer produced its first slice `chunks` chunk-spacings
   *  after it was sent. */
  recordFirstSlice(e, t) {
    const n = this.neighbors.get(e);
    !n || !Number.isFinite(t) || t < 0 || (n.firstSliceChunksEwma = os(n.firstSliceChunksEwma, t));
  }
  /**
   * Composite score in ~[0, 1.2]: fulfillment dominates, denies subtract
   * a little (a denying peer is still healthy), measured throughput adds up
   * to THROUGHPUT_WEIGHT, and first-slice latency subtracts up to
   * FIRST_SLICE_WEIGHT.
   */
  score(e) {
    const t = this.neighbors.get(e);
    if (!t) return 0;
    const n = Math.min(1, t.throughputBpsEwma / fw);
    return t.fulfillEwma - 0.25 * t.denyEwma + hw * n - pw * Math.min(1, t.firstSliceChunksEwma);
  }
  /** Neighbors best-first — request order for the scheduler. */
  rankedByScore() {
    return this.list().sort((e, t) => this.score(t.addr) - this.score(e.addr));
  }
  // ── Strikes (plan §4) ──────────────────────────────────────────────────────
  /** Count a failed chunk verification. True → disconnect the sender now. */
  recordBadChunk(e) {
    const t = this.neighbors.get(e);
    if (!t) return !1;
    t.badChunkStrikes++;
    const n = t.badChunkStrikes >= this.strikeLimit;
    return ge.warn("bad chunk strike", {
      peer: b(e),
      strikes: t.badChunkStrikes,
      limit: this.strikeLimit,
      disconnect: n
    }), n;
  }
  // ── Liveness via summaries (plan §6.4) ─────────────────────────────────────
  recordSummary(e, t, n, i) {
    const r = this.neighbors.get(e);
    r && (r.lastSummaryAtMs = t, this.recordDegreeReport(e, n, i));
  }
  /** One degree report (hello or summary). An absent degree (an older build's
   *  hello) leaves the count alone; an absent relayOnly reads as false. */
  recordDegreeReport(e, t, n) {
    const i = this.neighbors.get(e);
    i && (t !== void 0 && (i.remoteDegree = t, i.lowDegreeReports = t <= 1 ? i.lowDegreeReports + 1 : 0), i.relayOnly = n ?? !1);
  }
  // ── Host-only neighbors (host side) ────────────────────────────────────────
  /** Reaches only us: it said so, or reported degree ≤ 1 in
   *  HOST_ONLY_CONFIRM_REPORTS reports in a row. */
  hostOnly(e) {
    return e.relayOnly || e.lowDegreeReports >= Zf;
  }
  /** The host-only neighbors that hold the `slots` seats: advertised
   *  relayOnly first, then longest uptime. */
  hostOnlyCarried(e) {
    if (e <= 0) return /* @__PURE__ */ new Set();
    const t = this.list().filter((n) => this.hostOnly(n)).sort((n, i) => Number(i.relayOnly) - Number(n.relayOnly) || n.connectedAtMs - i.connectedAtMs);
    return new Set(t.slice(0, e).map((n) => n.addr));
  }
  // ── Mesh-dial failures (viewer side) ───────────────────────────────────────
  /** The broadcaster's link, flagged by the join or matched by address (a
   *  PEX-dialled host link is unflagged). */
  isHost(e) {
    return e.isHostLink || e.addr === this.hostAddr;
  }
  get hasHostLink() {
    for (const e of this.neighbors.values()) if (this.isHost(e)) return !0;
    return !1;
  }
  get dialFailStreak() {
    return this.failedTargets.size;
  }
  dialsPaused(e) {
    return e < this.dialPausedUntilMs;
  }
  /** An outbound mesh dial to `target` was answered but closed unopened.
   *  The target leaves the pool for REPLACE_BAN_MS either way, so PEX cannot
   *  hand it back every round. It counts only while a host link is up, and
   *  once: the streak is distinct peers. At MESH_DIAL_FAIL_STREAK and on
   *  every failure after it (a failed probe too), dialling pauses `pauseMs`. */
  recordDialFailure(e, t, n) {
    if (this.banCandidate(e, t), !!this.hasHostLink) {
      if (this.failedTargets.add(e), this.failedTargets.size >= nr) {
        const i = this.dialsPaused(t);
        this.dialPausedUntilMs = t + n, i || ge.warn("mesh dials paused: links to other viewers fail to open", {
          streak: this.failedTargets.size,
          pauseMs: Math.round(n),
          degree: this.neighbors.size,
          hostLink: this.hasHostLink
        });
      }
      this.noteRelayOnly();
    }
  }
  /** A link to `addr` opened, either direction. Not the host: one that is
   *  another viewer proves the mesh is reachable, so the streak and the
   *  pause end. */
  recordMeshLinkOpened(e) {
    const t = this.neighbors.get(e);
    !t || this.isHost(t) || (this.clearDialFailures("mesh dials resumed: a link to another viewer opened"), this.noteRelayOnly());
  }
  clearDialFailures(e) {
    this.failedTargets.size === 0 && this.dialPausedUntilMs === 0 || (ge.info(e, { streakWas: this.failedTargets.size }), this.failedTargets.clear(), this.dialPausedUntilMs = 0);
  }
  /** Only the host is reachable: MESH_DIAL_FAIL_STREAK failed dials and our
   *  one link is the host. Streak-based, so a probe window cannot flap it. */
  get relayOnly() {
    if (this.failedTargets.size < nr || this.neighbors.size !== 1) return !1;
    const [e] = this.neighbors.values();
    return this.isHost(e);
  }
  noteRelayOnly() {
    const e = this.relayOnly;
    e !== this.relayOnlyLogged && (this.relayOnlyLogged = e, e ? ge.warn("relay-only: only the host is reachable", { streak: this.failedTargets.size }) : ge.info("relay-only cleared", {
      streak: this.failedTargets.size,
      degree: this.neighbors.size
    }));
  }
  /** Neighbors silent for longer than `cutoffMs` (two missed summaries plus
   *  slack) → presumed dead. A link with no summary yet is judged from
   *  connect time. */
  deadPeers(e, t = Nc) {
    return this.list().filter((n) => e - n.lastSummaryAtMs > t).map((n) => n.addr);
  }
  // ── PEX candidate pool ─────────────────────────────────────────────────────
  addCandidates(e, t = Date.now()) {
    let n = 0, i = 0, r = 0, o = !1;
    for (const a of e)
      if (!(a.addr === this.selfAddr || this.neighbors.has(a.addr))) {
        if (this.isBanned(a.addr, t)) {
          i++;
          continue;
        }
        if (this.candidates.size >= this.candidatePoolCap && !this.candidates.has(a.addr) && (o || (o = !0, this.expireCandidates(t)), this.candidates.size >= this.candidatePoolCap)) {
          r++;
          continue;
        }
        this.candidates.has(a.addr) || n++, this.candidates.set(a.addr, a), this.candidateSeenAt.set(a.addr, t);
      }
    (n > 0 || i > 0) && ge.debug("candidates added", {
      added: n,
      banned: i,
      offered: e.length,
      pool: this.candidates.size
    }), r > 0 && this.poolFullCap.allow() && ge.warn("candidate pool full", { turnedAway: r, cap: this.candidatePoolCap });
  }
  /** Drop pooled candidates nobody has re-offered within CANDIDATE_TTL_MS. */
  expireCandidates(e) {
    let t = 0;
    for (const [n, i] of this.candidateSeenAt)
      e - i > Is && (this.candidates.delete(n), this.candidateSeenAt.delete(n), t++);
    return t > 0 && ge.debug("stale candidates dropped", { expired: t, ttlMs: Is, pool: this.candidates.size }), t;
  }
  isBanned(e, t) {
    const n = this.bannedUntil.get(e);
    return n === void 0 ? !1 : t < n ? !0 : (this.bannedUntil.delete(e), !1);
  }
  /** Refuse `addr` from the pool for REPLACE_BAN_MS: it was pruned for its
   *  score, or pruned us for ours. Links it opens to us are not blocked. */
  banCandidate(e, t) {
    this.candidates.delete(e), this.candidateSeenAt.delete(e), this.bannedUntil.set(e, t + pi), ge.debug("candidate banned", { peer: b(e), banMs: pi });
  }
  get candidateCount() {
    return this.candidates.size;
  }
  /** TEST HOOK (issue-#7 orphan repro): empty the candidate pool. */
  clearCandidates() {
    ge.warn("candidate pool cleared", { dropped: this.candidates.size }), this.candidates.clear(), this.candidateSeenAt.clear();
  }
  /**
   * How many new links to dial and to whom (below target → top up), bounded
   * by the outbound dials already in flight against `maxDialsInFlight`. Returned
   * candidates are consumed from the pool; report failures via addCandidates
   * re-learning them from future PEX.
   */
  dialTargets(e = Date.now(), t = 0) {
    if (this.hasHostLink && this.dialsPaused(e)) return [];
    const n = this.targetDegree - this.neighbors.size;
    if (n <= 0) return [];
    const i = this.maxDialsInFlight, r = i - t, o = Math.min(n, r);
    if (r < n && this.candidates.size > 0 && this.dialCapLog.allow() && ge.debug("dial targets capped", {
      wanted: n,
      room: Math.max(0, r),
      inFlight: t,
      cap: i,
      starved: this.isStarved
    }), o <= 0) return [];
    const a = [];
    let d = 0;
    for (const [c, l] of this.candidates) {
      if (a.length >= o) break;
      this.candidates.delete(c);
      const u = this.candidateSeenAt.get(c) ?? e;
      if (this.candidateSeenAt.delete(c), e - u > Is) {
        d++;
        continue;
      }
      a.push(l);
    }
    return d > 0 && ge.debug("stale candidates dropped", { expired: d, ttlMs: Is }), a.length > 0 && ge.debug("dial targets picked", {
      picked: a.length,
      wanted: o,
      degree: this.neighbors.size,
      pool: this.candidates.size,
      inFlight: t,
      cap: i,
      starved: this.isStarved
    }), a;
  }
  /** Below MIN_DEGREE the node should dial urgently / keep its host link. */
  get isStarved() {
    return this.neighbors.size < this.minDegree;
  }
  /** Outbound dials allowed in flight: doubled while starved. */
  get maxDialsInFlight() {
    return this.isStarved ? Wf : qf;
  }
  /**
   * Who to drop when over max degree: worst-scored first; the host link and
   * the last remaining neighbor are never offered up (a viewer whose only
   * link is the host must keep it — plan §6.2). Links younger than
   * NEWCOMER_GRACE_MS are also protected: a newcomer's neutral-prior score
   * always loses to established neighbors, and pruning it on sight makes a
   * saturated mesh reject every joiner (admission must evict an old link,
   * not the new one). A node whose whole excess is in grace stays over max
   * until the grace expires — bounded, since excess only grows by admission.
   */
  pruneTargets(e) {
    const t = this.neighbors.size - this.maxDegree;
    if (t <= 0) return [];
    const n = this.rankedByScore().reverse().filter((i) => !i.isHostLink && e - i.connectedAtMs >= $n).slice(0, t).map((i) => i.addr);
    return n.length > 0 && ge.info("pruning over max degree", {
      prune: n.length,
      excess: t,
      degree: this.neighbors.size,
      maxDegree: this.maxDegree
    }), n;
  }
  /** Hold replacements for REPLACE_COOLDOWN_MS (after an epoch reset, wants
   *  to neighbors still on the old epoch time out — not their fault). */
  holdReplacements(e) {
    this.replaceHoldUntilMs = Math.max(this.replaceHoldUntilMs, e + Uo);
  }
  /**
   * A persistently weak but live neighbor to swap for a pooled candidate.
   * Victim: the lowest-scored non-host link out of its NEWCOMER_GRACE_MS
   * that scores below REPLACE_SCORE_BELOW or denies above REPLACE_DENY_ABOVE.
   * Kept when the swap would drop us below minDegree, inside the cooldown,
   * when no other neighbor scores REPLACE_HEALTHY_SCORE (the fault is then
   * probably ours), or when no fresh keyed candidate is pooled. A hit
   * consumes the candidate, starts the cooldown and bans the victim.
   */
  replaceTarget(e) {
    let t = null, n = 1 / 0;
    for (const c of this.neighbors.values()) {
      if (c.isHostLink || c.addr === this.hostAddr || e - c.connectedAtMs < $n) continue;
      const l = this.score(c.addr);
      l >= pf && c.denyEwma < Lo || l < n && (t = c, n = l);
    }
    if (!t) return null;
    const i = (c) => (this.keptCap.allow(c) && ge.debug("weak neighbor kept", {
      peer: b(t.addr),
      score: n,
      deny: t.denyEwma,
      gate: c,
      kept: this.keptCap.count(c)
    }), null);
    if (this.neighbors.size - 1 < this.minDegree) return i("min-degree");
    if (e < this.replaceHoldUntilMs) return i("cooldown");
    let r = null, o = -1 / 0;
    for (const c of this.neighbors.values()) {
      if (c === t) continue;
      const l = this.score(c.addr);
      l > o && (r = c, o = l);
    }
    if (!r || o < mf)
      return this.keptCap.allow("no-reference") && ge.warn("slow neighbors kept: no healthy reference", {
        worst: b(t.addr),
        worstScore: n,
        bestScore: r ? o : null,
        degree: this.neighbors.size,
        kept: this.keptCap.count("no-reference")
      }), null;
    let a = null;
    for (const [c, l] of this.candidates) {
      const u = this.candidateSeenAt.get(c) ?? e;
      if (e - u > Is) {
        this.candidates.delete(c), this.candidateSeenAt.delete(c);
        continue;
      }
      if (l.boxPub) {
        a = l;
        break;
      }
    }
    if (!a) return i("no-candidate");
    this.candidates.delete(a.addr), this.candidateSeenAt.delete(a.addr), this.replaceHoldUntilMs = e + Uo, this.bannedUntil.set(t.addr, e + pi);
    const d = t.denyEwma >= Lo ? "deny" : "score";
    return ge.warn("replacing weak neighbor", {
      peer: b(t.addr),
      reason: d,
      score: n,
      fulfill: t.fulfillEwma,
      deny: t.denyEwma,
      throughputBps: Math.round(t.throughputBpsEwma),
      ageMs: e - t.connectedAtMs,
      reference: b(r.addr),
      referenceScore: o,
      candidate: b(a.addr),
      degree: this.neighbors.size,
      pool: this.candidates.size
    }), {
      victim: t,
      candidate: a,
      reason: d,
      score: n,
      reference: r.addr,
      referenceScore: o
    };
  }
  /**
   * Peers to offer in a `pex` message or a welcome's seeds: our live
   * neighbors only. Candidates are hearsay — re-offering them is how a dead
   * peer used to circulate the mesh for minutes, every node handing it back
   * to the next after its own dial timed out. Offering only neighbors bounds
   * that to the ~9.5 s a neighbor takes to notice the death. A relay-only
   * neighbor is never offered: nobody but us can open a link to it.
   */
  pexSample(e = Pr, t) {
    const n = [];
    for (const i of this.neighbors.values()) {
      if (n.length >= e) return n;
      i.addr !== t && !i.relayOnly && n.push({ addr: i.addr, name: i.name, boxPub: i.boxPub ?? void 0 });
    }
    return n;
  }
  /** Longest-uptime responders for the heartbeat responder list (§6.2a).
   *  A relay-only neighbor's answer could only ever open to us. */
  responderSample(e) {
    return this.list().filter((t) => t.responder && !t.relayOnly).sort((t, n) => t.connectedAtMs - n.connectedAtMs).slice(0, e);
  }
  /**
   * §6.2 host bootstrap prune: which temporary joiners to re-home when the
   * host holds more than `maxNeighbors` links. Only neighbors that reported
   * ≥ `minRemoteDegree` links (host + 2 non-host) are candidates — everyone
   * else keeps their host link (they would be islands). Best-established
   * (highest reported degree, then longest uptime) go first: they are the
   * least dependent on the bootstrap link.
   */
  hostPruneTargets(e, t) {
    const n = this.neighbors.size - e;
    if (n <= 0) return [];
    const i = this.list().filter((r) => r.remoteDegree !== null && r.remoteDegree >= t).sort(
      (r, o) => (o.remoteDegree ?? 0) - (r.remoteDegree ?? 0) || r.connectedAtMs - o.connectedAtMs
    ).slice(0, n).map((r) => r.addr);
    return i.length > 0 && ge.info("re-homing bootstrap joiners", {
      prune: i.length,
      excess: n,
      degree: this.neighbors.size,
      maxNeighbors: e
    }), i;
  }
}
const as = ne("swarm.sched"), mw = 10;
class gw {
  chunkMs;
  wantTimeoutChunks;
  progressTimeoutChunks;
  perPeerBudget;
  totalBudget;
  duplicateWindowChunks;
  skipGraceChunks;
  playhead = 0;
  /** Wall-clock moment the player needs `playhead`; null while the player
   *  is no clock (not started, paused, …) — deadlines are then hypothetical. */
  playheadDueAtMs = null;
  /** False until the playhead has been positioned once — the first
   *  placement must not "skip" chunks from before we joined. */
  playheadInitialized = !1;
  /** EWMA of observed chunk durations (ms). Chunks are keyframe-delimited and
   *  can run well under chunkMs (phase 4 findings — seq count is not a clock),
   *  so deadlines pace by what the stream actually produces once we've seen it. */
  chunkDurEwmaMs = null;
  edge = -1;
  inflight = /* @__PURE__ */ new Map();
  /** Peers already tried (and failed/timed out) for a seq — don't re-ask. */
  attempted = /* @__PURE__ */ new Map();
  skipped = /* @__PURE__ */ new Set();
  logCap = re(mw);
  totals = {
    wantTimeouts: 0,
    progressTimeouts: 0,
    dupPulls: 0,
    deadlineSkips: 0
  };
  constructor(e) {
    this.chunkMs = e?.chunkMs ?? Wt, this.wantTimeoutChunks = e?.wantTimeoutChunks ?? bf, this.progressTimeoutChunks = e?.progressTimeoutChunks ?? kf, this.perPeerBudget = e?.maxInflightPerPeer ?? If, this.totalBudget = e?.maxInflightTotal ?? Of, this.duplicateWindowChunks = e?.duplicateWindowChunks ?? vf, this.skipGraceChunks = e?.skipGraceChunks ?? Sf;
  }
  // ── State feed ─────────────────────────────────────────────────────────────
  get edgeSeq() {
    return this.edge;
  }
  /** Seq the player needs next, or null before the first placement. */
  get playheadSeq() {
    return this.playheadInitialized ? this.playhead : null;
  }
  counters() {
    return { ...this.totals };
  }
  /** Max seq seen across have/summary/meta messages. */
  updateEdge(e) {
    e > this.edge && (this.edge = e);
  }
  /** The player advanced: seqs below the playhead are history. `dueAtMs`
   *  null = no player clock; deadlines fall back to now + one chunk. */
  setPlayhead(e, t) {
    this.playheadInitialized = !0, this.playhead = e, this.playheadDueAtMs = t;
    for (const n of this.skipped) n < e && this.skipped.delete(n);
    for (const n of this.inflight.keys()) n < e && this.inflight.delete(n);
    for (const n of this.attempted.keys()) n < e && this.attempted.delete(n);
  }
  /**
   * Playhead placement (SwarmNode tick): move the playhead up to `desired`
   * (the feed's next seq, or the window floor below the live edge) and
   * return the seqs in [oldPlayhead, desired) that must be given up on — they
   * are not in the store and the playhead is rolling past them. Without this
   * rolled-past sweep, a missing chunk the floor passes would NEVER be
   * skipped (plan() only walks [playhead, edge]), so an in-order feed far
   * behind live, or one with no clock to go dry on, would stall on it
   * forever. The first call only positions the playhead: chunks from before
   * we joined were never "missed".
   *
   * For an unchanged playhead seq, a due that has already passed stays put:
   * a dry player reports remaining 0 (or a frame short of its range end)
   * every tick, and re-stamping that as "due now" would restart the skip
   * grace forever. The moment it ran dry is its due. A due still in the
   * future follows the clock, so a throttled or frozen player never skips.
   */
  advancePlayhead(e, t, n, i) {
    if (!this.playheadInitialized)
      return this.setPlayhead(e, t), [];
    const r = this.playhead;
    if (e <= r)
      return this.playheadDueAtMs !== null && this.playheadDueAtMs <= i && t !== null || (this.playheadDueAtMs = t), [];
    const o = [];
    for (let a = r; a < e; a++)
      !n(a) && !this.skipped.has(a) && o.push(a);
    return this.setPlayhead(e, t), o;
  }
  /** Feed an observed chunk duration (ms) into the pacing estimate. */
  observeChunkDur(e) {
    !Number.isFinite(e) || e <= 0 || (this.chunkDurEwmaMs = this.chunkDurEwmaMs === null ? e : 0.8 * this.chunkDurEwmaMs + 0.2 * e);
  }
  /** A slice of `seq` arrived from `peer`: re-arms its progress timeout.
   *  True when it is the first slice of that pull (the caller scores the
   *  want → first-slice latency); false for later slices and for slices of
   *  a pull already cancelled. */
  onSlice(e, t, n) {
    const i = this.inflight.get(e)?.find((r) => r.peer === t);
    return !i || (i.lastSliceAtMs = n, i.gotFirstSlice) ? !1 : (i.gotFirstSlice = !0, !0);
  }
  /** Chunk verified + stored. Clears all pulls for the seq (a concurrent
   *  duplicate pull is abandoned — its late slices get ignored). */
  onComplete(e) {
    this.inflight.delete(e), this.attempted.delete(e);
  }
  /** Peer denied the want — retry elsewhere immediately (next plan()). */
  onDeny(e, t) {
    const n = this.inflight.get(e)?.filter((i) => i.peer !== t) ?? [];
    n.length === 0 ? this.inflight.delete(e) : this.inflight.set(e, n), this.markAttempted(e, t);
  }
  /** Neighbor died: forget its pulls so they re-plan instantly (plan §6.4). */
  onPeerLost(e) {
    for (const [t, n] of this.inflight) {
      const i = n.filter((r) => r.peer !== e);
      i.length === 0 ? this.inflight.delete(t) : this.inflight.set(t, i);
    }
  }
  /** Host re-go-live: new epoch, new seq space. */
  reset() {
    as.info("scheduler reset", { playhead: this.playhead, edge: this.edge }), this.logCap.reset(), this.playhead = 0, this.playheadDueAtMs = null, this.playheadInitialized = !1, this.chunkDurEwmaMs = null, this.edge = -1, this.inflight.clear(), this.attempted.clear(), this.skipped.clear();
  }
  markAttempted(e, t) {
    let n = this.attempted.get(e);
    n || this.attempted.set(e, n = /* @__PURE__ */ new Set()), n.add(t);
  }
  /** Chunk spacing D every timing rule is measured in: the observed EWMA
   *  once chunks have flowed, the configured chunkMs before that. */
  spacingMs() {
    return this.chunkDurEwmaMs ?? this.chunkMs;
  }
  /** Absolute deadline for a seq: when the playhead will reach it. With no
   *  player clock, deadlines are hypothetical — one chunk of slack each. */
  deadlineAt(e, t) {
    const n = this.spacingMs();
    return (this.playheadDueAtMs ?? t + n) + (e - this.playhead) * n;
  }
  /** ms until `seq` is due, for log lines. */
  remainingMs(e, t) {
    return Math.round(this.deadlineAt(e, t) - t);
  }
  inflightTotal() {
    let e = 0;
    for (const t of this.inflight.values()) e += t.length;
    return e;
  }
  inflightForPeer(e) {
    let t = 0;
    for (const n of this.inflight.values())
      for (const i of n) i.peer === e && t++;
    return t;
  }
  // ── Planning ───────────────────────────────────────────────────────────────
  /**
   * One planning pass: expire stale pulls, skip a dry playhead's missing run,
   * then fill budgets deadline-first. Call on every scheduling tick and after
   * any have/deny/complete event.
   */
  plan(e, t, n) {
    const i = [], r = [...t].sort((a, d) => d.score - a.score), o = this.spacingMs();
    for (const [a, d] of this.inflight) {
      const c = [];
      for (const l of d) {
        const u = e - l.sentAtMs, h = e - (l.lastSliceAtMs ?? l.sentAtMs);
        let f = null;
        if (!l.gotFirstSlice && u >= this.wantTimeoutChunks * o ? (f = "first-slice", this.totals.wantTimeouts++) : l.gotFirstSlice && h >= this.progressTimeoutChunks * o && (f = "progress", this.totals.progressTimeouts++), f === null) {
          c.push(l);
          continue;
        }
        this.markAttempted(a, l.peer), i.push({ type: "cancel", seq: a, peer: l.peer, reason: f }), this.logCap.allow(f) && as.warn("pull timed out — re-requesting", {
          seq: a,
          peer: b(l.peer),
          reason: f,
          idleMs: Math.round(h),
          sinceWantMs: Math.round(u),
          remainingMs: this.remainingMs(a, e),
          timedOut: f === "first-slice" ? this.totals.wantTimeouts : this.totals.progressTimeouts
        });
      }
      c.length === 0 ? this.inflight.delete(a) : this.inflight.set(a, c);
    }
    if (this.edge < 0) return i;
    this.skipDryRun(e, n, o, i);
    for (let a = this.playhead; a <= this.edge; a++) {
      if (n(a) || this.skipped.has(a)) continue;
      const d = this.deadlineAt(a, e), c = this.inflight.get(a) ?? [], l = c.length === 0, u = c.length === 1 && this.playheadDueAtMs !== null && d - e < this.duplicateWindowChunks * o;
      if (!l && !u || this.inflightTotal() >= this.totalBudget) continue;
      const h = new Set(c.map((p) => p.peer)), f = this.pickPeer(a, r, h);
      if (!f) {
        l && this.attempted.delete(a);
        continue;
      }
      const m = c[0];
      c.push({ peer: f, sentAtMs: e, gotFirstSlice: !1, lastSliceAtMs: null }), this.inflight.set(a, c);
      const g = Math.max(0, Math.round(d - e));
      u ? (i.push({ type: "want", seq: a, peer: f, deadlineMs: g, duplicate: !0 }), this.totals.dupPulls++, this.logCap.allow("duplicate") && as.warn("duplicate pull", {
        seq: a,
        peer: b(f),
        firstPeer: b(m.peer),
        remainingMs: Math.round(d - e),
        sinceWantMs: Math.round(e - m.sentAtMs),
        duplicates: this.totals.dupPulls
      })) : i.push({ type: "want", seq: a, peer: f, deadlineMs: g });
    }
    return i.length > 0 && this.logPlan(i), i;
  }
  /** Step 2 of plan(): skip [playhead, nextHeld) once the player has been dry
   *  for the grace and a later chunk is held to hop to. */
  skipDryRun(e, t, n, i) {
    const r = this.playheadDueAtMs, o = this.playhead;
    if (r === null || o > this.edge || t(o) || this.skipped.has(o) || e < r + this.skipGraceChunks * n) return;
    let a = -1;
    for (let c = o + 1; c <= this.edge; c++)
      if (t(c)) {
        a = c;
        break;
      }
    if (a === -1) return;
    const d = [];
    for (let c = o; c < a; c++)
      if (!this.skipped.has(c)) {
        this.skipped.add(c);
        for (const l of this.inflight.get(c) ?? [])
          i.push({ type: "cancel", seq: c, peer: l.peer, reason: "deadline" }), d.push(b(l.peer));
        this.inflight.delete(c), this.attempted.delete(c), i.push({ type: "skip", seq: c }), this.totals.deadlineSkips++;
      }
    this.logCap.allow("skip") && as.warn("deadline missed — skipping chunk", {
      seq: o,
      run: [o, a],
      hopTo: a,
      playhead: o,
      edge: this.edge,
      peers: d,
      lateMs: Math.round(e - r),
      remainingMs: Math.round(r - e),
      skipped: this.totals.deadlineSkips
    });
  }
  /** One tick summary instead of a line per action. */
  logPlan(e) {
    if (!as.on("debug")) return;
    let t = 0, n = 0, i = 0;
    for (const r of e)
      r.type === "want" ? t++ : r.type === "cancel" ? n++ : i++;
    as.debug("plan", {
      wants: t,
      cancels: n,
      skips: i,
      inflight: this.inflightTotal(),
      playhead: this.playhead,
      edge: this.edge
    });
  }
  /** Best-scored neighbor that has the seq, wasn't tried, and has budget. */
  pickPeer(e, t, n) {
    const i = this.attempted.get(e);
    for (const r of t)
      if (!(n.has(r.addr) || i?.has(r.addr)) && r.has(e) && !(this.inflightForPeer(r.addr) >= this.perPeerBudget))
        return r.addr;
    return null;
  }
  // ── Introspection (stats / tests) ──────────────────────────────────────────
  inflightSnapshot() {
    return [...this.inflight.entries()].map(([e, t]) => ({ seq: e, peers: t.map((n) => n.peer) })).sort((e, t) => e.seq - t.seq);
  }
  get skippedSeqs() {
    return [...this.skipped].sort((e, t) => e - t);
  }
}
const yw = 0.9;
function ww(s, e) {
  let t = 0, n = 0, i = 0, r = 0, o = 0;
  for (const c of s) {
    if (c.samples < e.windowSamples) continue;
    o = Math.max(o, c.max);
    const l = c.last.sent - c.first.sent, u = c.last.buffered - c.first.buffered;
    l === 0 && u === 0 || (t++, i += Math.max(0, l - u), c.min >= e.backlogBytes && (n++, r += c.min));
  }
  const a = n >= Math.max(2, Math.ceil(t / 2)), d = e.windowMs > 0 ? i * 8 * 1e3 / e.windowMs : 0;
  return {
    samples: e.windowSamples,
    active: t,
    backedUp: n,
    majority: a,
    drainedBytes: i,
    settledBytes: r,
    measuredBps: d,
    maxBuffered: o
  };
}
const Ua = (s, e, t) => Math.min(t, Math.max(e, s));
function bw(s, e, t) {
  const { floorBps: n, ceilingBps: i } = t, r = [];
  let o = Ua(s.budgetBps, n, i);
  const a = s.settledPrev !== null && e.settledBytes < yw * s.settledPrev, d = s.starvedRun > 0;
  if (e.majority) {
    if (e.samples >= Lc && !a) {
      const u = Ua(Math.min(o, Af * e.measuredBps), n, i);
      u < o && (o = u, d && u <= n || r.push("cut"));
    }
  } else e.samples >= 1 && o < i && (o = Math.min(i, Bf * o), o >= i && r.push("restored"));
  let { starvedRun: c, starved: l } = s;
  return e.majority ? (c = o <= n ? c + 1 : 0, !l && c >= Mf && (l = !0, r.push("starved"))) : (c = 0, l && (l = !1, r.push("recovered"))), {
    state: { budgetBps: o, settledPrev: e.settledBytes, starvedRun: c, starved: l },
    events: r
  };
}
const it = ne("swarm.serve"), vw = 5, Sw = 6e4, _w = 0.2, kw = 10, Na = ht, Fi = () => Object.fromEntries(Hc.options.map((s) => [s, 0]));
class Kn {
  queue = [];
  servedCount = /* @__PURE__ */ new Map();
  lastServedAt = /* @__PURE__ */ new Map();
  budgetBps;
  ceilingBps;
  maxQueueDepth;
  fanoutCap;
  chunkMs;
  /** Requesters a seat already carried each seq to — a seat is one copy. */
  carriedServed = /* @__PURE__ */ new Map();
  /** Seqs whose fanout cap was already overridden once for a danger zone. */
  dangerUsed = /* @__PURE__ */ new Set();
  /** Danger-zone overrides granted — a running total like every swarm
   *  stats counter, so it survives reset(). */
  dangerServes = 0;
  /** Carried serves past the fanout cap, since this queue was built. */
  hostOnlyServedTotal = 0;
  /** Token bucket, in bytes. Capacity = 1 s of budget. */
  tokens;
  lastRefillMs = null;
  denyCap = re(vw);
  dangerCap = re(kw);
  ceilingCap = re(1);
  queuedSinceRollup = 0;
  servedSinceRollup = 0;
  bytesSinceRollup = 0;
  hostOnlySinceRollup = 0;
  deniedSinceRollup = Fi();
  rollupStartMs = null;
  deniedTotal = Fi();
  // Measured budget. EWMAs are null until the first chunk.
  chunkBytesEwma = null;
  chunkMsEwma = null;
  budgetState;
  windowStartMs = null;
  windowSamples = 0;
  linkWindows = /* @__PURE__ */ new Map();
  measuredBps = null;
  backedUpLinks = 0;
  maxBufferedBytes = 0;
  cuts = 0;
  limitedSinceMs = null;
  starvedSinceMs = null;
  constructor(e) {
    this.ceilingBps = e?.uploadBudgetBps ?? wf, this.budgetBps = this.ceilingBps, this.budgetState = { budgetBps: this.budgetBps, settledPrev: null, starvedRun: 0, starved: !1 }, this.maxQueueDepth = e?.maxQueueDepth ?? 32, this.fanoutCap = e?.fanoutCap === void 0 ? null : e.fanoutCap, this.chunkMs = e?.chunkMs ?? Wt, this.tokens = this.budgetBps / 8;
  }
  static host(e) {
    return new Kn({ ...e, fanoutCap: gf });
  }
  /** The observed chunk spacing (the node's Scheduler.spacingMs, each tick):
   *  the danger zone and the expiry grace are measured in it. */
  setChunkMs(e) {
    Number.isFinite(e) && e > 0 && (this.chunkMs = e);
  }
  refill(e) {
    if (this.lastRefillMs !== null && e > this.lastRefillMs) {
      const t = this.budgetBps / 8;
      this.tokens = Math.min(t, this.tokens + (e - this.lastRefillMs) / 1e3 * t);
    }
    this.lastRefillMs = e;
  }
  /**
   * Handle an incoming want. `deadlineMs` is the requester's time-to-playhead
   * (relative); `hasChunk`/`othersHave` come from the caller's ChunkStore
   * and HAVE knowledge of its other neighbors; `hostOnly` from the host's
   * seat policy (SwarmNode.hostOnlyStatus). The budget deny comes first for
   * everyone: tokens stay the hard bound, a seat included.
   */
  request(e, t, n, i, r) {
    if (this.refill(i), r?.hasChunk === !1) return this.deny("missing", e, t);
    if (this.queue.length >= this.maxQueueDepth) return this.deny("busy", e, t);
    if (this.tokens < Na) return this.deny("budget", e, t);
    const o = this.fanoutCap !== null && (this.servedCount.get(t) ?? 0) >= this.fanoutCap, a = r?.hostOnly === "carried" && !this.carriedServed.get(t)?.has(e);
    if (o && r?.hostOnly === "refused") return this.deny("fanout", e, t, "host-full");
    if (o && !a) {
      if (!(n < Ef * this.chunkMs && r?.othersHave === !1) || this.dangerUsed.has(t))
        return this.deny("fanout", e, t);
      this.dangerUsed.add(t), this.dangerServes++, this.dangerCap.allow() && it.info("fanout cap overridden: requester in its danger zone", {
        peer: b(e),
        seq: t,
        deadlineMs: n,
        dangerServes: this.dangerServes
      });
    }
    this.queue = this.queue.filter((c) => !(c.peer === e && c.seq === t));
    const d = { peer: e, seq: t, deadlineAtMs: i + n, enqueuedAtMs: i };
    return a && (d.carried = !0, d.overCap = o), this.queue.push(d), this.queuedSinceRollup++, { kind: "queued" };
  }
  countDeny(e) {
    this.deniedTotal[e]++, this.deniedSinceRollup[e]++;
  }
  /** One line per deny reason while it is new, then a count only. */
  deny(e, t, n, i) {
    return this.countDeny(e), this.denyCap.allow(e) && it.debug(`want denied: ${e}`, {
      peer: b(t),
      seq: n,
      detail: i ?? null,
      depth: this.queue.length,
      denied: this.denyCap.count(e)
    }), i ? { kind: "deny", reason: e, detail: i } : { kind: "deny", reason: e };
  }
  /**
   * A request `next()` popped but the caller could not send yet (bulk
   * backpressure). Below SERVE_HOLD_MAX_CHUNKS since its want was queued it
   * goes back unchanged — enqueue time and deadline kept, no re-admission
   * that could deny it silently — and this returns 'held'. From then on it
   * has missed the requester's progress window: it is dropped and this
   * returns 'deny', so the caller sends `deny busy` and the requester
   * re-plans now. That is always before `next()` would expire it silently
   * (enqueue + 0.5 D < enqueue + deadline + 1 D grace).
   */
  hold(e, t) {
    return t - e.enqueuedAtMs >= xf * this.chunkMs ? (this.countDeny("busy"), "deny") : (this.queue.push(e), "held");
  }
  /** Requester lost interest (re-pulled elsewhere, disconnected). */
  cancel(e, t) {
    this.queue = this.queue.filter((n) => n.peer !== e || t !== void 0 && n.seq !== t);
  }
  /**
   * Pop the next request to serve, or null when idle / out of budget:
   * carried first, then deadline, then least-recently-served requester.
   * Requests more than SERVE_EXPIRY_GRACE_CHUNKS past their deadline are
   * dropped — the requester has skipped that chunk by then.
   */
  next(e) {
    if (this.refill(e), this.tokens < Na) return null;
    const t = Tf * this.chunkMs;
    if (this.queue = this.queue.filter((i) => i.deadlineAtMs + t > e), this.queue.length === 0) return null;
    let n = null;
    for (const i of this.queue) {
      if (!n) {
        n = i;
        continue;
      }
      if (!!i.carried != !!n.carried) {
        i.carried && (n = i);
        continue;
      }
      (i.deadlineAtMs < n.deadlineAtMs || i.deadlineAtMs === n.deadlineAtMs && (this.lastServedAt.get(i.peer) ?? 0) < (this.lastServedAt.get(n.peer) ?? 0)) && (n = i);
    }
    return this.queue = this.queue.filter((i) => i !== n), n;
  }
  /** Account a completed serve: consumes budget, counts fanout (a carried
   *  serve leaves the mesh's count alone). */
  onServed(e, t, n) {
    if (this.refill(n), this.tokens -= t, e.carried) {
      const i = this.carriedServed.get(e.seq) ?? /* @__PURE__ */ new Set();
      i.add(e.peer), this.carriedServed.set(e.seq, i);
    } else
      this.servedCount.set(e.seq, (this.servedCount.get(e.seq) ?? 0) + 1);
    e.overCap && (this.hostOnlyServedTotal++, this.hostOnlySinceRollup++), this.lastServedAt.set(e.peer, n), this.servedSinceRollup++, this.bytesSinceRollup += t;
  }
  // ── Measured budget ──────────────────────────────────────────────────────
  /** Feed one chunk (seeded or verified) into the stream-rate EWMAs. */
  observeChunk(e, t) {
    if (!Number.isFinite(e) || e <= 0 || !Number.isFinite(t) || t <= 0) return;
    const n = _w;
    this.chunkBytesEwma = this.chunkBytesEwma === null ? e : (1 - n) * this.chunkBytesEwma + n * e, this.chunkMsEwma = this.chunkMsEwma === null ? t : (1 - n) * this.chunkMsEwma + n * t;
  }
  /** Chunk duration from the stream EWMAs: paces the stream rate and the
   *  budget window. Kept apart from `chunkMs` (the scheduler's spacing, which
   *  the danger zone, expiry grace and hold limit use): that one restarts on
   *  an epoch reset, and these EWMAs carry over it. */
  get streamChunkMs() {
    return this.chunkMsEwma ?? Wt;
  }
  get chunkBytes() {
    return this.chunkBytesEwma ?? (Pc + Fc) * Wt / 8e3;
  }
  get streamBps() {
    return this.chunkBytes * 8 * 1e3 / this.streamChunkMs;
  }
  get floorBps() {
    return Math.min(this.ceilingBps, mi * this.streamBps);
  }
  get windowMs() {
    return Math.max(this.streamChunkMs, Lc * sr);
  }
  /**
   * One tick's sample of every open link's bulk queue. Accumulates the
   * window; at its edge, sizes the budget from what the queues drained.
   * Also drives the time-based roll-up line.
   */
  observeLinks(e, t) {
    this.windowStartMs === null && (this.windowStartMs = t, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map()), this.windowSamples++;
    for (const { peer: n, buffered: i, sent: r } of e) {
      const o = this.linkWindows.get(n);
      o ? (o.samples++, o.min = Math.min(o.min, i), o.max = Math.max(o.max, i), o.last = { buffered: i, sent: r }) : this.linkWindows.set(n, {
        peer: n,
        samples: 1,
        min: i,
        max: i,
        first: { buffered: i, sent: r },
        last: { buffered: i, sent: r }
      });
    }
    t - this.windowStartMs >= this.windowMs && (this.closeWindow(t - this.windowStartMs, t), this.windowStartMs = null), this.rollup(t);
  }
  closeWindow(e, t) {
    const n = ww(this.linkWindows.values(), {
      windowSamples: this.windowSamples,
      backlogBytes: Cf * this.chunkBytes,
      windowMs: e
    });
    this.linkWindows = /* @__PURE__ */ new Map(), this.measuredBps = n.measuredBps, this.backedUpLinks = n.backedUp, this.maxBufferedBytes = n.maxBuffered;
    const i = this.streamBps, r = this.floorBps;
    this.ceilingBps < mi * i && this.ceilingCap.allow() && it.warn("upload ceiling below one full-rate copy", {
      ceilingBps: this.ceilingBps,
      floorBps: Math.round(mi * i),
      streamBps: Math.round(i)
    });
    const o = this.budgetBps, { state: a, events: d } = bw(this.budgetState, n, {
      floorBps: r,
      ceilingBps: this.ceilingBps
    });
    this.budgetState = a, a.budgetBps !== o && (this.refill(t), this.budgetBps = a.budgetBps, this.tokens = Math.min(this.tokens, this.budgetBps / 8));
    for (const c of d)
      switch (c) {
        case "cut":
          this.cuts++, this.limitedSinceMs ??= t, it.info("upload budget cut", {
            fromBps: Math.round(o),
            toBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            floorBps: Math.round(r),
            ceilingBps: this.ceilingBps,
            copies: this.copies,
            backedUp: n.backedUp,
            active: n.active,
            settledBytes: n.settledBytes,
            windowMs: Math.round(e),
            samples: n.samples
          });
          break;
        case "restored":
          it.info("upload budget restored", {
            budgetBps: Math.round(this.budgetBps),
            limitedMs: this.limitedSinceMs === null ? null : t - this.limitedSinceMs
          }), this.limitedSinceMs = null;
          break;
        case "starved":
          this.starvedSinceMs = t, it.warn("upload starved", {
            budgetBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            streamBps: Math.round(i),
            backedUp: n.backedUp
          });
          break;
        case "recovered":
          it.info("upload recovered", {
            starvedMs: this.starvedSinceMs === null ? null : t - this.starvedSinceMs
          }), this.starvedSinceMs = null;
          break;
      }
  }
  get copies() {
    return Math.floor(this.budgetBps / this.streamBps);
  }
  get upload() {
    return {
      budgetBps: this.budgetBps,
      ceilingBps: this.ceilingBps,
      floorBps: this.floorBps,
      measuredBps: this.measuredBps,
      streamBps: this.streamBps,
      chunkMs: this.streamChunkMs,
      chunkBytes: this.chunkBytes,
      windowMs: this.windowMs,
      copies: this.copies,
      backedUpLinks: this.backedUpLinks,
      maxBufferedBytes: this.maxBufferedBytes,
      starved: this.budgetState.starved,
      cuts: this.cuts
    };
  }
  /** Carried host-only serves past the fanout cap, since this queue was
   *  built (survives reset(), like every stats counter). */
  get hostOnlyServed() {
    return this.hostOnlyServedTotal;
  }
  /** Denies since this queue was built, per reason. */
  get denied() {
    return { ...this.deniedTotal };
  }
  /**
   * The `chunks served` line, once per SERVE_ROLLUP_MS. Returns the record it
   * logged; null between periods and for an idle period (nothing queued,
   * served or denied).
   */
  rollup(e) {
    if (this.rollupStartMs === null)
      return this.rollupStartMs = e, null;
    const t = e - this.rollupStartMs;
    if (t < Sw) return null;
    const n = Object.values(this.deniedSinceRollup).reduce((o, a) => o + a, 0), r = this.queuedSinceRollup + this.servedSinceRollup + n === 0 ? null : {
      periodMs: t,
      queued: this.queuedSinceRollup,
      served: this.servedSinceRollup,
      bytes: this.bytesSinceRollup,
      depth: this.queue.length,
      denied: { ...this.deniedSinceRollup },
      cuts: this.cuts,
      budgetBps: Math.round(this.budgetBps),
      measuredBps: this.measuredBps === null ? null : Math.round(this.measuredBps),
      streamBps: Math.round(this.streamBps),
      copies: this.copies,
      backedUp: this.backedUpLinks,
      maxBufferedBytes: this.maxBufferedBytes,
      hostOnly: this.hostOnlySinceRollup
    };
    return r && it.debug("chunks served", { ...r }), this.clearRollup(), this.rollupStartMs = e, r;
  }
  clearRollup() {
    this.queuedSinceRollup = 0, this.servedSinceRollup = 0, this.bytesSinceRollup = 0, this.hostOnlySinceRollup = 0, this.deniedSinceRollup = Fi();
  }
  /** Epoch change / go-live reset. The link did not change, so the budget,
   *  the stream EWMAs and the deny/cut totals carry over. */
  reset() {
    it.info("serve queue reset", { depth: this.queue.length }), this.queue = [], this.servedCount.clear(), this.carriedServed.clear(), this.lastServedAt.clear(), this.dangerUsed.clear(), this.denyCap.reset(), this.dangerCap.reset(), this.clearRollup(), this.rollupStartMs = null, this.windowStartMs = null, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map();
  }
  get depth() {
    return this.queue.length;
  }
  timesServed(e) {
    return this.servedCount.get(e) ?? 0;
  }
}
const V = ne("swarm.node"), xw = 6e4, Da = 5;
class Tw {
  selfAddr;
  selfName;
  role;
  epoch;
  streamPubKeyHex;
  boxKey;
  streamKey;
  chunkMs;
  isResponder;
  /** Live lag the player keeps, in chunks: the pre-anchor placement and the
   *  window floor sit this far below the edge. The viewer's player owns it
   *  (setLagChunks); the host never changes it. */
  lagChunksValue = lf;
  callbacks;
  now;
  /** Fed by noteEdge: one observation per edge advance. */
  edgeCadence;
  book;
  store;
  scheduler;
  serve;
  dedup = new ow();
  presence = new aw();
  reactionLimiter = new cw(
    $f,
    zf
  );
  assembler = new Tp();
  /** The last CHAT_BACKLOG_LINES chat lines of this epoch, for new neighbors. */
  chatLog = [];
  /** Which epoch the neighbors' hellos say is current (assessment gap 13). */
  epochVotes = new iw();
  /** Newest epoch already reported through onEpochSuspected — the node does
   *  not move on a neighbor verdict, so this is what makes it fire once. */
  suspectedEpoch = 0;
  peers = /* @__PURE__ */ new Map();
  attachOpts = /* @__PURE__ */ new Map();
  neighborHaves = /* @__PURE__ */ new Map();
  metas = /* @__PURE__ */ new Map();
  pendingVerify = /* @__PURE__ */ new Map();
  /** `${seq}:${peer}` → want-send time, for throughput scoring. */
  wantSentAt = /* @__PURE__ */ new Map();
  /** Outbound/inbound mesh negotiations keyed by remote addr (glare-checked). */
  dials = /* @__PURE__ */ new Map();
  /** TEST HOOKS (Phase 5 e2e, armed only via the E2E-gated debug handles):
   *  discard the next N encoder chunks at seeding (creates a real seq hole —
   *  the gap-jump spec) / flip one payload byte in the next N serves to a
   *  given peer (the verify-drop-disconnect spec) / malform the next N chunks
   *  BEFORE signing (the issue-#5 poison-chunk spec: verifies fine everywhere,
   *  unplayable everywhere). */
  testDropSeedsLeft = 0;
  testCorruptServes = /* @__PURE__ */ new Map();
  testPoisonSeedsLeft = 0;
  /** Fake bulk backlog per neighbor, fed to the upload sampler only (the
   *  serve pump still reads the real bufferedAmount). The BUDGET spec. */
  testBacklogs = /* @__PURE__ */ new Map();
  /** Serves this node actually corrupted. The runner reads it through the
   *  E2E handle, because the log never reaches the browser console. */
  testCorruptedServeCount = 0;
  /** Next N serves to a peer send meta + slice 0 now, the rest `delayMs`
   *  later (the slice-progress timeout spec), and how many really were. */
  testDelayServes = /* @__PURE__ */ new Map();
  testDelayedServeCount = 0;
  /** Stand-in for a symmetric NAT (the NAT spec): answered outbound mesh
   *  dials are closed before they open, inbound offers are ignored. */
  testRefuseMeshDialsOn = !1;
  /** Host seats for host-only viewers, overriding the policy; null = policy. */
  testHostOnlySlotsOverride = null;
  tickTimer = null;
  lastSummaryAt = 0;
  /** Viewer: when the host link last delivered a chunk / last said host-full. */
  lastHostChunkAt = 0;
  lastHostFullDenyAt = 0;
  lastPresenceAt = 0;
  lastPexAt = 0;
  /** When the degree last fell below MIN_DEGREE; null while at or above it. */
  belowMinSinceMs = null;
  lastLinkSummaryAt = 0;
  linkSummaryRunning = !1;
  running = !1;
  counters = {
    chunksReceived: 0,
    chunksServed: 0,
    badChunks: 0,
    invalidCtrl: 0,
    invalidSlices: 0,
    skips: 0,
    heldDenies: 0,
    hostFullDenies: 0,
    sigForwarded: 0,
    downBytes: 0,
    upBytes: 0
  };
  receivedFrom = /* @__PURE__ */ new Map();
  dialCap = re(Da);
  sigCap = re(20);
  expiryCap = re(Da);
  /** Held-serve denies repeat while a requester's link stays congested. */
  heldCap = re(10);
  /** Host-only peers already logged as carried (one line each). */
  carriedLogged = /* @__PURE__ */ new Set();
  /** A refused host-only viewer re-wants every chunk. */
  refusedCap = re(5);
  constructor(e) {
    if (this.selfAddr = e.selfAddr, this.selfName = e.selfName, this.role = e.role, this.epoch = e.epoch, this.streamPubKeyHex = e.streamPubKeyHex, this.boxKey = e.boxKey, this.streamKey = e.streamKey ?? null, this.chunkMs = e.chunkMs ?? Wt, this.isResponder = e.responder ?? !1, this.callbacks = e.callbacks ?? {}, this.now = e.now ?? (() => Date.now()), e.role === "host" && !e.streamKey)
      throw new Error("host SwarmNode needs the stream signing key");
    this.book = e.role === "host" ? new La(e.selfAddr, { minDegree: 0, targetDegree: 0, maxDegree: No }) : new La(e.selfAddr, { hostAddr: e.hostAddr }), this.store = new sw(er), this.store.reset(this.epoch), this.scheduler = new gw({
      chunkMs: this.chunkMs,
      wantTimeoutChunks: e.wantTimeoutChunks
    }), this.edgeCadence = new gd(this.chunkMs);
    const t = e.fanoutCap !== void 0 ? e.fanoutCap : e.role === "host" ? void 0 : null;
    this.serve = t === void 0 ? Kn.host({ uploadBudgetBps: e.uploadBudgetBps, chunkMs: this.chunkMs }) : new Kn({
      uploadBudgetBps: e.uploadBudgetBps,
      fanoutCap: t,
      chunkMs: this.chunkMs
    });
  }
  // ── Lifecycle ──────────────────────────────────────────────────────────────
  start() {
    if (this.running) return;
    this.running = !0, V.info("node started", {
      self: b(this.selfAddr),
      role: this.role,
      epoch: this.epoch,
      tickMs: sr
    });
    const e = this.now();
    this.lastSummaryAt = e, this.lastPresenceAt = e, this.lastPexAt = e, this.lastLinkSummaryAt = e, this.tickTimer = setInterval(() => this.tick(), sr);
  }
  /** Tear down. `silent` skips the bye (spike uses it to simulate a crash). */
  stop(e) {
    V.info("node stopped", {
      role: this.role,
      neighbors: this.peers.size,
      silent: e?.silent ?? !1,
      ...this.counters
    }), this.tickTimer && (clearInterval(this.tickTimer), this.tickTimer = null), this.running = !1;
    for (const t of this.peers.values())
      e?.silent || t.sendCtrl({ v: ye, t: "bye" }), t.close();
    for (const t of this.dials.values()) t.peer.close();
    this.peers.clear(), this.dials.clear(), this.attachOpts.clear(), this.neighborHaves.clear();
  }
  /** Host re-go-live / heartbeat announced a new epoch: new seq space. */
  resetEpoch(e, t) {
    V.info("epoch reset", {
      from: this.epoch,
      to: e,
      rekeyed: t !== void 0,
      pendingVerify: this.pendingVerify.size
    }), this.epoch = e, t && (this.streamPubKeyHex = t), this.store.reset(e), this.scheduler.reset(), this.edgeCadence.reset(), this.serve.reset(), this.assembler.clear(), this.metas.clear(), this.pendingVerify.clear(), this.wantSentAt.clear(), this.heldCap.reset(), this.chatLog = [];
    for (const n of this.neighborHaves.values()) n.clear();
    this.book.holdReplacements(this.now());
  }
  /**
   * A neighbor's hello named its epoch (epochVotes.ts). An older epoch never
   * does anything, from anyone.
   *
   * The host link is believed alone: it re-went-live while we negotiated, and
   * the reset is the one the host-hello path always made. Any other neighbor
   * needs a second one to agree, so a single lying peer counts for nothing —
   * and even then the node does NOT move. A hello carries no stream key, and
   * only the statement-signed heartbeat does, so a node switched on hearsay
   * would fail to verify every chunk of the new epoch and strike the honest
   * neighbors serving them. The quorum is reported once per epoch through
   * onEpochSuspected, and the owner fetches the heartbeat; this node keeps
   * dropping the new epoch's metas and slices as foreign, without strikes.
   */
  considerEpoch(e, t, n) {
    this.epochVotes.record(e, t, n);
    const i = this.epochVotes.decide(this.epoch);
    if (i) {
      if (i.viaHost) {
        this.resetEpoch(i.epoch), this.callbacks.onEpochReset?.(i.epoch);
        return;
      }
      i.epoch <= this.suspectedEpoch || (this.suspectedEpoch = i.epoch, V.info("neighbors agree on a newer epoch — asking for the heartbeat", {
        from: this.epoch,
        to: i.epoch,
        voters: i.voters.map(b)
      }), this.callbacks.onEpochSuspected?.(i.epoch));
    }
  }
  // ── Peers in/out ───────────────────────────────────────────────────────────
  /**
   * Adopt a SwarmPeer (from joinSignaling or a mesh dial): wires handlers and,
   * once both channels are open, adds it to the neighbor set + says hello.
   */
  attachPeer(e, t) {
    V.debug("peer attached", {
      peer: b(e.addr),
      isHostLink: t?.isHostLink ?? !1,
      responder: t?.responder ?? !1,
      alreadyOpen: e.isOpen
    }), this.attachOpts.set(e.addr, t ?? {}), e.setHandlers({
      onCtrl: (n) => this.handleCtrl(e, n),
      onInvalidCtrl: () => {
        this.counters.invalidCtrl++;
      },
      onSlice: (n) => this.handleSlice(e, n),
      onInvalidSlice: () => {
        this.counters.invalidSlices++;
      },
      onOpen: () => this.onPeerOpen(e),
      onClose: () => this.onPeerClosed(e),
      onBulkDrain: () => this.pumpServe()
    }), e.isOpen && this.onPeerOpen(e);
  }
  onPeerOpen(e) {
    const t = this.peers.get(e.addr);
    t && t !== e && (this.epochVotes.forget(e.addr), t.close()), this.peers.set(e.addr, e), this.dials.delete(e.addr);
    const n = this.attachOpts.get(e.addr) ?? {};
    this.book.addNeighbor(e.addr, e.addr, this.now(), {
      isHostLink: n.isHostLink,
      responder: n.responder
    }), this.book.recordMeshLinkOpened(e.addr), this.neighborHaves.has(e.addr) || this.neighborHaves.set(e.addr, /* @__PURE__ */ new Set());
    const i = this.store.summary();
    e.sendCtrl({
      v: ye,
      t: "hello",
      addr: this.selfAddr,
      name: this.selfName,
      epoch: this.epoch,
      edgeSeq: this.store.edgeSeq,
      have: i,
      responder: this.isResponder || void 0,
      boxPub: this.boxKey.publicKeyHex,
      degree: this.peers.size,
      relayOnly: this.book.relayOnly
    }), V.debug("hello sent", {
      peer: b(e.addr),
      degree: this.peers.size,
      epoch: this.epoch,
      edgeSeq: this.store.edgeSeq
    }), this.flood({ ...this.floodFields(), t: "presence", name: this.selfName });
    for (const r of this.chatLog) e.sendCtrl({ ...r, t: "chat-backlog", epoch: this.epoch });
    this.callbacks.onPeersChanged?.();
  }
  onPeerClosed(e) {
    this.dials.get(e.addr)?.peer === e && this.dials.delete(e.addr), this.peers.get(e.addr) === e && this.removePeer(e.addr);
  }
  /** Drop a neighbor: book/scheduler/serve bookkeeping + close. Plan §6.4 —
   *  no subtree exists; a peer death affects only its own links. */
  removePeer(e, t) {
    const n = this.peers.get(e);
    n && (V.info("link dropped", {
      peer: b(e),
      notice: t?.t ?? null,
      reason: t?.t === "prune" ? t.reason : null,
      degree: this.peers.size - 1
    }), t && n.sendCtrl(t), this.peers.delete(e), this.attachOpts.delete(e), this.neighborHaves.delete(e), this.epochVotes.forget(e), this.book.removeNeighbor(e), this.scheduler.onPeerLost(e), this.serve.cancel(e), this.carriedLogged.delete(e), n.close(), this.role === "viewer" && this.peers.size === 1 && (V.info("summary sent early: degree dropped", { degree: this.peers.size }), this.sendSummary(this.now())), this.callbacks.onPeersChanged?.());
  }
  get neighborAddrs() {
    return [...this.peers.keys()];
  }
  /** Verified chunks received so far — cheap monotonic counter for callers
   *  that need "has data flowed since X" without building full stats(). */
  get chunksReceivedCount() {
    return this.counters.chunksReceived;
  }
  /** Seed sample for a welcome answer: our live peers, best-uptime first. */
  seedSample(e = 8) {
    return this.book.pexSample(e);
  }
  // ── Host seeding ───────────────────────────────────────────────────────────
  /** Host: sign + store a fresh encoder chunk and announce it (plan §2). The
   *  swarm pulls it from here — the ServeQueue's fanout cap bounds our upload.
   *  Returns null when a test hook discarded the chunk. */
  seedChunk(e) {
    if (!this.streamKey) throw new Error("seedChunk requires the stream key (host role)");
    if (this.testDropSeedsLeft > 0)
      return this.testDropSeedsLeft--, V.warn("test hook dropped a seeded chunk", { seq: e.seq }), null;
    let t = e;
    if (this.testPoisonSeedsLeft > 0) {
      this.testPoisonSeedsLeft--;
      const i = e.payload.slice();
      for (let r = 4; r < Math.min(8, i.length); r++) i[r] ^= 255;
      t = { ...e, payload: i }, V.warn("test hook poisoned a seeded chunk", { seq: e.seq });
    }
    const n = X0(this.streamKey, t, this.epoch);
    return this.store.insert({ meta: n, payload: t.payload }), this.serve.observeChunk(t.payload.length, n.durUs / 1e3), this.metas.set(n.seq, n), this.noteEdge(n.seq, this.now()), this.scheduler.observeChunkDur(n.durUs / 1e3), this.broadcastHave(n.seq), this.callbacks.onChunk?.(n, t.payload, "self"), n;
  }
  // ── Gossip out ─────────────────────────────────────────────────────────────
  /** Fields every flooded message carries (plan §5): dedup id = from:ts:nonce. */
  floodFields() {
    return {
      v: ye,
      from: this.selfAddr,
      ts: this.now(),
      nonce: Math.random().toString(36).slice(2, 10)
    };
  }
  /** Send a flooded message we authored (chat/reaction/poll/presence/end). */
  flood(e) {
    V.debug("flood tx", { type: e.t, neighbors: this.peers.size }), this.dedup.firstSight(wt(e), this.now()), e.t === "chat" && this.logChat(e), this.forwardFlood(e, null);
  }
  logChat(e) {
    const t = wt(e);
    this.chatLog.some((n) => wt(n) === t) || (this.chatLog.push(e), this.chatLog.length > Vf && this.chatLog.shift());
  }
  forwardFlood(e, t) {
    for (const [n, i] of this.peers)
      n !== t && i.sendCtrl(e);
  }
  // ── Playhead (player integration point: callbacks.getPlayhead) ─────────────
  get edgeSeq() {
    return this.scheduler.edgeSeq;
  }
  /** Where the scheduler's window starts, or null before the first placement.
   *  The feed anchors here, not on whichever chunk happens to land first. */
  get playheadSeq() {
    return this.scheduler.playheadSeq;
  }
  /** Observed chunk spacing (ms) the timing rules are measured in. */
  get chunkDurMs() {
    return this.scheduler.spacingMs();
  }
  get lagChunks() {
    return this.lagChunksValue;
  }
  /** The player's adaptive live lag: placement at edge − n before the feed
   *  anchors, window floor at edge − (n + HARD_SEEK_MARGIN_CHUNKS) after. */
  setLagChunks(e) {
    Number.isFinite(e) && e >= 1 && (this.lagChunksValue = Math.round(e));
  }
  /** Every edge advance goes through here so the edge cadence sees it. A
   *  jump of several seqs (a summary after missed HAVEs) is one observation
   *  spread over them. */
  noteEdge(e, t) {
    const n = this.scheduler.edgeSeq;
    this.scheduler.updateEdge(e);
    const i = this.scheduler.edgeSeq;
    i > n && this.edgeCadence.observe(t, i - n);
  }
  // ── Ctrl dispatch ──────────────────────────────────────────────────────────
  handleCtrl(e, t) {
    const n = this.now();
    switch (t.t) {
      case "hello": {
        const i = this.book.get(e.addr);
        i && (i.name = t.name, i.responder = t.responder ?? !1, i.boxPub = t.boxPub ?? i.boxPub), this.book.recordDegreeReport(e.addr, t.degree, t.relayOnly), i && this.role === "viewer" && this.considerEpoch(e.addr, t.epoch, i.isHostLink), this.neighborHaves.set(e.addr, jo(t.have)), this.noteEdge(t.edgeSeq, n);
        break;
      }
      case "have": {
        this.neighborHaves.get(e.addr)?.add(t.seq), this.noteEdge(Math.max(t.seq, t.edgeSeq), n);
        break;
      }
      case "summary": {
        this.neighborHaves.set(
          e.addr,
          jo({ base: t.base, bitmapHex: t.bitmapHex })
        ), this.book.recordSummary(e.addr, n, t.degree, t.relayOnly), this.noteEdge(t.edgeSeq, n);
        break;
      }
      case "want":
        this.handleWant(e, t.seq, t.deadlineMs);
        break;
      case "deny": {
        this.scheduler.onDeny(t.seq, e.addr), this.book.recordDeny(e.addr), this.wantSentAt.delete(`${t.seq}:${e.addr}`), t.detail === "host-full" && (this.lastHostFullDenyAt = n, this.counters.hostFullDenies++);
        break;
      }
      case "meta":
        this.handleMeta(e, t.meta);
        break;
      case "pex": {
        this.book.addCandidates(
          t.peers.filter((i) => i.addr !== this.selfAddr),
          this.now()
        );
        break;
      }
      case "sig":
        this.handleSig(e, t);
        break;
      case "end": {
        if (!this.dedup.firstSight(wt(t), n)) break;
        if (V.info("stream end received", { from: b(t.from), epoch: t.epoch }), !ew(this.streamPubKeyHex, t.epoch, t.sig)) {
          this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
          break;
        }
        this.forwardFlood(t, e.addr), this.callbacks.onEnd?.(t.epoch);
        break;
      }
      case "presence": {
        if (!this.dedup.firstSight(wt(t), n)) break;
        V.debug("flood rx", { type: t.t, from: b(t.from), via: b(e.addr) }), this.presence.touch(t.from, t.name, t.ts, n), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "reaction": {
        if (!this.dedup.firstSight(wt(t), n) || !this.reactionLimiter.allow(t.from, n)) break;
        V.debug("flood rx", { type: t.t, from: b(t.from), via: b(e.addr) }), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat":
      case "poll-open":
      case "poll-vote":
      case "poll-tally":
      case "poll-close": {
        if (!this.dedup.firstSight(wt(t), n)) break;
        V.debug("flood rx", { type: t.t, from: b(t.from), via: b(e.addr) }), t.t === "chat" && this.logChat(t), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat-backlog": {
        if (t.epoch !== this.epoch || !this.dedup.firstSight(wt(t), n)) break;
        const { epoch: i, ...r } = t, o = { ...r, t: "chat" };
        this.logChat(o), this.callbacks.onFlood?.(o);
        break;
      }
      case "bye": {
        this.presence.remove(e.addr), this.removePeer(e.addr);
        break;
      }
      case "prune": {
        V.info("pruned by neighbor", {
          peer: b(e.addr),
          reason: t.reason,
          degree: this.peers.size - 1
        }), t.reason === "scoring" && this.book.banCandidate(e.addr, n), this.removePeer(e.addr);
        break;
      }
    }
  }
  // ── Serving (plan §7.2) ────────────────────────────────────────────────────
  handleWant(e, t, n) {
    const i = this.now(), r = this.store.has(t);
    let o = !1;
    for (const [c, l] of this.neighborHaves)
      if (c !== e.addr && l.has(t)) {
        o = !0;
        break;
      }
    const a = this.hostOnlyStatus(e.addr), d = this.serve.request(e.addr, t, n, i, {
      hasChunk: r,
      othersHave: o,
      hostOnly: a
    });
    if (d.kind === "deny") {
      e.sendCtrl({ v: ye, t: "deny", seq: t, reason: d.reason, detail: d.detail }), d.detail === "host-full" && this.refusedCap.allow() && V.warn("host-only slots full: requester refused", {
        peer: b(e.addr),
        slots: this.hostOnlySlots(),
        hostOnlyNeighbors: this.hostOnlyNeighborCount(),
        refused: this.refusedCap.count()
      });
      return;
    }
    this.pumpServe();
  }
  /** Host seats for host-only viewers: HOST_ONLY_SLOTS, and never more than
   *  `copies − 1` of the measured budget, so the mesh keeps a full copy. */
  hostOnlySlots() {
    return this.testHostOnlySlotsOverride ?? Math.min(Gf, Math.max(0, this.serve.upload.copies - 1));
  }
  hostOnlyNeighborCount() {
    return this.book.list().filter((e) => this.book.hostOnly(e)).length;
  }
  /** Host only: a requester that reaches nobody but us holds a seat
   *  ('carried') or is past the seats ('refused'); anyone else, undefined. */
  hostOnlyStatus(e) {
    if (this.role !== "host") return;
    const t = this.book.get(e);
    if (!t || !this.book.hostOnly(t)) return;
    const n = this.hostOnlySlots();
    return this.book.hostOnlyCarried(n).has(e) ? (this.carriedLogged.has(e) || (this.carriedLogged.add(e), V.info("host-only neighbor carried past the fanout cap", {
      peer: b(e),
      source: t.relayOnly ? "advertised" : "degree",
      remoteDegree: t.remoteDegree,
      slots: n
    })), "carried") : "refused";
  }
  /** Drain the serve queue while bulk channels have headroom (plan §5). */
  pumpServe() {
    const e = this.now(), t = [];
    for (; ; ) {
      const n = this.serve.next(e);
      if (!n) break;
      const i = this.peers.get(n.peer);
      if (i?.isOpen) {
        if (i.bulkBufferedAmount > Dc) {
          t.push(n);
          continue;
        }
        this.serveChunk(i, n, e);
      }
    }
    for (const n of t) {
      if (this.serve.hold(n, e) === "held") continue;
      const i = this.peers.get(n.peer);
      i?.sendCtrl({ v: ye, t: "deny", seq: n.seq, reason: "busy" }), this.counters.heldDenies++, this.heldCap.allow() && V.warn("serve held too long — denying", {
        peer: b(n.peer),
        seq: n.seq,
        heldMs: Math.round(e - n.enqueuedAtMs),
        bufferedAmount: i?.bulkBufferedAmount ?? 0,
        heldDenies: this.counters.heldDenies
      });
    }
  }
  serveChunk(e, t, n) {
    const i = this.store.get(t.seq);
    if (!i) {
      e.sendCtrl({ v: ye, t: "deny", seq: t.seq, reason: "missing" });
      return;
    }
    let r = i.payload;
    const o = this.testCorruptServes.get(t.peer);
    o && (r = r.slice(), r[0] ^= 255, o <= 1 ? this.testCorruptServes.delete(t.peer) : this.testCorruptServes.set(t.peer, o - 1), this.testCorruptedServeCount += 1, V.warn("test hook corrupted a served chunk", {
      seq: t.seq,
      peer: b(t.peer)
    })), e.sendCtrl({ v: ye, t: "meta", meta: i.meta });
    const a = xp(this.epoch, t.seq, r), d = this.testDelayServes.get(t.peer);
    if (d && a.length > 1)
      d.left <= 1 ? this.testDelayServes.delete(t.peer) : d.left--, this.testDelayedServeCount += 1, V.warn("test hook delayed a served chunk", {
        seq: t.seq,
        peer: b(t.peer),
        delayMs: d.delayMs
      }), e.sendSlice(a[0]), setTimeout(() => {
        if (e.isOpen)
          for (const c of a.slice(1)) e.sendSlice(c);
      }, d.delayMs);
    else
      for (const c of a) e.sendSlice(c);
    this.serve.onServed(t, i.payload.length, n), this.counters.chunksServed++, this.counters.upBytes += i.payload.length;
  }
  // ── Receiving chunks (plan §4, §7.1) ───────────────────────────────────────
  handleMeta(e, t) {
    if (t.epoch !== this.epoch) return;
    if (!this.metas.has(t.seq)) {
      if (!Y0(this.streamPubKeyHex, t)) {
        V.warn("chunk meta rejected", { from: b(e.addr), seq: t.seq }), this.counters.badChunks++, this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
        return;
      }
      this.metas.set(t.seq, t);
    }
    this.noteEdge(t.seq, this.now());
    const n = this.pendingVerify.get(t.seq);
    n && (this.pendingVerify.delete(t.seq), this.finalizeChunk(t.seq, n.payload, n.from));
  }
  handleSlice(e, t) {
    if (t.epochLow !== bn(this.epoch) || this.store.has(t.seq)) return;
    const n = this.assembler.add(t);
    switch (n.kind) {
      case "invalid":
        this.counters.invalidSlices++;
        break;
      case "progress": {
        const i = this.now();
        if (this.scheduler.onSlice(t.seq, e.addr, i)) {
          const r = this.wantSentAt.get(`${t.seq}:${e.addr}`);
          r !== void 0 && this.book.recordFirstSlice(e.addr, (i - r) / this.scheduler.spacingMs());
        }
        break;
      }
      case "done":
        this.finalizeChunk(t.seq, n.payload, e.addr);
        break;
    }
  }
  finalizeChunk(e, t, n) {
    const i = this.metas.get(e);
    if (!i) {
      this.pendingVerify.set(e, { payload: t, from: n, atMs: this.now() });
      return;
    }
    if (!Q0(this.streamPubKeyHex, i, t)) {
      V.warn("chunk rejected: verification failed", {
        from: b(n),
        seq: e,
        bytes: t.length
      }), this.counters.badChunks++, this.scheduler.onDeny(e, n), this.book.recordBadChunk(n) && this.removePeer(n);
      return;
    }
    if (!this.store.insert({ meta: i, payload: t })) return;
    const r = this.book.get(n);
    r && this.book.isHost(r) && (this.lastHostChunkAt = this.now()), this.scheduler.onComplete(e), this.scheduler.observeChunkDur(i.durUs / 1e3), this.serve.observeChunk(t.length, i.durUs / 1e3), this.book.recordFulfilled(n);
    const o = `${e}:${n}`, a = this.wantSentAt.get(o);
    a !== void 0 && (this.book.recordDelivery(n, t.length, this.now() - a), this.wantSentAt.delete(o)), this.counters.chunksReceived++, this.counters.downBytes += t.length, this.receivedFrom.set(n, (this.receivedFrom.get(n) ?? 0) + 1), this.broadcastHave(e), this.callbacks.onChunk?.(i, t, n);
  }
  broadcastHave(e) {
    const t = { v: ye, t: "have", seq: e, edgeSeq: this.store.edgeSeq };
    for (const n of this.peers.values()) n.sendCtrl(t);
  }
  // ── Relayed SDP (plan §6.3) ────────────────────────────────────────────────
  handleSig(e, t) {
    if (t.path.includes(this.selfAddr)) return;
    if (t.target === this.selfAddr) {
      t.kind === "offer" ? this.answerMeshOffer(t, e.addr) : this.completeMeshDial(t);
      return;
    }
    if (t.path.length > tr) {
      this.sigCap.allow("hop-cap") && V.debug("sig dropped: hop cap reached", {
        target: b(t.target),
        hops: t.path.length,
        cap: tr
      });
      return;
    }
    const n = { ...t, path: [...t.path, this.selfAddr] };
    let i = 0;
    const r = this.peers.get(t.target);
    if (r) {
      r.sendCtrl(n), this.counters.sigForwarded++, this.logSigForward(t, 1);
      return;
    }
    for (const [o, a] of this.peers)
      o === e.addr || t.path.includes(o) || (a.sendCtrl(n), this.counters.sigForwarded++, i++);
    this.logSigForward(t, i);
  }
  /** The relay line repeats on a busy mesh — cap it, then count only. */
  logSigForward(e, t) {
    t === 0 || !this.sigCap.allow() || V.debug("sig relayed", {
      kind: e.kind,
      from: b(e.from),
      target: b(e.target),
      hops: e.path.length,
      fanout: t,
      relayed: this.sigCap.count()
    });
  }
  /** Route a sig we authored: straight to the target if it's (about to be) a
   *  neighbor's job to deliver; prefer the link the counterpart used. */
  routeSig(e, t) {
    if (!(t && this.peers.get(t)?.sendCtrl(e)))
      for (const n of this.peers.values()) n.sendCtrl(e);
  }
  /** Dial a PEX/seed candidate over the mesh — no Statement Store involved. */
  async meshDial(e) {
    const t = e.addr;
    if (t === this.selfAddr || this.peers.has(t) || this.dials.has(t)) return;
    if (!e.boxPub) {
      this.dialCap.allow("no-box-key") && V.warn("mesh dial skipped: candidate has no box key", {
        target: b(t),
        skipped: this.dialCap.count("no-box-key")
      });
      return;
    }
    V.debug("mesh dial started", { target: b(t), degree: this.peers.size });
    const n = new wr(t, { gatherTimeoutMs: Do });
    this.dials.set(t, { peer: n, atMs: this.now(), outbound: !0 }), this.attachPeer(n);
    try {
      const i = await n.createOffer();
      this.routeSig({
        v: ye,
        t: "sig",
        target: t,
        from: this.selfAddr,
        kind: "offer",
        sealed: await fr(e.boxPub, i.sdp ?? ""),
        boxPub: this.boxKey.publicKeyHex,
        path: [this.selfAddr]
      });
    } catch (i) {
      V.warn("mesh dial failed", { target: b(t), err: i }), this.dials.delete(t), n.close();
    }
  }
  async answerMeshOffer(e, t) {
    if (this.testRefuseMeshDialsOn) return;
    if (this.peers.has(e.from)) {
      this.dialCap.allow("offer-from-neighbor") && V.info("mesh offer ignored: still linked to the sender", {
        from: b(e.from),
        ignored: this.dialCap.count("offer-from-neighbor")
      });
      return;
    }
    let n;
    try {
      n = await pr(this.boxKey, e.sealed);
    } catch {
      V.warn("mesh offer dropped: the sealed sdp did not open", {
        from: b(e.from),
        via: b(t)
      });
      return;
    }
    const i = this.dials.get(e.from);
    if (i) {
      if (V.debug("mesh dial glare", {
        from: b(e.from),
        ourOfferWins: this.selfAddr < e.from
      }), this.selfAddr < e.from) return;
      i.peer.close(), this.dials.delete(e.from);
    }
    const r = new wr(e.from, { gatherTimeoutMs: Do });
    this.dials.set(e.from, { peer: r, atMs: this.now(), outbound: !1 }), this.attachPeer(r);
    try {
      const o = await r.acceptOffer({ type: "offer", sdp: n });
      this.routeSig(
        {
          v: ye,
          t: "sig",
          target: e.from,
          from: this.selfAddr,
          kind: "answer",
          sealed: await fr(e.boxPub, o.sdp ?? ""),
          boxPub: this.boxKey.publicKeyHex,
          path: [this.selfAddr]
        },
        t
      );
    } catch (o) {
      V.warn("mesh answer failed", { to: b(e.from), err: o }), this.dials.delete(e.from), r.close();
    }
  }
  async completeMeshDial(e) {
    const t = this.dials.get(e.from);
    if (t)
      try {
        const n = await pr(this.boxKey, e.sealed);
        await t.peer.acceptAnswer({ type: "answer", sdp: n }), t.peer.waitOpen().catch(() => {
          this.running && this.onMeshDialFailed(e.from, t.peer.closeReason);
        }), this.testRefuseMeshDialsOn && (V.warn("test hook refused a mesh dial", { target: b(e.from) }), t.peer.close());
      } catch (n) {
        V.warn("mesh dial completion failed", { from: b(e.from), err: n }), this.dials.delete(e.from), t.peer.close();
      }
  }
  onMeshDialFailed(e, t) {
    this.book.recordDialFailure(e, this.now(), Kf * this.scheduler.spacingMs()), V.warn("mesh dial failed after the answer arrived", {
      target: b(e),
      closeReason: t,
      streak: this.book.dialFailStreak,
      limit: nr
    });
  }
  // ── Tick ───────────────────────────────────────────────────────────────────
  tick() {
    const e = this.now();
    if (this.serve.observeLinks(
      [...this.peers.values()].filter((o) => o.isOpen).map((o) => ({
        peer: o.addr,
        buffered: this.sampleTestBacklog(o.addr) ?? o.bulkBufferedAmount,
        sent: o.bulkSentBytes
      })),
      e
    ), this.role === "viewer") {
      const o = this.scheduler.edgeSeq;
      if (o >= 0) {
        const a = (l) => this.store.has(l), d = this.callbacks.getPlayhead?.() ?? null;
        let c;
        if (d === null)
          c = this.scheduler.advancePlayhead(
            Math.max(0, o - this.lagChunks),
            null,
            a,
            e
          );
        else {
          const l = o - (d.started ? this.lagChunks + _f : this.lagChunks);
          c = this.scheduler.advancePlayhead(
            Math.max(d.seq, l),
            d.remainingMs === null ? null : e + d.remainingMs,
            a,
            e
          );
        }
        for (const l of c)
          this.counters.skips++, this.assembler.drop(bn(this.epoch), l), this.pendingVerify.delete(l), this.callbacks.onSkip?.(l);
      }
    }
    if (this.role === "viewer") {
      const o = this.book.list().map((d) => ({
        addr: d.addr,
        score: this.book.score(d.addr),
        has: (c) => this.neighborHaves.get(d.addr)?.has(c) ?? !1
      })), a = this.scheduler.plan(e, o, (d) => this.store.has(d));
      for (const d of a)
        switch (d.type) {
          case "want": {
            this.peers.get(d.peer)?.sendCtrl({
              v: ye,
              t: "want",
              seq: d.seq,
              deadlineMs: Math.min(6e5, Math.max(0, d.deadlineMs))
            }) ? this.wantSentAt.set(`${d.seq}:${d.peer}`, e) : this.scheduler.onDeny(d.seq, d.peer);
            break;
          }
          case "cancel":
            this.book.recordTimeout(d.peer), this.wantSentAt.delete(`${d.seq}:${d.peer}`);
            break;
          case "skip":
            this.counters.skips++, this.assembler.drop(bn(this.epoch), d.seq), this.pendingVerify.delete(d.seq), this.callbacks.onSkip?.(d.seq);
            break;
        }
    }
    this.serve.setChunkMs(this.scheduler.spacingMs()), this.pumpServe(), e - this.lastSummaryAt >= Uc && this.sendSummary(e);
    for (const o of this.book.deadPeers(e))
      V.warn("neighbor missed its summaries — dropping", {
        peer: b(o),
        silentMs: e - (this.book.get(o)?.lastSummaryAtMs ?? e),
        limitMs: Nc
      }), this.removePeer(o);
    if (e - this.lastPresenceAt >= Ff && (this.lastPresenceAt = e, this.flood({ ...this.floodFields(), t: "presence", name: this.selfName })), e - this.lastPexAt >= zc) {
      this.lastPexAt = e;
      for (const [o, a] of this.peers)
        a.sendCtrl({
          v: ye,
          t: "pex",
          peers: this.book.pexSample(Pr, o)
        });
    }
    e - this.lastLinkSummaryAt >= xw && !this.linkSummaryRunning && (this.lastLinkSummaryAt = e, this.logLinkSummary());
    let t = 0;
    for (const o of this.dials.values()) o.outbound && t++;
    const n = this.book.dialTargets(e, t), i = this.book.maxDialsInFlight - t - n.length;
    for (const o of n)
      this.meshDial(o);
    if (this.role === "host")
      for (const o of this.book.hostPruneTargets(
        No,
        yf
      ))
        this.removePeer(o, { v: ye, t: "prune", reason: "bootstrap-rotation" });
    else {
      const o = this.book.pruneTargets(e);
      for (const a of o)
        this.removePeer(a, { v: ye, t: "prune", reason: "over-degree" });
      if (o.length === 0 && i >= 1) {
        const a = this.book.replaceTarget(e);
        a && (this.removePeer(a.victim.addr, { v: ye, t: "prune", reason: "scoring" }), this.meshDial(a.candidate));
      }
      this.book.isStarved && this.belowMinSinceMs === null ? (this.belowMinSinceMs = e, V.warn("degree below min", {
        degree: this.book.size,
        minDegree: this.book.minDegree,
        pool: this.book.candidateCount,
        dialsInFlight: t
      })) : !this.book.isStarved && this.belowMinSinceMs !== null && (V.info("degree restored", {
        degree: this.book.size,
        belowMs: e - this.belowMinSinceMs
      }), this.belowMinSinceMs = null);
    }
    for (const [o, a] of this.dials)
      e - a.atMs > zo && (this.dialCap.allow("timeout") && V.warn("mesh dial timed out", {
        target: b(o),
        timeoutMs: zo,
        timedOut: this.dialCap.count("timeout")
      }), this.dials.delete(o), a.peer.close());
    for (const [o, a] of this.pendingVerify)
      e - a.atMs > 3 * this.chunkMs && (this.expiryCap.allow("pending-verify") && V.warn("chunk dropped: its meta never arrived", {
        seq: o,
        from: b(a.from),
        expired: this.expiryCap.count("pending-verify")
      }), this.pendingVerify.delete(o), this.book.recordTimeout(a.from));
    const r = this.store.edgeSeq - 2 * er;
    if (r > 0) {
      for (const o of this.metas.keys()) o < r && this.metas.delete(o);
      for (const o of this.wantSentAt.keys())
        Number(o.slice(0, o.indexOf(":"))) < r && this.wantSentAt.delete(o);
    }
  }
  /** Our HAVE window, edge, degree and relayOnly to every neighbor. */
  sendSummary(e) {
    this.lastSummaryAt = e;
    const t = this.store.summary(), n = {
      v: ye,
      t: "summary",
      base: t.base,
      bitmapHex: t.bitmapHex,
      edgeSeq: this.store.edgeSeq,
      degree: this.peers.size,
      relayOnly: this.book.relayOnly
    };
    for (const i of this.peers.values()) i.sendCtrl(n);
  }
  // ── Test hooks (armed only via the E2E-gated debug handles) ───────────────
  /** Discard the next `count` seeded chunks (host) — creates a real seq hole. */
  testDropSeeds(e) {
    this.testDropSeedsLeft += Math.max(0, Math.floor(e));
  }
  /** Flip a byte in the next `count` chunk payloads served to `addr`. */
  testCorruptServesTo(e, t) {
    t > 0 ? this.testCorruptServes.set(e, Math.floor(t)) : this.testCorruptServes.delete(e);
  }
  /** Send only the first slice of the next `count` chunks served to `addr`
   *  at once and the rest `delayMs` later; count 0 disarms. */
  testDelayServesTo(e, t, n) {
    t > 0 ? this.testDelayServes.set(e, { left: Math.floor(t), delayMs: Math.max(0, n) }) : this.testDelayServes.delete(e);
  }
  /** Malform the next `count` seeded chunks BEFORE signing (issue #5 repro):
   *  validly signed, unplayable — the swarm distributes them happily. */
  testPoisonSeeds(e) {
    this.testPoisonSeedsLeft += Math.max(0, Math.floor(e));
  }
  /** Overwrite one neighbor's fulfil EWMA so the replacement policy can be
   *  driven deterministically. Age and the pool are untouched. */
  testScorePeer(e, t) {
    const n = this.book.get(e);
    n && (n.fulfillEwma = t, V.warn("test hook set a neighbor score", { peer: b(e), fulfill: t }));
  }
  /** Report `bytes` as `addr`'s bulk backlog to the upload sampler; null
   *  clears it. A backed-up queue, without throttling a link. */
  testBacklog(e, t) {
    t === null ? this.testBacklogs.delete(e) : this.testBacklogs.set(e, Math.max(0, Math.floor(t)));
  }
  /** The fake backlog grows a byte per sample: a real backed-up queue moves
   *  every tick, and a constant one reads as a frozen link (not active)
   *  in any window the host served that link nothing. */
  sampleTestBacklog(e) {
    const t = this.testBacklogs.get(e);
    return t !== void 0 && this.testBacklogs.set(e, t + 1), t;
  }
  /** On: drop every link but the host's, close pending dials, and from now
   *  on close each answered outbound dial before it opens (so the real
   *  failure count runs) and ignore inbound offers. Off: dial normally. */
  testRefuseMeshDials(e) {
    if (this.testRefuseMeshDialsOn = e, V.warn("test hook set mesh-dial refusal", { on: e }), !!e) {
      for (const t of [...this.peers.keys()]) {
        const n = this.book.get(t);
        (!n || !this.book.isHost(n)) && this.removePeer(t);
      }
      for (const t of [...this.dials.values()]) t.peer.close();
    }
  }
  /** Host seats for host-only viewers; null restores the policy. */
  testHostOnlySlots(e) {
    this.testHostOnlySlotsOverride = e === null ? null : Math.max(0, Math.floor(e)), V.warn("test hook overrode host-only slots", { slots: this.testHostOnlySlotsOverride });
  }
  /** Sever every neighbor (no bye) and empty the candidate pool — the
   *  issue-#7 absorbing state (`neighbors=0, candidates=0`), reached
   *  deterministically instead of racing PEX against a neighbor kill. */
  testOrphan() {
    for (const e of [...this.peers.keys()]) this.removePeer(e);
    this.book.clearCandidates(), V.warn("test hook orphaned the node: neighbors severed, candidate pool cleared");
  }
  // ── Introspection ──────────────────────────────────────────────────────────
  /** Everyone the presence gossip currently knows, by SS58 and self-name.
   *  The room store keeps them for the session; the tip feed reverse-maps a
   *  tipper's H160 onto them (lib/identity/tipperName). */
  presencePeers() {
    const e = this.presence.live(this.now()).map((t) => ({ address: t.addr, name: t.name }));
    return [{ address: this.selfAddr, name: this.selfName }, ...e];
  }
  stats() {
    const e = this.now();
    let t = -1 / 0;
    for (const n of this.peers.keys()) {
      const i = this.book.get(n);
      i && i.lastSummaryAtMs > t && (t = i.lastSummaryAtMs);
    }
    return {
      neighbors: this.peers.size,
      candidates: this.book.candidateCount,
      edgeSeq: this.scheduler.edgeSeq,
      edgeCadence: this.edgeCadence.snapshot(e),
      neighborHeardMs: t === -1 / 0 ? null : Math.max(0, e - t),
      storeSize: this.store.size,
      serveDepth: this.serve.depth,
      ...this.counters,
      chunkDurMs: Math.round(this.scheduler.spacingMs()),
      ...this.scheduler.counters(),
      dangerServes: this.serve.dangerServes,
      receivedFrom: Object.fromEntries(this.receivedFrom),
      presenceCount: this.presence.liveCount(this.now()),
      upload: this.serve.upload,
      denied: this.serve.denied,
      relayOnly: this.book.relayOnly,
      dialFailStreak: this.book.dialFailStreak,
      dialsPaused: this.book.dialsPaused(e),
      hostOnlyServed: this.serve.hostOnlyServed,
      hostOnlyNeighbors: this.hostOnlyNeighborCount(),
      lastHostChunkAt: this.lastHostChunkAt,
      lastHostFullDenyAt: this.lastHostFullDenyAt
    };
  }
  /** One `links` line: the link count and the median RTT per ICE path. */
  async logLinkSummary() {
    if (this.peers.size !== 0) {
      this.linkSummaryRunning = !0;
      try {
        const e = await Promise.all([...this.peers.values()].map((i) => i.linkStats())), t = { direct: 0, stun: 0, turn: 0, unknown: 0 }, n = { direct: [], stun: [], turn: [] };
        for (const { path: i, rttMs: r } of e) {
          if (!i) {
            t.unknown++;
            continue;
          }
          t[i]++, r !== null && n[i].push(r);
        }
        V.info("links", {
          total: e.length,
          ...t,
          rttMs: { direct: Li(n.direct), stun: Li(n.stun), turn: Li(n.turn) }
        });
      } finally {
        this.linkSummaryRunning = !1;
      }
    }
  }
  /** Per-neighbor snapshot for the mesh control panel: PeerBook scoring +
   *  live link state + selected-ICE-pair introspection. Read-only. */
  async neighborDetails() {
    return Promise.all(
      this.book.list().map(async (e) => {
        const t = this.peers.get(e.addr), n = t ? await t.linkStats() : { path: null, rttMs: null };
        return {
          addr: e.addr,
          name: e.name,
          isHostLink: e.isHostLink,
          responder: e.responder,
          connectedAtMs: e.connectedAtMs,
          score: this.book.score(e.addr),
          fulfillEwma: e.fulfillEwma,
          denyEwma: e.denyEwma,
          throughputBpsEwma: e.throughputBpsEwma,
          badChunkStrikes: e.badChunkStrikes,
          remoteDegree: e.remoteDegree,
          chunksReceivedFrom: this.receivedFrom.get(e.addr) ?? 0,
          connectionState: t?.connectionState ?? null,
          bulkBufferedAmount: t?.bulkBufferedAmount ?? 0,
          path: n.path,
          rttMs: n.rttMs
        };
      })
    );
  }
}
function Li(s) {
  if (s.length === 0) return null;
  const e = [...s].sort((n, i) => n - i), t = e.length >> 1;
  return e.length % 2 ? e[t] : Math.round((e[t - 1] + e[t]) / 2);
}
const xt = ne("swarm.host");
class Ew {
  epoch;
  codecs;
  node;
  key;
  /** Session box keypair — sealed-SDP recipient key for joins and mesh dials. */
  boxKey;
  responder;
  pipeline;
  chunkMs;
  audioContext;
  started = !1;
  ended = !1;
  startedAtMs = 0;
  /** Last responder count published, so only a change logs at `info`. */
  lastResponderCount = -1;
  constructor(e) {
    this.epoch = e.epoch, this.codecs = e.codecs, this.chunkMs = e.chunkMs ?? Wt, this.audioContext = e.audioContext, this.key = K0(), this.boxKey = L0(), xt.info("host created", {
      self: b(e.selfAddr),
      epoch: e.epoch,
      streamPubKey: Te(this.key.publicKeyHex),
      boxPub: Te(this.boxKey.publicKeyHex),
      codecs: e.codecs.mimeType
    });
    const t = e.callbacks ?? {};
    this.node = new Tw({
      selfAddr: e.selfAddr,
      selfName: e.selfName,
      role: "host",
      epoch: e.epoch,
      streamPubKeyHex: this.key.publicKeyHex,
      boxKey: this.boxKey,
      streamKey: this.key,
      chunkMs: this.chunkMs,
      callbacks: {
        onFlood: t.onFlood,
        onPeersChanged: t.onPeersChanged
      }
    }), this.responder = new W0({
      selfAddr: e.selfAddr,
      boxKey: this.boxKey,
      transport: e.transport,
      getEpoch: () => this.node.epoch,
      getEdgeSeq: () => this.node.store.edgeSeq,
      getSeeds: () => this.node.seedSample(Vo),
      onPeer: (n) => this.node.attachPeer(n)
    }), this.pipeline = new Oy({
      canvas: e.canvas,
      audioContext: e.audioContext,
      audioSource: e.audioSource,
      codecs: e.codecs,
      chunkMs: this.chunkMs,
      onChunk: (n) => {
        this.node.seedChunk(n);
      },
      onError: (n) => t.onEncoderError?.(n)
    });
  }
  /** Hex stream public key — what the heartbeat advertises (plan §4). */
  get streamPubKeyHex() {
    return this.key.publicKeyHex;
  }
  async start() {
    if (this.started) throw new Error("SwarmHost already started");
    if (this.started = !0, this.startedAtMs = Date.now(), xt.info("go live started", { epoch: this.epoch, chunkMs: this.chunkMs }), this.audioContext.state === "suspended")
      try {
        await this.audioContext.resume();
      } catch {
      }
    this.node.start(), this.responder.start();
    try {
      await this.pipeline.start();
    } catch (e) {
      throw xt.error("go live failed: the encoder did not start", {
        epoch: this.epoch,
        elapsedMs: Date.now() - this.startedAtMs,
        err: e
      }), this.stopSwarm(), e;
    }
    xt.info("go live ready", { epoch: this.epoch, elapsedMs: Date.now() - this.startedAtMs });
  }
  /** Join negotiations in flight right now. The only thing that must not be
   *  disturbed while repairing this host's signal subscription. */
  get joinsInFlight() {
    return this.responder.inFlight;
  }
  /** Heartbeat mesh section — everything a viewer needs to trust and join
   *  (plan §10). `responders` = longest-uptime neighbors that opted in via
   *  the hello flag (§6.2a); joiners rendezvous-hash over them + the host.
   *  Only responders whose box key we know are listed — a joiner can't seal
   *  a swarm-join to a keyless responder. */
  mesh() {
    const e = this.node.book.responderSample(Vo).filter((n) => n.boxPub !== null), t = {
      [this.node.selfAddr]: this.boxKey.publicKeyHex
    };
    for (const n of e) t[n.addr] = n.boxPub;
    return e.length !== this.lastResponderCount && (xt.info("responder list changed", {
      responders: e.length,
      was: this.lastResponderCount < 0 ? null : this.lastResponderCount,
      neighbors: this.node.book.size
    }), this.lastResponderCount = e.length), xt.debug("heartbeat mesh", {
      epoch: this.epoch,
      edgeSeq: this.node.store.edgeSeq,
      responders: e.length,
      boxPubs: Object.keys(t).length
    }), {
      streamPubKey: this.key.publicKeyHex,
      epoch: this.epoch,
      chunkMs: this.chunkMs,
      codecs: this.codecs.mimeType,
      edgeSeq: this.node.store.edgeSeq,
      responders: e.length > 0 ? e.map((n) => n.addr) : void 0,
      boxPubs: t
    };
  }
  // ── Gossip authority (plan §8) ────────────────────────────────────────────
  /** `ts` must equal the fallback statement's timestamp: consumers dedup
   *  chat by `${from}-${ts}`, so the flood and the statement replay of the
   *  same message must produce the same id. */
  sendChat(e, t, n) {
    if (t.length === 0) return;
    const i = this.node.floodFields();
    n !== void 0 && (i.ts = n), this.node.flood({ ...i, t: "chat", senderName: e, text: t });
  }
  sendReaction(e) {
    this.node.flood({ ...this.node.floodFields(), t: "reaction", emoji: e });
  }
  pollOpen(e) {
    this.node.flood({ ...this.node.floodFields(), t: "poll-open", ...e });
  }
  pollTally(e, t, n) {
    this.node.flood({ ...this.node.floodFields(), t: "poll-tally", pollId: e, tallies: t, totalVotes: n });
  }
  pollClose(e) {
    this.node.flood({ ...this.node.floodFields(), t: "poll-close", pollId: e });
  }
  // ── Introspection ─────────────────────────────────────────────────────────
  stats() {
    return { swarm: this.node.stats(), encoder: this.pipeline.stats };
  }
  // ── Teardown ──────────────────────────────────────────────────────────────
  /**
   * Orderly stream end: flood the host-signed `end` (viewers learn instantly,
   * quota-free — the caller's ended heartbeat tells the lobby), flush the
   * encoder, drop the swarm.
   * Idempotent — unmount cleanup and endBroadcast can both call it.
   */
  async end() {
    if (!this.ended) {
      this.ended = !0, xt.info("stream ending", {
        epoch: this.epoch,
        liveMs: this.startedAtMs > 0 ? Date.now() - this.startedAtMs : 0,
        neighbors: this.node.book.size
      }), this.node.flood({
        ...this.node.floodFields(),
        t: "end",
        epoch: this.epoch,
        sig: J0(this.key, this.epoch)
      });
      try {
        await this.pipeline.stop();
      } catch (e) {
        xt.error("encoder stop failed — teardown continues", { epoch: this.epoch, err: e });
      }
      this.stopSwarm();
    }
  }
  stopSwarm() {
    this.responder.stop(), this.node.stop();
  }
}
class Cw {
  ctx = null;
  destination = null;
  masterBus = null;
  persistentNodes = [];
  micNode = null;
  systemNode = null;
  /** Mix the given tracks into one output track. Any null/undefined inputs
   *  are ignored (a mixer with no inputs produces silence — the pipeline
   *  stays uniform and the encoder tap still gets its clock). Returns the
   *  mixed audio track (single-track MediaStream). */
  start(e) {
    if (this.ctx) throw new Error("AudioMixer: already running");
    this.ctx = new AudioContext({ sampleRate: cf }), this.destination = this.ctx.createMediaStreamDestination(), this.masterBus = this.ctx.createGain(), this.masterBus.connect(this.destination), e.mic && this.setMicSource(e.mic), e.system && this.setSystemSource(e.system);
    const [t] = this.destination.stream.getAudioTracks();
    if (!t)
      throw new Error("AudioMixer: no output track generated — check that AudioContext is permitted");
    return t;
  }
  /** Swap the microphone source. Pass null to remove. */
  setMicSource(e) {
    if (!(!this.ctx || !this.masterBus)) {
      if (this.micNode) {
        try {
          this.micNode.disconnect();
        } catch {
        }
        this.micNode = null;
      }
      if (e) {
        const t = new MediaStream([e]);
        this.micNode = this.ctx.createMediaStreamSource(t), this.micNode.connect(this.masterBus);
      }
    }
  }
  /** Swap the system-audio source (from screen capture). Pass null to remove. */
  setSystemSource(e) {
    if (!(!this.ctx || !this.masterBus)) {
      if (this.systemNode) {
        try {
          this.systemNode.disconnect();
        } catch {
        }
        this.systemNode = null;
      }
      if (e) {
        const t = new MediaStream([e]);
        this.systemNode = this.ctx.createMediaStreamSource(t), this.systemNode.connect(this.masterBus);
      }
    }
  }
  /** Expose the underlying AudioContext so clip synthesisers can build
   *  AudioBuffers in the same context (required — AudioBufferSourceNode
   *  must be created on the same context it plays into). */
  getContext() {
    return this.ctx;
  }
  /** The master bus carrying the full broadcast mix — the encoder pipeline's
   *  tap point (plan §3: AudioWorklet PCM tap at the mixer output). */
  getOutputNode() {
    return this.masterBus;
  }
  /**
   * Play a one-shot AudioBuffer mixed into the broadcast AND the host's
   * speakers. Routed through a per-play GainNode (default 0.6, sits under
   * voice). Resolves when playback finishes. No-op if the mixer isn't running.
   *
   * The mic source intentionally does NOT connect to ctx.destination (that
   * would create a feedback loop) — only clips are monitored locally.
   */
  async playClip(e, t = 0.6) {
    if (!this.ctx || !this.masterBus) return;
    if (this.ctx.state === "suspended")
      try {
        await this.ctx.resume();
      } catch {
      }
    const n = this.ctx.createBufferSource();
    n.buffer = e;
    const i = this.ctx.createGain();
    i.gain.value = t;
    const r = this.ctx.createGain();
    r.gain.value = t, n.connect(i).connect(this.masterBus), n.connect(r).connect(this.ctx.destination), await new Promise((o) => {
      const a = () => {
        try {
          n.disconnect();
        } catch {
        }
        try {
          i.disconnect();
        } catch {
        }
        try {
          r.disconnect();
        } catch {
        }
        o();
      };
      n.onended = a, n.start();
    });
  }
  stop() {
    for (const e of this.persistentNodes)
      try {
        e.disconnect();
      } catch {
      }
    if (this.persistentNodes = [], this.micNode) {
      try {
        this.micNode.disconnect();
      } catch {
      }
      this.micNode = null;
    }
    if (this.systemNode) {
      try {
        this.systemNode.disconnect();
      } catch {
      }
      this.systemNode = null;
    }
    if (this.masterBus) {
      try {
        this.masterBus.disconnect();
      } catch {
      }
      this.masterBus = null;
    }
    if (this.destination) {
      for (const e of this.destination.stream.getTracks()) e.stop();
      this.destination = null;
    }
    this.ctx && (this.ctx.close(), this.ctx = null);
  }
}
const Va = /* @__PURE__ */ new Map();
function Tt(s) {
  const e = Va.get(s);
  if (e !== void 0) return e;
  if (typeof document > "u") return "";
  const t = getComputedStyle(document.documentElement).getPropertyValue(s).trim();
  return t && Va.set(s, t), t;
}
const Aw = () => ({
  isHidden: () => document.visibilityState === "hidden",
  raf: (s) => requestAnimationFrame(s),
  caf: (s) => cancelAnimationFrame(s),
  startInterval: yd
});
class Bw {
  constructor(e, t, n = {}) {
    this.paint = e, this.periodMs = t, this.deps = { ...Aw(), ...n };
  }
  deps;
  rafHandle = null;
  timer = null;
  running = !1;
  /** The clock painting now. */
  get mode() {
    return this.rafHandle != null ? "raf" : this.timer ? `${this.timer.mode}-interval` : "off";
  }
  /** Arm the clock that fits the current visibility. */
  start() {
    this.running = !0, this.arm();
  }
  /** Switch clocks when the visibility no longer matches the armed one.
   *  Returns true when a switch happened; false before start(), after stop(),
   *  and for a repeated change to the state already in effect. */
  onVisibilityChange() {
    return !this.running || this.deps.isHidden() === (this.timer !== null) ? !1 : (this.disarm(), this.arm(), !0);
  }
  /** Cancel whichever clock is armed. No paint runs after it returns. */
  stop() {
    this.running = !1, this.disarm();
  }
  /** Idempotent: never a second rAF or a second interval beside the one painting. */
  arm() {
    !this.running || this.timer !== null || this.rafHandle != null || (this.deps.isHidden() ? this.timer = this.deps.startInterval(this.paint, this.periodMs) : this.nextFrame());
  }
  disarm() {
    this.rafHandle != null && (this.deps.caf(this.rafHandle), this.rafHandle = null), this.timer?.stop(), this.timer = null;
  }
  nextFrame() {
    this.rafHandle = this.deps.raf(() => {
      this.rafHandle = null, !(!this.running || this.timer !== null) && (this.paint(), this.nextFrame());
    });
  }
}
const Ui = ne("media.compositor"), Mw = re(3);
class Iw {
  canvas;
  ctx;
  screenVideo;
  cameraVideo;
  width;
  height;
  fps;
  pipScale;
  pipPadding;
  pipRadius;
  /** rAF while the document is visible; a worker-hosted interval at the
   *  capture rate while it is hidden, where rAF is paused (paintClock.ts). */
  paintClock;
  output = null;
  running = !1;
  scene = "camera";
  brb = {};
  overlays = [];
  /** Crossfade state — if non-null, `paint()` blends from `fadeFromScene`
   *  into `scene` over `FADE_MS`. Starts at the `setScene` call. */
  fadeFromScene = null;
  fadeStart = 0;
  fadeMs = 200;
  constructor(e = {}) {
    this.width = e.width ?? 1280, this.height = e.height ?? 720, this.fps = e.fps ?? 30, this.pipScale = e.pipScale ?? 0.2, this.pipPadding = e.pipPadding ?? 24, this.pipRadius = e.pipRadius ?? 12, this.paintClock = new Bw(() => this.paint(), 1e3 / this.fps), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height;
    const t = this.canvas.getContext("2d", { alpha: !1 });
    if (!t) throw new Error("CanvasCompositor: unable to acquire 2d context");
    this.ctx = t, this.screenVideo = $a(), this.cameraVideo = $a();
  }
  /**
   * Start compositing with whichever sources are available. Either parameter
   * may be null — sources can be added later via `setScreenSource` /
   * `setCameraSource`. Scene defaults to the richest combination the inputs
   * support (camera+screen → 'both'; camera only → 'camera'; etc.).
   */
  async start(e, t) {
    if (this.running) throw new Error("CanvasCompositor: already running");
    return this.running = !0, document.addEventListener("visibilitychange", this.onVisibilityChange), this.screenVideo.srcObject = e, this.cameraVideo.srcObject = t, !e && t ? this.scene = "camera" : e && !t ? this.scene = "screen" : this.scene = "both", await Promise.allSettled([
      e ? yn(this.screenVideo) : Promise.resolve(),
      t ? yn(this.cameraVideo) : Promise.resolve()
    ]), this.paint(), this.output = this.canvas.captureStream(this.fps), this.paintClock.start(), Ui.info("painting started", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    }), this.output;
  }
  /** Replace the camera source. Pass null to clear. */
  setCameraSource(e) {
    this.cameraVideo.srcObject = e, e && yn(this.cameraVideo);
  }
  /** Replace the screen-share source. Pass null to clear. */
  setScreenSource(e) {
    this.screenVideo.srcObject = e, e && yn(this.screenVideo);
  }
  hasScreenSource() {
    return !!this.screenVideo.srcObject;
  }
  /** Change which scene is painted. Crossfades over ~200ms. Falls back to
   *  camera if a required source is missing (e.g. host switches to 'both'
   *  but hasn't started screen share). */
  setScene(e, t) {
    t && "brbSubtitle" in t && (this.brb = { ...this.brb, subtitle: t.brbSubtitle }), e !== this.scene && (this.fadeFromScene = this.scene, this.fadeStart = performance.now(), this.scene = e);
  }
  setBrbSubtitle(e) {
    this.brb = { subtitle: e };
  }
  getScene() {
    return this.scene;
  }
  /** Add/replace an overlay by id. Painted each frame after the main scene. */
  addOverlay(e) {
    this.removeOverlay(e.id), this.overlays.push(e), this.overlays.sort((t, n) => (t.zIndex ?? 0) - (n.zIndex ?? 0));
  }
  removeOverlay(e) {
    this.overlays = this.overlays.filter((t) => t.id !== e);
  }
  hasOverlay(e) {
    return this.overlays.some((t) => t.id === e);
  }
  getTrack() {
    return this.output?.getVideoTracks()[0] ?? null;
  }
  /** The composite canvas itself — the encoder pipeline grabs VideoFrames
   *  from it directly (plan §3: canvas capture, no track processor). */
  getCanvas() {
    return this.canvas;
  }
  stop() {
    if (this.running = !1, document.removeEventListener("visibilitychange", this.onVisibilityChange), this.paintClock.stop(), this.output) {
      for (const e of this.output.getTracks()) e.stop();
      this.output = null;
    }
    this.screenVideo.srcObject = null, this.cameraVideo.srcObject = null, this.overlays = [];
  }
  /** One line per transition; the clock named here is what paints now. The
   *  `media.timer` warn is authoritative if a worker fails after start. */
  onVisibilityChange = () => {
    this.paintClock.onVisibilityChange() && Ui.info("visibility changed", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    });
  };
  paint() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Tt("--bg-surface-main"), e.fillRect(0, 0, t, n);
    const i = this.effectiveScene(this.scene);
    if (this.fadeFromScene != null) {
      const r = performance.now() - this.fadeStart, o = Math.min(1, r / this.fadeMs), a = Rw(o);
      if (o < 1) {
        const d = this.effectiveScene(this.fadeFromScene);
        e.save(), e.globalAlpha = 1 - a, this.paintScene(d), e.restore(), e.save(), e.globalAlpha = a, this.paintScene(i), e.restore();
      } else
        this.fadeFromScene = null, this.paintScene(i);
    } else
      this.paintScene(i);
    for (const r of this.overlays)
      try {
        r.draw({ ctx: e, width: t, height: n });
      } catch (o) {
        Mw.allow(r.id) && Ui.warn("overlay draw threw", { overlay: r.id, err: o });
      }
  }
  paintScene(e) {
    switch (e) {
      case "camera":
        this.paintCameraFull();
        break;
      case "screen":
        this.paintScreenFull();
        break;
      case "both":
        this.paintScreenFull(), this.paintCameraPip();
        break;
      case "brb":
        this.paintBrb();
        break;
    }
  }
  /** Fall back to a renderable scene if the requested one needs an absent
   *  source. Keeps the stream alive (never goes black) when the host toggles
   *  screen share on/off or the OS terminates the capture. */
  effectiveScene(e) {
    return (e === "both" || e === "screen") && this.screenVideo.readyState < 2 ? "camera" : e;
  }
  paintCameraFull() {
    this.cameraVideo.readyState < 2 || za(this.ctx, this.cameraVideo, 0, 0, this.width, this.height);
  }
  paintScreenFull() {
    this.screenVideo.readyState < 2 || Ow(this.ctx, this.screenVideo, 0, 0, this.width, this.height);
  }
  paintCameraPip() {
    const { ctx: e, width: t, height: n } = this;
    if (this.cameraVideo.readyState < 2) return;
    const i = Math.round(t * this.pipScale), r = Math.round(i * 9 / 16), o = t - i - this.pipPadding, a = n - r - this.pipPadding;
    e.save(), e.shadowColor = "rgba(0, 0, 0, 0.55)", e.shadowBlur = 18, e.shadowOffsetY = 4, Ni(e, o, a, i, r, this.pipRadius), e.fillStyle = Tt("--bg-surface-main"), e.fill(), e.restore(), e.save(), Ni(e, o, a, i, r, this.pipRadius), e.clip(), za(e, this.cameraVideo, o, a, i, r), e.restore(), e.save(), e.strokeStyle = "rgba(255, 255, 255, 0.08)", e.lineWidth = 1, Ni(e, o + 0.5, a + 0.5, i - 1, r - 1, this.pipRadius), e.stroke(), e.restore();
  }
  paintBrb() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Tt("--bg-surface-main"), e.fillRect(0, 0, t, n), e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = Tt("--fg-primary");
    const i = Math.round(n * 0.12);
    e.font = `600 ${i}px ${Tt("--scale-font-family-accent")}, sans-serif`, e.fillText("Be right back", t / 2, n * 0.42);
    const r = this.brb.subtitle?.trim() || "Back in a moment.";
    e.fillStyle = Tt("--fg-secondary");
    const o = Math.round(n * 0.035);
    e.font = `${o}px ${Tt("--scale-font-family-sans")}, sans-serif`, e.fillText(r, t / 2, n * 0.58);
    const a = performance.now(), d = Math.round(n * 8e-3), c = Math.round(n * 0.03), l = t / 2 - c, u = n * 0.68;
    for (let h = 0; h < 3; h++) {
      const f = (a / 400 + h * 0.33) % 1, m = 0.35 + 0.65 * Math.sin(f * Math.PI);
      e.globalAlpha = m, e.fillStyle = Tt("--fg-secondary"), e.beginPath(), e.arc(l + h * c, u, d, 0, Math.PI * 2), e.fill();
    }
    e.globalAlpha = 1;
  }
}
function $a() {
  const s = document.createElement("video");
  return s.autoplay = !0, s.playsInline = !0, s.muted = !0, s;
}
async function yn(s) {
  if (s.readyState >= 2) {
    try {
      await s.play();
    } catch {
    }
    return;
  }
  await new Promise((e) => {
    const t = () => {
      s.removeEventListener("loadeddata", t), e();
    };
    s.addEventListener("loadeddata", t);
  });
  try {
    await s.play();
  } catch {
  }
}
function Ow(s, e, t, n, i, r) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const d = Math.min(i / o, r / a), c = o * d, l = a * d, u = t + (i - c) / 2, h = n + (r - l) / 2;
  s.drawImage(e, u, h, c, l);
}
function za(s, e, t, n, i, r) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const d = Math.max(i / o, r / a), c = o * d, l = a * d, u = t + (i - c) / 2, h = n + (r - l) / 2;
  s.drawImage(e, u, h, c, l);
}
function Rw(s) {
  return s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2;
}
function Ni(s, e, t, n, i, r) {
  const o = Math.min(r, n / 2, i / 2);
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + n - o, t), s.quadraticCurveTo(e + n, t, e + n, t + o), s.lineTo(e + n, t + i - o), s.quadraticCurveTo(e + n, t + i, e + n - o, t + i), s.lineTo(e + o, t + i), s.quadraticCurveTo(e, t + i, e, t + i - o), s.lineTo(e, t + o), s.quadraticCurveTo(e, t, e + o, t), s.closePath();
}
const hs = ne("sdk.broadcast"), Pw = 3e4, Fw = 2e3, Lw = 1e4, Uw = 1e4, Nw = 6e4, Dw = "spotlight-mesh", Vw = 30;
function Zw() {
  return Ru(ku());
}
async function Kw(s) {
  const e = bh(await wh());
  if (!e)
    throw new Error("This browser cannot host a stream: WebCodecs H.264 with Opus or AAC is required.");
  const t = mc(window.location), n = await zw(t), i = (s.hostName || t).slice(0, 64), r = await ph("statements", "statement-submit");
  for (const y of ["statements", "statement-submit"]) {
    const k = r[y];
    if (k && k !== "granted") throw new Error(mh[k]);
  }
  const o = Ww(), a = new Wp();
  let d = null;
  if (a.onFatalError = (y) => {
    d ??= y, o.emit("error", { message: y.message, fatal: !0 });
  }, a.onSubmitError = (y) => o.emit("error", { message: y.message, fatal: !1 }), await a.connect(), !a.isConnected)
    throw a.destroy(), d ?? new Error("The host has no Statement Store, so the stream cannot be announced.");
  a.setProductAccount({ dotNsIdentifier: t, derivationIndex: 0 });
  const c = Date.now();
  Kp();
  const l = new Iw(), u = new Cw(), h = s.audio instanceof MediaStream ? s.audio.getAudioTracks()[0] ?? null : s.audio ?? null;
  let f = null, m = null, g = null;
  const p = () => {
    if (l.stop(), u.stop(), f && f !== s.video) for (const y of f.getTracks()) y.stop();
  };
  try {
    f = s.video instanceof MediaStream ? s.video : s.video.captureStream(s.fps ?? Vw), await l.start(f, null), u.start({ system: h });
    const y = u.getContext(), k = u.getOutputNode();
    if (!y || !k) throw new Error("The audio graph did not start.");
    const A = Up(n), F = new Ew({
      selfAddr: n,
      selfName: i,
      epoch: c,
      transport: Qp(a, A),
      codecs: e,
      canvas: l.getCanvas(),
      audioContext: y,
      audioSource: k,
      callbacks: {
        onFlood: (X) => Hw(X, o),
        onPeersChanged: () => {
          queueMicrotask(() => {
            const X = F.node.neighborAddrs.length;
            X < j && g?.reopen("neighbor dropped", { degree: X }), j = X;
          });
        },
        onEncoderError: (X) => {
          hs.error("encoder pipeline failed", { err: X }), o.emit("error", { message: X.message, fatal: !0 });
        }
      }
    });
    let j = 0;
    await F.start(), m = F;
    const Z = qw(a, A, () => F.joinsInFlight);
    g = Z;
    const L = await Sh(n), q = Lp(), $ = Np(), te = /* @__PURE__ */ new Set(), W = async (X) => {
      let me;
      try {
        me = a.submit(
          q,
          {
            type: "heartbeat",
            from: n,
            timestamp: Date.now(),
            payload: {
              roomHash: L,
              hostAddress: n,
              hostName: i,
              title: s.title.slice(0, 200),
              viewerCount: F.node.stats().presenceCount,
              startedAt: c,
              mesh: F.mesh(),
              ...X ? { ended: !0 } : {}
            }
          },
          { channel: $ }
        ), X || te.add(me), await me;
      } catch (xe) {
        if (Ku(xe)) return;
        hs.error("heartbeat failed", { err: xe });
      } finally {
        me && te.delete(me);
      }
    };
    W(!1);
    const S = setInterval(() => void W(!1), Pw), M = setInterval(() => {
      o.emit("viewers", F.node.stats().presenceCount);
    }, Fw);
    let C = document.visibilityState === "hidden";
    const R = () => {
      if (document.visibilityState === "hidden") {
        C = !0;
        return;
      }
      W(!1), C && (C = !1, a.refreshAllSubscriptions());
    }, U = () => {
      W(!1), a.refreshAllSubscriptions();
    }, K = (X) => {
      X.persisted || ie();
    };
    document.addEventListener("visibilitychange", R), window.addEventListener("online", U), window.addEventListener("pagehide", K);
    let ee = null;
    const ie = () => (ee ??= (async () => {
      clearInterval(S), clearInterval(M), Z.stop(), document.removeEventListener("visibilitychange", R), window.removeEventListener("online", U), window.removeEventListener("pagehide", K);
      try {
        await F.end();
      } catch (X) {
        hs.warn("swarm end failed — teardown continues", { err: X });
      }
      await Promise.allSettled([...te]), await W(!0), p(), a.destroy(), o.emit("ended", void 0), o.clear();
    })(), ee);
    return {
      roomHash: L,
      roomUrl: jw(L, s.spotlightOrigin),
      hostAddress: n,
      on: o.on,
      sendChat: (X) => F.sendChat(i, X.slice(0, 500), Date.now()),
      end: ie
    };
  } catch (y) {
    throw hs.error("go live failed", { err: y }), g?.stop(), m && await m.end().catch(() => {
    }), p(), a.destroy(), y;
  }
}
const $w = lc();
async function zw(s) {
  const e = await Rt(rl(), ys.read, "getAccountsProvider");
  if (!e) throw new Error("Not inside a Polkadot host, so there is no account to stream from.");
  const t = await Rt(
    Promise.resolve(e.getProductAccount(s, 0)),
    ys.hostDialog,
    "getProductAccount"
  );
  if (t.isErr()) {
    const i = du(t.error) ?? ol(t.error);
    throw new Error(`The host refused a product account for ${s}: ${i}`);
  }
  const { publicKey: n } = t.value;
  return $w.dec(n);
}
function Hw(s, e) {
  s.t === "chat" ? e.emit("chat", { from: s.from, senderName: s.senderName, text: s.text, timestamp: s.ts }) : s.t === "reaction" && e.emit("reaction", { from: s.from, emoji: s.emoji });
}
function jw(s, e) {
  if (e) return `${e.replace(/\/+$/, "")}/#/room/${s}`;
  const { hostname: t, protocol: n } = window.location;
  if (n !== "https:" && n !== "http:" || /^[\d.]+$/.test(t) || t.includes(":") || t.endsWith(`.${Er}`)) return null;
  const i = t.split(".");
  if (i.length < 3) return null;
  const r = i.slice(-2).join(".");
  return `${window.location.protocol}//${Dw}.${r}/#/room/${s}`;
}
function qw(s, e, t) {
  let n = 0, i = null;
  const r = (a, d) => {
    const c = Date.now();
    if (t() > 0 || c - n < Uw) {
      i ??= { reason: a, sinceMs: c };
      return;
    }
    i = null, n = c;
    const l = s.reopenTopic(e);
    hs.info(`signal route reopen (${l ? "done" : "no live route"}): ${a}`, d);
  }, o = setInterval(() => {
    const a = s.silentMsFor(e);
    if (a !== null) {
      if (i) {
        const d = Date.now() - i.sinceMs;
        a < d ? i = null : r(`${i.reason}, deferred`, { waitedMs: d });
        return;
      }
      a >= Nw && r("topic quiet", { silentMs: a });
    }
  }, Lw);
  return { reopen: r, stop: () => clearInterval(o) };
}
function Ww() {
  const s = /* @__PURE__ */ new Map();
  return {
    on(e, t) {
      let n = s.get(e);
      return n || s.set(e, n = /* @__PURE__ */ new Set()), n.add(t), () => n.delete(t);
    },
    emit(e, t) {
      for (const n of s.get(e) ?? [])
        try {
          n(t);
        } catch (i) {
          hs.warn("event handler threw", { event: e, err: i });
        }
    },
    clear: () => s.clear()
  };
}
export {
  Zw as getBroadcastLog,
  Kw as startBroadcast
};
