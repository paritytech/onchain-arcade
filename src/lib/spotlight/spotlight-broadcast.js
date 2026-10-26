// Vendored from paritytech/spotlight-mesh@6b6309c (`bun run build:sdk`). Do not edit; rebuild and copy.
import { requestResourceAllocation as Gd, HostResponseDecodeError as Zd, getHostLocalStorage as Kd, isInsideContainer as Xd, getStatementStore as Sc, requestPermission as Yd, requestDevicePermission as Qd, toHex as gn, fromHex as Jd, getAccountsProvider as eu, formatHostError as tu } from "@parity/product-sdk/host";
var su = Object.defineProperty, nu = (s, e, t) => e in s ? su(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Mo = (s, e, t) => (nu(s, typeof e != "symbol" ? e + "" : e, t), t), wr = {
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
function ru(s) {
  const e = s.length % 2, t = (s[1] === "x" ? 2 : 0) + e, n = (s.length - t) / 2 + e, r = new Uint8Array(n);
  e && (r[0] = 0 | wr[s[2]]);
  for (let i = 0; i < n; ) {
    const o = t + i * 2, a = wr[s[o]], c = wr[s[o + 1]];
    r[e + i++] = a << 4 | c;
  }
  return r;
}
var Bo = class extends Uint8Array {
  constructor(s) {
    super(s), Mo(this, "i", 0), Mo(this, "v"), this.v = new DataView(s);
  }
}, Rs = (s) => (e) => s(e instanceof Bo ? e : new Bo(e instanceof Uint8Array ? e.buffer : typeof e == "string" ? ru(e).buffer : e)), $i = (s) => {
  const e = s.length;
  let t = 0;
  for (let r = 0; r < e; r++)
    t += s[r].length;
  const n = new Uint8Array(t);
  for (let r = 0, i = 0; r < e; r++) {
    const o = s[r];
    n.set(o, i), i += o.byteLength;
  }
  return n;
}, rt = (s, e) => {
  const t = [s, e];
  return t.enc = s, t.dec = e, t;
}, iu = (s, e) => (t) => s(e(t)), ou = (s, e) => (t) => e(s(t)), _c = ([s, e], t, n) => rt(iu(s, t), ou(e, n));
function au(s, e) {
  return Rs((t) => {
    const n = t.v[e](t.i, !0);
    return t.i += s, n;
  });
}
function cu(s, e) {
  return (t) => {
    const n = new Uint8Array(s);
    return new DataView(n.buffer)[e](0, t, !0), n;
  };
}
function Vt(s, e, t) {
  return rt(cu(s, t), au(s, e));
}
var Js = Vt(1, "getUint8", "setUint8"), Pn = Vt(2, "getUint16", "setUint16"), Fn = Vt(4, "getUint32", "setUint32"), xc = Vt(8, "getBigUint64", "setBigUint64");
Vt(1, "getInt8", "setInt8");
Vt(2, "getInt16", "setInt16");
Vt(4, "getInt32", "setInt32");
Vt(8, "getBigInt64", "setBigInt64");
var kc = (s) => {
  const e = new Uint8Array(16), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), e;
}, Ec = (s) => Rs((e) => {
  const { v: t, i: n } = e, r = t.getBigUint64(n, !0), i = t[s](n + 8, !0);
  return e.i += 16, i << 64n | r;
});
rt(kc, Ec("getBigUint64"));
rt(kc, Ec("getBigInt64"));
var Tc = (s) => {
  const e = new Uint8Array(32), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), t.setBigInt64(16, s >> 128n, !0), t.setBigInt64(24, s >> 192n, !0), e;
}, Cc = (s) => Rs((e) => {
  let t = e.v.getBigUint64(e.i, !0);
  return e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 64n, e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 128n, e.i += 8, t |= e.v[s](e.i, !0) << 192n, e.i += 8, t;
});
rt(Tc, Cc("getBigUint64"));
rt(Tc, Cc("getBigInt64"));
_c(Js, (s) => s ? 1 : 0, Boolean);
var lu = [Js[1], Pn[1], Fn[1]], du = Rs((s) => {
  const e = s[s.i], t = e & 3;
  if (t < 3)
    return lu[t](s) >>> 2;
  const n = (e >>> 2) + 4;
  s.i++;
  let r = 0n;
  const i = n / 8 | 0;
  let o = 0n;
  for (let c = 0; c < i; c++)
    r = xc[1](s) << o | r, o += 64n;
  let a = n % 8;
  return a > 3 && (r = BigInt(Fn[1](s)) << o | r, o += 32n, a -= 4), a > 1 && (r = BigInt(Pn[1](s)) << o | r, o += 16n, a -= 2), a && (r = BigInt(Js[1](s)) << o | r), r;
}), uu = 1n << 56n, hu = 1 << 24, fu = 256, pu = 4294967295n, mu = 64, gu = 16384, yu = 1 << 30, wu = (s) => {
  if (s < 0)
    throw new Error(`Wrong compact input (${s})`);
  const e = Number(s) << 2;
  if (s < mu)
    return Js[0](e);
  if (s < gu)
    return Pn[0](e | 1);
  if (s < yu)
    return Fn[0](e | 2);
  let t = [new Uint8Array(1)], n = BigInt(s);
  for (; n >= uu; )
    t.push(xc[0](n)), n >>= 64n;
  n >= hu && (t.push(Fn[0](Number(n & pu))), n >>= 32n);
  let r = Number(n);
  r >= fu && (t.push(Pn[0](r)), r >>= 16), r && t.push(Js[0](r));
  const i = $i(t);
  return i[0] = i.length - 5 << 2 | 3, i;
}, lr = rt(wu, du), bu = new TextEncoder(), vu = (s) => {
  const e = bu.encode(s);
  return $i([lr.enc(e.length), e]);
}, Su = new TextDecoder(), _u = Rs((s) => {
  let e = lr.dec(s);
  const t = new DataView(s.buffer, s.i, e);
  return s.i += e, Su.decode(t);
});
rt(vu, _u);
var xu = () => {
}, ku = new Uint8Array(0);
rt(() => ku, xu);
var Ac = (s) => s === void 0 ? (e) => $i([lr.enc(e.length), e]) : (e) => e.length === s ? e : e.slice(0, s), Mc = (s) => Rs((e) => {
  const t = s === void 0 ? lr.dec(e) : s !== 1 / 0 ? s : e.byteLength - e.i, n = new Uint8Array(e.buffer.slice(e.i, e.i + t));
  return e.i += t, n;
}), Vi = (s) => rt(Ac(s), Mc(s));
Vi.enc = Ac;
Vi.dec = Mc;
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Eu(s) {
  return s instanceof Uint8Array || ArrayBuffer.isView(s) && s.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in s && s.BYTES_PER_ELEMENT === 1;
}
function Bc(s, e) {
  return Array.isArray(e) ? e.length === 0 ? !0 : s ? e.every((t) => typeof t == "string") : e.every((t) => Number.isSafeInteger(t)) : !1;
}
function si(s, e) {
  if (typeof e != "string")
    throw new TypeError(`${s}: string expected`);
  return !0;
}
function Ic(s) {
  if (typeof s != "number")
    throw new TypeError(`number expected, got ${typeof s}`);
  if (!Number.isSafeInteger(s))
    throw new RangeError(`invalid integer: ${s}`);
}
function ni(s) {
  if (!Array.isArray(s))
    throw new TypeError("array expected");
}
function Rc(s, e) {
  if (!Bc(!0, e))
    throw new TypeError(`${s}: array of strings expected`);
}
function Tu(s, e) {
  if (!Bc(!1, e))
    throw new TypeError(`${s}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Cu(...s) {
  const e = (i) => i, t = (i, o) => (a) => i(o(a)), n = s.map((i) => i.encode).reduceRight(t, e), r = s.map((i) => i.decode).reduce(t, e);
  return { encode: n, decode: r };
}
// @__NO_SIDE_EFFECTS__
function Au(s) {
  const e = typeof s == "string" ? s.split("") : s, t = e.length;
  Rc("alphabet", e);
  const n = new Map(e.map((r, i) => [r, i]));
  return {
    encode: (r) => (ni(r), r.map((i) => {
      if (!Number.isSafeInteger(i) || i < 0 || i >= t)
        throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${s}`);
      return e[i];
    })),
    decode: (r) => (ni(r), r.map((i) => {
      si("alphabet.decode", i);
      const o = n.get(i);
      if (o === void 0)
        throw new Error(`Unknown letter: "${i}". Allowed: ${s}`);
      return o;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Mu(s = "") {
  return si("join", s), {
    encode: (e) => (Rc("join.decode", e), e.join(s)),
    decode: (e) => (si("join.decode", e), e.split(s))
  };
}
function Io(s, e, t) {
  if (e < 2)
    throw new RangeError(`convertRadix: invalid from=${e}, base cannot be less than 2`);
  if (t < 2)
    throw new RangeError(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (ni(s), !s.length)
    return [];
  let n = 0;
  const r = [], i = Array.from(s, (a) => {
    if (Ic(a), a < 0 || a >= e)
      throw new Error(`invalid integer: ${a}`);
    return a;
  }), o = i.length;
  for (; ; ) {
    let a = 0, c = !0;
    for (let l = n; l < o; l++) {
      const d = i[l], u = e * a, h = u + d;
      if (!Number.isSafeInteger(h) || u / e !== a || h - d !== u)
        throw new Error("convertRadix: carry overflow");
      const f = h / t;
      a = h % t;
      const g = Math.floor(f);
      if (i[l] = g, !Number.isSafeInteger(g) || g * t + a !== h)
        throw new Error("convertRadix: carry overflow");
      if (c)
        g ? c = !1 : n = l;
      else continue;
    }
    if (r.push(a), c)
      break;
  }
  for (let a = 0; a < s.length - 1 && s[a] === 0; a++)
    r.push(0);
  return r.reverse();
}
// @__NO_SIDE_EFFECTS__
function Bu(s) {
  Ic(s);
  const e = 2 ** 8;
  return {
    encode: (t) => {
      if (!Eu(t))
        throw new TypeError("radix.encode input should be Uint8Array");
      return Io(Array.from(t), e, s);
    },
    decode: (t) => (Tu("radix.decode", t), Uint8Array.from(Io(t, s, e)))
  };
}
const Iu = /* @__NO_SIDE_EFFECTS__ */ (s) => /* @__PURE__ */ Cu(/* @__PURE__ */ Bu(58), /* @__PURE__ */ Au(s), /* @__PURE__ */ Mu("")), Oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Iu("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
function Pc(s) {
  return s instanceof Uint8Array || ArrayBuffer.isView(s) && s.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in s && s.BYTES_PER_ELEMENT === 1;
}
function mt(s, e = "") {
  if (typeof s != "number") {
    const t = e && `"${e}" `;
    throw new TypeError(`${t}expected number, got ${typeof s}`);
  }
  if (!Number.isSafeInteger(s) || s < 0) {
    const t = e && `"${e}" `;
    throw new RangeError(`${t}expected integer >= 0, got ${s}`);
  }
}
function Ce(s, e, t = "") {
  const n = Pc(s), r = s?.length, i = e !== void 0;
  if (!n || i && r !== e) {
    const o = t && `"${t}" `, a = i ? ` of length ${e}` : "", c = n ? `length=${r}` : `type=${typeof s}`, l = o + "expected Uint8Array" + a + ", got " + c;
    throw n ? new RangeError(l) : new TypeError(l);
  }
  return s;
}
function Hi(s) {
  if (typeof s != "function" || typeof s.create != "function")
    throw new TypeError("Hash must wrapped by utils.createHasher");
  if (mt(s.outputLen), mt(s.blockLen), s.outputLen < 1)
    throw new Error('"outputLen" must be >= 1');
  if (s.blockLen < 1)
    throw new Error('"blockLen" must be >= 1');
}
function ks(s, e = !0) {
  if (s.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && s.finished)
    throw new Error("Hash#digest() has already been called");
}
function zi(s, e) {
  Ce(s, void 0, "digestInto() output");
  const t = e.outputLen;
  if (s.length < t)
    throw new RangeError('"digestInto() output" expected to be of length >=' + t);
}
function Ln(s) {
  return new Uint32Array(s.buffer, s.byteOffset, Math.floor(s.byteLength / 4));
}
function tt(...s) {
  for (let e = 0; e < s.length; e++)
    s[e].fill(0);
}
function br(s) {
  return new DataView(s.buffer, s.byteOffset, s.byteLength);
}
function qe(s, e) {
  return s << 32 - e | s >>> e;
}
const Fc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Lc(s) {
  return s << 24 & 4278190080 | s << 8 & 16711680 | s >>> 8 & 65280 | s >>> 24 & 255;
}
const at = Fc ? (s) => s : (s) => Lc(s) >>> 0;
function Ru(s) {
  for (let e = 0; e < s.length; e++)
    s[e] = Lc(s[e]);
  return s;
}
const as = Fc ? (s) => s : Ru, Uc = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Ou = /* @__PURE__ */ Array.from({ length: 256 }, (s, e) => e.toString(16).padStart(2, "0"));
function He(s) {
  if (Ce(s), Uc)
    return s.toHex();
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += Ou[s[t]];
  return e;
}
const it = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ro(s) {
  if (s >= it._0 && s <= it._9)
    return s - it._0;
  if (s >= it.A && s <= it.F)
    return s - (it.A - 10);
  if (s >= it.a && s <= it.f)
    return s - (it.a - 10);
}
function Ie(s) {
  if (typeof s != "string")
    throw new TypeError("hex string expected, got " + typeof s);
  if (Uc)
    try {
      return Uint8Array.fromHex(s);
    } catch (r) {
      throw r instanceof SyntaxError ? new RangeError(r.message) : r;
    }
  const e = s.length, t = e / 2;
  if (e % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + e);
  const n = new Uint8Array(t);
  for (let r = 0, i = 0; r < t; r++, i += 2) {
    const o = Ro(s.charCodeAt(i)), a = Ro(s.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = s[i] + s[i + 1];
      throw new RangeError('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    n[r] = o * 16 + a;
  }
  return n;
}
function Pu(...s) {
  let e = 0;
  for (let n = 0; n < s.length; n++) {
    const r = s[n];
    Ce(r), e += r.length;
  }
  const t = new Uint8Array(e);
  for (let n = 0, r = 0; n < s.length; n++) {
    const i = s[n];
    t.set(i, r), r += i.length;
  }
  return t;
}
function ji(s, e = {}) {
  const t = (r, i) => s(i).update(r).digest(), n = s(void 0);
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.canXOF = n.canXOF, t.create = (r) => s(r), Object.assign(t, e), Object.freeze(t);
}
function Fu(s = 32) {
  mt(s, "bytesLength");
  const e = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof e?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (s > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${s}`);
  return e.getRandomValues(new Uint8Array(s));
}
const Dc = (s) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, s])
}), Lu = /* @__PURE__ */ Uint8Array.from([
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
function Uu(s, e, t) {
  return s & e ^ ~s & t;
}
function Du(s, e, t) {
  return s & e ^ s & t ^ e & t;
}
class Nc {
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
  constructor(e, t, n, r) {
    this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = br(this.buffer);
  }
  update(e) {
    ks(this), Ce(e);
    const { view: t, buffer: n, blockLen: r } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(r - this.pos, i - o);
      if (a === r) {
        const c = br(e);
        for (; r <= i - o; o += r)
          this.process(c, o);
        continue;
      }
      n.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === r && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ks(this), zi(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: r, isLE: i } = this;
    let { pos: o } = this;
    t[o++] = 128, tt(this.buffer.subarray(o)), this.padOffset > r - o && (this.process(n, 0), o = 0);
    for (let u = o; u < r; u++)
      t[u] = 0;
    n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const a = br(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const l = c / 4, d = this.get();
    if (l > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < l; u++)
      a.setUint32(4 * u, d[u], i);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e ||= new this.constructor(), e.set(...this.get());
    const { blockLen: t, buffer: n, length: r, finished: i, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = i, e.length = r, e.pos = a, r % t && e.buffer.set(n), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const yt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ee = /* @__PURE__ */ Uint32Array.from([
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
]), yn = /* @__PURE__ */ BigInt(2 ** 32 - 1), Oo = /* @__PURE__ */ BigInt(32);
function $c(s, e = !1) {
  return e ? { h: Number(s & yn), l: Number(s >> Oo & yn) } : { h: Number(s >> Oo & yn) | 0, l: Number(s & yn) | 0 };
}
function Nu(s, e = !1) {
  const t = s.length;
  let n = new Uint32Array(t), r = new Uint32Array(t);
  for (let i = 0; i < t; i++) {
    const { h: o, l: a } = $c(s[i], e);
    [n[i], r[i]] = [o, a];
  }
  return [n, r];
}
const Po = (s, e, t) => s >>> t, Fo = (s, e, t) => s << 32 - t | e >>> t, At = (s, e, t) => s >>> t | e << 32 - t, Mt = (s, e, t) => s << 32 - t | e >>> t, zs = (s, e, t) => s << 64 - t | e >>> t - 32, js = (s, e, t) => s >>> t - 32 | e << 64 - t, $u = (s, e) => e, Vu = (s, e) => s;
function $e(s, e, t, n) {
  const r = (e >>> 0) + (n >>> 0);
  return { h: s + t + (r / 2 ** 32 | 0) | 0, l: r | 0 };
}
const qi = (s, e, t) => (s >>> 0) + (e >>> 0) + (t >>> 0), Wi = (s, e, t, n) => e + t + n + (s / 2 ** 32 | 0) | 0, Hu = (s, e, t, n) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0), zu = (s, e, t, n, r) => e + t + n + r + (s / 2 ** 32 | 0) | 0, ju = (s, e, t, n, r) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), qu = (s, e, t, n, r, i) => e + t + n + r + i + (s / 2 ** 32 | 0) | 0, ye = /* @__PURE__ */ Uint32Array.from([
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
function wt(s, e, t, n, r, i) {
  const o = r[i], a = r[i + 1];
  let c = T[2 * s], l = T[2 * s + 1], d = T[2 * e], u = T[2 * e + 1], h = T[2 * t], f = T[2 * t + 1], g = T[2 * n], m = T[2 * n + 1], p = qi(c, d, o);
  l = Wi(p, l, u, a), c = p | 0, { Dh: m, Dl: g } = { Dh: m ^ l, Dl: g ^ c }, { Dh: m, Dl: g } = { Dh: $u(m, g), Dl: Vu(m) }, { h: f, l: h } = $e(f, h, m, g), { Bh: u, Bl: d } = { Bh: u ^ f, Bl: d ^ h }, { Bh: u, Bl: d } = { Bh: At(u, d, 24), Bl: Mt(u, d, 24) }, T[2 * s] = c, T[2 * s + 1] = l, T[2 * e] = d, T[2 * e + 1] = u, T[2 * t] = h, T[2 * t + 1] = f, T[2 * n] = g, T[2 * n + 1] = m;
}
function bt(s, e, t, n, r, i) {
  const o = r[i], a = r[i + 1];
  let c = T[2 * s], l = T[2 * s + 1], d = T[2 * e], u = T[2 * e + 1], h = T[2 * t], f = T[2 * t + 1], g = T[2 * n], m = T[2 * n + 1], p = qi(c, d, o);
  l = Wi(p, l, u, a), c = p | 0, { Dh: m, Dl: g } = { Dh: m ^ l, Dl: g ^ c }, { Dh: m, Dl: g } = { Dh: At(m, g, 16), Dl: Mt(m, g, 16) }, { h: f, l: h } = $e(f, h, m, g), { Bh: u, Bl: d } = { Bh: u ^ f, Bl: d ^ h }, { Bh: u, Bl: d } = { Bh: zs(u, d, 63), Bl: js(u, d, 63) }, T[2 * s] = c, T[2 * s + 1] = l, T[2 * e] = d, T[2 * e + 1] = u, T[2 * t] = h, T[2 * t + 1] = f, T[2 * n] = g, T[2 * n + 1] = m;
}
function Wu(s, e = {}, t, n, r) {
  if (mt(t), s <= 0 || s > t)
    throw new Error("outputLen bigger than keyLen");
  const { key: i, salt: o, personalization: a } = e;
  if (i !== void 0 && (i.length < 1 || i.length > t))
    throw new Error('"key" expected to be undefined or of length=1..' + t);
  o !== void 0 && Ce(o, n, "salt"), a !== void 0 && Ce(a, r, "personalization");
}
class Gu {
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
    mt(e), mt(t), this.blockLen = e, this.outputLen = t, this.buffer = new Uint8Array(e), this.buffer32 = Ln(this.buffer);
  }
  update(e) {
    ks(this), Ce(e);
    const { blockLen: t, buffer: n, buffer32: r } = this, i = e.length, o = e.byteOffset, a = e.buffer;
    for (let c = 0; c < i; ) {
      this.pos === t && (as(r), this.compress(r, 0, !1), as(r), this.pos = 0);
      const l = Math.min(t - this.pos, i - c), d = o + c;
      if (l === t && !(d % 4) && c + l < i) {
        const u = new Uint32Array(a, d, Math.floor((i - c) / 4));
        as(u);
        for (let h = 0; c + t < i; h += r.length, c += t)
          this.length += t, this.compress(u, h, !1);
        as(u);
        continue;
      }
      n.set(e.subarray(c, c + l), this.pos), this.pos += l, this.length += l, c += l;
    }
    return this;
  }
  digestInto(e) {
    ks(this), zi(e, this);
    const { pos: t, buffer32: n } = this;
    if (this.finished = !0, tt(this.buffer.subarray(t)), as(n), this.compress(n, 0, !0), as(n), e.byteOffset & 3)
      throw new RangeError('"digestInto() output" expected 4-byte aligned byteOffset, got ' + e.byteOffset);
    const r = this.get(), i = Ln(e), o = Math.floor(this.outputLen / 4);
    for (let d = 0; d < o; d++)
      i[d] = at(r[d]);
    const a = this.outputLen % 4;
    if (!a)
      return;
    const c = o * 4, l = r[o];
    for (let d = 0; d < a; d++)
      e[c + d] = l >>> 8 * d;
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    const { buffer: t, length: n, finished: r, destroyed: i, outputLen: o, pos: a } = this;
    return e ||= new this.constructor({ dkLen: o }), e.set(...this.get()), e.buffer.set(t), e.destroyed = i, e.finished = r, e.length = n, e.pos = a, e.outputLen = o, e;
  }
  clone() {
    return this._cloneInto();
  }
}
class Zu extends Gu {
  // Same IV words as SHA-512 / BLAKE2b, encoded as LE u32 low/high halves.
  v0l = ye[0] | 0;
  v0h = ye[1] | 0;
  v1l = ye[2] | 0;
  v1h = ye[3] | 0;
  v2l = ye[4] | 0;
  v2h = ye[5] | 0;
  v3l = ye[6] | 0;
  v3h = ye[7] | 0;
  v4l = ye[8] | 0;
  v4h = ye[9] | 0;
  v5l = ye[10] | 0;
  v5h = ye[11] | 0;
  v6l = ye[12] | 0;
  v6h = ye[13] | 0;
  v7l = ye[14] | 0;
  v7h = ye[15] | 0;
  constructor(e = {}) {
    const t = e.dkLen === void 0 ? 64 : e.dkLen;
    super(128, t), Wu(t, e, 64, 16, 16);
    let { key: n, personalization: r, salt: i } = e, o = 0;
    if (n !== void 0 && (Ce(n, void 0, "key"), o = n.length), this.v0l ^= this.outputLen | o << 8 | 65536 | 1 << 24, i !== void 0) {
      Ce(i, void 0, "salt");
      const a = Ln(i);
      this.v4l ^= at(a[0]), this.v4h ^= at(a[1]), this.v5l ^= at(a[2]), this.v5h ^= at(a[3]);
    }
    if (r !== void 0) {
      Ce(r, void 0, "personalization");
      const a = Ln(r);
      this.v6l ^= at(a[0]), this.v6h ^= at(a[1]), this.v7l ^= at(a[2]), this.v7h ^= at(a[3]);
    }
    if (n !== void 0) {
      const a = new Uint8Array(this.blockLen);
      a.set(n), this.update(a);
    }
  }
  // prettier-ignore
  get() {
    let { v0l: e, v0h: t, v1l: n, v1h: r, v2l: i, v2h: o, v3l: a, v3h: c, v4l: l, v4h: d, v5l: u, v5h: h, v6l: f, v6h: g, v7l: m, v7h: p } = this;
    return [e, t, n, r, i, o, a, c, l, d, u, h, f, g, m, p];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, c, l, d, u, h, f, g, m, p) {
    this.v0l = e | 0, this.v0h = t | 0, this.v1l = n | 0, this.v1h = r | 0, this.v2l = i | 0, this.v2h = o | 0, this.v3l = a | 0, this.v3h = c | 0, this.v4l = l | 0, this.v4h = d | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = f | 0, this.v6h = g | 0, this.v7l = m | 0, this.v7h = p | 0;
  }
  compress(e, t, n) {
    this.get().forEach((c, l) => T[l] = c), T.set(ye, 16);
    let { h: r, l: i } = $c(BigInt(this.length));
    T[24] = ye[8] ^ i, T[25] = ye[9] ^ r, n && (T[28] = ~T[28], T[29] = ~T[29]);
    let o = 0;
    const a = Lu;
    for (let c = 0; c < 12; c++)
      wt(0, 4, 8, 12, e, t + 2 * a[o++]), bt(0, 4, 8, 12, e, t + 2 * a[o++]), wt(1, 5, 9, 13, e, t + 2 * a[o++]), bt(1, 5, 9, 13, e, t + 2 * a[o++]), wt(2, 6, 10, 14, e, t + 2 * a[o++]), bt(2, 6, 10, 14, e, t + 2 * a[o++]), wt(3, 7, 11, 15, e, t + 2 * a[o++]), bt(3, 7, 11, 15, e, t + 2 * a[o++]), wt(0, 5, 10, 15, e, t + 2 * a[o++]), bt(0, 5, 10, 15, e, t + 2 * a[o++]), wt(1, 6, 11, 12, e, t + 2 * a[o++]), bt(1, 6, 11, 12, e, t + 2 * a[o++]), wt(2, 7, 8, 13, e, t + 2 * a[o++]), bt(2, 7, 8, 13, e, t + 2 * a[o++]), wt(3, 4, 9, 14, e, t + 2 * a[o++]), bt(3, 4, 9, 14, e, t + 2 * a[o++]);
    this.v0l ^= T[0] ^ T[16], this.v0h ^= T[1] ^ T[17], this.v1l ^= T[2] ^ T[18], this.v1h ^= T[3] ^ T[19], this.v2l ^= T[4] ^ T[20], this.v2h ^= T[5] ^ T[21], this.v3l ^= T[6] ^ T[22], this.v3h ^= T[7] ^ T[23], this.v4l ^= T[8] ^ T[24], this.v4h ^= T[9] ^ T[25], this.v5l ^= T[10] ^ T[26], this.v5h ^= T[11] ^ T[27], this.v6l ^= T[12] ^ T[28], this.v6h ^= T[13] ^ T[29], this.v7l ^= T[14] ^ T[30], this.v7h ^= T[15] ^ T[31], tt(T);
  }
  destroy() {
    this.destroyed = !0, tt(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const dr = /* @__PURE__ */ ji((s) => new Zu(s)), Vc = new TextEncoder().encode("SS58PRE"), ri = 2, Ku = (s) => {
  try {
    const e = Oc.decode(s), t = e.subarray(0, e[0] & 64 ? 2 : 1), n = e.subarray(
      t.length,
      e.length - ri
    ), r = e.subarray(t.length + n.length), i = dr(
      Uint8Array.of(...Vc, ...t, ...n),
      {
        dkLen: 64
      }
    ).subarray(0, ri);
    return r[0] === i[0] && r[1] === i[1] ? {
      isValid: !0,
      ss58Format: Xu(t),
      publicKey: n.slice()
    } : { isValid: !1 };
  } catch {
    return { isValid: !1 };
  }
}, Xu = (s) => {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  return e.byteLength === 1 ? e.getUint8(0) : e.getUint16(0);
}, Yu = (s) => {
  let e = 0n;
  const t = new DataView(s.buffer), n = Math.floor(s.length / 8);
  for (let r = 0; r < n; r++)
    e = e << 64n | t.getBigUint64(r * 8);
  for (let r = n * 8; r < s.length; r++)
    e = e << 8n | BigInt(t.getUint8(r));
  return e;
}, Qu = (s) => {
  let e = /* @__PURE__ */ new Map(), t = 0, n = 0;
  const r = () => {
    t === n ? (e.clear(), t = n = 0) : (n = t, setTimeout(r, 0));
  };
  return (i) => {
    ++t === 1 && r();
    const o = Yu(i);
    return e.has(o) || e.set(o, s(i)), e.get(o);
  };
}, Ju = (s) => {
  const e = s < 64 ? Uint8Array.of(s) : Uint8Array.of(
    (s & 252) >> 2 | 64,
    s >> 8 | (s & 3) << 6
  );
  return Qu((t) => {
    const n = dr(
      Uint8Array.of(...Vc, ...e, ...t),
      {
        dkLen: 64
      }
    ).subarray(0, ri);
    return Oc.encode(
      Uint8Array.of(...e, ...t, ...n)
    );
  });
};
function eh(s, e) {
  return (t) => {
    const n = Ku(t);
    if (!n.isValid) throw new Error("Invalid checksum");
    const { publicKey: r } = n;
    if (r.length !== s)
      throw new Error("Invalid public key length");
    return r;
  };
}
const Hc = (s = 42, e = 32) => _c(
  Vi(e),
  eh(e),
  Ju(s)
), th = { dkLen: 32 }, sh = (s) => dr(s, th);
function nh(s) {
  return s === "Domain" || /^V\d+$/.test(s);
}
function rh(s) {
  let e = s;
  for (let t = 0; t < 4; t++) {
    if (typeof e != "object" || e === null || !("tag" in e)) return null;
    const n = e, r = String(n.tag);
    if (!nh(r)) {
      const i = n.value?.reason;
      return i ? `${r}: ${i}` : r;
    }
    if (n.value === void 0) return r;
    e = n.value;
  }
  return null;
}
const ih = Date.now(), Lo = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", Uo = 5;
function oh() {
  const s = new Uint8Array(Uo);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(s);
  else
    for (let t = 0; t < Uo; t += 1) s[t] = Math.floor(Math.random() * 256);
  let e = "";
  for (const t of s) e += Lo[t % Lo.length];
  return e;
}
const zc = oh(), ah = "spotlight-broadcast-sdk · 6b6309c · 2026-10-26", ch = 4, vr = 2e3, Do = 8, lh = "[circular]", dh = "[deep]";
function Sr(s) {
  return s.length <= vr ? s : `${s.slice(0, vr)}…(${s.length - vr} more)`;
}
function uh(s) {
  const e = s.subarray(0, Do);
  let t = "";
  for (const n of e) t += n.toString(16).padStart(2, "0");
  return `0x${t}${s.length > Do ? "…" : ""}`;
}
function hh(s) {
  return `[fn ${s.name || "(anonymous)"}]`;
}
function ms(s, e, t) {
  if (e > ch) return dh;
  if (s === null) return null;
  switch (typeof s) {
    case "string":
      return Sr(s);
    case "number":
      return Number.isFinite(s) ? s : String(s);
    case "boolean":
      return s;
    case "undefined":
      return;
    case "bigint":
      return `${s.toString()}n`;
    case "function":
      return hh(s);
    case "symbol":
      return s.toString();
  }
  const n = s;
  if (t.has(n)) return lh;
  if (n instanceof Error)
    return {
      name: n.name,
      message: Sr(n.message),
      stack: typeof n.stack == "string" ? Sr(n.stack) : void 0
    };
  if (n instanceof Uint8Array) return uh(n);
  if (n instanceof Date) return n.toISOString();
  t.add(n);
  try {
    if (Array.isArray(n))
      return n.map((i) => ms(i, e + 1, t));
    if (n instanceof Map) {
      const i = {};
      for (const [o, a] of n)
        i[typeof o == "string" ? o : String(ms(o, e + 1, t))] = ms(
          a,
          e + 1,
          t
        );
      return i;
    }
    if (n instanceof Set)
      return [...n].map((i) => ms(i, e + 1, t));
    const r = {};
    for (const [i, o] of Object.entries(n))
      r[i] = ms(o, e + 1, t);
    return r;
  } finally {
    t.delete(n);
  }
}
function fh(s, e = 0) {
  try {
    return ms(s, e, /* @__PURE__ */ new Set());
  } catch {
    return "[unserializable]";
  }
}
function ph(s) {
  if (s === void 0) return;
  const e = fh(s);
  return typeof e != "object" || e === null ? { value: e } : e;
}
const No = 5e3, Un = { debug: 0, info: 1, warn: 2, error: 3 };
let qs = [], mh = 0, jc = "debug";
const qc = /* @__PURE__ */ new Set();
let Gs = null, vs = null;
function _r() {
  Gs !== null && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(Gs), Gs = null, vs !== null && (clearTimeout(vs), vs = null);
  for (const s of qc)
    try {
      s();
    } catch {
    }
}
function gh() {
  qc.size !== 0 && (Gs !== null || vs !== null || (typeof requestAnimationFrame == "function" ? (Gs = requestAnimationFrame(_r), vs = setTimeout(_r, 100)) : vs = setTimeout(_r, 0)));
}
function wn(s, e, t, n) {
  if (Un[s] < Un[jc]) return;
  const r = { seq: ++mh, sid: zc, ts: Date.now(), level: s, ns: e, msg: String(t) }, i = ph(n);
  i !== void 0 && (r.data = i), qs.length >= No && qs.splice(0, qs.length - No + 1), qs.push(r), gh();
}
function yh(s) {
  return Un[s] >= Un[jc];
}
function Wc() {
  return qs.slice();
}
function Q(s) {
  return {
    ns: s,
    debug(e, t) {
      wn("debug", s, e, t);
    },
    info(e, t) {
      wn("info", s, e, t);
    },
    warn(e, t) {
      wn("warn", s, e, t);
    },
    error(e, t) {
      wn("error", s, e, t);
    },
    on(e) {
      return yh(e);
    }
  };
}
const $o = 8, wh = 8;
function v(s) {
  return s == null ? String(s) : s.length > $o ? `${s.slice(0, $o)}…` : s;
}
function ve(s) {
  const e = s.startsWith("0x") ? s.slice(2) : s, t = e.slice(0, wh * 2);
  return `0x${t}${e.length > t.length ? "…" : ""}`;
}
function ne(s) {
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
const bh = 18, bn = 120, vh = 13;
function Sh(s) {
  return s.toUpperCase().padEnd(5);
}
function _h(s) {
  if (typeof s == "string") return s;
  if (typeof s == "number" || typeof s == "boolean" || s === null)
    return String(s);
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return "[unserializable]";
  }
}
function xh(s) {
  const e = [];
  for (const [r, i] of Object.entries(s))
    e.push(`${r}=${_h(i)}`);
  if (e.length === 0) return [];
  const t = [];
  let n = "";
  for (const r of e)
    for (n !== "" && n.length + 1 + r.length > bn && (t.push(n), n = ""), n = n === "" ? `    ${r}` : `${n} ${r}`; n.length > bn; )
      t.push(n.slice(0, bn)), n = `    ${n.slice(bn)}`;
  return n !== "" && t.push(n), t;
}
function kh(s) {
  const t = `${new Date(s.ts).toISOString()}  ${Sh(s.level)}  ${s.sid}  ${s.ns.padEnd(bh)}${s.msg}`;
  return !s.data || Object.keys(s.data).length === 0 ? [t] : [t, ...xh(s.data)];
}
function Eh() {
  return typeof location > "u" ? "(unknown)" : location.href;
}
function Th() {
  return typeof navigator > "u" ? "(unknown)" : navigator.userAgent;
}
function Gc(s, e = {}) {
  const t = e.page ?? Eh(), n = e.userAgent ?? Th(), r = e.sessionStartMs ?? ih, i = e.build ?? ah, o = (l) => `${l} `.padEnd(Math.max(vh, l.length + 1), " "), a = [
    "# spotlight debug log",
    `# ${o("build")}${i}`,
    `# ${o("session start")}${new Date(r).toISOString()}`,
    `# ${o("page")}${t}`,
    `# ${o("user agent")}${n}`,
    `# ${o("entries")}${s.length}`,
    `# ${o("session id")}${e.sessionId ?? zc} (this page load)`
  ];
  for (const l of e.earlier ?? [])
    a.push(
      `# ${o("earlier")}${l.sid}  start ${new Date(l.startMs).toISOString()}  entries ${l.entries}  build ${l.build}  page ${l.page}`
    );
  const c = [];
  for (const l of s) c.push(...kh(l));
  return `${[...a, ...c].join(`
`)}
`;
}
const Ch = Q("triangle"), Zc = {
  // paseo-next-v2 Asset Hub — the network the dotns deploy targets
  // (.github/workflows/deploy-dotns.yml passes `--env paseo-next-v2`).
  // Verified against wss://paseo-asset-hub-next-rpc.polkadot.io on 2026-09-07,
  // after the chain was re-genesised AGAIN (third hash in a month:
  // 0xbf0488db… → 0x23e730eb… → this one). Each wipe also destroys the
  // deployed tip contract at CONTRACT_ADDRESS.
  // Testnets get re-genesised: if the host answers "chain not supported",
  // re-read the hash with chainSpec_v1_genesisHash before you debug anything else.
  "paseo-asset-hub-next": "0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a"
}, Vo = Zc["paseo-asset-hub-next"], Ah = {
  [Zc["paseo-asset-hub-next"]]: "paseo"
};
function Mh() {
  const s = Ah[Vo.toLowerCase()];
  return s || (Ch.error(
    "no DotNS TLD known for this genesis — the host will refuse the product account with DomainNotValid, and there will be no wallet, no statements and no tips. Set VITE_DOTNS_SUFFIX to this network's TLD, or add the genesis to DOTNS_SUFFIX_BY_GENESIS in src/lib/triangle/constants.ts.",
    { genesis: ve(Vo), fallback: "paseo" }
  ), "paseo");
}
const Gi = Mh(), Bh = Q("wallet");
function Kc(s, e = Gi) {
  const t = s.hostname.toLowerCase(), n = s.host.toLowerCase();
  if (s.protocol === "dot:") return t;
  if (t === "localhost" || t === "127.0.0.1" || t.endsWith(".localhost"))
    return n;
  const r = t.split(".");
  if (t.endsWith(`.${e}`))
    return r.length > 2 ? r.slice(-2).join(".") : t;
  if (r.length >= 3) {
    let i = r.slice(0, -2);
    if (i[i.length - 1] === "app" && (i = i.slice(0, -1)), i[0] === "app" && (i = i.slice(1)), i.length > 0) return `${i.join(".")}.${e}`;
  }
  return n;
}
const Ih = typeof window > "u" ? "" : Kc(window.location);
typeof window < "u" && Bh.info("product identifier derived", {
  identifier: Ih,
  origin: `${window.location.protocol}//${window.location.host}`,
  suffix: `.${Gi}`
});
class Xc extends Error {
  constructor(e, t) {
    super(`${e} timed out after ${t}ms`), this.label = e, this.elapsedMs = t, this.name = "DeadlineError";
  }
  kind = "DeadlineError";
}
function Yc(s) {
  return s instanceof Xc;
}
const Es = {
  /** Quick chain read (ReviveApi.call dry-run, Assets.Account balance, ...). */
  read: 45e3,
  /** Submit + best-block inclusion via signSubmitAndWatch. */
  submit: 6e4,
  /** User-gated sign action — mobile wallet round-trip + user finding the app. */
  sign: 9e4,
  /** Host-bridge permission / allowance dialog. */
  hostDialog: 9e4
};
async function Lt(s, e, t) {
  const n = Date.now(), r = typeof s == "function" ? s() : s;
  let i;
  const o = new Promise((a, c) => {
    i = setTimeout(() => c(new Xc(t, Date.now() - n)), e);
  });
  try {
    return await Promise.race([r, o]);
  } finally {
    i && clearTimeout(i);
  }
}
const vn = Q("statement.alloc");
async function Rh(s, e, t) {
  try {
    const n = await Lt(
      async () => Gd(s),
      e,
      `requestResourceAllocation(${t})`
    );
    if (!n.ok) {
      const o = Ho(n.error), a = Oh(n.error);
      return vn.warn("resource allocation failed", { label: t, detail: o, answered: a }), { status: "error", detail: o, answered: a };
    }
    const r = {}, i = [];
    return n.value.forEach((o, a) => {
      const c = s[a]?.tag;
      i.push(`${c ?? a}=${o}`), c && (r[c] = o);
    }), vn.info("allowance outcomes", { label: t, outcomes: i.join(" ") }), { status: "ok", outcomes: r };
  } catch (n) {
    if (Yc(n))
      return vn.warn("resource allocation: no answer inside the deadline", { label: t, timeoutMs: e }), { status: "timeout" };
    const r = Ho(n);
    return vn.warn("resource allocation threw", { label: t, detail: r }), { status: "error", detail: r, answered: !1 };
  }
}
function Oh(s) {
  return !(s instanceof Zd);
}
function Ho(s) {
  if (s instanceof Error) return s.message;
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return String(s);
  }
}
const Zi = Q("host.grants"), cn = "spotlight/host-grants/v1", Ph = 864e5;
function Ki(s = Date.now()) {
  return Math.floor(s / Ph);
}
function Fh(s, e, t = Ki()) {
  return s ? e === "forever" || s.slot === t : !1;
}
let Ye = null, xr = null, kr = null;
function Xi() {
  return kr ??= Kd().catch((s) => (kr = null, Zi.warn("host local storage unavailable — falling back to page storage", { err: s }), null)), kr;
}
function Lh(s) {
  if (!s) return {};
  try {
    const e = JSON.parse(s);
    return e && typeof e == "object" ? e : {};
  } catch {
    return {};
  }
}
function Uh() {
  try {
    return localStorage.getItem(cn);
  } catch {
    return null;
  }
}
function Qc(s) {
  try {
    localStorage.setItem(cn, s);
  } catch {
  }
}
function Jc() {
  return Ye ? Promise.resolve(Ye) : (xr ??= (async () => {
    const s = await Lt(
      (async () => {
        const e = await Xi();
        return (e ? await e.readString(cn).catch(() => null) : null) ?? Uh();
      })(),
      Es.read,
      "loadGrants"
    ).catch((e) => (Zi.warn("could not read remembered grants — asking as if nothing were", { err: e }), null));
    return Ye = Lh(s), Ye;
  })().finally(() => {
    xr = null;
  }), xr);
}
function Yi(s, e) {
  const t = { ...Ye ?? {}, [s]: { outcome: e, slot: Ki() } };
  Ye = t;
  const n = JSON.stringify(t);
  Qc(n), (async () => await (await Xi())?.writeString(cn, n).catch((i) => {
    Zi.warn("could not persist a grant to host storage", { grant: s, err: i });
  }))();
}
function el(s) {
  if (!Ye || !(s in Ye)) return;
  const e = { ...Ye };
  delete e[s], Ye = e;
  const t = JSON.stringify(e);
  Qc(t), (async () => await (await Xi())?.writeString(cn, t).catch(() => {
  }))();
}
let Ls = null, tl = 0;
const Dh = /* @__PURE__ */ new Set();
function sl(s) {
  if (Ls !== s && !(Ls && s && Ls.outcome === s.outcome && Ls.message === s.message)) {
    Ls = s;
    for (const e of Dh)
      try {
        e();
      } catch {
      }
  }
}
function Nh(s = Date.now()) {
  tl = s, sl(null);
}
function $h() {
  return tl;
}
const zo = [6e4, 12e4, 24e4, 48e4, 9e5];
class ii extends Error {
  until;
  constructor(e, t) {
    super(
      `Signaling is paused until ${Hh(e)}: the Polkadot app could not sign for Spotlight.`,
      t
    ), this.name = "SignalingPausedError", this.until = e;
  }
}
function Vh(s) {
  return s instanceof ii;
}
function Hh(s) {
  return new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
let Xe = null;
const zh = /* @__PURE__ */ new Set();
function jh(s = Date.now()) {
  return Xe && s < Xe.until ? Xe.until : null;
}
function nl(s = Date.now()) {
  if (Xe && s < Xe.until) return Xe;
  const e = (Xe?.strikes ?? 0) + 1, t = zo[Math.min(e, zo.length) - 1];
  return rl({ until: s + t, strikes: e }), Xe;
}
function qh() {
  Xe && rl(null);
}
function rl(s) {
  Xe = s;
  for (const e of zh)
    try {
      e();
    } catch {
    }
}
const Je = Q("host.grants"), Wh = {
  statements: "day-slot",
  contracts: "day-slot",
  "statement-submit": "session",
  "chain-submit": "session",
  camera: "forever",
  microphone: "forever"
}, Mn = ["contracts"], Gh = {
  contracts: "SmartContractAllowance"
}, Zh = {
  "statement-submit": { tag: "StatementSubmit", value: void 0 },
  "chain-submit": { tag: "ChainSubmit", value: void 0 }
}, Kh = {
  camera: "Camera",
  microphone: "Microphone"
}, Xh = [
  { tag: "SmartContractAllowance", value: { tag: "Index", value: 0 } },
  { tag: "AutoSigning", value: void 0 }
];
function Yh() {
  return {
    proof: void 0,
    decryptionKey: void 0,
    expiry: BigInt(Math.floor(Date.now() / 1e3) + 60) << 32n,
    channel: void 0,
    topics: [],
    data: "0x00"
  };
}
const Dn = 12e4, oi = 6e4, il = {
  // The host reports a refusal, a phone with no free slot and an offline phone
  // as the same `UnableToSign`, so this line has to cover all three.
  declined: "The Polkadot app did not let Spotlight publish to the Statement Store — the approval was declined, or no slot is free — so streams cannot be announced or joined. Try again to ask once more.",
  timeout: "The approval is still waiting in the Polkadot app. Answer it, then try again.",
  unavailable: "The host could not grant Spotlight permission to publish. Try again in a moment — if it keeps failing, reopen Spotlight from Polkadot Desktop or the browser host."
}, Yt = /* @__PURE__ */ new Map(), ur = /* @__PURE__ */ new Map();
let ai = 0, jo = Promise.resolve(), Er = null;
function Qh() {
  return Er ??= Lt(Xd(), Es.read, "isInsideContainer").catch(
    (s) => (Je.warn("could not tell whether this is a host — treating grants as unavailable", { err: s }), Er = null, "unknown")
  ), Er;
}
function Jh(...s) {
  return ol(s, !1);
}
function ol(s, e) {
  const t = jo.then(
    () => qo(s, e),
    () => qo(s, e)
    // one gate's failure must not poison the chain
  );
  return jo = t.catch(() => {
  }), t;
}
function ef(...s) {
  return ol(s, !0);
}
async function tf(s) {
  const e = await Jc();
  for (const t of s)
    e[t] && e[t].outcome !== "granted" && el(t), Yt.get(t) !== "granted" && Yt.delete(t), ur.delete(t);
  ai = 0;
}
async function qo(s, e) {
  const t = Date.now();
  e && await tf(s);
  const n = await Jc(), r = Ki(), i = {}, o = [];
  for (const c of s) {
    const l = Wh[c], d = Yt.get(c) ?? (l !== "session" && Fh(n[c], l, r) ? n[c].outcome : void 0);
    if (d) {
      i[c] = d;
      continue;
    }
    if (Date.now() < (ur.get(c) ?? 0)) {
      i[c] = "unavailable";
      continue;
    }
    o.push(c);
  }
  if (o.length === 0) return Us(i, t);
  if (Date.now() < ai) {
    for (const c of o) i[c] = "unavailable";
    return Us(i, t);
  }
  const a = await Qh();
  if (a === "unknown") {
    ai = Date.now() + oi;
    for (const c of o) i[c] = "unavailable";
    return Us(i, t);
  }
  if (!a) {
    for (const c of o) i[c] = "granted";
    return Us(i, t);
  }
  Je.info("asking the host for grants", { missing: o, slot: r }), o.includes("statements") && (i.statements = await sf()), o.some((c) => Mn.includes(c)) && Object.assign(i, await nf());
  for (const c of o) {
    const l = Zh[c];
    if (!l) continue;
    const d = await Wo(c, () => Yd(l));
    i[c] = d, (d === "granted" || d === "declined") && Yt.set(c, d);
  }
  for (const c of o) {
    const l = Kh[c];
    if (!l) continue;
    const d = await Wo(c, () => Qd(l));
    i[c] = d, (d === "granted" || d === "declined") && Yi(c, d);
  }
  return Us(i, t);
}
function Us(s, e) {
  const t = s.statements;
  return !t || t !== "granted" && $h() >= e || sl(
    t === "granted" ? null : { outcome: t, message: il[t] }
  ), s;
}
async function sf() {
  let s;
  try {
    s = await Lt(Sc(), Es.read, "getStatementStore");
  } catch (e) {
    return Je.warn("statement store unreachable for the allowance probe", { err: e }), Ot("statements"), "unavailable";
  }
  if (!s)
    return Ot("statements"), "unavailable";
  try {
    await Lt(
      s.createProofAuthorized(Yh()),
      Dn,
      "createProofAuthorized (allowance probe)"
    );
  } catch (e) {
    if (Yc(e))
      return Je.warn("no answer from the host on the allowance probe", { timeoutMs: Dn }), Ot("statements"), "timeout";
    const t = e instanceof Error ? e.message : String(e), n = /\bUnableToSign\b/.test(t) ? "declined" : "unavailable";
    return Je.warn("allowance probe failed", { outcome: n, err: e }), Yt.set("statements", n), n === "declined" && nl(), n;
  }
  return Yi("statements", "granted"), "granted";
}
async function nf() {
  const s = await Rh(Xh, Dn, "grants"), e = {};
  if (s.status === "timeout") {
    Je.warn("no answer from the host on the allowance batch", {
      timeoutMs: Dn
    });
    for (const t of Mn)
      e[t] = "timeout", Ot(t);
    return e;
  }
  if (s.status === "error") {
    for (const t of Mn)
      e[t] = "unavailable", s.answered ? Yt.set(t, "unavailable") : Ot(t);
    return e;
  }
  for (const t of Mn) {
    const n = rf(s.outcomes, t);
    e[t] = n, n === "timeout" ? Ot(t) : Yi(t, n);
  }
  return Je.info("allowance batch settled", {
    outcomes: Object.entries(s.outcomes).map(([t, n]) => `${t}=${n}`).join(" "),
    autoSigning: s.outcomes.AutoSigning ?? "unanswered"
  }), e;
}
function rf(s, e) {
  const t = Gh[e], n = t ? s[t] : void 0;
  return n === "Allocated" ? "granted" : n === "Rejected" ? "declined" : n === "NotAvailable" ? "unavailable" : (Je.warn("the host named no outcome for a requested resource", { grant: e, tag: t }), "timeout");
}
async function Wo(s, e) {
  try {
    const t = await Lt(e, Es.hostDialog, `grant(${s})`);
    return t.ok ? t.value === !0 ? "granted" : "declined" : (Ot(s), "unavailable");
  } catch (t) {
    return Je.warn("grant request did not settle", { grant: s, err: t }), Ot(s), "timeout";
  }
}
function Ot(s) {
  ur.set(s, Date.now() + oi), Je.info("grant will be retried", { grant: s, inSecs: oi / 1e3 });
}
function of(...s) {
  for (const e of s)
    el(e), Yt.delete(e), ur.delete(e);
}
const al = Jh, af = ef, cf = of, lf = il, It = "avc1.64001f", Nn = "opus", $n = "mp4a.40.2";
function Vn(s, e) {
  return `video/mp4; codecs="${s}, ${e}"`;
}
function df() {
  const s = globalThis;
  return s.MediaSource ?? s.ManagedMediaSource;
}
function Tr(s) {
  const e = df();
  return !!e && e.isTypeSupported(s);
}
async function uf(s) {
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
async function Go(s) {
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
async function hf() {
  const s = globalThis, [e, t, n] = await Promise.all([
    uf(It),
    Go(Nn),
    Go($n)
  ]);
  return {
    userAgent: typeof navigator < "u" ? navigator.userAgent : "unknown",
    webCodecs: typeof VideoEncoder < "u" && typeof AudioEncoder < "u" && typeof VideoFrame < "u",
    managedMediaSource: typeof s.ManagedMediaSource < "u",
    mediaSource: typeof s.MediaSource < "u",
    videoEncoderAvc: e,
    audioEncoderOpus: t,
    audioEncoderAac: n,
    mseAvcOpus: Tr(Vn(It, Nn)),
    mseAvcAac: Tr(Vn(It, $n)),
    mseAvcOnly: Tr(`video/mp4; codecs="${It}"`)
  };
}
function ff(s) {
  return !s.webCodecs || !s.videoEncoderAvc ? null : s.audioEncoderAac && s.mseAvcAac ? {
    videoCodec: It,
    audioCodec: $n,
    muxAudioCodec: "aac",
    mimeType: Vn(It, $n)
  } : s.audioEncoderOpus && s.mseAvcOpus ? {
    videoCodec: It,
    audioCodec: Nn,
    muxAudioCodec: "opus",
    mimeType: Vn(It, Nn)
  } : null;
}
const pf = 8;
async function mf(s) {
  const e = new TextEncoder().encode(`spotlight:room:v1:${s}`), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t)).slice(0, pf).map((r) => r.toString(16).padStart(2, "0")).join("");
}
const Cr = " unchannelled", Zo = Q("statement.expiry"), Ko = 900;
function gf(s = Date.now) {
  const e = /* @__PURE__ */ new Map();
  let t = 0n;
  const n = () => BigInt(Math.floor(s() / 1e3));
  return {
    next(r, i = Cr) {
      const o = n() + BigInt(r) << 32n | t++ & 0xffffffffn, a = e.get(i), c = a !== void 0 && o <= a ? a + 1n : o;
      return i !== Cr && e.set(i, c), c;
    },
    raiseFloor(r, i = Cr) {
      if (r >> 32n > n() + BigInt(Ko))
        return Zo.warn("ignoring an implausible priority floor — reading it as a misparse", {
          min: r,
          expiration: new Date(Number(r >> 32n) * 1e3).toISOString(),
          horizonSecs: Ko
        }), !1;
      const o = e.get(i);
      return o !== void 0 && r < o ? !1 : (e.set(i, r), Zo.debug("priority floor adopted", { channel: i, min: r }), !0);
    }
  };
}
const yf = /channel_?priority_?too_?low|expiry_?too_?low/i, wf = 1n << 12n, bf = /account_?full/i;
function vf(s) {
  return Qi(s) || !_f(s) ? null : cl(s);
}
function Sf(s) {
  if (!Qi(s)) return null;
  const e = cl(s);
  return e === null ? null : (e + wf >> 32n) + 1n << 32n;
}
function cl(s) {
  const e = /* @__PURE__ */ new Set(), t = (n, r) => {
    if (n == null || r > 4 || e.has(n)) return null;
    if (typeof n == "string") {
      const o = /"?min_?expiry"?\s*[:=]\s*"?(\d+)"?/i.exec(n);
      return o ? BigInt(o[1]) : null;
    }
    if (typeof n != "object") return null;
    e.add(n);
    const i = n;
    for (const o of ["min_expiry", "minExpiry"]) {
      const a = i[o];
      if (typeof a == "bigint") return a;
      if (typeof a == "number" || typeof a == "string")
        try {
          return BigInt(a);
        } catch {
        }
    }
    for (const o of Object.values(i)) {
      const a = t(o, r + 1);
      if (a !== null) return a;
    }
    return null;
  };
  return t(s instanceof Error ? s.message : s, 0) ?? t(s, 0);
}
function Qi(s) {
  return ll(s, bf);
}
function _f(s) {
  return ll(s, yf);
}
function ll(s, e) {
  const t = /* @__PURE__ */ new Set(), n = (r, i) => r == null || i > 4 || t.has(r) ? !1 : typeof r == "string" ? e.test(r) : typeof r != "object" ? !1 : (t.add(r), Object.entries(r).some(
    ([o, a]) => e.test(o) || n(a, i + 1)
  ));
  return s instanceof Error && e.test(s.message) ? !0 : n(s, 0);
}
function xf() {
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
var Y;
(function(s) {
  s.assertEqual = (r) => {
  };
  function e(r) {
  }
  s.assertIs = e;
  function t(r) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (r) => {
    const i = {};
    for (const o of r)
      i[o] = o;
    return i;
  }, s.getValidEnumValues = (r) => {
    const i = s.objectKeys(r).filter((a) => typeof r[r[a]] != "number"), o = {};
    for (const a of i)
      o[a] = r[a];
    return s.objectValues(o);
  }, s.objectValues = (r) => s.objectKeys(r).map(function(i) {
    return r[i];
  }), s.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const i = [];
    for (const o in r)
      Object.prototype.hasOwnProperty.call(r, o) && i.push(o);
    return i;
  }, s.find = (r, i) => {
    for (const o of r)
      if (i(o))
        return o;
  }, s.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function n(r, i = " | ") {
    return r.map((o) => typeof o == "string" ? `'${o}'` : o).join(i);
  }
  s.joinValues = n, s.jsonStringifyReplacer = (r, i) => typeof i == "bigint" ? i.toString() : i;
})(Y || (Y = {}));
var Xo;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Xo || (Xo = {}));
const B = Y.arrayToEnum([
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
]), Bt = (s) => {
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
}, S = Y.arrayToEnum([
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
class gt extends Error {
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
    const t = e || function(i) {
      return i.message;
    }, n = { _errors: [] }, r = (i) => {
      for (const o of i.issues)
        if (o.code === "invalid_union")
          o.unionErrors.map(r);
        else if (o.code === "invalid_return_type")
          r(o.returnTypeError);
        else if (o.code === "invalid_arguments")
          r(o.argumentsError);
        else if (o.path.length === 0)
          n._errors.push(t(o));
        else {
          let a = n, c = 0;
          for (; c < o.path.length; ) {
            const l = o.path[c];
            c === o.path.length - 1 ? (a[l] = a[l] || { _errors: [] }, a[l]._errors.push(t(o))) : a[l] = a[l] || { _errors: [] }, a = a[l], c++;
          }
        }
    };
    return r(this), n;
  }
  static assert(e) {
    if (!(e instanceof gt))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, Y.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, n = [];
    for (const r of this.issues)
      if (r.path.length > 0) {
        const i = r.path[0];
        t[i] = t[i] || [], t[i].push(e(r));
      } else
        n.push(e(r));
    return { formErrors: n, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
gt.create = (s) => new gt(s);
const ci = (s, e) => {
  let t;
  switch (s.code) {
    case S.invalid_type:
      s.received === B.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case S.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, Y.jsonStringifyReplacer)}`;
      break;
    case S.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${Y.joinValues(s.keys, ", ")}`;
      break;
    case S.invalid_union:
      t = "Invalid input";
      break;
    case S.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${Y.joinValues(s.options)}`;
      break;
    case S.invalid_enum_value:
      t = `Invalid enum value. Expected ${Y.joinValues(s.options)}, received '${s.received}'`;
      break;
    case S.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case S.invalid_return_type:
      t = "Invalid function return type";
      break;
    case S.invalid_date:
      t = "Invalid date";
      break;
    case S.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : Y.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case S.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case S.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case S.custom:
      t = "Invalid input";
      break;
    case S.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case S.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case S.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, Y.assertNever(s);
  }
  return { message: t };
};
let kf = ci;
function Ef() {
  return kf;
}
const Tf = (s) => {
  const { data: e, path: t, errorMaps: n, issueData: r } = s, i = [...t, ...r.path || []], o = {
    ...r,
    path: i
  };
  if (r.message !== void 0)
    return {
      ...r,
      path: i,
      message: r.message
    };
  let a = "";
  const c = n.filter((l) => !!l).slice().reverse();
  for (const l of c)
    a = l(o, { data: e, defaultError: a }).message;
  return {
    ...r,
    path: i,
    message: a
  };
};
function C(s, e) {
  const t = Ef(), n = Tf({
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
      t === ci ? void 0 : ci
      // then global default map
    ].filter((r) => !!r)
  });
  s.common.issues.push(n);
}
class Ae {
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
    for (const r of t) {
      if (r.status === "aborted")
        return D;
      r.status === "dirty" && e.dirty(), n.push(r.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, t) {
    const n = [];
    for (const r of t) {
      const i = await r.key, o = await r.value;
      n.push({
        key: i,
        value: o
      });
    }
    return Ae.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, t) {
    const n = {};
    for (const r of t) {
      const { key: i, value: o } = r;
      if (i.status === "aborted" || o.status === "aborted")
        return D;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || r.alwaysSet) && (n[i.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const D = Object.freeze({
  status: "aborted"
}), Ws = (s) => ({ status: "dirty", value: s }), Le = (s) => ({ status: "valid", value: s }), Yo = (s) => s.status === "aborted", Qo = (s) => s.status === "dirty", Ts = (s) => s.status === "valid", Hn = (s) => typeof Promise < "u" && s instanceof Promise;
var R;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e?.message;
})(R || (R = {}));
class st {
  constructor(e, t, n, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Jo = (s, e) => {
  if (Ts(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new gt(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function z(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: n, description: r } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (o, a) => {
    const { message: c } = s;
    return o.code === "invalid_enum_value" ? { message: c ?? a.defaultError } : typeof a.data > "u" ? { message: c ?? n ?? a.defaultError } : o.code !== "invalid_type" ? { message: a.defaultError } : { message: c ?? t ?? a.defaultError };
  }, description: r };
}
class Z {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Bt(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Bt(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Ae(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Bt(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Hn(t))
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
      parsedType: Bt(e)
    }, r = this._parseSync({ data: e, path: n.path, parent: n });
    return Jo(n, r);
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
      parsedType: Bt(e)
    };
    if (!this["~standard"].async)
      try {
        const n = this._parseSync({ data: e, path: [], parent: t });
        return Ts(n) ? {
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
    return this._parseAsync({ data: e, path: [], parent: t }).then((n) => Ts(n) ? {
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
      parsedType: Bt(e)
    }, r = this._parse({ data: e, path: n.path, parent: n }), i = await (Hn(r) ? r : Promise.resolve(r));
    return Jo(n, i);
  }
  refine(e, t) {
    const n = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, i) => {
      const o = e(r), a = () => i.addIssue({
        code: S.custom,
        ...n(r)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((c) => c ? !0 : (a(), !1)) : o ? !0 : (a(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
  }
  _refinement(e) {
    return new es({
      schema: this,
      typeName: N.ZodEffects,
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
    return ft.create(this, this._def);
  }
  nullable() {
    return ts.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return et.create(this);
  }
  promise() {
    return Zn.create(this, this._def);
  }
  or(e) {
    return jn.create([this, e], this._def);
  }
  and(e) {
    return qn.create(this, e, this._def);
  }
  transform(e) {
    return new es({
      ...z(this._def),
      schema: this,
      typeName: N.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Kn({
      ...z(this._def),
      innerType: this,
      defaultValue: t,
      typeName: N.ZodDefault
    });
  }
  brand() {
    return new fl({
      typeName: N.ZodBranded,
      type: this,
      ...z(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Xn({
      ...z(this._def),
      innerType: this,
      catchValue: t,
      typeName: N.ZodCatch
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
    return eo.create(this, e);
  }
  readonly() {
    return Yn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Cf = /^c[^\s-]{8,}$/i, Af = /^[0-9a-z]+$/, Mf = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Bf = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, If = /^[a-z0-9_-]{21}$/i, Rf = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Of = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Pf = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ff = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ar;
const Lf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Uf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Df = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Nf = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, $f = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Vf = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, dl = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Hf = new RegExp(`^${dl}$`);
function ul(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function zf(s) {
  return new RegExp(`^${ul(s)}$`);
}
function jf(s) {
  let e = `${dl}T${ul(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function qf(s, e) {
  return !!((e === "v4" || !e) && Lf.test(s) || (e === "v6" || !e) && Df.test(s));
}
function Wf(s, e) {
  if (!Rf.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const n = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), r = JSON.parse(atob(n));
    return !(typeof r != "object" || r === null || "typ" in r && r?.typ !== "JWT" || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function Gf(s, e) {
  return !!((e === "v4" || !e) && Uf.test(s) || (e === "v6" || !e) && Nf.test(s));
}
class ut extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== B.string) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: B.string,
        received: i.parsedType
      }), D;
    }
    const n = new Ae();
    let r;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (r = this._getOrReturnCtx(e, r), C(r, {
          code: S.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), n.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (r = this._getOrReturnCtx(e, r), C(r, {
          code: S.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), n.dirty());
      else if (i.kind === "length") {
        const o = e.data.length > i.value, a = e.data.length < i.value;
        (o || a) && (r = this._getOrReturnCtx(e, r), o ? C(r, {
          code: S.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : a && C(r, {
          code: S.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), n.dirty());
      } else if (i.kind === "email")
        Pf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "email",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "emoji")
        Ar || (Ar = new RegExp(Ff, "u")), Ar.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "emoji",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "uuid")
        Bf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "uuid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "nanoid")
        If.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "nanoid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid")
        Cf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "cuid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid2")
        Af.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "cuid2",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "ulid")
        Mf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "ulid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), C(r, {
            validation: "url",
            code: S.invalid_string,
            message: i.message
          }), n.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "regex",
        code: S.invalid_string,
        message: i.message
      }), n.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), n.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), n.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), n.dirty()) : i.kind === "datetime" ? jf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "datetime",
        message: i.message
      }), n.dirty()) : i.kind === "date" ? Hf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "date",
        message: i.message
      }), n.dirty()) : i.kind === "time" ? zf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "time",
        message: i.message
      }), n.dirty()) : i.kind === "duration" ? Of.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "duration",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "ip" ? qf(e.data, i.version) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "ip",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "jwt" ? Wf(e.data, i.alg) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "jwt",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "cidr" ? Gf(e.data, i.version) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "cidr",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64" ? $f.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "base64",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64url" ? Vf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "base64url",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : Y.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: S.invalid_string,
      ...R.errToObj(n)
    });
  }
  _addCheck(e) {
    return new ut({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...R.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...R.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...R.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...R.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...R.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...R.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...R.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...R.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...R.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...R.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...R.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...R.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...R.errToObj(e) });
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
      ...R.errToObj(e?.message)
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
      ...R.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...R.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...R.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...R.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...R.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...R.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...R.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...R.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...R.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, R.errToObj(e));
  }
  trim() {
    return new ut({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ut({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ut({
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
ut.create = (s) => new ut({
  checks: [],
  typeName: N.ZodString,
  coerce: s?.coerce ?? !1,
  ...z(s)
});
function Zf(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, r = t > n ? t : n, i = Number.parseInt(s.toFixed(r).replace(".", "")), o = Number.parseInt(e.toFixed(r).replace(".", ""));
  return i % o / 10 ** r;
}
class Cs extends Z {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== B.number) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: B.number,
        received: i.parsedType
      }), D;
    }
    let n;
    const r = new Ae();
    for (const i of this._def.checks)
      i.kind === "int" ? Y.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), r.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? Zf(e.data, i.value) !== 0 && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.not_finite,
        message: i.message
      }), r.dirty()) : Y.assertNever(i);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, R.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, R.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, R.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, R.toString(t));
  }
  setLimit(e, t, n, r) {
    return new Cs({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Cs({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: R.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: R.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: R.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: R.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: R.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: R.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: R.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: R.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: R.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && Y.isInteger(e.value));
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
Cs.create = (s) => new Cs({
  checks: [],
  typeName: N.ZodNumber,
  coerce: s?.coerce || !1,
  ...z(s)
});
class en extends Z {
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
    const r = new Ae();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : Y.assertNever(i);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return C(t, {
      code: S.invalid_type,
      expected: B.bigint,
      received: t.parsedType
    }), D;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, R.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, R.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, R.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, R.toString(t));
  }
  setLimit(e, t, n, r) {
    return new en({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new en({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: R.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: R.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: R.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: R.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: R.toString(t)
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
en.create = (s) => new en({
  checks: [],
  typeName: N.ZodBigInt,
  coerce: s?.coerce ?? !1,
  ...z(s)
});
class li extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== B.boolean) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.boolean,
        received: n.parsedType
      }), D;
    }
    return Le(e.data);
  }
}
li.create = (s) => new li({
  typeName: N.ZodBoolean,
  coerce: s?.coerce || !1,
  ...z(s)
});
class zn extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== B.date) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: B.date,
        received: i.parsedType
      }), D;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_date
      }), D;
    }
    const n = new Ae();
    let r;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), n.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), n.dirty()) : Y.assertNever(i);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new zn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: R.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: R.toString(t)
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
zn.create = (s) => new zn({
  checks: [],
  coerce: s?.coerce || !1,
  typeName: N.ZodDate,
  ...z(s)
});
class ea extends Z {
  _parse(e) {
    if (this._getType(e) !== B.symbol) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.symbol,
        received: n.parsedType
      }), D;
    }
    return Le(e.data);
  }
}
ea.create = (s) => new ea({
  typeName: N.ZodSymbol,
  ...z(s)
});
class di extends Z {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.undefined,
        received: n.parsedType
      }), D;
    }
    return Le(e.data);
  }
}
di.create = (s) => new di({
  typeName: N.ZodUndefined,
  ...z(s)
});
class ui extends Z {
  _parse(e) {
    if (this._getType(e) !== B.null) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.null,
        received: n.parsedType
      }), D;
    }
    return Le(e.data);
  }
}
ui.create = (s) => new ui({
  typeName: N.ZodNull,
  ...z(s)
});
class ta extends Z {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Le(e.data);
  }
}
ta.create = (s) => new ta({
  typeName: N.ZodAny,
  ...z(s)
});
class hi extends Z {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Le(e.data);
  }
}
hi.create = (s) => new hi({
  typeName: N.ZodUnknown,
  ...z(s)
});
class Ut extends Z {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return C(t, {
      code: S.invalid_type,
      expected: B.never,
      received: t.parsedType
    }), D;
  }
}
Ut.create = (s) => new Ut({
  typeName: N.ZodNever,
  ...z(s)
});
class sa extends Z {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.void,
        received: n.parsedType
      }), D;
    }
    return Le(e.data);
  }
}
sa.create = (s) => new sa({
  typeName: N.ZodVoid,
  ...z(s)
});
class et extends Z {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== B.array)
      return C(t, {
        code: S.invalid_type,
        expected: B.array,
        received: t.parsedType
      }), D;
    if (r.exactLength !== null) {
      const o = t.data.length > r.exactLength.value, a = t.data.length < r.exactLength.value;
      (o || a) && (C(t, {
        code: o ? S.too_big : S.too_small,
        minimum: a ? r.exactLength.value : void 0,
        maximum: o ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), n.dirty());
    }
    if (r.minLength !== null && t.data.length < r.minLength.value && (C(t, {
      code: S.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (C(t, {
      code: S.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), n.dirty()), t.common.async)
      return Promise.all([...t.data].map((o, a) => r.type._parseAsync(new st(t, o, t.path, a)))).then((o) => Ae.mergeArray(n, o));
    const i = [...t.data].map((o, a) => r.type._parseSync(new st(t, o, t.path, a)));
    return Ae.mergeArray(n, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new et({
      ...this._def,
      minLength: { value: e, message: R.toString(t) }
    });
  }
  max(e, t) {
    return new et({
      ...this._def,
      maxLength: { value: e, message: R.toString(t) }
    });
  }
  length(e, t) {
    return new et({
      ...this._def,
      exactLength: { value: e, message: R.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
et.create = (s, e) => new et({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: N.ZodArray,
  ...z(e)
});
function gs(s) {
  if (s instanceof ge) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = ft.create(gs(n));
    }
    return new ge({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof et ? new et({
    ...s._def,
    type: gs(s.element)
  }) : s instanceof ft ? ft.create(gs(s.unwrap())) : s instanceof ts ? ts.create(gs(s.unwrap())) : s instanceof Qt ? Qt.create(s.items.map((e) => gs(e))) : s;
}
class ge extends Z {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = Y.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== B.object) {
      const l = this._getOrReturnCtx(e);
      return C(l, {
        code: S.invalid_type,
        expected: B.object,
        received: l.parsedType
      }), D;
    }
    const { status: n, ctx: r } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), a = [];
    if (!(this._def.catchall instanceof Ut && this._def.unknownKeys === "strip"))
      for (const l in r.data)
        o.includes(l) || a.push(l);
    const c = [];
    for (const l of o) {
      const d = i[l], u = r.data[l];
      c.push({
        key: { status: "valid", value: l },
        value: d._parse(new st(r, u, r.path, l)),
        alwaysSet: l in r.data
      });
    }
    if (this._def.catchall instanceof Ut) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const d of a)
          c.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: r.data[d] }
          });
      else if (l === "strict")
        a.length > 0 && (C(r, {
          code: S.unrecognized_keys,
          keys: a
        }), n.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const d of a) {
        const u = r.data[d];
        c.push({
          key: { status: "valid", value: d },
          value: l._parse(
            new st(r, u, r.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const l = [];
      for (const d of c) {
        const u = await d.key, h = await d.value;
        l.push({
          key: u,
          value: h,
          alwaysSet: d.alwaysSet
        });
      }
      return l;
    }).then((l) => Ae.mergeObjectSync(n, l)) : Ae.mergeObjectSync(n, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return R.errToObj, new ge({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          const r = this._def.errorMap?.(t, n).message ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: R.errToObj(e).message ?? r
          } : {
            message: r
          };
        }
      } : {}
    });
  }
  strip() {
    return new ge({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ge({
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
    return new ge({
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
    return new ge({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: N.ZodObject
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
    return new ge({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of Y.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of Y.objectKeys(this.shape))
      e[n] || (t[n] = this.shape[n]);
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return gs(this);
  }
  partial(e) {
    const t = {};
    for (const n of Y.objectKeys(this.shape)) {
      const r = this.shape[n];
      e && !e[n] ? t[n] = r : t[n] = r.optional();
    }
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const n of Y.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let i = this.shape[n];
        for (; i instanceof ft; )
          i = i._def.innerType;
        t[n] = i;
      }
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return hl(Y.objectKeys(this.shape));
  }
}
ge.create = (s, e) => new ge({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Ut.create(),
  typeName: N.ZodObject,
  ...z(e)
});
ge.strictCreate = (s, e) => new ge({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Ut.create(),
  typeName: N.ZodObject,
  ...z(e)
});
ge.lazycreate = (s, e) => new ge({
  shape: s,
  unknownKeys: "strip",
  catchall: Ut.create(),
  typeName: N.ZodObject,
  ...z(e)
});
class jn extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function r(i) {
      for (const a of i)
        if (a.result.status === "valid")
          return a.result;
      for (const a of i)
        if (a.result.status === "dirty")
          return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((a) => new gt(a.ctx.common.issues));
      return C(t, {
        code: S.invalid_union,
        unionErrors: o
      }), D;
    }
    if (t.common.async)
      return Promise.all(n.map(async (i) => {
        const o = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: t.data,
            path: t.path,
            parent: o
          }),
          ctx: o
        };
      })).then(r);
    {
      let i;
      const o = [];
      for (const c of n) {
        const l = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, d = c._parseSync({
          data: t.data,
          path: t.path,
          parent: l
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: l }), l.common.issues.length && o.push(l.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const a = o.map((c) => new gt(c));
      return C(t, {
        code: S.invalid_union,
        unionErrors: a
      }), D;
    }
  }
  get options() {
    return this._def.options;
  }
}
jn.create = (s, e) => new jn({
  options: s,
  typeName: N.ZodUnion,
  ...z(e)
});
const ct = (s) => s instanceof pi ? ct(s.schema) : s instanceof es ? ct(s.innerType()) : s instanceof Gn ? [s.value] : s instanceof Jt ? s.options : s instanceof mi ? Y.objectValues(s.enum) : s instanceof Kn ? ct(s._def.innerType) : s instanceof di ? [void 0] : s instanceof ui ? [null] : s instanceof ft ? [void 0, ...ct(s.unwrap())] : s instanceof ts ? [null, ...ct(s.unwrap())] : s instanceof fl || s instanceof Yn ? ct(s.unwrap()) : s instanceof Xn ? ct(s._def.innerType) : [];
class Ji extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== B.object)
      return C(t, {
        code: S.invalid_type,
        expected: B.object,
        received: t.parsedType
      }), D;
    const n = this.discriminator, r = t.data[n], i = this.optionsMap.get(r);
    return i ? t.common.async ? i._parseAsync({
      data: t.data,
      path: t.path,
      parent: t
    }) : i._parseSync({
      data: t.data,
      path: t.path,
      parent: t
    }) : (C(t, {
      code: S.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), D);
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
    const r = /* @__PURE__ */ new Map();
    for (const i of t) {
      const o = ct(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const a of o) {
        if (r.has(a))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
        r.set(a, i);
      }
    }
    return new Ji({
      typeName: N.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: r,
      ...z(n)
    });
  }
}
function fi(s, e) {
  const t = Bt(s), n = Bt(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === B.object && n === B.object) {
    const r = Y.objectKeys(e), i = Y.objectKeys(s).filter((a) => r.indexOf(a) !== -1), o = { ...s, ...e };
    for (const a of i) {
      const c = fi(s[a], e[a]);
      if (!c.valid)
        return { valid: !1 };
      o[a] = c.data;
    }
    return { valid: !0, data: o };
  } else if (t === B.array && n === B.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let i = 0; i < s.length; i++) {
      const o = s[i], a = e[i], c = fi(o, a);
      if (!c.valid)
        return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return t === B.date && n === B.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class qn extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), r = (i, o) => {
      if (Yo(i) || Yo(o))
        return D;
      const a = fi(i.value, o.value);
      return a.valid ? ((Qo(i) || Qo(o)) && t.dirty(), { status: t.value, value: a.data }) : (C(n, {
        code: S.invalid_intersection_types
      }), D);
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
    ]).then(([i, o]) => r(i, o)) : r(this._def.left._parseSync({
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
qn.create = (s, e, t) => new qn({
  left: s,
  right: e,
  typeName: N.ZodIntersection,
  ...z(t)
});
class Qt extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.array)
      return C(n, {
        code: S.invalid_type,
        expected: B.array,
        received: n.parsedType
      }), D;
    if (n.data.length < this._def.items.length)
      return C(n, {
        code: S.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), D;
    !this._def.rest && n.data.length > this._def.items.length && (C(n, {
      code: S.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...n.data].map((o, a) => {
      const c = this._def.items[a] || this._def.rest;
      return c ? c._parse(new st(n, o, n.path, a)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(i).then((o) => Ae.mergeArray(t, o)) : Ae.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Qt({
      ...this._def,
      rest: e
    });
  }
}
Qt.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Qt({
    items: s,
    typeName: N.ZodTuple,
    rest: null,
    ...z(e)
  });
};
class Wn extends Z {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.object)
      return C(n, {
        code: S.invalid_type,
        expected: B.object,
        received: n.parsedType
      }), D;
    const r = [], i = this._def.keyType, o = this._def.valueType;
    for (const a in n.data)
      r.push({
        key: i._parse(new st(n, a, n.path, a)),
        value: o._parse(new st(n, n.data[a], n.path, a)),
        alwaysSet: a in n.data
      });
    return n.common.async ? Ae.mergeObjectAsync(t, r) : Ae.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof Z ? new Wn({
      keyType: e,
      valueType: t,
      typeName: N.ZodRecord,
      ...z(n)
    }) : new Wn({
      keyType: ut.create(),
      valueType: e,
      typeName: N.ZodRecord,
      ...z(t)
    });
  }
}
class na extends Z {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.map)
      return C(n, {
        code: S.invalid_type,
        expected: B.map,
        received: n.parsedType
      }), D;
    const r = this._def.keyType, i = this._def.valueType, o = [...n.data.entries()].map(([a, c], l) => ({
      key: r._parse(new st(n, a, n.path, [l, "key"])),
      value: i._parse(new st(n, c, n.path, [l, "value"]))
    }));
    if (n.common.async) {
      const a = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of o) {
          const l = await c.key, d = await c.value;
          if (l.status === "aborted" || d.status === "aborted")
            return D;
          (l.status === "dirty" || d.status === "dirty") && t.dirty(), a.set(l.value, d.value);
        }
        return { status: t.value, value: a };
      });
    } else {
      const a = /* @__PURE__ */ new Map();
      for (const c of o) {
        const l = c.key, d = c.value;
        if (l.status === "aborted" || d.status === "aborted")
          return D;
        (l.status === "dirty" || d.status === "dirty") && t.dirty(), a.set(l.value, d.value);
      }
      return { status: t.value, value: a };
    }
  }
}
na.create = (s, e, t) => new na({
  valueType: e,
  keyType: s,
  typeName: N.ZodMap,
  ...z(t)
});
class tn extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.set)
      return C(n, {
        code: S.invalid_type,
        expected: B.set,
        received: n.parsedType
      }), D;
    const r = this._def;
    r.minSize !== null && n.data.size < r.minSize.value && (C(n, {
      code: S.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (C(n, {
      code: S.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), t.dirty());
    const i = this._def.valueType;
    function o(c) {
      const l = /* @__PURE__ */ new Set();
      for (const d of c) {
        if (d.status === "aborted")
          return D;
        d.status === "dirty" && t.dirty(), l.add(d.value);
      }
      return { status: t.value, value: l };
    }
    const a = [...n.data.values()].map((c, l) => i._parse(new st(n, c, n.path, l)));
    return n.common.async ? Promise.all(a).then((c) => o(c)) : o(a);
  }
  min(e, t) {
    return new tn({
      ...this._def,
      minSize: { value: e, message: R.toString(t) }
    });
  }
  max(e, t) {
    return new tn({
      ...this._def,
      maxSize: { value: e, message: R.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
tn.create = (s, e) => new tn({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: N.ZodSet,
  ...z(e)
});
class pi extends Z {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
pi.create = (s, e) => new pi({
  getter: s,
  typeName: N.ZodLazy,
  ...z(e)
});
class Gn extends Z {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return C(t, {
        received: t.data,
        code: S.invalid_literal,
        expected: this._def.value
      }), D;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Gn.create = (s, e) => new Gn({
  value: s,
  typeName: N.ZodLiteral,
  ...z(e)
});
function hl(s, e) {
  return new Jt({
    values: s,
    typeName: N.ZodEnum,
    ...z(e)
  });
}
class Jt extends Z {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return C(t, {
        expected: Y.joinValues(n),
        received: t.parsedType,
        code: S.invalid_type
      }), D;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return C(t, {
        received: t.data,
        code: S.invalid_enum_value,
        options: n
      }), D;
    }
    return Le(e.data);
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
    return Jt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Jt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Jt.create = hl;
class mi extends Z {
  _parse(e) {
    const t = Y.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== B.string && n.parsedType !== B.number) {
      const r = Y.objectValues(t);
      return C(n, {
        expected: Y.joinValues(r),
        received: n.parsedType,
        code: S.invalid_type
      }), D;
    }
    if (this._cache || (this._cache = new Set(Y.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = Y.objectValues(t);
      return C(n, {
        received: n.data,
        code: S.invalid_enum_value,
        options: r
      }), D;
    }
    return Le(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
mi.create = (s, e) => new mi({
  values: s,
  typeName: N.ZodNativeEnum,
  ...z(e)
});
class Zn extends Z {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== B.promise && t.common.async === !1)
      return C(t, {
        code: S.invalid_type,
        expected: B.promise,
        received: t.parsedType
      }), D;
    const n = t.parsedType === B.promise ? t.data : Promise.resolve(t.data);
    return Le(n.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
Zn.create = (s, e) => new Zn({
  type: s,
  typeName: N.ZodPromise,
  ...z(e)
});
class es extends Z {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === N.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
      addIssue: (o) => {
        C(n, o), o.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
      const o = r.transform(n.data, i);
      if (n.common.async)
        return Promise.resolve(o).then(async (a) => {
          if (t.value === "aborted")
            return D;
          const c = await this._def.schema._parseAsync({
            data: a,
            path: n.path,
            parent: n
          });
          return c.status === "aborted" ? D : c.status === "dirty" || t.value === "dirty" ? Ws(c.value) : c;
        });
      {
        if (t.value === "aborted")
          return D;
        const a = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? D : a.status === "dirty" || t.value === "dirty" ? Ws(a.value) : a;
      }
    }
    if (r.type === "refinement") {
      const o = (a) => {
        const c = r.refinement(a, i);
        if (n.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return a;
      };
      if (n.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? D : (a.status === "dirty" && t.dirty(), o(a.value), { status: t.value, value: a.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((a) => a.status === "aborted" ? D : (a.status === "dirty" && t.dirty(), o(a.value).then(() => ({ status: t.value, value: a.value }))));
    }
    if (r.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Ts(o))
          return D;
        const a = r.transform(o.value, i);
        if (a instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: a };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => Ts(o) ? Promise.resolve(r.transform(o.value, i)).then((a) => ({
          status: t.value,
          value: a
        })) : D);
    Y.assertNever(r);
  }
}
es.create = (s, e, t) => new es({
  schema: s,
  typeName: N.ZodEffects,
  effect: e,
  ...z(t)
});
es.createWithPreprocess = (s, e, t) => new es({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: N.ZodEffects,
  ...z(t)
});
class ft extends Z {
  _parse(e) {
    return this._getType(e) === B.undefined ? Le(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ft.create = (s, e) => new ft({
  innerType: s,
  typeName: N.ZodOptional,
  ...z(e)
});
class ts extends Z {
  _parse(e) {
    return this._getType(e) === B.null ? Le(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ts.create = (s, e) => new ts({
  innerType: s,
  typeName: N.ZodNullable,
  ...z(e)
});
class Kn extends Z {
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
Kn.create = (s, e) => new Kn({
  innerType: s,
  typeName: N.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...z(e)
});
class Xn extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return Hn(r) ? r.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new gt(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
        get error() {
          return new gt(n.common.issues);
        },
        input: n.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Xn.create = (s, e) => new Xn({
  innerType: s,
  typeName: N.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...z(e)
});
class ra extends Z {
  _parse(e) {
    if (this._getType(e) !== B.nan) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: B.nan,
        received: n.parsedType
      }), D;
    }
    return { status: "valid", value: e.data };
  }
}
ra.create = (s) => new ra({
  typeName: N.ZodNaN,
  ...z(s)
});
class fl extends Z {
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
class eo extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return i.status === "aborted" ? D : i.status === "dirty" ? (t.dirty(), Ws(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: n.path,
          parent: n
        });
      })();
    {
      const r = this._def.in._parseSync({
        data: n.data,
        path: n.path,
        parent: n
      });
      return r.status === "aborted" ? D : r.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, t) {
    return new eo({
      in: e,
      out: t,
      typeName: N.ZodPipeline
    });
  }
}
class Yn extends Z {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (r) => (Ts(r) && (r.value = Object.freeze(r.value)), r);
    return Hn(t) ? t.then((r) => n(r)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Yn.create = (s, e) => new Yn({
  innerType: s,
  typeName: N.ZodReadonly,
  ...z(e)
});
var N;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(N || (N = {}));
const ue = ut.create, ie = Cs.create, gi = li.create, Kf = hi.create;
Ut.create;
const rs = et.create, J = ge.create;
jn.create;
const Xf = Ji.create;
qn.create;
Qt.create;
const pl = Wn.create, ce = Gn.create, Os = Jt.create;
Zn.create;
ft.create;
ts.create;
const Yf = 32 * 1024, Qf = Math.ceil(Yf / 3) * 4, Jf = ["video/mp4", "image/jpeg"], ep = { BASE_URL: "/", DEV: !1, MODE: "production", PROD: !0, SSR: !1 };
function ml(s) {
  const t = ep?.[s];
  return t === void 0 || t === "" ? void 0 : t;
}
function Ue(s, e) {
  const t = ml(s);
  if (t === void 0) return e;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : e;
}
function tp(s, e) {
  const t = ml(s);
  if (t === void 0) return e;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) && n > 0 ? n : e;
}
const Xt = Ue("VITE_CHUNK_MS", 2e3), gl = Ue("VITE_VIDEO_BITRATE", 12e5), yl = 96e3, sp = 30, np = 48e3, rp = 960, ip = 3;
Ue("VITE_LAG_DECAY_CHUNKS", 30);
const yi = 30, pt = 16 * 1024, op = 3, ap = 6, cp = 12, Qn = 3e4, lp = 0.3, ia = 0.9, dp = 0.7, oa = Qn, Mr = 2 * Qn, aa = 20, up = Ue("VITE_HOST_FANOUT", 4), hp = 3, fp = Ue("VITE_UPLOAD_BUDGET", 4e6), pp = 1, mp = 1, gp = 0.25, yp = 3, wp = tp("VITE_PROGRESS_TIMEOUT_CHUNKS", 0.5), bp = 0.5, vp = 1, Sp = 1, Br = 1.25, _p = 0.25, xp = 0.9, kp = 1.1, wl = 4, Ep = 3, Tp = 2, Cp = 6, bl = 4e3, Ap = 2, Mp = Ue("VITE_SUMMARY_MISS_SLACK_MS", 1500), vl = bl * Ap + Mp, Bp = 3e4, Ip = 9e4;
Ue("VITE_JOIN_WATCHDOG_MS", 22e3);
Ue("VITE_ORPHAN_REJOIN_MS", 3e3);
const ca = 2e3, Rp = 2, Sl = 1024 * 1024, _l = 60, xl = 32, la = 8, Op = 4096, Pp = 12e4, Fp = 30, Lp = 5, Up = 50, wi = 2, to = 16, Dp = Ue("VITE_JOIN_GATHER_MS", 3e3), Np = 3e4, da = Ue("VITE_ICE_DISCONNECT_GRACE_MS", 3e3), bi = 250, kl = 1e4, Ds = 3 * kl, ua = 1e4, $p = 2, Vp = 4, Hp = Ue("VITE_HOST_ONLY_SLOTS", 1), zp = 2, vi = 3, jp = Ue("VITE_MESH_DIAL_BACKOFF_CHUNKS", 30), Dt = Q("swarm.wire"), so = 5, Jn = ne(so), ha = ne(so), me = 1, Ss = ue().min(1).max(64), hr = ue().max(64), Ps = ie().int().min(0).max(2 ** 32 - 1), fr = ie().int().min(0), Si = ie().int().min(0), qp = ue().min(1).max(32), Nt = ue().regex(/^[0-9a-f]*$/), Wp = J({
  base: Ps,
  bitmapHex: Nt.max(256)
  // ≤128 bytes ⇒ ≤1024-chunk window
}), Gp = J({
  epoch: fr,
  seq: Ps,
  tsUs: ie().int().min(0),
  durUs: ie().int().min(0),
  size: ie().int().min(1).max(32 * 1024 * 1024),
  hash: Nt.length(64),
  sig: Nt.length(128)
}), is = Nt.length(64), no = J({
  epk: is,
  iv: Nt.length(24),
  ct: Nt.min(2).max(102400)
}), Ht = { from: Ss, ts: Si, nonce: qp }, _e = { v: ce(me) }, Zp = J({
  ..._e,
  t: ce("hello"),
  addr: Ss,
  name: hr,
  epoch: fr,
  edgeSeq: ie().int().min(-1),
  have: Wp,
  /** Opt-in flag: willing to act as a delegated join responder (§6.2a). */
  responder: gi().optional(),
  /** Sender's session box pubkey — lets neighbors seal SDP to us and lets
   *  PEX/heartbeats redistribute the key. Optional for wire compat only;
   *  peers without one are never mesh-dialed. */
  boxPub: is.optional(),
  /** Sender's neighbor count, this link included: the host's first
   *  host-only report (summary.degree carries the next ones). */
  degree: ie().int().min(0).max(256).optional(),
  /** Sender reaches only the host (PeerBook.relayOnly). Absent = false. */
  relayOnly: gi().optional()
}), Kp = J({
  ..._e,
  t: ce("have"),
  seq: Ps,
  edgeSeq: ie().int().min(-1)
}), Xp = J({
  ..._e,
  t: ce("summary"),
  base: Ps,
  bitmapHex: Nt.max(256),
  edgeSeq: ie().int().min(-1),
  /** Sender's current neighbor count. Drives the host's §6.2 bootstrap
   *  prune: a joiner is only re-homed once it reports enough links. */
  degree: ie().int().min(0).max(256).optional(),
  /** As in hello: the sender reaches only the host. Absent = false. */
  relayOnly: gi().optional()
}), Yp = J({
  ..._e,
  t: ce("want"),
  seq: Ps,
  /** ms until the requester's playhead reaches this seq (serve priority). */
  deadlineMs: ie().int().min(0).max(6e5)
}), El = Os(["busy", "missing", "fanout", "budget"]), Qp = Os(["host-full"]), Jp = J({
  ..._e,
  t: ce("deny"),
  seq: Ps,
  reason: El,
  /** 'host-full': a fanout deny to a host-only viewer the host has no seat for. */
  detail: Qp.optional().catch(void 0)
}), em = J({
  ..._e,
  t: ce("meta"),
  meta: Gp
}), tm = J({
  ..._e,
  t: ce("pex"),
  peers: rs(J({ addr: Ss, name: hr, boxPub: is.optional() })).max(to)
}), sm = J({
  ..._e,
  t: ce("sig"),
  target: Ss,
  from: Ss,
  kind: Os(["offer", "answer"]),
  /** SDP sealed to the target's session box key — relaying peers carry
   *  ciphertext, so they can't harvest the endpoints' IP addresses. */
  sealed: no,
  /** Sender's session box pubkey — the answer is sealed back to this. */
  boxPub: is,
  /** Addresses this message has traversed; forwarding stops at SIG_MAX_HOPS. */
  path: rs(Ss).max(wi + 1)
}), nm = J({ ..._e, t: ce("presence"), ...Ht, name: hr }), Tl = J({
  ..._e,
  t: ce("chat"),
  ...Ht,
  senderName: hr,
  text: ue().min(1).max(500)
}), rm = Tl.extend({
  t: ce("chat-backlog"),
  epoch: fr
}), im = J({
  ..._e,
  t: ce("reaction"),
  ...Ht,
  emoji: ue().min(1).max(16)
}), om = J({
  ..._e,
  t: ce("poll-open"),
  ...Ht,
  pollId: ue().min(1).max(64),
  question: ue().min(1).max(200),
  options: rs(ue().min(1).max(100)).min(2).max(4),
  openedAt: Si,
  closesAt: Si.optional()
}), am = J({
  ..._e,
  t: ce("poll-vote"),
  ...Ht,
  pollId: ue().min(1).max(64),
  optionIdx: ie().int().min(0).max(3)
}), cm = J({
  ..._e,
  t: ce("poll-tally"),
  ...Ht,
  pollId: ue().min(1).max(64),
  tallies: rs(ie().int().min(0)).max(4),
  totalVotes: ie().int().min(0)
}), lm = J({
  ..._e,
  t: ce("poll-close"),
  ...Ht,
  pollId: ue().min(1).max(64)
}), dm = J({
  ..._e,
  t: ce("end"),
  ...Ht,
  epoch: fr,
  sig: Nt.length(128)
}), um = J({
  ..._e,
  t: ce("prune"),
  reason: Os(["bootstrap-rotation", "over-degree", "scoring"])
}), hm = J({ ..._e, t: ce("bye") }), Cl = Xf("t", [
  Zp,
  Kp,
  Xp,
  Yp,
  Jp,
  em,
  tm,
  sm,
  nm,
  Tl,
  rm,
  im,
  om,
  am,
  cm,
  lm,
  dm,
  um,
  hm
]), fm = new Set(Cl.options.map((s) => s.shape.t.value));
function vt(s) {
  return `${s.from}:${s.ts}:${s.nonce}`;
}
function pm(s) {
  return JSON.stringify(s);
}
function mm(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return Ir("not-json");
  }
  if (!e || typeof e != "object") return Ir("not-object");
  const { v: t, t: n } = e;
  if (t !== me || typeof n != "string" || !fm.has(n)) {
    const i = `v=${String(t)} t=${String(n)}`;
    return Jn.allow(i) && Dt.debug("ctrl ignored: unknown version or type", { v: t, type: n, seen: Jn.count(i) }), { kind: "ignore" };
  }
  const r = Cl.safeParse(e);
  return r.success ? { kind: "ok", msg: r.data } : Ir(r.error.issues[0]?.message ?? "invalid", String(n));
}
function Ir(s, e) {
  return Jn.allow(s) && Dt.warn("ctrl message dropped: decode failed", { error: s, type: e, seen: Jn.count(s) }), { kind: "invalid", error: s };
}
function gm(s, e, t) {
  const n = new Uint8Array(Math.ceil(t / 8));
  for (const i of e) {
    const o = i - s;
    o < 0 || o >= t || (n[o >> 3] |= 128 >> (o & 7));
  }
  let r = "";
  for (const i of n) r += i.toString(16).padStart(2, "0");
  return { base: s, bitmapHex: r };
}
function fa(s) {
  const e = /* @__PURE__ */ new Set(), { base: t, bitmapHex: n } = s;
  for (let r = 0; r * 2 < n.length; r++) {
    const i = Number.parseInt(n.slice(r * 2, r * 2 + 2), 16);
    if (i)
      for (let o = 0; o < 8; o++)
        i & 128 >> o && e.add(t + r * 8 + o);
  }
  return e;
}
const Zs = 24, Al = 21328;
function Bn(s) {
  return s % 4294967296;
}
function ym(s) {
  if (s.payload.length === 0 || s.payload.length > pt)
    throw Dt.error("slice encode failed: payload out of range", {
      seq: s.seq,
      bytes: s.payload.length,
      max: pt
    }), new Error(`slice payload ${s.payload.length} outside (0, ${pt}]`);
  if (s.sliceIdx >= s.sliceCount)
    throw Dt.error("slice encode failed: index past the count", {
      seq: s.seq,
      sliceIdx: s.sliceIdx,
      sliceCount: s.sliceCount
    }), new Error(`sliceIdx ${s.sliceIdx} >= sliceCount ${s.sliceCount}`);
  const e = new Uint8Array(Zs + s.payload.length), t = new DataView(e.buffer);
  return t.setUint16(0, Al, !0), t.setUint8(2, me), t.setUint8(3, 0), t.setUint32(4, s.seq, !0), t.setUint16(8, s.sliceIdx, !0), t.setUint16(10, s.sliceCount, !0), t.setUint32(12, s.payload.length, !0), t.setUint32(16, s.epochLow, !0), t.setUint32(20, 0, !0), e.set(s.payload, Zs), e;
}
function wm(s) {
  if (s.length < Zs) return cs("short-header");
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  if (e.getUint16(0, !0) !== Al) return cs("bad-magic");
  if (e.getUint8(2) !== me) return cs("bad-version");
  const t = e.getUint32(4, !0), n = e.getUint16(8, !0), r = e.getUint16(10, !0), i = e.getUint32(12, !0), o = e.getUint32(16, !0);
  return r === 0 || n >= r ? cs("bad-slice-index", t) : i === 0 || i > pt ? cs("bad-payload-len", t) : s.length !== Zs + i ? cs("length-mismatch", t) : {
    kind: "ok",
    frame: {
      epochLow: o,
      seq: t,
      sliceIdx: n,
      sliceCount: r,
      payload: s.subarray(Zs)
    }
  };
}
function cs(s, e) {
  return ha.allow(s) && Dt.warn("slice dropped: decode failed", { error: s, seq: e, seen: ha.count(s) }), { kind: "invalid", error: s };
}
function bm(s, e, t) {
  if (t.length === 0)
    throw Dt.error("chunk slicing failed: empty payload", { seq: e, epoch: s }), new Error("empty chunk payload");
  const n = Math.ceil(t.length / pt);
  if (n > 65535)
    throw Dt.error("chunk slicing failed: too many slices", { seq: e, sliceCount: n, bytes: t.length }), new Error(`chunk needs ${n} slices > u16`);
  const r = Bn(s), i = [];
  for (let o = 0; o < n; o++)
    i.push({
      epochLow: r,
      seq: e,
      sliceIdx: o,
      sliceCount: n,
      payload: t.subarray(o * pt, Math.min((o + 1) * pt, t.length))
    });
  return i;
}
class vm {
  partials = /* @__PURE__ */ new Map();
  assembleCap = ne(so);
  key(e, t) {
    return `${e}:${t}`;
  }
  add(e) {
    const t = this.key(e.epochLow, e.seq);
    let n = this.partials.get(t);
    if (n || (n = { sliceCount: e.sliceCount, received: 0, slices: new Array(e.sliceCount) }, this.partials.set(t, n)), e.sliceCount !== n.sliceCount)
      return this.partials.delete(t), this.bad("slice-count-mismatch", e.seq);
    if (e.sliceIdx < e.sliceCount - 1 && e.payload.length !== pt)
      return this.partials.delete(t), this.bad("short-interior-slice", e.seq);
    const r = n.received === 0;
    if (n.slices[e.sliceIdx] || (n.slices[e.sliceIdx] = e.payload, n.received++), n.received < n.sliceCount)
      return { kind: "progress", received: n.received, total: n.sliceCount, firstSlice: r };
    this.partials.delete(t);
    const i = n.slices.reduce((c, l) => c + (l?.length ?? 0), 0), o = new Uint8Array(i);
    let a = 0;
    for (const c of n.slices)
      o.set(c, a), a += c.length;
    return { kind: "done", payload: o };
  }
  bad(e, t) {
    return this.assembleCap.allow(e) && Dt.warn("chunk reassembly failed", { error: e, seq: t, seen: this.assembleCap.count(e) }), { kind: "invalid", error: e };
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
const _i = Q("statement.schema"), ys = ne(5), Sm = Os([
  "heartbeat",
  "swarm-join",
  "welcome-board"
]), _m = J({
  type: Sm,
  from: ue(),
  to: ue().optional(),
  timestamp: ie(),
  payload: pl(Kf()).optional()
}), ss = ue().min(1).max(64), ro = ue().max(64), xm = ue().regex(/^[0-9a-f]*$/), km = J({
  /** Ephemeral per-stream ed25519 public key, hex (plan §4). */
  streamPubKey: xm.length(64),
  /** Stream session id (go-live timestamp ms); resets the chunk seq space. */
  epoch: ie().int().min(0),
  chunkMs: ie().int().min(200).max(1e4),
  /** MSE codec string, e.g. `video/mp4; codecs="avc1.64001f, mp4a.40.2"`. */
  codecs: ue().min(1).max(200),
  edgeSeq: ie().int().min(-1),
  /** Delegated join responders (§6.2a), host always implicitly included. */
  responders: rs(ss).max(8).optional(),
  /**
   * X25519 session box pubkeys by address — the host plus every listed
   * responder. A joiner seals its swarm-join SDP to its chosen responder's
   * key: statements on the signal topic are publicly subscribable, and a
   * cleartext non-trickle SDP would publish the joiner's IP next to its
   * on-chain address. The heartbeat statement is host-signed, so these keys
   * share the streamPubKey trust anchor.
   */
  boxPubs: pl(ss, is).optional()
}), Em = J({
  mime: Os(Jf),
  data: ue().min(4).max(Qf).regex(/^[A-Za-z0-9+/]+={0,2}$/)
});
J({
  roomHash: ue().min(1).max(128),
  hostAddress: ss,
  hostName: ro,
  title: ue().max(200),
  viewerCount: ie().int().min(0).max(1e4),
  startedAt: ie(),
  /** Tip goal for this session, in whole PAS. 0/absent = no goal set. */
  tipGoal: ie().int().min(0).max(1e6).optional(),
  /** Host's authoritative session tip total, in PAS planck (string — JSON has
   *  no bigint). Viewers render the goal bar from this so it's identical for
   *  everyone regardless of join time. */
  tippedPlanck: ue().max(40).optional(),
  /** Swarm join/trust info. Optional so the lobby stays tolerant of hosts
   *  running builds without the mesh (and vice versa). */
  mesh: km.optional(),
  /** The lobby card preview. Absent = no preview. */
  clip: Em.optional(),
  /** The host ended this stream. Absent = live. */
  ended: ce(!0).optional()
});
const Tm = J({
  viewerAddress: ss,
  viewerName: ro,
  /** The peer this join is addressed to; others on the topic ignore it. */
  responder: ss,
  /** Viewer's session box pubkey — the welcome answer is sealed back to it. */
  boxPub: is,
  sealedSdp: no,
  sdpType: ce("offer")
}), Cm = J({
  /** The joiner this answer is for. */
  to: ss,
  sealedSdp: no,
  sdpType: ce("answer"),
  /** Sample of live peers to dial for additional mesh links. `boxPub` lets
   *  the joiner seal its mesh-dial offers to them (§6.3). */
  seeds: rs(J({ addr: ss, name: ro, boxPub: is.optional() })).max(8),
  edgeSeq: ie().int().min(-1),
  epoch: ie().int().min(0)
});
J({
  answers: rs(Cm).max(xl)
});
function Am(s, e) {
  const t = e.safeParse(s.payload);
  return t.success ? t.data : (ys.allow(`payload:${s.type}`) && _i.warn("dropping a message: invalid payload", {
    type: s.type,
    from: v(s.from),
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: ys.count(`payload:${s.type}`)
  }), null);
}
function Mm(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return ys.allow("envelope:json") && _i.debug("dropping a statement: the data is not JSON", {
      bytes: s.length,
      seen: ys.count("envelope:json")
    }), null;
  }
  const t = _m.safeParse(e);
  return t.success ? t.data : (ys.allow("envelope:schema") && _i.debug("dropping a statement: the envelope does not match the schema", {
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: ys.count("envelope:schema")
  }), null);
}
const Bm = new TextEncoder();
function ln(s) {
  return sh(Bm.encode(s));
}
function Im() {
  return ln("spotlight:lobby:v1");
}
function Rm(s) {
  return ln(`spotlight:signal:v1:${s}`);
}
function Om() {
  return ln("spotlight:heartbeat-channel:v1");
}
function Pm() {
  return ln("spotlight:join-channel:v1");
}
function Fm() {
  return ln("spotlight:welcome-board-channel:v1");
}
function ls(s) {
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += s[t].toString(16).padStart(2, "0");
  return e;
}
const oe = Q("statement.client"), pa = Hc();
function Lm(s) {
  if (!s) return null;
  try {
    switch (s.tag) {
      case "Sr25519":
      case "Ed25519":
      case "Ecdsa":
        return pa.dec(s.value.signer);
      case "OnChain":
        return pa.dec(s.value.who);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
const Um = new TextEncoder(), Dm = new TextDecoder(), Nm = 300, $m = {
  timeout: "The host has not confirmed permission to publish signaling, so streams cannot be announced or joined. If an approval is waiting in the Polkadot app, answer it — this clears on its own.",
  declined: "Permission to publish signaling was declined, so streams cannot be announced or joined. Start a stream or rejoin the room to be asked again.",
  unavailable: "The host did not grant Spotlight permission to publish signaling, so streams cannot be announced or joined. Retrying — if this persists, reopen Spotlight from Polkadot Desktop or the browser host."
};
class Vm {
  store = null;
  productAccount = null;
  subscribers = /* @__PURE__ */ new Map();
  routes = /* @__PURE__ */ new Map();
  nextSubId = 0;
  disposed = !1;
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements can't tie (see ./expiry.ts). */
  expiry = gf();
  /** Submits in flight by type, so each submit line says what it shared the
   *  bridge with. Observability only. */
  inflight = xf();
  /**
   * On `AccountFull`, re-mint once just above the account's earliest-expiring
   * statement, which takes that slot. Off for Spotlight, whose own statements
   * are the whole account and must not inherit each other's lifetimes (see
   * SUPERSESSION_REJECTION in ./expiry). On for the broadcast SDK, which shares
   * its account with the host app: a game posting 300 s events would otherwise
   * outlive every 60 s welcome, and no viewer could join.
   */
  claimSlotWhenFull;
  constructor(e = {}) {
    this.claimSlotWhenFull = e.claimSlotWhenFull ?? !1;
  }
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
      e = await Sc();
    } catch (t) {
      if (this.disposed) return;
      const n = t instanceof Error ? t.message : String(t);
      oe.error("host statement store unavailable", { detail: n, err: t }), this.onFatalError?.(
        new Error(`Statement Store unavailable: ${n}. Reload to try again.`)
      );
      return;
    }
    if (!this.disposed) {
      if (!e) {
        oe.warn("no host statement store — not inside a host container"), this.onFatalError?.(
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
    this.productAccount = e, oe.info(e ? "product account wired" : "product account cleared"), e && this.primeGrants();
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
    al("statement-submit").then(({ "statement-submit": e }) => {
      e && (e === "granted" || this.disposed || this.reportedGrantOutcome !== e && (this.reportedGrantOutcome = e, oe.error("statement grants not available", { outcome: e }), this.onFatalError?.(new Error($m[e]))));
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
    const r = ls(e), i = this.routes.get(r);
    if (oe.debug("subscribe", {
      subId: n,
      topic: ve(r),
      route: i ? "shared" : "new"
    }), i)
      i.handlers.add(t);
    else {
      const o = /* @__PURE__ */ new Set([t]), a = () => {
        if (!this.store || this.disposed) return { unsubscribe: () => {
        } };
        const l = this.store.subscribe(
          { matchAll: [gn(e)] },
          (d) => {
            let u = 0, h = 0;
            for (const g of d.statements) {
              const m = zm(g);
              if (!m) {
                h++;
                continue;
              }
              u++;
              for (const p of o)
                try {
                  p(m.envelope, m.signedBy);
                } catch (b) {
                  oe.error("handler threw", { topic: ve(r), err: b });
                }
            }
            const f = this.routes.get(r);
            f && (f.lastPageAt = Date.now()), oe.debug("page received", {
              topic: ve(r),
              statements: d.statements.length,
              decoded: u,
              dropped: h
            });
          }
        );
        return l.onInterrupt((d) => {
          oe.warn("upstream subscription interrupted — resubscribing", {
            topic: ve(r),
            payload: d
          });
          const u = this.routes.get(r);
          if (!u || this.disposed) return;
          const h = a();
          u.unsubscribe = h.unsubscribe, u.lastPageAt = Date.now();
        }), { unsubscribe: l.unsubscribe };
      }, c = a();
      this.routes.set(r, {
        topic: e,
        handlers: o,
        unsubscribe: c.unsubscribe,
        lastPageAt: Date.now(),
        resubscribe: () => {
          const l = this.routes.get(r);
          if (!l || this.disposed) return;
          try {
            l.unsubscribe();
          } catch {
          }
          const d = a();
          l.unsubscribe = d.unsubscribe, l.lastPageAt = Date.now();
        }
      });
    }
    return n;
  }
  /** Milliseconds since this topic last delivered a page, or null when no
   *  route is open for it. Null means "cannot answer" — never "silent". */
  silentMsFor(e) {
    const t = this.routes.get(ls(e));
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
    const t = ls(e), n = this.routes.get(t);
    if (!n || this.disposed) return !1;
    oe.info("reopening one topic", { topic: ve(t) });
    try {
      n.resubscribe();
    } catch (r) {
      return oe.warn("reopen failed", { topic: ve(t), err: r }), !1;
    }
    return !0;
  }
  /** Force every active topic subscription to reopen. Use after a tab
   *  visibility / focus change to recover from a possibly-stale upstream. */
  refreshAllSubscriptions() {
    oe.info("refreshing every subscription", { routes: this.routes.size });
    for (const e of this.routes.values())
      try {
        e.resubscribe();
      } catch (t) {
        oe.warn("subscription refresh failed", { topic: ve(ls(e.topic)), err: t });
      }
  }
  unsubscribe(e) {
    const t = this.subscribers.get(e);
    if (!t) return;
    this.subscribers.delete(e);
    const n = ls(t.topic), r = this.routes.get(n);
    if (r && (r.handlers.delete(t.handler), oe.debug("unsubscribe", {
      subId: e,
      topic: ve(n),
      handlers: r.handlers.size
    }), r.handlers.size === 0)) {
      try {
        r.unsubscribe();
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
    const r = (h) => {
      n?.quiet || this.onSubmitError?.(h);
    };
    if (this.disposed) throw new Error("Signaling disposed");
    if (!this.store) throw new Error("Statement store not initialised");
    if (!this.productAccount)
      throw new Error(
        "No product account — sign in via the host before broadcasting."
      );
    const i = jh();
    if (i !== null) throw new ii(i);
    this.primeGrants();
    const o = Um.encode(JSON.stringify(t)), a = n?.expirySecs ?? Nm, c = n?.channel ? gn(n.channel) : void 0, l = Date.now(), d = this.inflight.snapshot();
    oe.debug("submit started", {
      type: t.type,
      to: v(t.to),
      topic: ve(ls(e)),
      bytes: o.length,
      expirySecs: a,
      channel: c ? ve(c) : null,
      inflight: d
    });
    const u = this.inflight.begin(t.type);
    try {
      for (let h = 0; ; h++) {
        const f = {
          proof: void 0,
          decryptionKey: void 0,
          expiry: this.expiry.next(a, c),
          channel: c,
          topics: [gn(e)],
          data: gn(o)
        };
        let g;
        const m = Date.now();
        try {
          g = await this.store.createProofAuthorized(f);
        } catch (b) {
          const y = b instanceof Error ? b : new Error(String(b));
          if (Hm(y)) {
            const k = nl();
            throw oe.error("createProof failed with UnableToSign — submits paused", {
              type: t.type,
              attempt: h,
              strikes: k.strikes,
              pauseS: Math.round((k.until - Date.now()) / 1e3),
              err: y,
              proofMs: Date.now() - m,
              ...u.overlap()
            }), new ii(k.until, { cause: y });
          }
          throw oe.error("createProof failed", {
            type: t.type,
            attempt: h,
            err: y,
            proofMs: Date.now() - m,
            ...u.overlap()
          }), r(y), y;
        }
        const p = Date.now() - m;
        try {
          await this.store.submit({ ...f, proof: g }), Nh(), qh(), oe.debug("submit succeeded", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - l,
            proofMs: p,
            ...u.overlap()
          });
          return;
        } catch (b) {
          const y = b instanceof Error ? b : new Error(String(b)), k = h === 0 ? vf(b) : null;
          if (k !== null && this.expiry.raiseFloor(k, c)) {
            oe.warn("statement rejected below the priority floor — re-minting above it", {
              type: t.type,
              min: k,
              channel: c ? ve(c) : null
            });
            continue;
          }
          const U = h === 0 && this.claimSlotWhenFull ? Sf(b) : null;
          if (U !== null && this.expiry.raiseFloor(U, c)) {
            oe.warn("statement store account is full — claiming the earliest-expiring slot", {
              type: t.type,
              min: U,
              channel: c ? ve(c) : null
            });
            continue;
          }
          throw Qi(b) ? (oe.error("statement store account is full — submits rejected until slots free", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - l,
            proofMs: p,
            ...u.overlap(),
            err: y
          }), r(y), y) : (oe.error("statement submit rejected", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - l,
            proofMs: p,
            ...u.overlap(),
            err: y
          }), r(y), y);
        }
      }
    } finally {
      u.end();
    }
  }
  destroy() {
    oe.info("client destroyed", {
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
    e !== this._ready && (this._ready = e, oe.info(e ? "store connected" : "store disconnected"), this.onConnectionChange?.(e));
  }
}
function Hm(s) {
  return /\bUnableToSign\b/.test(s.message);
}
function zm(s) {
  if (!s.data || s.data.length <= 2) return null;
  try {
    const e = Dm.decode(Jd(s.data)), t = Mm(e);
    return t ? { envelope: t, signedBy: Lm(s.proof) } : null;
  } catch {
    return null;
  }
}
const qt = Q("swarm.transport"), Wt = /* @__PURE__ */ new Map(), xi = 600 * 1e3, Rr = 1e3;
function jm() {
  Wt.clear(), Ks.clear();
}
function qm(s) {
  let e = 0;
  for (const [t, n] of Wt)
    s - n.seenAt >= xi && (Wt.delete(t), Ks.delete(t), e++);
  return e;
}
const Ks = /* @__PURE__ */ new Set();
function Wm(s, e, t) {
  const n = Date.now(), r = Wt.get(s);
  if (r && n - r.seenAt < xi) {
    if (r.signer === e)
      return r.seenAt = n, !0;
    if (!Ks.has(s)) {
      Ks.add(s);
      const i = Math.round((xi - (n - r.seenAt)) / 1e3);
      qt.warn("sender binding mismatch — statement dropped", {
        type: t,
        from: v(s),
        boundSigner: v(r.signer),
        signedBy: v(e),
        lapsesInSec: i
      });
    }
    return !1;
  }
  if (!r && Wt.size >= Rr) {
    const i = qm(n);
    if (Wt.size >= Rr)
      return qt.warn("sender binding table full", {
        type: t,
        from: v(s),
        cap: Rr
      }), !1;
    qt.debug("sender bindings swept", { swept: i, from: v(s) });
  }
  return Wt.set(s, { signer: e, seenAt: n }), Ks.delete(s), !0;
}
function Gm(s, e) {
  return {
    submit(t) {
      if (t.type === "welcome-board") {
        const r = { expirySecs: _l, channel: Fm() };
        return qt.debug("tx", { type: t.type, channel: r.channel }), s.submit(e, t, r);
      }
      const n = { channel: Pm() };
      return qt.debug("tx", { type: t.type, channel: n.channel, to: v(t.to) }), s.submit(e, t, n);
    },
    subscribe(t) {
      let n = !0, r = null;
      return s.subscribe(e, (i, o) => {
        n && (o !== null && !Wm(i.from, o, i.type) || (qt.debug("rx", {
          type: i.type,
          from: v(i.from),
          signedBy: v(o)
        }), t(i, o)));
      }).then((i) => {
        n ? r = i : s.unsubscribe(i);
      }).catch((i) => {
        qt.error("transport subscribe failed", { err: i });
      }), () => {
        n = !1, r !== null && s.unsubscribe(r);
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
function E(s) {
  if (!s)
    throw new Error("Assertion failed.");
}
const ws = (s) => s && s[s.length - 1], $t = (s) => s >= 0 && s < 2 ** 32, x = (s) => {
  let e = 0;
  for (; s.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + s.readBits(e);
}, ht = (s) => {
  const e = x(s);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, dn = (s) => s.constructor === Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s), Ml = (s) => s.constructor === DataView ? s : ArrayBuffer.isView(s) ? new DataView(s.buffer, s.byteOffset, s.byteLength) : new DataView(s), Qe = /* @__PURE__ */ new TextEncoder(), io = {
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
}, oo = {
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
}, ao = {
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
}, Zm = (s) => !!s && !!s.primaries && !!s.transfer && !!s.matrix && s.fullRange !== void 0, Bl = (s) => s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer || ArrayBuffer.isView(s);
class Il {
  constructor() {
    this.currentPromise = Promise.resolve(), this.pending = 0;
  }
  async acquire() {
    let e;
    const t = new Promise((r) => {
      let i = !1;
      e = () => {
        i || (r(), this.pending--, i = !0);
      };
    }), n = this.currentPromise;
    return this.currentPromise = t, this.pending++, await n, e;
  }
}
const Km = () => {
  let s, e;
  return { promise: new Promise((n, r) => {
    s = n, e = r;
  }), resolve: s, reject: e };
}, Rl = (s) => {
  throw new Error(`Unexpected value: ${s}`);
}, Xm = (s, e, t, n) => {
  t = t >>> 0, t = t & 16777215, s.setUint8(e, t >>> 16 & 255), s.setUint8(e + 1, t >>> 8 & 255), s.setUint8(e + 2, t & 255);
}, Ym = "und", Qm = /^[a-z]{3}$/, Jm = (s) => Qm.test(s), ma = 1e6 * (1 + Number.EPSILON), eg = (s, e) => {
  const t = s < 0 ? -1 : 1;
  s = Math.abs(s);
  let n = 0, r = 1, i = 1, o = 0, a = s;
  for (; ; ) {
    const c = Math.floor(a), l = c * i + n, d = c * o + r;
    if (d > e)
      return {
        num: t * i,
        den: o
      };
    if (n = i, r = o, i = l, o = d, a = 1 / (a - c), !isFinite(a))
      break;
  }
  return {
    num: t * i,
    den: o
  };
}, Ol = function* (s) {
  for (const e in s) {
    const t = s[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, tg = (s) => {
  E(Number.isInteger(s.num)), E(Number.isInteger(s.den)), E(s.den !== 0);
  let e = Math.abs(s.num), t = Math.abs(s.den);
  for (; t !== 0; ) {
    const r = e % t;
    e = t, t = r;
  }
  const n = e || 1;
  return {
    num: s.num / n,
    den: s.den / n
  };
}, ga = (s) => Array.isArray(s) ? s : [s];
class co {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
  on(e, t, n) {
    this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set());
    const r = { fn: t, once: n?.once ?? !1 };
    return this._listeners.get(e).add(r), () => {
      this._listeners.get(e)?.delete(r);
    };
  }
  /** @internal */
  _emit(...e) {
    const [t, n] = e, r = this._listeners.get(t);
    if (r)
      for (const i of r) {
        try {
          i.fn(n);
        } catch (o) {
          console.error(o);
        }
        i.once && r.delete(i);
      }
  }
}
const sg = (s) => s !== null && typeof s == "object" && Object.getPrototypeOf(s) === Object.prototype && Object.values(s).every((e) => typeof e == "string");
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Ke;
(function(s) {
  s[s.Silent = 0] = "Silent", s[s.Errors = 1] = "Errors", s[s.Warnings = 2] = "Warnings", s[s.Info = 3] = "Info";
})(Ke || (Ke = {}));
class he {
  constructor() {
  }
  /** The current log level. Defaults to {@link LogLevel.Info}. */
  static get level() {
    return he._level;
  }
  static set level(e) {
    if (e !== Ke.Silent && e !== Ke.Errors && e !== Ke.Warnings && e !== Ke.Info)
      throw new TypeError("Invalid log level. Use one of the values of the LogLevel enum.");
    he._level = e;
  }
  /** @internal */
  static get _emitter() {
    return he._emitterInstance ??= new co();
  }
  /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
  static on(e, t, n) {
    return he._emitter.on(e, t, n);
  }
  /** @internal */
  static _error(...e) {
    he._emitter._emit("error", e), he._level >= Ke.Errors && console.error(...e);
  }
  /** @internal */
  static _warn(...e) {
    he._emitter._emit("warn", e), he._level >= Ke.Warnings && console.warn(...e);
  }
  /** @internal */
  static _info(...e) {
    he._emitter._emit("info", e), he._level >= Ke.Info && console.info(...e);
  }
}
he._level = Ke.Info;
he._emitterInstance = null;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Pl {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class ng {
  /** Creates a new {@link AttachedFile}. */
  constructor(e, t, n, r) {
    if (this.data = e, this.mimeType = t, this.name = n, this.description = r, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== void 0 && typeof t != "string")
      throw new TypeError("mimeType, when provided, must be a string.");
    if (n !== void 0 && typeof n != "string")
      throw new TypeError("name, when provided, must be a string.");
    if (r !== void 0 && typeof r != "string")
      throw new TypeError("description, when provided, must be a string.");
  }
}
const rg = (s) => {
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
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof Pl) && !(e instanceof ng) && !sg(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, ig = (s) => {
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
class je {
  constructor(e) {
    this.bytes = e, this.pos = 0;
  }
  seekToByte(e) {
    this.pos = 8 * e;
  }
  readBit() {
    const e = Math.floor(this.pos / 8), t = this.bytes[e] ?? 0, n = 7 - (this.pos & 7), r = (t & 1 << n) >> n;
    return this.pos++, r;
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
    for (let r = this.pos; r < n; r++) {
      const i = Math.floor(r / 8);
      let o = this.bytes[i];
      const a = 7 - (r & 7);
      o &= ~(1 << a), o |= (t & 1 << n - r - 1) >> n - r - 1 << a, this.bytes[i] = o;
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
    const e = new je(this.bytes);
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
const Fl = [
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
], Ll = [-1, 1, 2, 3, 4, 5, 6, 8], og = (s) => {
  let e = Fl.indexOf(s.sampleRate), t = null;
  e === -1 && (e = 15, t = s.sampleRate);
  const n = Ll.indexOf(s.numberOfChannels);
  if (n === -1)
    throw new TypeError(`Unsupported number of channels: ${s.numberOfChannels}`);
  let r = 13;
  s.objectType >= 32 && (r += 6), e === 15 && (r += 24);
  const i = Math.ceil(r / 8), o = new Uint8Array(i), a = new je(o);
  return s.objectType < 32 ? a.writeBits(5, s.objectType) : (a.writeBits(5, 31), a.writeBits(6, s.objectType - 32)), a.writeBits(4, e), e === 15 && a.writeBits(24, t), a.writeBits(4, n), o;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const As = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8",
  "prores"
], Ms = [
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
], lo = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3"
], er = [
  ...lo,
  ...Ms
], sn = [
  "webvtt"
], ya = [
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
], In = [
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
], ag = (s) => {
  const e = s.split("."), r = (1 << 7) + 1, i = Number(e[1]), o = e[2], a = Number(o.slice(0, -1)), c = (i << 5) + a, l = o.slice(-1) === "H" ? 1 : 0, u = Number(e[3]) === 8 ? 0 : 1, h = 0, f = e[4] ? Number(e[4]) : 0, g = e[5] ? Number(e[5][0]) : 1, m = e[5] ? Number(e[5][1]) : 1, p = e[5] ? Number(e[5][2]) : 0, b = (l << 7) + (u << 6) + (h << 5) + (f << 4) + (g << 3) + (m << 2) + p;
  return [r, c, b, 0];
}, cg = /^pcm-([usf])(\d+)(be)?$/, Bs = (s) => {
  if (E(Ms.includes(s)), s === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (s === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = cg.exec(s);
  E(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const n = Number(e[2]) / 8, r = e[3] !== "be", i = s === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: n, littleEndian: r, silentValue: i };
}, lg = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01", ...In], dg = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, ug = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, hg = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, fg = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, pg = (s) => {
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
  if (!lg.some((e) => s.decoderConfig.codec.startsWith(e)))
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
  if (s.decoderConfig.description !== void 0 && !Bl(s.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (s.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = s.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const t = Object.keys(io);
    if (e.primaries != null && !t.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${t.join(", ")}.`);
    const n = Object.keys(oo);
    if (e.transfer != null && !n.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${n.join(", ")}.`);
    const r = Object.keys(ao);
    if (e.matrix != null && !r.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${r.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (s.decoderConfig.codec.startsWith("avc1") || s.decoderConfig.codec.startsWith("avc3")) {
    if (!dg.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (s.decoderConfig.codec.startsWith("hev1") || s.decoderConfig.codec.startsWith("hvc1")) {
    if (!ug.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (s.decoderConfig.codec.startsWith("vp8")) {
    if (s.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (s.decoderConfig.codec.startsWith("vp09")) {
    if (!hg.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (s.decoderConfig.codec.startsWith("av01")) {
    if (!fg.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
  } else if (In.some((e) => s.decoderConfig.codec.startsWith(e)) && !In.some((e) => s.decoderConfig.codec === e))
    throw new TypeError(`Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes four-character codes: ${In.join(", ")}.`);
}, mg = [
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
], gg = (s) => {
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
  if (!mg.some((e) => s.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(s.decoderConfig.sampleRate) || s.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(s.decoderConfig.numberOfChannels) || s.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (s.decoderConfig.description !== void 0 && !Bl(s.decoderConfig.description))
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
  } else if ((s.decoderConfig.codec.startsWith("pcm") || s.decoderConfig.codec.startsWith("ulaw") || s.decoderConfig.codec.startsWith("alaw")) && !Ms.includes(s.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${Ms.join(", ")}).`);
}, yg = (s) => {
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
const wg = [48e3, 44100, 32e3], bg = [24e3, 22050, 16e3];
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Xs;
(function(s) {
  s[s.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", s[s.SLICE_DPA = 2] = "SLICE_DPA", s[s.SLICE_DPB = 3] = "SLICE_DPB", s[s.SLICE_DPC = 4] = "SLICE_DPC", s[s.IDR = 5] = "IDR", s[s.SEI = 6] = "SEI", s[s.SPS = 7] = "SPS", s[s.PPS = 8] = "PPS", s[s.AUD = 9] = "AUD", s[s.SPS_EXT = 13] = "SPS_EXT";
})(Xs || (Xs = {}));
var Ze;
(function(s) {
  s[s.RASL_N = 8] = "RASL_N", s[s.RASL_R = 9] = "RASL_R", s[s.BLA_W_LP = 16] = "BLA_W_LP", s[s.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", s[s.VPS_NUT = 32] = "VPS_NUT", s[s.SPS_NUT = 33] = "SPS_NUT", s[s.PPS_NUT = 34] = "PPS_NUT", s[s.AUD_NUT = 35] = "AUD_NUT", s[s.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", s[s.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(Ze || (Ze = {}));
const uo = function* (s) {
  let e = 0, t = -1;
  for (; e < s.length - 2; ) {
    const n = s.indexOf(0, e);
    if (n === -1 || n >= s.length - 2)
      break;
    e = n;
    let r = 0;
    if (e + 3 < s.length && s[e + 1] === 0 && s[e + 2] === 0 && s[e + 3] === 1 ? r = 4 : s[e + 1] === 0 && s[e + 2] === 1 && (r = 3), r === 0) {
      e++;
      continue;
    }
    t !== -1 && e > t && (yield {
      offset: t,
      length: e - t
    }), t = e + r, e = t;
  }
  t !== -1 && t < s.length && (yield {
    offset: t,
    length: s.length - t
  });
}, vg = (s) => s & 31, ho = (s) => {
  const e = [], t = s.length;
  for (let n = 0; n < t; n++)
    n + 2 < t && s[n] === 0 && s[n + 1] === 0 && s[n + 2] === 3 ? (e.push(0, 0), n += 2) : e.push(s[n]);
  return new Uint8Array(e);
}, Sg = (s, e) => {
  const t = s.reduce((i, o) => i + e + o.byteLength, 0), n = new Uint8Array(t);
  let r = 0;
  for (const i of s) {
    const o = new DataView(n.buffer, n.byteOffset, n.byteLength);
    switch (e) {
      case 1:
        o.setUint8(r, i.byteLength);
        break;
      case 2:
        o.setUint16(r, i.byteLength, !1);
        break;
      case 3:
        Xm(o, r, i.byteLength);
        break;
      case 4:
        o.setUint32(r, i.byteLength, !1);
        break;
    }
    r += e, n.set(i, r), r += i.byteLength;
  }
  return n;
}, _g = (s) => {
  try {
    const e = [], t = [], n = [];
    for (const a of uo(s)) {
      const c = s.subarray(a.offset, a.offset + a.length), l = vg(c[0]);
      l === Xs.SPS ? e.push(c) : l === Xs.PPS ? t.push(c) : l === Xs.SPS_EXT && n.push(c);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const r = e[0], i = kg(r);
    E(i !== null);
    const o = i.profileIdc === 100 || i.profileIdc === 110 || i.profileIdc === 122 || i.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: i.profileIdc,
      profileCompatibility: i.constraintFlags,
      avcLevelIndication: i.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: e,
      pictureParameterSets: t,
      chromaFormat: o ? i.chromaFormatIdc : null,
      bitDepthLumaMinus8: o ? i.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: o ? i.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: o ? n : null
    };
  } catch (e) {
    return he._error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, xg = (s) => {
  const e = [];
  e.push(s.configurationVersion), e.push(s.avcProfileIndication), e.push(s.profileCompatibility), e.push(s.avcLevelIndication), e.push(252 | s.lengthSizeMinusOne & 3), e.push(224 | s.sequenceParameterSets.length & 31);
  for (const t of s.sequenceParameterSets) {
    const n = t.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let r = 0; r < n; r++)
      e.push(t[r]);
  }
  e.push(s.pictureParameterSets.length);
  for (const t of s.pictureParameterSets) {
    const n = t.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let r = 0; r < n; r++)
      e.push(t[r]);
  }
  if (s.avcProfileIndication === 100 || s.avcProfileIndication === 110 || s.avcProfileIndication === 122 || s.avcProfileIndication === 144) {
    E(s.chromaFormat !== null), E(s.bitDepthLumaMinus8 !== null), E(s.bitDepthChromaMinus8 !== null), E(s.sequenceParameterSetExt !== null), e.push(252 | s.chromaFormat & 3), e.push(248 | s.bitDepthLumaMinus8 & 7), e.push(248 | s.bitDepthChromaMinus8 & 7), e.push(s.sequenceParameterSetExt.length);
    for (const t of s.sequenceParameterSetExt) {
      const n = t.byteLength;
      e.push(n >> 8), e.push(n & 255);
      for (let r = 0; r < n; r++)
        e.push(t[r]);
    }
  }
  return new Uint8Array(e);
}, Ul = {
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
}, kg = (s) => {
  try {
    const e = new je(ho(s));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const n = e.readAlignedByte(), r = e.readAlignedByte(), i = e.readAlignedByte();
    x(e);
    let o = 1, a = 0, c = 0, l = 0;
    if ((n === 100 || n === 110 || n === 122 || n === 244 || n === 44 || n === 83 || n === 86 || n === 118 || n === 128) && (o = x(e), o === 3 && (l = e.readBits(1)), a = x(e), c = x(e), e.skipBits(1), e.readBits(1))) {
      for (let _ = 0; _ < (o !== 3 ? 8 : 12); _++)
        if (e.readBits(1)) {
          const A = _ < 6 ? 16 : 64;
          let P = 8, M = 8;
          for (let W = 0; W < A; W++) {
            if (M !== 0) {
              const ee = ht(e);
              M = (P + ee + 256) % 256;
            }
            P = M === 0 ? P : M;
          }
        }
    }
    x(e);
    const d = x(e);
    if (d === 0)
      x(e);
    else if (d === 1) {
      e.skipBits(1), ht(e), ht(e);
      const K = x(e);
      for (let _ = 0; _ < K; _++)
        ht(e);
    }
    x(e), e.skipBits(1);
    const u = x(e), h = x(e), f = 16 * (u + 1), g = 16 * (h + 1);
    let m = f, p = g;
    const b = e.readBits(1);
    if (b || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const K = x(e), _ = x(e), I = x(e), A = x(e);
      let P, M;
      if ((l === 0 ? o : 0) === 0)
        P = 1, M = 2 - b;
      else {
        const ee = o === 3 ? 1 : 2, le = o === 1 ? 2 : 1;
        P = ee, M = le * (2 - b);
      }
      m -= P * (K + _), p -= M * (I + A);
    }
    let k = 2, U = 2, q = 2, G = 0, L = { num: 1, den: 1 }, j = null, V = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const le = e.readBits(8);
        if (le === 255)
          L = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const xe = Ul[le];
          xe && (L = xe);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), G = e.readBits(1), e.readBits(1) && (k = e.readBits(8), U = e.readBits(8), q = e.readBits(8))), e.readBits(1) && (x(e), x(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const M = e.readBits(1);
      M && wa(e);
      const W = e.readBits(1);
      W && wa(e), (M || W) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), x(e), x(e), x(e), x(e), j = x(e), V = x(e));
    }
    if (j === null) {
      E(V === null);
      const K = r & 16;
      if ((n === 44 || n === 86 || n === 100 || n === 110 || n === 122 || n === 244) && K)
        j = 0, V = 0;
      else {
        const _ = u + 1, I = h + 1, A = (2 - b) * I, P = ya.find((W) => W.level >= i) ?? ws(ya), M = Math.min(Math.floor(P.maxDpbMbs / (_ * A)), 16);
        j = M, V = M;
      }
    }
    return E(V !== null), {
      profileIdc: n,
      constraintFlags: r,
      levelIdc: i,
      frameMbsOnlyFlag: b,
      chromaFormatIdc: o,
      bitDepthLumaMinus8: a,
      bitDepthChromaMinus8: c,
      codedWidth: f,
      codedHeight: g,
      displayWidth: m,
      displayHeight: p,
      pixelAspectRatio: L,
      colourPrimaries: k,
      matrixCoefficients: q,
      transferCharacteristics: U,
      fullRangeFlag: G,
      numReorderFrames: j,
      maxDecFrameBuffering: V
    };
  } catch (e) {
    return he._error("Error parsing AVC SPS:", e), null;
  }
}, wa = (s) => {
  const e = x(s);
  s.skipBits(4), s.skipBits(4);
  for (let t = 0; t <= e; t++)
    x(s), x(s), s.skipBits(1);
  s.skipBits(5), s.skipBits(5), s.skipBits(5), s.skipBits(5);
}, ba = (s) => s >> 1 & 63, Eg = (s) => {
  try {
    const e = new je(ho(s));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), n = e.readBits(1), { general_profile_space: r, general_tier_flag: i, general_profile_idc: o, general_profile_compatibility_flags: a, general_constraint_indicator_flags: c, general_level_idc: l } = Cg(e, t);
    x(e);
    const d = x(e);
    let u = 0;
    d === 3 && (u = e.readBits(1));
    const h = x(e), f = x(e);
    let g = h, m = f;
    if (e.readBits(1)) {
      const _ = x(e), I = x(e), A = x(e), P = x(e);
      let M = 1, W = 1;
      const ee = u === 0 ? d : 0;
      ee === 1 ? (M = 2, W = 2) : ee === 2 && (M = 2, W = 1), g -= (_ + I) * M, m -= (A + P) * W;
    }
    const p = x(e), b = x(e);
    x(e);
    const k = e.readBits(1) ? 0 : t;
    let U = 0;
    for (let _ = k; _ <= t; _++)
      x(e), U = x(e), x(e);
    x(e), x(e), x(e), x(e), x(e), x(e), e.readBits(1) && e.readBits(1) && Ag(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), x(e), x(e), e.skipBits(1));
    const q = x(e);
    if (Mg(e, q), e.readBits(1)) {
      const _ = x(e);
      for (let I = 0; I < _; I++)
        x(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let G = 2, L = 2, j = 2, V = 0, te = 0, K = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const _ = Ig(e, t);
      K = _.pixelAspectRatio, G = _.colourPrimaries, L = _.transferCharacteristics, j = _.matrixCoefficients, V = _.fullRangeFlag, te = _.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: g,
      displayHeight: m,
      pixelAspectRatio: K,
      colourPrimaries: G,
      transferCharacteristics: L,
      matrixCoefficients: j,
      fullRangeFlag: V,
      maxDecFrameBuffering: U + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: n,
      generalProfileSpace: r,
      generalTierFlag: i,
      generalProfileIdc: o,
      generalProfileCompatibilityFlags: a,
      generalConstraintIndicatorFlags: c,
      generalLevelIdc: l,
      chromaFormatIdc: d,
      bitDepthLumaMinus8: p,
      bitDepthChromaMinus8: b,
      minSpatialSegmentationIdc: te
    };
  } catch (e) {
    return he._error("Error parsing HEVC SPS:", e), null;
  }
}, Tg = (s) => {
  try {
    const e = [], t = [], n = [], r = [];
    for (const l of uo(s)) {
      const d = s.subarray(l.offset, l.offset + l.length), u = ba(d[0]);
      u === Ze.VPS_NUT ? e.push(d) : u === Ze.SPS_NUT ? t.push(d) : u === Ze.PPS_NUT ? n.push(d) : (u === Ze.PREFIX_SEI_NUT || u === Ze.SUFFIX_SEI_NUT) && r.push(d);
    }
    if (t.length === 0 || n.length === 0)
      return null;
    const i = Eg(t[0]);
    if (!i)
      return null;
    let o = 0;
    if (n.length > 0) {
      const l = n[0], d = new je(ho(l));
      d.skipBits(16), x(d), x(d), d.skipBits(1), d.skipBits(1), d.skipBits(3), d.skipBits(1), d.skipBits(1), x(d), x(d), ht(d), d.skipBits(1), d.skipBits(1), d.readBits(1) && x(d), ht(d), ht(d), d.skipBits(1), d.skipBits(1), d.skipBits(1), d.skipBits(1);
      const u = d.readBits(1), h = d.readBits(1);
      !u && !h ? o = 0 : u && !h ? o = 2 : !u && h ? o = 3 : o = 0;
    }
    const a = [
      ...e.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Ze.VPS_NUT,
          nalUnits: e
        }
      ] : [],
      ...t.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Ze.SPS_NUT,
          nalUnits: t
        }
      ] : [],
      ...n.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Ze.PPS_NUT,
          nalUnits: n
        }
      ] : [],
      ...r.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ba(r[0][0]),
          nalUnits: r
        }
      ] : []
    ];
    return {
      configurationVersion: 1,
      generalProfileSpace: i.generalProfileSpace,
      generalTierFlag: i.generalTierFlag,
      generalProfileIdc: i.generalProfileIdc,
      generalProfileCompatibilityFlags: i.generalProfileCompatibilityFlags,
      generalConstraintIndicatorFlags: i.generalConstraintIndicatorFlags,
      generalLevelIdc: i.generalLevelIdc,
      minSpatialSegmentationIdc: i.minSpatialSegmentationIdc,
      parallelismType: o,
      chromaFormatIdc: i.chromaFormatIdc,
      bitDepthLumaMinus8: i.bitDepthLumaMinus8,
      bitDepthChromaMinus8: i.bitDepthChromaMinus8,
      avgFrameRate: 0,
      constantFrameRate: 0,
      numTemporalLayers: i.spsMaxSubLayersMinus1 + 1,
      temporalIdNested: i.spsTemporalIdNestingFlag,
      lengthSizeMinusOne: 3,
      arrays: a
    };
  } catch (e) {
    return he._error("Error building HEVC Decoder Configuration Record:", e), null;
  }
}, Cg = (s, e) => {
  const t = s.readBits(2), n = s.readBits(1), r = s.readBits(5);
  let i = 0;
  for (let d = 0; d < 32; d++)
    i = i << 1 | s.readBits(1);
  const o = new Uint8Array(6);
  for (let d = 0; d < 6; d++)
    o[d] = s.readBits(8);
  const a = s.readBits(8), c = [], l = [];
  for (let d = 0; d < e; d++)
    c.push(s.readBits(1)), l.push(s.readBits(1));
  if (e > 0)
    for (let d = e; d < 8; d++)
      s.skipBits(2);
  for (let d = 0; d < e; d++)
    c[d] && s.skipBits(88), l[d] && s.skipBits(8);
  return {
    general_profile_space: t,
    general_tier_flag: n,
    general_profile_idc: r,
    general_profile_compatibility_flags: i,
    general_constraint_indicator_flags: o,
    general_level_idc: a
  };
}, Ag = (s) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!s.readBits(1))
        x(s);
      else {
        const r = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && ht(s);
        for (let i = 0; i < r; i++)
          ht(s);
      }
}, Mg = (s, e) => {
  const t = [];
  for (let n = 0; n < e; n++)
    t[n] = Bg(s, n, e, t);
}, Bg = (s, e, t, n) => {
  let r = 0, i = 0, o = 0;
  if (e !== 0 && (i = s.readBits(1)), i) {
    if (e === t) {
      const c = x(s);
      o = e - (c + 1);
    } else
      o = e - 1;
    s.readBits(1), x(s);
    const a = n[o] ?? 0;
    for (let c = 0; c <= a; c++)
      s.readBits(1) || s.readBits(1);
    r = n[o];
  } else {
    const a = x(s), c = x(s);
    for (let l = 0; l < a; l++)
      x(s), s.readBits(1);
    for (let l = 0; l < c; l++)
      x(s), s.readBits(1);
    r = a + c;
  }
  return r;
}, Ig = (s, e) => {
  let t = 2, n = 2, r = 2, i = 0, o = 0, a = { num: 1, den: 1 };
  if (s.readBits(1)) {
    const c = s.readBits(8);
    if (c === 255)
      a = {
        num: s.readBits(16),
        den: s.readBits(16)
      };
    else {
      const l = Ul[c];
      l && (a = l);
    }
  }
  return s.readBits(1) && s.readBits(1), s.readBits(1) && (s.readBits(3), i = s.readBits(1), s.readBits(1) && (t = s.readBits(8), n = s.readBits(8), r = s.readBits(8))), s.readBits(1) && (x(s), x(s)), s.readBits(1), s.readBits(1), s.readBits(1), s.readBits(1) && (x(s), x(s), x(s), x(s)), s.readBits(1) && (s.readBits(32), s.readBits(32), s.readBits(1) && x(s), s.readBits(1) && Rg(s, !0, e)), s.readBits(1) && (s.readBits(1), s.readBits(1), s.readBits(1), o = x(s), x(s), x(s), x(s), x(s)), {
    pixelAspectRatio: a,
    colourPrimaries: t,
    transferCharacteristics: n,
    matrixCoefficients: r,
    fullRangeFlag: i,
    minSpatialSegmentationIdc: o
  };
}, Rg = (s, e, t) => {
  let n = !1, r = !1, i = !1;
  n = s.readBits(1) === 1, r = s.readBits(1) === 1, (n || r) && (i = s.readBits(1) === 1, i && (s.readBits(8), s.readBits(5), s.readBits(1), s.readBits(5)), s.readBits(4), s.readBits(4), i && s.readBits(4), s.readBits(5), s.readBits(5), s.readBits(5));
  for (let o = 0; o <= t; o++) {
    const a = s.readBits(1) === 1;
    let c = !0;
    a || (c = s.readBits(1) === 1);
    let l = !1;
    c ? x(s) : l = s.readBits(1) === 1;
    let d = 1;
    l || (d = x(s) + 1), n && va(s, d, i), r && va(s, d, i);
  }
}, va = (s, e, t) => {
  for (let n = 0; n < e; n++)
    x(s), x(s), t && (x(s), x(s)), s.readBits(1);
}, Og = (s) => {
  const e = [];
  e.push(s.configurationVersion), e.push((s.generalProfileSpace & 3) << 6 | (s.generalTierFlag & 1) << 5 | s.generalProfileIdc & 31), e.push(s.generalProfileCompatibilityFlags >>> 24 & 255), e.push(s.generalProfileCompatibilityFlags >>> 16 & 255), e.push(s.generalProfileCompatibilityFlags >>> 8 & 255), e.push(s.generalProfileCompatibilityFlags & 255), e.push(...s.generalConstraintIndicatorFlags), e.push(s.generalLevelIdc & 255), e.push(240 | s.minSpatialSegmentationIdc >> 8 & 15), e.push(s.minSpatialSegmentationIdc & 255), e.push(252 | s.parallelismType & 3), e.push(252 | s.chromaFormatIdc & 3), e.push(248 | s.bitDepthLumaMinus8 & 7), e.push(248 | s.bitDepthChromaMinus8 & 7), e.push(s.avgFrameRate >> 8 & 255), e.push(s.avgFrameRate & 255), e.push((s.constantFrameRate & 3) << 6 | (s.numTemporalLayers & 7) << 3 | (s.temporalIdNested & 1) << 2 | s.lengthSizeMinusOne & 3), e.push(s.arrays.length & 255);
  for (const t of s.arrays) {
    e.push((t.arrayCompleteness & 1) << 7 | 0 | t.nalUnitType & 63), e.push(t.nalUnits.length >> 8 & 255), e.push(t.nalUnits.length & 255);
    for (const n of t.nalUnits) {
      e.push(n.length >> 8 & 255), e.push(n.length & 255);
      for (let r = 0; r < n.length; r++)
        e.push(n[r]);
    }
  }
  return new Uint8Array(e);
};
var Sa;
(function(s) {
  s[s.audAllowed = 0] = "audAllowed", s[s.beforeFirstVcl = 1] = "beforeFirstVcl", s[s.afterFirstVcl = 2] = "afterFirstVcl", s[s.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", s[s.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(Sa || (Sa = {}));
const Pg = (s) => {
  const e = Ml(s), t = e.getUint8(9), n = e.getUint16(10, !0), r = e.getUint32(12, !0), i = e.getInt16(16, !0), o = e.getUint8(18);
  let a = null;
  return o && (a = s.subarray(19, 21 + t)), {
    outputChannelCount: t,
    preSkip: n,
    inputSampleRate: r,
    outputGain: i,
    channelMappingFamily: o,
    channelMappingTable: a
  };
};
var _a;
(function(s) {
  s[s.STREAMINFO = 0] = "STREAMINFO", s[s.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", s[s.PICTURE = 6] = "PICTURE";
})(_a || (_a = {}));
const Fg = (s) => {
  if (s.length < 7 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new je(s);
  e.skipBits(16), e.skipBits(16);
  const t = e.readBits(2);
  if (t === 3)
    return null;
  const n = e.readBits(6), r = e.readBits(5);
  if (r > 8)
    return null;
  const i = e.readBits(3), o = e.readBits(3);
  (o & 1) !== 0 && o !== 1 && e.skipBits(2), (o & 4) !== 0 && e.skipBits(2), o === 2 && e.skipBits(2);
  const a = e.readBits(1), c = Math.floor(n / 2);
  return { fscod: t, bsid: r, bsmod: i, acmod: o, lfeon: a, bitRateCode: c };
}, Lg = [1, 2, 3, 6], Ug = (s) => {
  if (s.length < 6 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new je(s);
  e.skipBits(16);
  const t = e.readBits(2);
  if (e.skipBits(3), t !== 0 && t !== 2)
    return null;
  const n = e.readBits(11), r = e.readBits(2);
  let i = 0, o;
  r === 3 ? (i = e.readBits(2), o = 3) : o = e.readBits(2);
  const a = e.readBits(3), c = e.readBits(1), l = e.readBits(5);
  if (l < 11 || l > 16)
    return null;
  const d = Lg[o];
  let u;
  return r < 3 ? u = wg[r] / 1e3 : u = bg[i] / 1e3, {
    dataRate: Math.round((n + 1) * u / (d * 16)),
    substreams: [{
      fscod: r,
      fscod2: i,
      bsid: l,
      bsmod: 0,
      acmod: a,
      lfeon: c,
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
const xa = /* @__PURE__ */ new Uint8Array(0);
class Pt {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, n, r, i = -1, o, a) {
    if (this.data = e, this.type = t, this.timestamp = n, this.duration = r, this.sequenceNumber = i, e === xa && o === void 0)
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    if (o === void 0 && (o = e.byteLength), !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (t !== "key" && t !== "delta")
      throw new TypeError('type must be either "key" or "delta".');
    if (!Number.isFinite(n))
      throw new TypeError("timestamp must be a number.");
    if (!Number.isFinite(r) || r < 0)
      throw new TypeError("duration must be a non-negative number.");
    if (!Number.isFinite(i))
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
    return this.data === xa;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(ma * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ma * this.duration);
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
    return e.copyTo(n), new Pt(n, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, t);
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
    return new Pt(e?.data ?? this.data, e?.type ?? this.type, e?.timestamp ?? this.timestamp, e?.duration ?? this.duration, e?.sequenceNumber ?? this.sequenceNumber, this.byteLength, e?.sideData ?? this.sideData);
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Dg = (s) => {
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
const Or = 8, ka = 16;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Ng = 7, $g = 9, Ea = (s) => {
  const e = s.filePos, t = Hg(s, 9), n = new je(t);
  if (n.readBits(12) !== 4095 || (n.skipBits(1), n.readBits(2) !== 0))
    return null;
  const o = n.readBits(1), a = n.readBits(2) + 1, c = n.readBits(4);
  if (c === 15)
    return null;
  n.skipBits(1);
  const l = n.readBits(3);
  if (l === 0)
    throw new Error("ADTS frames with channel configuration 0 are not supported.");
  n.skipBits(1), n.skipBits(1), n.skipBits(1), n.skipBits(1);
  const d = n.readBits(13);
  n.skipBits(11);
  const u = n.readBits(2) + 1;
  if (u !== 1)
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  let h = null;
  return o === 1 ? s.filePos -= 2 : h = n.readBits(16), {
    objectType: a,
    samplingFrequencyIndex: c,
    channelConfiguration: l,
    frameLength: d,
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
class nn {
  constructor(e, t, n, r, i) {
    this.bytes = e, this.view = t, this.offset = n, this.start = r, this.end = i, this.bufferPos = r - n;
  }
  static tempFromBytes(e) {
    return new nn(e, Ml(e), 0, 0, e.length);
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
    return new nn(this.bytes, this.view, this.offset, e, e + t);
  }
}
const Vg = (s, e) => {
  if (s.filePos < s.start || s.filePos + e > s.end)
    throw new RangeError(`Tried reading [${s.filePos}, ${s.filePos + e}), but slice is [${s.start}, ${s.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, Hg = (s, e) => {
  Vg(s, e);
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
class zg {
  constructor(e) {
    this.mutex = new Il(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackClose(e) {
  }
  validateTimestamp(e, t, n) {
    if (t < 0)
      throw new Error(`Timestamps must be non-negative (got ${t}s).`);
    let r = this.trackTimestampInfo.get(e);
    if (r) {
      if (n && (r.maxTimestampBeforeLastKeyPacket = r.maxTimestamp), r.maxTimestampBeforeLastKeyPacket !== null && t < r.maxTimestampBeforeLastKeyPacket)
        throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${t}s, but largest timestamp is ${r.maxTimestampBeforeLastKeyPacket}s.`);
      r.maxTimestamp = Math.max(r.maxTimestamp, t);
    } else {
      if (!n)
        throw new Error("First packet must be a key packet.");
      r = {
        maxTimestamp: t,
        maxTimestampBeforeLastKeyPacket: null
      }, this.trackTimestampInfo.set(e, r);
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
const Ta = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, jg = (s) => {
  const e = Math.floor(s / 36e5), t = Math.floor(s % (3600 * 1e3) / (60 * 1e3)), n = Math.floor(s % (60 * 1e3) / 1e3), r = s % 1e3;
  return e.toString().padStart(2, "0") + ":" + t.toString().padStart(2, "0") + ":" + n.toString().padStart(2, "0") + "." + r.toString().padStart(3, "0");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Sn {
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
        for (const i of e.children)
          i && this.writeBox(i);
      const n = this.writer.getPos(), r = e.size ?? n - t;
      this.writer.seek(t), this.writeBoxHeader(e, r), this.writer.seek(n);
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
    E(t !== void 0);
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
const H = /* @__PURE__ */ new Uint8Array(8), Fe = /* @__PURE__ */ new DataView(H.buffer), de = (s) => [(s % 256 + 256) % 256], F = (s) => (Fe.setUint16(0, s, !1), [H[0], H[1]]), fo = (s) => (Fe.setInt16(0, s, !1), [H[0], H[1]]), Dl = (s) => (Fe.setUint32(0, s, !1), [H[1], H[2], H[3]]), w = (s) => (Fe.setUint32(0, s, !1), [H[0], H[1], H[2], H[3]]), dt = (s) => (Fe.setInt32(0, s, !1), [H[0], H[1], H[2], H[3]]), nt = (s) => (Fe.setUint32(0, Math.floor(s / 2 ** 32), !1), Fe.setUint32(4, s, !1), [H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7]]), qg = (s) => (Fe.setInt32(0, Math.floor(s / 2 ** 32), !1), Fe.setUint32(4, s, !1), [H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7]]), Nl = (s) => (Fe.setInt16(0, 2 ** 8 * s, !1), [H[0], H[1]]), Ve = (s) => (Fe.setInt32(0, 2 ** 16 * s, !1), [H[0], H[1], H[2], H[3]]), Pr = (s) => (Fe.setInt32(0, 2 ** 30 * s, !1), [H[0], H[1], H[2], H[3]]), Fr = (s, e) => {
  const t = [];
  let n = s;
  do {
    let r = n & 127;
    n >>= 7, t.length > 0 && (r |= 128), t.push(r);
  } while (n > 0 || e);
  return t.reverse();
}, se = (s, e = !1) => {
  const t = Array(s.length).fill(null).map((n, r) => s.charCodeAt(r));
  return e && t.push(0), t;
}, $l = (s) => {
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
}, Vl = /* @__PURE__ */ $l(0), Hl = (s) => [
  Ve(s[0]),
  Ve(s[1]),
  Pr(s[2]),
  Ve(s[3]),
  Ve(s[4]),
  Pr(s[5]),
  Ve(s[6]),
  Ve(s[7]),
  Pr(s[8])
], O = (s, e, t) => ({
  type: s,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), X = (s, e, t, n, r) => O(s, [de(e), Dl(t), n ?? []], r), Wg = (s) => s.isQuickTime ? O("ftyp", [
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
]), Ca = () => O("styp", [
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
]), Aa = (s, e) => {
  let t = s.maxWrittenEndTimestamp - s.minWrittenTimestamp;
  return Number.isFinite(t) || (t = 0), X("sidx", 1, 0, [
    w(1),
    // Reference ID
    w(ze),
    // Timescale
    nt(re(s.minWrittenTimestamp, ze)),
    // Earliest presentation time
    nt(0),
    // First offset
    F(0),
    // Reserved
    F(1),
    // Reference count
    w(e & 2147483647),
    // Reference type (0) + referenced size
    w(re(t, ze)),
    // Subsegment duration
    w(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, _n = (s) => ({ type: "mdat", largeSize: s }), Gg = (s) => ({ type: "free", size: s }), Ns = (s) => O("moov", void 0, [
  Zg(s.creationTime, s.trackDatas),
  ...s.trackDatas.map((e) => Kg(e, s.creationTime)),
  s.isFragmented ? Py(s.trackDatas) : null,
  Gy(s)
]), Zg = (s, e) => {
  const t = Math.max(0, ...e.map((o) => re(pr(o), ze) + re(o.startTimestampOffset ?? 0, ze))), n = Math.max(0, ...e.map((o) => o.track.id)) + 1, r = !$t(s) || !$t(t), i = r ? nt : w;
  return X("mvhd", +r, 0, [
    i(s),
    // Creation time
    i(s),
    // Modification time
    w(ze),
    // Timescale
    i(t),
    // Duration
    Ve(1),
    // Preferred rate
    Nl(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    Hl(Vl),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    w(n)
    // Next track ID
  ]);
}, pr = (s) => {
  if (s.samples.length === 0)
    return 0;
  let e = 1 / 0, t = -1 / 0;
  for (let n = 0; n < s.samples.length; n++) {
    const r = s.samples[n];
    r.timestamp < e && (e = r.timestamp), r.timestamp + r.duration > t && (t = r.timestamp + r.duration);
  }
  return e === 1 / 0 ? 0 : t - e;
}, Kg = (s, e) => {
  const t = r0(s), n = s.startTimestampOffset !== null && s.startTimestampOffset > 0;
  return O("trak", void 0, [
    Xg(s, e),
    n ? Yg(s, s.startTimestampOffset) : null,
    Qg(s, e),
    t.name !== void 0 ? O("udta", void 0, [
      O("name", [
        ...Qe.encode(t.name)
      ])
    ]) : null
  ]);
}, Xg = (s, e) => {
  const t = re(pr(s), ze) + re(s.startTimestampOffset ?? 0, ze), n = !$t(e) || !$t(t), r = n ? nt : w;
  let i;
  if (s.type === "video") {
    const a = s.track.metadata.rotation;
    i = $l(a ?? 0);
  } else
    i = Vl;
  let o = 2;
  return s.track.metadata.disposition?.default !== !1 && (o |= 1), X("tkhd", +n, o, [
    r(e),
    // Creation time
    r(e),
    // Modification time
    w(s.track.id),
    // Track ID
    w(0),
    // Reserved
    r(t),
    // Duration
    Array(8).fill(0),
    // Reserved
    F(0),
    // Layer
    F(s.track.id),
    // Alternate group
    Nl(s.type === "audio" ? 1 : 0),
    // Volume
    F(0),
    // Reserved
    Hl(i),
    // Matrix
    Ve(s.type === "video" ? s.info.width : 0),
    // Track width
    Ve(s.type === "video" ? s.info.height : 0)
    // Track height
  ]);
}, Yg = (s, e) => {
  const t = re(e, ze), n = re(pr(s), ze), r = !$t(t) || !$t(n), i = r ? nt : w, o = r ? qg : dt;
  return O("edts", void 0, [
    X("elst", r ? 1 : 0, 0, [
      w(2),
      // Entry count
      // #1
      i(t),
      // Segment duration
      o(-1),
      // Media time
      Ve(1),
      // Media rate
      // #2
      i(n),
      // Segment duration
      o(0),
      // Media time
      Ve(1)
      // Media rate
    ])
  ]);
}, Qg = (s, e) => O("mdia", void 0, [
  Jg(s, e),
  po(!0, ey[s.type], ty[s.type]),
  sy(s)
]), Jg = (s, e) => {
  const t = re(pr(s), s.timescale), n = !$t(e) || !$t(t), r = n ? nt : w;
  return X("mdhd", +n, 0, [
    r(e),
    // Creation time
    r(e),
    // Modification time
    w(s.timescale),
    // Timescale
    r(t),
    // Duration
    F(Wl(s.track.metadata.languageCode ?? Ym)),
    // Language
    F(0)
    // Quality
  ]);
}, ey = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, ty = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, po = (s, e, t, n = "\0\0\0\0") => X("hdlr", 0, 0, [
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
]), sy = (s) => O("minf", void 0, [
  oy[s.type](),
  ay(),
  dy(s)
]), ny = () => X("vmhd", 0, 1, [
  F(0),
  // Graphics mode
  F(0),
  // Opcolor R
  F(0),
  // Opcolor G
  F(0)
  // Opcolor B
]), ry = () => X("smhd", 0, 0, [
  F(0),
  // Balance
  F(0)
  // Reserved
]), iy = () => X("nmhd", 0, 0), oy = {
  video: ny,
  audio: ry,
  subtitle: iy
}, ay = () => O("dinf", void 0, [
  cy()
]), cy = () => X("dref", 0, 0, [
  w(1)
  // Entry count
], [
  ly()
]), ly = () => X("url ", 0, 1), dy = (s) => {
  const e = s.compositionTimeOffsetTable.length > 1 || s.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return O("stbl", void 0, [
    uy(s),
    Cy(s),
    e ? Ry(s) : null,
    e ? Oy(s) : null,
    My(s),
    By(s),
    Iy(s),
    Ay(s)
  ]);
}, uy = (s) => {
  let e;
  if (s.type === "video")
    e = hy(Yy(s.track.source._codec, s.info.decoderConfig.codec), s);
  else if (s.type === "audio") {
    const t = ql(s.track.source._codec, s.muxer.isQuickTime);
    E(t), e = wy(t, s);
  } else s.type === "subtitle" && (e = Ey(e0[s.track.source._codec], s));
  return E(e), X("stsd", 0, 0, [
    w(1)
    // Entry count
  ], [
    e
  ]);
}, hy = (s, e) => O(s, [
  Array(6).fill(0),
  // Reserved
  F(1),
  // Data reference index
  F(0),
  // Pre-defined
  F(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  F(e.info.width),
  // Width
  F(e.info.height),
  // Height
  w(4718592),
  // Horizontal resolution
  w(4718592),
  // Vertical resolution
  w(0),
  // Reserved
  F(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  F(24),
  // Depth
  fo(65535)
  // Pre-defined
], [
  Qy[e.track.source._codec]?.(e) ?? null,
  fy(e),
  Zm(e.info.decoderConfig.colorSpace) ? py(e) : null
]), fy = (s) => s.info.pixelAspectRatio.num === s.info.pixelAspectRatio.den ? null : O("pasp", [
  w(s.info.pixelAspectRatio.num),
  w(s.info.pixelAspectRatio.den)
]), py = (s) => O("colr", [
  se(s.muxer.isQuickTime ? "nclc" : "nclx"),
  // Colour type
  F(io[s.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  F(oo[s.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  F(ao[s.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  s.muxer.isQuickTime ? [] : de((s.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), my = (s) => s.info.decoderConfig && O("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...dn(s.info.decoderConfig.description)
]), gy = (s) => s.info.decoderConfig && O("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...dn(s.info.decoderConfig.description)
]), Ma = (s) => {
  if (!s.info.decoderConfig)
    return null;
  const e = s.info.decoderConfig, t = e.codec.split("."), n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), o = t[4] ? Number(t[4]) : 1, a = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), c = (i << 4) + (o << 1) + a, l = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? io[e.colorSpace.primaries] : 2, d = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? oo[e.colorSpace.transfer] : 2, u = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? ao[e.colorSpace.matrix] : 2;
  return X("vpcC", 1, 0, [
    de(n),
    // Profile
    de(r),
    // Level
    de(c),
    // Bit depth, chroma subsampling, full range
    de(l),
    // Colour primaries
    de(d),
    // Transfer characteristics
    de(u),
    // Matrix coefficients
    F(0)
    // Codec initialization data size
  ]);
}, yy = (s) => O("av1C", ag(s.info.decoderConfig.codec)), wy = (s, e) => {
  let t = 0, n, r = 16;
  const i = Ms.includes(e.track.source._codec);
  if (i) {
    const o = e.track.source._codec, { sampleSize: a } = Bs(o);
    r = 8 * a, r > 16 && (t = 1);
  }
  if (e.muxer.isQuickTime && (t = 1), t === 0)
    n = [
      Array(6).fill(0),
      // Reserved
      F(1),
      // Data reference index
      F(t),
      // Version
      F(0),
      // Revision level
      w(0),
      // Vendor
      F(e.info.numberOfChannels),
      // Number of channels
      F(r),
      // Sample size (bits)
      F(0),
      // Compression ID
      F(0),
      // Packet size
      F(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      F(0)
      // Sample rate (lower)
    ];
  else {
    const o = i ? 0 : -2;
    n = [
      Array(6).fill(0),
      // Reserved
      F(1),
      // Data reference index
      F(t),
      // Version
      F(0),
      // Revision level
      w(0),
      // Vendor
      F(e.info.numberOfChannels),
      // Number of channels
      F(Math.min(r, 16)),
      // Sample size (bits)
      fo(o),
      // Compression ID
      F(0),
      // Packet size
      F(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      F(0),
      // Sample rate (lower)
      i ? [
        w(1),
        // Samples per packet (must be 1 for uncompressed formats)
        w(r / 8),
        // Bytes per packet
        w(e.info.numberOfChannels * r / 8)
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
    Jy(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Lr = (s) => {
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
    ...de(e),
    // Object type indication
    ...de(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...Dl(0),
    // 24bit buffer size
    ...w(0),
    // max bitrate
    ...w(0)
    // avg bitrate
  ];
  if (s.info.decoderConfig.description) {
    const n = dn(s.info.decoderConfig.description);
    t = [
      ...t,
      ...de(5),
      // TAG(5) = DecoderSpecificInfo
      ...Fr(n.byteLength),
      ...n
    ];
  }
  return t = [
    ...F(1),
    // ES_ID = 1
    ...de(0),
    // flags etc = 0
    ...de(4),
    // TAG(4) = ES Descriptor
    ...Fr(t.length),
    ...t,
    ...de(6),
    // TAG(6)
    ...de(1),
    // length
    ...de(2)
    // data
  ], t = [
    ...de(3),
    // TAG(3) = Object Descriptor
    ...Fr(t.length),
    ...t
  ], X("esds", 0, 0, t);
}, St = (s) => O("wave", void 0, [
  by(s),
  vy(s),
  O("\0\0\0\0")
  // NULL tag at the end
]), by = (s) => O("frma", [
  se(ql(s.track.source._codec, s.muxer.isQuickTime))
]), vy = (s) => {
  const { littleEndian: e } = Bs(s.track.source._codec);
  return O("enda", [
    F(+e)
  ]);
}, Sy = (s) => {
  let e = s.info.numberOfChannels, t = 3840, n = s.info.sampleRate, r = 0, i = 0, o = new Uint8Array(0);
  const a = s.info.decoderConfig?.description;
  if (a) {
    E(a.byteLength >= 18);
    const c = dn(a), l = Pg(c);
    e = l.outputChannelCount, t = l.preSkip, n = l.inputSampleRate, r = l.outputGain, i = l.channelMappingFamily, l.channelMappingTable && (o = l.channelMappingTable);
  }
  return O("dOps", [
    de(0),
    // Version
    de(e),
    // OutputChannelCount
    F(t),
    // PreSkip
    w(n),
    // InputSampleRate
    fo(r),
    // OutputGain
    de(i),
    // ChannelMappingFamily
    ...o
  ]);
}, _y = (s) => {
  const e = s.info.decoderConfig?.description;
  E(e);
  const t = dn(e);
  return X("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, We = (s) => {
  const { littleEndian: e, sampleSize: t } = Bs(s.track.source._codec), n = +e;
  return X("pcmC", 0, 0, [
    de(n),
    de(8 * t)
  ]);
}, xy = (s) => {
  const e = Fg(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const t = new Uint8Array(3), n = new je(t);
  return n.writeBits(2, e.fscod), n.writeBits(5, e.bsid), n.writeBits(3, e.bsmod), n.writeBits(3, e.acmod), n.writeBits(1, e.lfeon), n.writeBits(5, e.bitRateCode), n.writeBits(5, 0), O("dac3", [...t]);
}, ky = (s) => {
  const e = Ug(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let t = 16;
  for (const o of e.substreams)
    t += 23, o.numDepSub > 0 ? t += 9 : t += 1;
  const n = Math.ceil(t / 8), r = new Uint8Array(n), i = new je(r);
  i.writeBits(13, e.dataRate), i.writeBits(3, e.substreams.length - 1);
  for (const o of e.substreams)
    i.writeBits(2, o.fscod), i.writeBits(5, o.bsid), i.writeBits(1, 0), i.writeBits(1, 0), i.writeBits(3, o.bsmod), i.writeBits(3, o.acmod), i.writeBits(1, o.lfeon), i.writeBits(3, 0), i.writeBits(4, o.numDepSub), o.numDepSub > 0 ? i.writeBits(9, o.chanLoc) : i.writeBits(1, 0);
  return O("dec3", [...r]);
}, Ey = (s, e) => O(s, [
  Array(6).fill(0),
  // Reserved
  F(1)
  // Data reference index
], [
  t0[e.track.source._codec](e)
]), Ty = (s) => O("vttC", [
  ...Qe.encode(s.info.config.description)
]), Cy = (s) => X("stts", 0, 0, [
  w(s.timeToSampleTable.length),
  // Number of entries
  s.timeToSampleTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    w(e.sampleDelta)
    // Sample duration
  ])
]), Ay = (s) => {
  if (s.samples.every((t) => t.type === "key"))
    return null;
  const e = [...s.samples.entries()].filter(([, t]) => t.type === "key");
  return X("stss", 0, 0, [
    w(e.length),
    // Number of entries
    e.map(([t]) => w(t + 1))
    // Sync sample table
  ]);
}, My = (s) => X("stsc", 0, 0, [
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
]), By = (s) => {
  if (s.type === "audio" && s.info.requiresPcmTransformation) {
    const { sampleSize: e } = Bs(s.track.source._codec);
    return X("stsz", 0, 0, [
      w(e * s.info.numberOfChannels),
      // Sample size
      w(s.samples.reduce((t, n) => t + re(n.duration, s.timescale), 0))
    ]);
  }
  return X("stsz", 0, 0, [
    w(0),
    // Sample size (0 means non-constant size)
    w(s.samples.length),
    // Number of entries
    s.samples.map((e) => w(e.size))
    // Sample size table
  ]);
}, Iy = (s) => s.finalizedChunks.length > 0 && ws(s.finalizedChunks).offset >= 2 ** 32 ? X("co64", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => nt(e.offset))
  // Chunk offset table
]) : X("stco", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => w(e.offset))
  // Chunk offset table
]), Ry = (s) => X("ctts", 1, 0, [
  w(s.compositionTimeOffsetTable.length),
  // Number of entries
  s.compositionTimeOffsetTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    dt(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), Oy = (s) => {
  let e = 1 / 0, t = -1 / 0, n = 1 / 0, r = -1 / 0;
  E(s.compositionTimeOffsetTable.length > 0), E(s.samples.length > 0);
  for (let o = 0; o < s.compositionTimeOffsetTable.length; o++) {
    const a = s.compositionTimeOffsetTable[o];
    e = Math.min(e, a.sampleCompositionTimeOffset), t = Math.max(t, a.sampleCompositionTimeOffset);
  }
  for (let o = 0; o < s.samples.length; o++) {
    const a = s.samples[o];
    n = Math.min(n, re(a.timestamp, s.timescale)), r = Math.max(r, re(a.timestamp + a.duration, s.timescale));
  }
  const i = Math.max(-e, 0);
  return r >= 2 ** 31 ? null : X("cslg", 0, 0, [
    dt(i),
    // Composition to DTS shift
    dt(e),
    // Least decode to display delta
    dt(t),
    // Greatest decode to display delta
    dt(n),
    // Composition start time
    dt(r)
    // Composition end time
  ]);
}, Py = (s) => O("mvex", void 0, s.map(Fy)), Fy = (s) => X("trex", 0, 0, [
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
]), Ba = (s, e) => O("moof", void 0, [
  Ly(s),
  ...e.map(Uy)
]), Ly = (s) => X("mfhd", 0, 0, [
  w(s)
  // Sequence number
]), zl = (s) => {
  let e = 0, t = 0;
  const n = 0, r = 0, i = s.type === "delta";
  return t |= +i, i ? e |= 1 : e |= 2, e << 24 | t << 16 | n << 8 | r;
}, Uy = (s) => O("traf", void 0, [
  Dy(s),
  Ny(s),
  $y(s)
]), Dy = (s) => {
  E(s.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = s.currentChunk.samples[1] ?? s.currentChunk.samples[0], n = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: zl(t)
  };
  return X("tfhd", 0, e, [
    w(s.track.id),
    // Track ID
    w(n.duration),
    // Default sample duration
    w(n.size),
    // Default sample size
    w(n.flags)
    // Default sample flags
  ]);
}, Ny = (s) => (E(s.currentChunk), X("tfdt", 1, 0, [
  nt(re(s.currentChunk.startTimestamp, s.timescale))
  // Base Media Decode Time
])), $y = (s) => {
  E(s.currentChunk);
  const e = s.currentChunk.samples.map((m) => m.timescaleUnitsToNextSample), t = s.currentChunk.samples.map((m) => m.size), n = s.currentChunk.samples.map(zl), r = s.currentChunk.samples.map((m) => re(m.timestamp - m.decodeTimestamp, s.timescale)), i = new Set(e), o = new Set(t), a = new Set(n), c = new Set(r), l = a.size === 2 && n[0] !== n[1], d = i.size > 1, u = o.size > 1, h = !l && a.size > 1, f = c.size > 1 || [...c].some((m) => m !== 0);
  let g = 0;
  return g |= 1, g |= 4 * +l, g |= 256 * +d, g |= 512 * +u, g |= 1024 * +h, g |= 2048 * +f, X("trun", 1, g, [
    w(s.currentChunk.samples.length),
    // Sample count
    w(s.currentChunk.offset - s.currentChunk.moofOffset || 0),
    // Data offset
    l ? w(n[0]) : [],
    s.currentChunk.samples.map((m, p) => [
      d ? w(e[p]) : [],
      // Sample duration
      u ? w(t[p]) : [],
      // Sample size
      h ? w(n[p]) : [],
      // Sample flags
      // Sample composition time offsets
      f ? dt(r[p]) : []
    ])
  ]);
}, Vy = (s) => O("mfra", void 0, [
  ...s.map(Hy),
  zy()
]), Hy = (s, e) => X("tfra", 1, 0, [
  w(s.track.id),
  // Track ID
  w(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((n) => [
    nt(re(n.samples[0].timestamp, s.timescale)),
    // Time (in presentation time)
    nt(n.moofOffset),
    // moof offset
    w(e + 1),
    // traf number
    w(1),
    // trun number
    w(1)
    // Sample number
  ])
]), zy = () => X("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  w(0)
  // Size
]), jy = () => O("vtte"), qy = (s, e, t, n, r) => O("vttc", void 0, [
  r !== null ? O("vsid", [dt(r)]) : null,
  t !== null ? O("iden", [...Qe.encode(t)]) : null,
  e !== null ? O("ctim", [...Qe.encode(jg(e))]) : null,
  n !== null ? O("sttg", [...Qe.encode(n)]) : null,
  O("payl", [...Qe.encode(s)])
]), Wy = (s) => O("vtta", [...Qe.encode(s)]), Gy = (s) => {
  const e = [], t = s.format._options.metadataFormat ?? "auto", n = s.output._metadataTags;
  if (t === "mdir" || t === "auto" && !s.isQuickTime) {
    const r = Ky(n);
    r && e.push(r);
  } else if (t === "mdta") {
    const r = Xy(n);
    r && e.push(r);
  } else (t === "udta" || t === "auto" && s.isQuickTime) && Zy(e, s.output._metadataTags);
  return e.length === 0 ? null : O("udta", void 0, e);
}, Zy = (s, e) => {
  for (const { key: t, value: n } of Ol(e))
    switch (t) {
      case "title":
        s.push(Ge("©nam", n));
        break;
      case "description":
        s.push(Ge("©des", n));
        break;
      case "artist":
        s.push(Ge("©ART", n));
        break;
      case "album":
        s.push(Ge("©alb", n));
        break;
      case "albumArtist":
        s.push(Ge("albr", n));
        break;
      case "genre":
        s.push(Ge("©gen", n));
        break;
      case "date":
        s.push(Ge("©day", n.toISOString().slice(0, 10)));
        break;
      case "comment":
        s.push(Ge("©cmt", n));
        break;
      case "lyrics":
        s.push(Ge("©lyr", n));
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
        Rl(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const n = e.raw[t];
      n == null || t.length !== 4 || s.some((r) => r.type === t) || (typeof n == "string" ? s.push(Ge(t, n)) : n instanceof Uint8Array && s.push(O(t, Array.from(n))));
    }
}, Ge = (s, e) => {
  const t = Qe.encode(e);
  return O(s, [
    F(t.length),
    F(Wl("und")),
    Array.from(t)
  ]);
}, Ia = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, jl = (s, e) => {
  const t = [];
  for (const { key: n, value: r } of Ol(s))
    switch (n) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: De(r) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: De(r) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: De(r) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: De(r) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: De(r) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: De(r) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: De(r) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: De(r) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: De(r.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const i of r)
          i.kind === "coverFront" && t.push({ key: "covr", value: O("data", [
            w(Ia[i.mimeType] ?? 0),
            // Type indicator
            w(0),
            // Locale indicator
            Array.from(i.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const i = s.tracksTotal !== void 0 ? `${r}/${s.tracksTotal}` : r.toString();
          t.push({ key: "track", value: De(i) });
        } else
          t.push({ key: "trkn", value: O("data", [
            w(0),
            // 8 bytes empty
            w(0),
            F(0),
            // Empty
            F(r),
            F(s.tracksTotal ?? 0),
            F(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || t.push({ key: "disc", value: O("data", [
          w(0),
          // 8 bytes empty
          w(0),
          F(0),
          // Empty
          F(r),
          F(s.discsTotal ?? 0),
          F(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        Rl(n);
    }
  if (s.raw)
    for (const n in s.raw) {
      const r = s.raw[n];
      r == null || !e && n.length !== 4 || t.some((i) => i.key === n) || (typeof r == "string" ? t.push({ key: n, value: De(r) }) : r instanceof Uint8Array ? t.push({ key: n, value: O("data", [
        w(0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(r)
      ]) }) : r instanceof Pl && t.push({ key: n, value: O("data", [
        w(Ia[r.mimeType] ?? 0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(r.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, Ky = (s) => {
  const e = jl(s, !1);
  return e.length === 0 ? null : X("meta", 0, 0, void 0, [
    po(!1, "mdir", "", "appl"),
    // mdir handler
    O("ilst", void 0, e.map((t) => O(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, Xy = (s) => {
  const e = jl(s, !0);
  return e.length === 0 ? null : O("meta", void 0, [
    po(!1, "mdta", ""),
    // mdta handler
    X("keys", 0, 0, [
      w(e.length)
    ], e.map((t) => O("mdta", [
      ...Qe.encode(t.key)
    ]))),
    O("ilst", void 0, e.map((t, n) => {
      const r = String.fromCharCode(...w(n + 1));
      return O(r, void 0, [t.value]);
    }))
  ]);
}, De = (s) => O("data", [
  w(1),
  // Type indicator (UTF-8)
  w(0),
  // Locale indicator
  ...Qe.encode(s)
]), Yy = (s, e) => {
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
}, Qy = {
  avc: my,
  hevc: gy,
  vp8: Ma,
  vp9: Ma,
  av1: yy,
  prores: null
}, ql = (s, e) => {
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
}, Jy = (s, e) => {
  switch (s) {
    case "aac":
      return Lr;
    case "mp3":
      return Lr;
    case "opus":
      return Sy;
    case "vorbis":
      return Lr;
    case "flac":
      return _y;
    case "ac3":
      return xy;
    case "eac3":
      return ky;
  }
  if (e)
    switch (s) {
      case "pcm-s24":
        return St;
      case "pcm-s24be":
        return St;
      case "pcm-s32":
        return St;
      case "pcm-s32be":
        return St;
      case "pcm-f32":
        return St;
      case "pcm-f32be":
        return St;
      case "pcm-f64":
        return St;
      case "pcm-f64be":
        return St;
    }
  else
    switch (s) {
      case "pcm-s16":
        return We;
      case "pcm-s16be":
        return We;
      case "pcm-s24":
        return We;
      case "pcm-s24be":
        return We;
      case "pcm-s32":
        return We;
      case "pcm-s32be":
        return We;
      case "pcm-f32":
        return We;
      case "pcm-f32be":
        return We;
      case "pcm-f64":
        return We;
      case "pcm-f64be":
        return We;
    }
  return null;
}, e0 = {
  webvtt: "wvtt"
}, t0 = {
  webvtt: Ty
}, Wl = (s) => {
  E(s.length === 3);
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
class ki {
  constructor(e, t) {
    if (this.finalized = !1, this.started = !1, this.pos = 0, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1, e._writerAcquired)
      throw new Error("Can't have multiple Writers for the same Target.");
    this.target = e, e._setMonotonicity(t), e._writerAcquired = !0;
  }
  start() {
    E(!this.started), this.target._start(), this.started = !0;
  }
  /** Writes the given data to the target, at the current position. */
  write(e) {
    E(this.started && !this.finalized), this.maybeTrackWrites(e), this.target._write(e, this.pos), this.pos += e.byteLength;
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
    return E(this.started && !this.finalized), this.target._flush();
  }
  /** Called after muxing has finished. */
  async finalize() {
    E(this.started && !this.finalized), await this.target._finalize(), this.finalized = !0;
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
    let r = this.trackedWrites.byteLength;
    for (; r < n; )
      r *= 2;
    if (r !== this.trackedWrites.byteLength) {
      const i = new Uint8Array(r);
      i.set(this.trackedWrites, 0), this.trackedWrites = i;
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
class lt extends co {
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
    return new s0(this, e);
  }
}
const Ur = 2 ** 16, Dr = 2 ** 32;
class Rn extends lt {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer(Ur, { maxByteLength: Dr });
      } catch {
        this._buffer = new ArrayBuffer(Ur), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer(Ur);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let t = this._buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this._buffer.byteLength) {
      if (t > Dr)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Dr} bytes. Please consider using another target.`);
      if (this._supportsResize)
        this._buffer.resize(t);
      else {
        const n = new ArrayBuffer(t), r = new Uint8Array(n);
        r.set(this._bytes, 0), this._buffer = n, this._bytes = r;
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
class s0 extends lt {
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
class Nr {
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
const ze = 57600, n0 = 2082844800, r0 = (s) => {
  const e = {}, t = s.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, re = (s, e, t = !0) => {
  const n = s * e;
  return t ? Math.round(n) : n;
};
class i0 extends zg {
  constructor(e, t) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Rn(), this.auxWriter = new ki(this.auxTarget, !1), this.auxBoxWriter = new Sn(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = Km(), this.creationTime = Math.floor(Date.now() / 1e3) + n0, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = t, this.isQuickTime = t instanceof Yl, this.isCmaf = t instanceof Ra, this.minimumFragmentDuration = t._options.minimumFragmentDuration ?? (t instanceof Ra ? 1 / 0 : 1), this.auxWriter.start();
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((n) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : n instanceof Rn), this.boxWriter = new Sn(this.writer), this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof Rn ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const n = await this.output._getInitTarget(), r = new ki(n, !0);
      r.start(), this.initWriter = r, this.initBoxWriter = new Sn(r);
    }
    const t = this.output._tracks.some((n) => n.isVideoTrack() && n.source._codec === "avc");
    {
      const n = this.initBoxWriter ?? this.boxWriter;
      if (E(n), this.format._options.onFtyp && n.writer.startTrackingWrites(), n.writeBox(Wg({
        isQuickTime: this.isQuickTime,
        holdsAvc: t,
        fragmented: this.isFragmented,
        cmaf: this.isCmaf
      })), this.format._options.onFtyp) {
        const { data: r, start: i } = n.writer.stopTrackingWrites();
        this.format._options.onFtyp(r, i);
      }
      this.ftypSize = n.writer.getPos(), this.isCmaf && await this.initWriter.flush();
    }
    if (this.fastStart !== "in-memory") if (this.fastStart === "reserve") {
      for (const n of this.output._tracks)
        if (n.metadata.maximumPacketCount === void 0)
          throw new Error("All tracks must specify maximumPacketCount in their metadata when using fastStart: 'reserve'.");
    } else this.isFragmented || (E(this.writer), E(this.boxWriter), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = _n(!0), this.boxWriter.writeBox(this.mdat));
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
    return Dg({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((t) => t.type === "video"),
      hasAudio: this.trackDatas.some((t) => t.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, t, n) {
    const r = this.trackDatas.find((h) => h.track === e);
    if (r)
      return r;
    pg(n), E(n), E(n.decoderConfig);
    const i = { ...n.decoderConfig };
    E(i.codedWidth !== void 0), E(i.codedHeight !== void 0);
    let o = !1;
    if (e.source._codec === "avc" && !i.description) {
      const h = _g(t.data);
      if (!h)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      i.description = xg(h), o = !0;
    } else if (e.source._codec === "hevc" && !i.description) {
      const h = Tg(t.data);
      if (!h)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      i.description = Og(h), o = !0;
    }
    const a = eg(1 / (e.metadata.frameRate ?? ze), 1e6).den, c = i.displayAspectWidth, l = i.displayAspectHeight, d = c === void 0 || l === void 0 ? { num: 1, den: 1 } : tg({
      num: c * i.codedHeight,
      den: l * i.codedWidth
    }), u = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: i.codedWidth,
        height: i.codedHeight,
        pixelAspectRatio: d,
        decoderConfig: i,
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
    const r = this.trackDatas.find((c) => c.track === e);
    if (r)
      return r;
    gg(n), E(n), E(n.decoderConfig);
    const i = { ...n.decoderConfig };
    let o = !1;
    if (e.source._codec === "aac" && !i.description) {
      const c = Ea(nn.tempFromBytes(t.data));
      if (!c)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const l = Fl[c.samplingFrequencyIndex], d = Ll[c.channelConfiguration];
      if (l === void 0 || d === void 0)
        throw new Error("Invalid ADTS frame header.");
      i.description = og({
        objectType: c.objectType,
        sampleRate: l,
        numberOfChannels: d
      }), o = !0;
    }
    const a = {
      muxer: this,
      track: e,
      type: "audio",
      info: {
        numberOfChannels: n.decoderConfig.numberOfChannels,
        sampleRate: n.decoderConfig.sampleRate,
        decoderConfig: i,
        requiresPcmTransformation: !this.isFragmented && Ms.includes(e.source._codec),
        expectedNextPcmPacketTimestamp: null,
        requiresAdtsStripping: o,
        firstPacket: t
      },
      timescale: i.sampleRate,
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
    return this.trackDatas.push(a), this.trackDatas.sort((c, l) => c.track.id - l.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), a;
  }
  getSubtitleTrackData(e, t) {
    const n = this.trackDatas.find((i) => i.track === e);
    if (n)
      return n;
    yg(t), E(t), E(t.config);
    const r = {
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
    return this.trackDatas.push(r), this.trackDatas.sort((i, o) => i.track.id - o.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), r;
  }
  async addEncodedVideoPacket(e, t, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getVideoTrackData(e, t, n);
      let o = t.data;
      if (i.info.requiresAnnexBTransformation) {
        const c = [...uo(o)].map((l) => o.subarray(l.offset, l.offset + l.length));
        if (c.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        o = Sg(c, 4);
      }
      this.validateTimestamp(i.track, t.timestamp, t.type === "key");
      const a = this.createSampleForTrack(i, o, t.timestamp, t.duration, t.type);
      await this.registerSample(i, a);
    } finally {
      r();
    }
  }
  async addEncodedAudioPacket(e, t, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getAudioTrackData(e, t, n);
      let o = t.data;
      if (i.info.requiresAdtsStripping) {
        const d = Ea(nn.tempFromBytes(o));
        if (!d)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = d.crcCheck === null ? Ng : $g;
        o = o.subarray(u);
      }
      this.validateTimestamp(i.track, t.timestamp, t.type === "key");
      let a = t.timestamp, c = t.duration;
      if (i.info.requiresPcmTransformation) {
        const u = Bs(i.info.decoderConfig.codec).sampleSize * i.info.numberOfChannels;
        if (c = o.byteLength / u / i.info.sampleRate, i.info.expectedNextPcmPacketTimestamp !== null) {
          const h = a - i.info.expectedNextPcmPacketTimestamp;
          if (h < 0.01)
            a = i.info.expectedNextPcmPacketTimestamp;
          else {
            const f = await this.padWithSilence(i, i.info.expectedNextPcmPacketTimestamp, h);
            a = i.info.expectedNextPcmPacketTimestamp + f;
          }
        }
        i.info.expectedNextPcmPacketTimestamp = a + c;
      }
      const l = this.createSampleForTrack(i, o, a, c, t.type);
      await this.registerSample(i, l);
    } finally {
      r();
    }
  }
  async padWithSilence(e, t, n) {
    const r = re(n, e.timescale);
    if (n = r / e.timescale, r > 0) {
      const { sampleSize: i, silentValue: o } = Bs(e.info.decoderConfig.codec), a = r * e.info.numberOfChannels, c = new Uint8Array(i * a).fill(o), l = this.createSampleForTrack(e, new Uint8Array(c.buffer), t, n, "key");
      await this.registerSample(e, l);
    }
    return n;
  }
  async addSubtitleCue(e, t, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getSubtitleTrackData(e, n);
      this.validateTimestamp(i.track, t.timestamp, !0), e.source._codec === "webvtt" && (i.cueQueue.push(t), await this.processWebVTTCues(i, t.timestamp));
    } finally {
      r();
    }
  }
  async processWebVTTCues(e, t) {
    for (; e.cueQueue.length > 0; ) {
      const n = /* @__PURE__ */ new Set([]);
      for (const l of e.cueQueue)
        E(l.timestamp <= t), E(e.lastCueEndTimestamp <= l.timestamp + l.duration), n.add(Math.max(l.timestamp, e.lastCueEndTimestamp)), n.add(l.timestamp + l.duration);
      const r = [...n].sort((l, d) => l - d), i = r[0], o = r[1] ?? i;
      if (t < o)
        break;
      if (e.lastCueEndTimestamp < i) {
        this.auxWriter.seek(0);
        const l = jy();
        this.auxBoxWriter.writeBox(l);
        const d = this.auxTarget._getSlice(0, this.auxWriter.getPos()), u = this.createSampleForTrack(e, d, e.lastCueEndTimestamp, i - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, u), e.lastCueEndTimestamp = i;
      }
      this.auxWriter.seek(0);
      for (let l = 0; l < e.cueQueue.length; l++) {
        const d = e.cueQueue[l];
        if (d.timestamp >= o)
          break;
        Ta.lastIndex = 0;
        const u = Ta.test(d.text), h = d.timestamp + d.duration;
        let f = e.cueToSourceId.get(d);
        if (f === void 0 && o < h && (f = e.nextSourceId++, e.cueToSourceId.set(d, f)), d.notes) {
          const m = Wy(d.notes);
          this.auxBoxWriter.writeBox(m);
        }
        const g = qy(d.text, u ? i : null, d.identifier ?? null, d.settings ?? null, f ?? null);
        this.auxBoxWriter.writeBox(g), h === o && e.cueQueue.splice(l--, 1);
      }
      const a = this.auxTarget._getSlice(0, this.auxWriter.getPos()), c = this.createSampleForTrack(e, a, i, o - i, "key");
      await this.registerSample(e, c), e.lastCueEndTimestamp = o;
    }
  }
  createSampleForTrack(e, t, n, r, i) {
    return {
      timestamp: n,
      decodeTimestamp: n,
      // This may be refined later
      duration: r,
      data: t,
      size: t.byteLength,
      type: i,
      timescaleUnitsToNextSample: re(r, e.timescale)
      // Will be refined
    };
  }
  processTimestamps(e, t) {
    if (e.timestampProcessingQueue.length === 0)
      return;
    if (e.type === "audio" && e.info.requiresPcmTransformation) {
      this.isFragmented || (e.startTimestampOffset ??= e.timestampProcessingQueue[0].timestamp);
      let r = 0;
      for (let i = 0; i < e.timestampProcessingQueue.length; i++) {
        const o = e.timestampProcessingQueue[i], a = re(o.duration, e.timescale);
        r += a;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: r,
          sampleDelta: 1
        });
      else {
        const i = ws(e.timeToSampleTable);
        i.sampleCount += r;
      }
      e.timestampProcessingQueue.length = 0;
      return;
    }
    const n = e.timestampProcessingQueue.map((r) => r.timestamp).sort((r, i) => r - i);
    this.isFragmented || (e.startTimestampOffset ??= n[0]);
    for (let r = 0; r < e.timestampProcessingQueue.length; r++) {
      const i = e.timestampProcessingQueue[r];
      i.decodeTimestamp = n[r];
      const o = re(i.timestamp - i.decodeTimestamp, e.timescale), a = re(i.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        E(e.lastSample);
        const c = re(i.decodeTimestamp, e.timescale, !1), l = Math.round(c - e.lastTimescaleUnits);
        if (E(l >= 0), e.lastTimescaleUnits += l, e.lastSample.timescaleUnitsToNextSample = l, !this.isFragmented) {
          let d = ws(e.timeToSampleTable);
          if (E(d), d.sampleCount === 1) {
            d.sampleDelta = l;
            const h = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            h && h.sampleDelta === l && (h.sampleCount++, e.timeToSampleTable.pop(), d = h);
          } else d.sampleDelta !== l && (d.sampleCount--, e.timeToSampleTable.push(d = {
            sampleCount: 1,
            sampleDelta: l
          }));
          d.sampleDelta === a ? d.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: a
          });
          const u = ws(e.compositionTimeOffsetTable);
          E(u), u.sampleCompositionTimeOffset === o ? u.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: o
          });
        }
      } else
        e.lastTimescaleUnits = re(i.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
          sampleCount: 1,
          sampleDelta: a
        }), e.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset: o
        }));
      e.lastSample = i;
    }
    if (e.timestampProcessingQueue.length = 0, E(e.lastSample), E(e.lastTimescaleUnits !== null), t !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      E(t.type === "key");
      const r = re(t.timestamp, e.timescale, !1), i = Math.round(r - e.lastTimescaleUnits);
      e.lastSample.timescaleUnitsToNextSample = i;
    }
  }
  async registerSample(e, t) {
    t.type === "key" && this.processTimestamps(e, t), e.timestampProcessingQueue.push(t), this.isFragmented ? (e.sampleQueue.push(t), await this.interleaveSamples()) : this.fastStart === "reserve" ? await this.registerSampleFastStartReserve(e, t) : await this.addSampleToTrack(e, t);
  }
  async addSampleToTrack(e, t) {
    if (!this.isFragmented && (e.samples.push(t), this.fastStart === "reserve")) {
      const r = e.track.metadata.maximumPacketCount;
      if (E(r !== void 0), e.samples.length > r)
        throw new Error(`Track #${e.track.id} has already reached the maximum packet count (${r}). Either add less packets or increase the maximum packet count.`);
    }
    let n = !1;
    if (!e.currentChunk)
      n = !0;
    else {
      e.currentChunk.startTimestamp = Math.min(e.currentChunk.startTimestamp, t.timestamp);
      const r = t.timestamp - e.currentChunk.startTimestamp;
      if (this.isFragmented) {
        const i = this.trackDatas.every((o) => {
          if (e === o)
            return t.type === "key";
          const a = o.sampleQueue[0];
          return a ? a.type === "key" : o.closed;
        });
        r >= this.minimumFragmentDuration && i && t.timestamp > this.maxWrittenTimestamp && (n = !0, await this.finalizeFragment());
      } else
        n = r >= 0.5;
    }
    n && (e.currentChunk && await this.finalizeCurrentChunk(e), e.currentChunk = {
      startTimestamp: t.timestamp,
      samples: [],
      offset: null,
      moofOffset: null
    }), E(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, t.timestamp + t.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (E(!this.isFragmented), E(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((n, r) => n + re(r.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || ws(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: t
    }), this.fastStart === "in-memory") {
      e.currentChunk.offset = 0;
      return;
    }
    e.currentChunk.offset = this.writer.getPos();
    for (const n of e.currentChunk.samples)
      E(n.data), this.writer.write(n.data), n.data = null;
    await this.writer.flush();
  }
  async interleaveSamples(e = !1) {
    if (E(this.isFragmented), !(!e && !this.allTracksAreKnown()))
      e: for (; ; ) {
        let t = null, n = 1 / 0;
        for (const i of this.trackDatas) {
          if (!e && i.sampleQueue.length === 0 && !i.closed)
            break e;
          i.sampleQueue.length > 0 && i.sampleQueue[0].timestamp < n && (t = i, n = i.sampleQueue[0].timestamp);
        }
        if (!t)
          break;
        const r = t.sampleQueue.shift();
        await this.addSampleToTrack(t, r);
      }
  }
  async finalizeFragment(e = !this.isCmaf) {
    E(this.isFragmented);
    const t = this.nextFragmentNumber++;
    if (t === 1) {
      const f = this.initBoxWriter ?? this.boxWriter;
      E(f), this.format._options.onMoov && f.writer.startTrackingWrites(), this.ensureOneEnabledTrack();
      const g = Ns(this);
      if (f.writeBox(g), this.format._options.onMoov) {
        const { data: m, start: p } = f.writer.stopTrackingWrites();
        this.format._options.onMoov(m, p);
      }
      if (this.isCmaf) {
        E(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new Sn(this.writer);
        const m = this.boxWriter.measureBox(Ca()), p = this.boxWriter.measureBox(Aa(this, 0));
        this.segmentHeaderSize = m + p, this.writer.seek(this.segmentHeaderSize);
      }
    }
    E(this.writer), E(this.boxWriter);
    const n = this.trackDatas.filter((f) => f.currentChunk), r = Ba(t, n), i = this.writer.getPos(), o = i + this.boxWriter.measureBox(r);
    let a = o + Or, c = 1 / 0;
    for (const f of n) {
      f.currentChunk.offset = a, f.currentChunk.moofOffset = i;
      for (const g of f.currentChunk.samples)
        a += g.size;
      c = Math.min(c, f.currentChunk.startTimestamp);
    }
    const l = a - o, d = l >= 2 ** 32;
    if (d)
      for (const f of n)
        f.currentChunk.offset += ka - Or;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const u = Ba(t, n);
    if (this.boxWriter.writeBox(u), this.format._options.onMoof) {
      const { data: f, start: g } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(f, g, c);
    }
    E(this.writer.getPos() === o), this.format._options.onMdat && this.writer.startTrackingWrites();
    const h = _n(d);
    h.size = l, this.boxWriter.writeBox(h), this.writer.seek(o + (d ? ka : Or));
    for (const f of n)
      for (const g of f.currentChunk.samples)
        this.writer.write(g.data), g.data = null;
    if (this.format._options.onMdat) {
      const { data: f, start: g } = this.writer.stopTrackingWrites();
      this.format._options.onMdat(f, g);
    }
    for (const f of n)
      f.finalizedChunks.push(f.currentChunk), this.finalizedChunks.push(f.currentChunk), f.currentChunk = null;
    e && await this.writer.flush();
  }
  async registerSampleFastStartReserve(e, t) {
    if (E(this.writer), E(this.boxWriter), this.allTracksAreKnown()) {
      if (!this.mdat) {
        this.ensureOneEnabledTrack();
        const n = Ns(this), i = this.boxWriter.measureBox(n) + this.computeSampleTableSizeUpperBound() + 4096;
        E(this.ftypSize !== null), this.writer.seek(this.ftypSize + i), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = _n(!0), this.boxWriter.writeBox(this.mdat);
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
    E(this.fastStart === "reserve");
    let e = 0;
    for (const t of this.trackDatas) {
      const n = t.track.metadata.maximumPacketCount;
      E(n !== void 0), e += 8 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * Math.ceil(2 / 3 * n), e += 12 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * n;
    }
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async onTrackClose(e) {
    const t = await this.mutex.acquire(), n = this.trackDatas.find((r) => r.track === e);
    n && (n.closed = !0, n.type === "subtitle" && e.source._codec === "webvtt" && await this.processWebVTTCues(n, 1 / 0), this.processTimestamps(n)), this.allTracksAreKnown() && this.allTracksKnown.resolve(), this.isFragmented && await this.interleaveSamples(), t();
  }
  ensureOneEnabledTrack() {
    for (const e of ["video", "audio", "subtitle"]) {
      const t = this.trackDatas.filter((r) => r.type === e);
      if (t.length === 0)
        continue;
      if (!t.some((r) => r.track.metadata.disposition?.default !== !1)) {
        const r = t[0];
        r.track.metadata.disposition = {
          ...r.track.metadata.disposition,
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
        await this.finalizeCurrentChunk(t), E(t.startTimestampOffset !== null);
        for (let n = 0; n < t.samples.length; n++) {
          const r = t.samples[n];
          r.timestamp -= t.startTimestampOffset, r.decodeTimestamp -= t.startTimestampOffset;
        }
      }
    if (E(this.writer), E(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = _n(!1);
      let t;
      for (let r = 0; r < 2; r++) {
        const i = Ns(this), o = this.boxWriter.measureBox(i);
        t = this.boxWriter.measureBox(this.mdat);
        let a = this.writer.getPos() + o + t;
        for (const c of this.finalizedChunks) {
          c.offset = a;
          for (const { data: l } of c.samples)
            E(l), a += l.byteLength, t += l.byteLength;
        }
        if (a < 2 ** 32)
          break;
        t >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const n = Ns(this);
      if (this.boxWriter.writeBox(n), this.format._options.onMoov) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(r, i);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const r of this.finalizedChunks)
        for (const i of r.samples)
          E(i.data), this.writer.write(i.data), i.data = null;
      if (this.format._options.onMdat) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(r, i);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const t = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(Ca()), this.boxWriter.writeBox(Aa(this, t));
      } else {
        const t = this.writer.getPos(), n = Vy(this.trackDatas);
        this.boxWriter.writeBox(n);
        const r = this.writer.getPos() - t;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(r);
      }
    else {
      E(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      E(t !== void 0);
      const n = this.writer.getPos() - t;
      if (this.mdat.size = n, this.mdat.largeSize = n >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: i, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(i, o);
      }
      const r = Ns(this);
      if (this.fastStart === "reserve") {
        E(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(r);
        const i = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(Gg(i));
      } else
        this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(r);
      if (this.format._options.onMoov) {
        const { data: i, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(i, o);
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
class mo {
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
class Gl extends mo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !As.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${As.join(", ")}.`);
    this._codec = e;
  }
}
const o0 = (s, e) => {
  if (s.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class a0 extends Gl {
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
    if (!(e instanceof Pt))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), o0(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class Zl extends mo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !er.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${er.join(", ")}.`);
    this._codec = e;
  }
}
class c0 extends Zl {
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
    if (!(e instanceof Pt))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (t !== void 0 && (!t || typeof t != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, e, t);
  }
}
class l0 extends mo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !sn.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${sn.join(", ")}.`);
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
class Kl {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => As.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => er.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => sn.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class go extends Kl {
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
    return new i0(e, this);
  }
}
class Xl extends go {
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
      ...As,
      ...lo,
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
      ...sn
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Yl().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class Ra extends go {
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
      ...As,
      ...lo,
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
      ...sn
    ];
  }
}
class Yl extends go {
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
      ...As,
      ...er
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Xl().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const d0 = ["video", "audio", "subtitle"];
class un {
  /** @internal */
  constructor(e, t, n, r, i) {
    this.id = e, this.output = t, this.type = n, this.source = r, this.metadata = i;
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
    if (!(e instanceof un))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const t = ga(this.metadata.group), n = ga(e.metadata.group);
    for (const r of t)
      if (this.type !== e.type && n.some((a) => r === a) || n.some((a) => r._pairedGroups.has(a)))
        return !0;
    return !1;
  }
}
class u0 extends un {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "video", n, r);
  }
}
class h0 extends un {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "audio", n, r);
  }
}
class f0 extends un {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "subtitle", n, r);
  }
}
class rn {
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
    if (!(e instanceof rn))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const $r = (s) => {
  if (!s || typeof s != "object")
    throw new TypeError("metadata must be an object.");
  if (s.languageCode !== void 0 && !Jm(s.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (s.name !== void 0 && typeof s.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (s.disposition !== void 0 && ig(s.disposition), s.maximumPacketCount !== void 0 && (!Number.isInteger(s.maximumPacketCount) || s.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (s.group !== void 0 && !(s.group instanceof rn) && (!Array.isArray(s.group) || s.group.some((e) => !(e instanceof rn))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class p0 extends co {
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
    if (super(), this.state = "pending", this.defaultTrackGroup = new rn(), this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new Il(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof Kl))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof lt || e.target instanceof Nr))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof lt && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof lt) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof lt && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    E(this._target instanceof Nr);
    const t = this._target.getTarget(e), n = (r) => {
      if (!(r instanceof lt))
        throw new TypeError("getTarget must return a Target.");
      return r;
    };
    return t instanceof Promise ? t.then(n) : n(t);
  }
  /** @internal */
  async _getTarget(e) {
    E(this._target instanceof Nr);
    const t = await this._getTargetValidated(e);
    return this._emit("target", { target: t, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await t._close() : this._rememberTarget(t), t;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (E(this._initTarget !== null), this._initTarget instanceof lt)
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
    if (this._target instanceof lt)
      return this._emit("target", { target: this._target, request: null, isRoot: !0 }), this._rootTarget = this._target, this._target;
    const e = {
      path: this._target.rootPath,
      isRoot: !0,
      mimeType: this.format.mimeType
    }, t = this._getTargetValidated(e), n = (r) => (this.state === "canceled" ? r._close() : this._rememberTarget(r), this._emit("target", { target: r, request: e, isRoot: !0 }), this._rootTarget = r, r);
    return t instanceof Promise ? this._rootTargetPromise = t.then(n) : n(t);
  }
  /** @internal */
  _getRootWriter(e) {
    return this._rootWriterPromise ??= (async () => {
      const t = await this._getRootTarget(), n = new ki(t, typeof e == "boolean" ? e : e(t));
      return n.start(), n;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof Gl))
      throw new TypeError("source must be a VideoSource.");
    if ($r(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new u0(this._tracks.length + 1, this, e, n));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof Zl))
      throw new TypeError("source must be an AudioSource.");
    $r(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new h0(this._tracks.length + 1, this, e, n));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof l0))
      throw new TypeError("source must be a SubtitleSource.");
    $r(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new f0(this._tracks.length + 1, this, e, n));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (rg(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (e.source._connectedTrack)
      throw new Error("Source is already used for a track.");
    const t = this.format.getSupportedTrackCounts(), n = this._tracks.reduce((o, a) => o + (a.type === e.type ? 1 : 0), 0), r = t[e.type].max;
    if (n === r)
      throw new Error(r === 0 ? `${this.format._name} does not support ${e.type} tracks.` : `${this.format._name} does not support more than ${r} ${e.type} track${r === 1 ? "" : "s"}.`);
    const i = t.total.max;
    if (this._tracks.length === i)
      throw new Error(`${this.format._name} does not support more than ${i} tracks${i === 1 ? "" : "s"} in total.`);
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
    for (const n of d0) {
      const r = this._tracks.reduce((o, a) => o + (a.type === n ? 1 : 0), 0), i = e[n].min;
      if (r < i)
        throw new Error(i === e[n].max ? `${this.format._name} requires exactly ${i} ${n} track${i === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${i} ${n} track${i === 1 ? "" : "s"}.`);
    }
    const t = e.total.min;
    if (this._tracks.length < t)
      throw new Error(t === e.total.max ? `${this.format._name} requires exactly ${t} track${t === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${t} track${t === 1 ? "" : "s"}.`);
    if (this.state === "canceled")
      throw new Error("Output has been canceled.");
    return this._startPromise ? (he._warn("Output has already been started."), this._startPromise) : this._startPromise = (async () => {
      this.state = "started";
      const n = await this._mutex.acquire();
      try {
        await this._muxer.start();
        const r = this._tracks.map((i) => i.source._start());
        await Promise.all(r);
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
      return he._warn("Output has already been canceled."), this._cancelPromise;
    if (this.state === "finalizing" || this.state === "finalized") {
      this.state === "finalized" && he._warn("Output has already been finalized.");
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
    return this._finalizePromise ? (he._warn("Output has already been finalized."), this._finalizePromise) : this._finalizePromise = (async () => {
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
const Oa = 7, Ei = 1.5, Pa = 3, m0 = 2, g0 = 0.05;
class Ql {
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
      if (this.gaps += 1, this.gaps <= Oa)
        this.warmup.push(n), this.ewmaGapMs = y0(this.warmup);
      else if (this.ewmaGapMs !== null && w0(n, this.ewmaGapMs)) {
        const r = Math.max(1 / this.gaps, g0);
        this.ewmaGapMs += r * (n - this.ewmaGapMs);
      }
      this.recent.push(n), this.recent.length > Pa && this.recent.shift();
    }
    this.lastAtMs = e;
  }
  /** Forget the baseline — a new epoch is a new stream. */
  reset() {
    this.lastAtMs = null, this.gaps = 0, this.warmup = [], this.ewmaGapMs = null, this.recent = [];
  }
  snapshot(e) {
    const t = this.lastAtMs === null ? 0 : Math.max(0, e - this.lastAtMs), n = this.ewmaGapMs ?? 0;
    let r = "ok";
    return this.lastAtMs !== null && t > m0 * Math.max(n, this.chunkMs) ? r = "stalled" : this.established() && this.recent.length >= Pa && this.recent.every((i) => i > Ei * n) && (r = "slow"), {
      state: r,
      lastGapMs: this.recent.length > 0 ? this.recent[this.recent.length - 1] : 0,
      ewmaGapMs: n,
      sinceLastMs: t
    };
  }
  established() {
    return this.gaps >= Oa;
  }
}
function y0(s) {
  const e = [...s].sort((n, r) => n - r), t = e.length >> 1;
  return e.length % 2 === 1 ? e[t] : (e[t - 1] + e[t]) / 2;
}
function w0(s, e) {
  return s >= e / Ei && s <= e * Ei;
}
const b0 = `
const FRAMES_PER_POST = ${rp};

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
async function v0(s, e, t) {
  const n = new Blob([b0], { type: "application/javascript" }), r = URL.createObjectURL(n);
  try {
    await s.audioWorklet.addModule(r);
  } finally {
    URL.revokeObjectURL(r);
  }
  const i = new AudioWorkletNode(s, "pcm-tap");
  i.port.onmessage = (a) => {
    t(a.data);
  };
  const o = s.createGain();
  return o.gain.value = 0, e.connect(i), i.connect(o), o.connect(s.destination), {
    node: i,
    stop: () => {
      i.port.onmessage = null, e.disconnect(i), i.disconnect(), o.disconnect();
    }
  };
}
const Vr = Q("media.timer");
function S0() {
  return typeof Worker == "function" && typeof Blob == "function" && typeof URL < "u" && typeof URL.createObjectURL == "function";
}
function Jl(s, e) {
  const t = Math.max(1, Math.round(e));
  let n = !1, r = "main", i = null, o = null, a = null, c = !1;
  const l = () => {
    n || s();
  }, d = () => {
    r = "main", i = setInterval(l, t);
  }, u = () => {
    o && (o.onmessage = null, o.onerror = null, o.terminate(), o = null), a && (URL.revokeObjectURL(a), a = null);
  };
  if (S0())
    try {
      const h = `setInterval(() => postMessage(0), ${t});`;
      a = URL.createObjectURL(new Blob([h], { type: "application/javascript" })), o = new Worker(a), o.onmessage = () => {
        c || (c = !0, Vr.info("worker timer running", { period: t })), l();
      }, o.onerror = (f) => {
        Vr.warn("worker timer failed, falling back to the main-thread interval", {
          err: f.message,
          period: t,
          mode: "main"
        }), u(), n || d();
      }, r = "worker";
    } catch (h) {
      Vr.warn("worker timer unavailable, using the main-thread interval", {
        err: h,
        period: t,
        mode: "main"
      }), u(), d();
    }
  else
    d();
  return {
    get mode() {
      return r;
    },
    stop() {
      n || (n = !0, u(), i !== null && (clearInterval(i), i = null));
    }
  };
}
const Fa = Q("media.encoder"), La = ne(5), _0 = 5, x0 = [
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
function k0(s, e) {
  const n = x0.indexOf(s);
  if (n === -1)
    throw new Error(`No AAC frequency index for sample rate ${s}`);
  return new Uint8Array([
    16 | n >> 1,
    (n & 1) << 7 | e << 3
  ]);
}
const E0 = /* @__PURE__ */ new Set(["ftyp", "styp", "moov", "moof", "mdat", "sidx"]);
function T0(s) {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  let t = 0;
  for (; t + 8 <= s.byteLength; ) {
    let n = e.getUint32(t);
    const r = String.fromCharCode(
      s[t + 4],
      s[t + 5],
      s[t + 6],
      s[t + 7]
    );
    if (n === 1 ? n = Number(e.getBigUint64(t + 8)) : n === 0 && (n = s.byteLength - t), n < 8 || t + n > s.byteLength) break;
    if (!E0.has(r))
      return s.subarray(0, t);
    t += n;
  }
  return s;
}
class C0 {
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
      chunkMs: Xt,
      fps: sp,
      videoBitrate: gl,
      audioBitrate: yl,
      ...e
    }, this.cadence = new Ql(this.opts.chunkMs);
  }
  /** Counters plus the cadence as of now — `stalled` is a reading of the clock. */
  get stats() {
    return { ...this.counters, cadence: this.cadence.snapshot(Date.now()) };
  }
  async start() {
    const { canvas: e, audioContext: t, audioSource: n, codecs: r } = this.opts;
    if (e.width % 2 !== 0 || e.height % 2 !== 0)
      throw new Error(`Canvas dimensions must be even, got ${e.width}x${e.height}`);
    this.videoEncoder = new VideoEncoder({
      output: (a, c) => this.onVideoOutput(a, c),
      error: (a) => this.fail(a)
    }), this.videoEncoder.configure({
      codec: r.videoCodec,
      width: e.width,
      height: e.height,
      bitrate: this.opts.videoBitrate,
      framerate: this.opts.fps,
      latencyMode: "realtime",
      avc: { format: "avc" }
    }), this.audioTap = await v0(
      t,
      n,
      (a) => this.onPcm(a)
    ), this.baseAudioTime = t.currentTime, this.nextBoundaryUs = 0;
    const i = Math.round(1e6 / this.opts.fps), o = () => {
      if (this.stopped || this.failed || !this.videoEncoder) return;
      const a = Math.round((t.currentTime - this.baseAudioTime) * 1e6);
      if (a <= this.lastVideoTsUs) return;
      if (this.videoEncoder.encodeQueueSize > _0) {
        this.counters.framesDropped += 1;
        return;
      }
      const c = a >= this.nextBoundaryUs;
      c && (this.nextBoundaryUs = a + this.opts.chunkMs * 1e3);
      const l = new VideoFrame(e, { timestamp: a, duration: i });
      this.lastVideoTsUs = a, this.counters.framesCaptured += 1;
      try {
        this.videoEncoder.encode(l, { keyFrame: c });
      } finally {
        l.close();
      }
    };
    this.captureTimer = Jl(o, 1e3 / this.opts.fps), Fa.info("capture timer started", { timer: this.captureTimer.mode, fps: this.opts.fps }), o();
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
      const i = {
        codec: this.opts.codecs.audioCodec,
        sampleRate: this.opts.audioContext.sampleRate,
        numberOfChannels: this.audioChannels,
        bitrate: this.opts.audioBitrate
      };
      this.opts.codecs.muxAudioCodec === "aac" && (i.aac = { format: "aac" }), this.audioEncoder.configure(i);
    }
    const t = this.opts.audioContext.sampleRate, n = Math.round(this.audioSamplesSent / t * 1e6);
    this.audioSamplesSent += e.numberOfFrames;
    const r = new AudioData({
      format: "f32-planar",
      sampleRate: t,
      numberOfFrames: e.numberOfFrames,
      numberOfChannels: e.numberOfChannels,
      timestamp: n,
      data: e.planar
    });
    try {
      this.audioEncoder.encode(r);
    } finally {
      r.close();
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
      const r = [];
      for (; this.audioQueue.length > 0 && this.audioQueue[0].timestamp < t; )
        r.push(this.audioQueue.shift());
      if (r.length === 0 && this.lastAudioPacket === null && this.audioEncoder !== null) {
        La.allow() && Fa.warn("dropping leading chunk: audio has not started yet", {
          drops: La.count()
        });
        continue;
      }
      const i = this.seq++;
      this.muxSerial = this.muxSerial.then(() => this.muxGroup(i, e, r)).catch((o) => this.fail(o));
    }
  }
  async muxGroup(e, t, n) {
    if (this.failed) return;
    const r = t.endTsUs, i = new p0({
      format: new Xl({ fastStart: "fragmented", minimumFragmentDuration: 3600 }),
      target: new Rn()
    }), o = new a0("avc");
    i.addVideoTrack(o);
    const a = n.length === 0 ? this.lastAudioPacket : null;
    let c = null;
    if ((n.length > 0 || a) && (c = new c0(this.opts.codecs.muxAudioCodec), i.addAudioTrack(c)), await i.start(), !this.videoDecoderConfig)
      throw new Error("Video decoder config missing before first chunk");
    for (let u = 0; u < t.video.length; u++)
      await o.add(
        Pt.fromEncodedChunk(t.video[u]),
        u === 0 ? { decoderConfig: this.videoDecoderConfig } : void 0
      );
    if (c) {
      let u = this.audioDecoderConfig ?? {
        codec: this.opts.codecs.audioCodec,
        sampleRate: this.opts.audioContext.sampleRate,
        numberOfChannels: this.audioChannels
      };
      if (this.opts.codecs.muxAudioCodec === "aac" && (u = {
        ...u,
        description: k0(
          this.opts.audioContext.sampleRate,
          this.audioChannels
        )
      }), a) {
        for (let h = t.startTsUs, f = !0; h < r; h += a.durUs)
          await c.add(
            new Pt(a.data, "key", h / 1e6, a.durUs / 1e6),
            f ? { decoderConfig: u } : void 0
          ), f = !1;
        this.counters.audioPaddedChunks += 1;
      } else {
        for (let m = 0; m < n.length; m++)
          await c.add(
            Pt.fromEncodedChunk(n[m]),
            m === 0 ? { decoderConfig: u } : void 0
          );
        const h = n[n.length - 1], f = new Uint8Array(h.byteLength);
        h.copyTo(f);
        const g = this.opts.codecs.muxAudioCodec === "aac" ? Math.round(1024e6 / this.opts.audioContext.sampleRate) : 2e4;
        this.lastAudioPacket = { data: f, durUs: h.duration || g };
      }
    }
    await i.finalize();
    const l = i.target.buffer;
    if (!l)
      throw new Error(`Muxer produced no output for chunk ${e}`);
    const d = {
      seq: e,
      tsUs: t.startTsUs,
      durUs: r - t.startTsUs,
      payload: T0(new Uint8Array(l))
    };
    this.counters.chunksEmitted += 1, this.counters.lastChunkBytes = d.payload.byteLength, this.cadence.observe(Date.now()), this.opts.onChunk(d);
  }
}
const A0 = {}, Ua = Q("ice");
function ed(s) {
  const e = A0 ?? {};
  return {
    VITE_TURN_ISSUER_URL: e.VITE_TURN_ISSUER_URL ?? "",
    VITE_TURN_URL: e.VITE_TURN_URL ?? "",
    VITE_TURN_USER: e.VITE_TURN_USER ?? "",
    VITE_TURN_PASS: e.VITE_TURN_PASS ?? "",
    VITE_DISABLE_STUN: e.VITE_DISABLE_STUN ?? "",
    VITE_DISABLE_TURN: e.VITE_DISABLE_TURN ?? ""
  };
}
const M0 = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" }
], B0 = 5e3, I0 = 10 * 6e4, R0 = 6e4;
let _s = null, $s = null, Da = 0;
function O0(s, e) {
  if (!s || typeof s != "object") return null;
  const { iceServers: t, ttl: n } = s;
  if (!Array.isArray(t) || typeof n != "number" || n <= 0) return null;
  const r = t.filter(
    (i) => !!i && typeof i == "object" && typeof i.username == "string" && typeof i.credential == "string" && [i.urls].flat().some((o) => typeof o == "string" && /^turns?:/.test(o))
  );
  return r.length === 0 ? null : { servers: r, expiresAt: e + n * 1e3 };
}
function P0(s) {
  return s.VITE_DISABLE_TURN !== "1" && !s.VITE_TURN_URL && !!s.VITE_TURN_ISSUER_URL;
}
function Na(s) {
  const e = ed();
  if (!P0(e)) return Promise.resolve();
  const t = Date.now();
  return _s && t < _s.expiresAt - I0 ? Promise.resolve() : $s || (t - Da < R0 ? Promise.resolve() : ($s = (async () => {
    try {
      const n = await fetch(e.VITE_TURN_ISSUER_URL, {
        signal: AbortSignal.timeout(B0),
        cache: "no-store"
      });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const r = O0(await n.json(), Date.now());
      if (!r) throw new Error("bad response shape");
      _s = r, Ua.info("turn credentials issued", {
        servers: r.servers.length,
        expiresInS: Math.round((r.expiresAt - Date.now()) / 1e3)
      });
    } catch (n) {
      Da = Date.now(), Ua.warn("turn issuer failed, using STUN only", {
        url: e.VITE_TURN_ISSUER_URL,
        error: n instanceof Error ? n.message : String(n)
      });
    } finally {
      $s = null;
    }
  })(), $s));
}
const F0 = "spotlight.iceRelayOnly";
function L0() {
  try {
    return localStorage.getItem(F0) === "1";
  } catch {
    return !1;
  }
}
function U0(s) {
  const {
    VITE_TURN_ISSUER_URL: e,
    VITE_TURN_URL: t,
    VITE_TURN_USER: n,
    VITE_TURN_PASS: r,
    VITE_DISABLE_STUN: i,
    VITE_DISABLE_TURN: o
  } = ed(), a = i === "1" ? [] : [...M0], c = [t, n, r].filter(Boolean).length;
  if (c > 0 && c < 3)
    throw new Error(
      "Incomplete TURN config: set VITE_TURN_URL, VITE_TURN_USER, and VITE_TURN_PASS together."
    );
  return o === "1" || (t && n && r ? a.push({
    urls: t,
    username: n,
    credential: r
  }) : e && _s && Date.now() < _s.expiresAt ? (a.push(..._s.servers), Na()) : e && Na()), a;
}
const D0 = /* @__PURE__ */ Uint32Array.from([
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
]), _t = /* @__PURE__ */ new Uint32Array(64);
class N0 extends Nc {
  constructor(e) {
    super(64, e, 8, !1);
  }
  get() {
    const { A: e, B: t, C: n, D: r, E: i, F: o, G: a, H: c } = this;
    return [e, t, n, r, i, o, a, c];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, c) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, t) {
    for (let u = 0; u < 16; u++, t += 4)
      _t[u] = e.getUint32(t, !1);
    for (let u = 16; u < 64; u++) {
      const h = _t[u - 15], f = _t[u - 2], g = qe(h, 7) ^ qe(h, 18) ^ h >>> 3, m = qe(f, 17) ^ qe(f, 19) ^ f >>> 10;
      _t[u] = m + _t[u - 7] + g + _t[u - 16] | 0;
    }
    let { A: n, B: r, C: i, D: o, E: a, F: c, G: l, H: d } = this;
    for (let u = 0; u < 64; u++) {
      const h = qe(a, 6) ^ qe(a, 11) ^ qe(a, 25), f = d + h + Uu(a, c, l) + D0[u] + _t[u] | 0, m = (qe(n, 2) ^ qe(n, 13) ^ qe(n, 22)) + Du(n, r, i) | 0;
      d = l, l = c, c = a, a = o + f | 0, o = i, i = r, r = n, n = f + m | 0;
    }
    n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, l = l + this.G | 0, d = d + this.H | 0, this.set(n, r, i, o, a, c, l, d);
  }
  roundClean() {
    tt(_t);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), tt(this.buffer);
  }
}
class $0 extends N0 {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  A = yt[0] | 0;
  B = yt[1] | 0;
  C = yt[2] | 0;
  D = yt[3] | 0;
  E = yt[4] | 0;
  F = yt[5] | 0;
  G = yt[6] | 0;
  H = yt[7] | 0;
  constructor() {
    super(32);
  }
}
const td = Nu([
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
].map((s) => BigInt(s))), V0 = td[0], H0 = td[1], xt = /* @__PURE__ */ new Uint32Array(80), kt = /* @__PURE__ */ new Uint32Array(80);
class z0 extends Nc {
  constructor(e) {
    super(128, e, 16, !1);
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: n, Bl: r, Ch: i, Cl: o, Dh: a, Dl: c, Eh: l, El: d, Fh: u, Fl: h, Gh: f, Gl: g, Hh: m, Hl: p } = this;
    return [e, t, n, r, i, o, a, c, l, d, u, h, f, g, m, p];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, c, l, d, u, h, f, g, m, p) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = r | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = l | 0, this.El = d | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = f | 0, this.Gl = g | 0, this.Hh = m | 0, this.Hl = p | 0;
  }
  process(e, t) {
    for (let k = 0; k < 16; k++, t += 4)
      xt[k] = e.getUint32(t), kt[k] = e.getUint32(t += 4);
    for (let k = 16; k < 80; k++) {
      const U = xt[k - 15] | 0, q = kt[k - 15] | 0, G = At(U, q, 1) ^ At(U, q, 8) ^ Po(U, q, 7), L = Mt(U, q, 1) ^ Mt(U, q, 8) ^ Fo(U, q, 7), j = xt[k - 2] | 0, V = kt[k - 2] | 0, te = At(j, V, 19) ^ zs(j, V, 61) ^ Po(j, V, 6), K = Mt(j, V, 19) ^ js(j, V, 61) ^ Fo(j, V, 6), _ = Hu(L, K, kt[k - 7], kt[k - 16]), I = zu(_, G, te, xt[k - 7], xt[k - 16]);
      xt[k] = I | 0, kt[k] = _ | 0;
    }
    let { Ah: n, Al: r, Bh: i, Bl: o, Ch: a, Cl: c, Dh: l, Dl: d, Eh: u, El: h, Fh: f, Fl: g, Gh: m, Gl: p, Hh: b, Hl: y } = this;
    for (let k = 0; k < 80; k++) {
      const U = At(u, h, 14) ^ At(u, h, 18) ^ zs(u, h, 41), q = Mt(u, h, 14) ^ Mt(u, h, 18) ^ js(u, h, 41), G = u & f ^ ~u & m, L = h & g ^ ~h & p, j = ju(y, q, L, H0[k], kt[k]), V = qu(j, b, U, G, V0[k], xt[k]), te = j | 0, K = At(n, r, 28) ^ zs(n, r, 34) ^ zs(n, r, 39), _ = Mt(n, r, 28) ^ js(n, r, 34) ^ js(n, r, 39), I = n & i ^ n & a ^ i & a, A = r & o ^ r & c ^ o & c;
      b = m | 0, y = p | 0, m = f | 0, p = g | 0, f = u | 0, g = h | 0, { h: u, l: h } = $e(l | 0, d | 0, V | 0, te | 0), l = a | 0, d = c | 0, a = i | 0, c = o | 0, i = n | 0, o = r | 0;
      const P = qi(te, _, A);
      n = Wi(P, V, K, I), r = P | 0;
    }
    ({ h: n, l: r } = $e(this.Ah | 0, this.Al | 0, n | 0, r | 0)), { h: i, l: o } = $e(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = $e(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: l, l: d } = $e(this.Dh | 0, this.Dl | 0, l | 0, d | 0), { h: u, l: h } = $e(this.Eh | 0, this.El | 0, u | 0, h | 0), { h: f, l: g } = $e(this.Fh | 0, this.Fl | 0, f | 0, g | 0), { h: m, l: p } = $e(this.Gh | 0, this.Gl | 0, m | 0, p | 0), { h: b, l: y } = $e(this.Hh | 0, this.Hl | 0, b | 0, y | 0), this.set(n, r, i, o, a, c, l, d, u, h, f, g, m, p, b, y);
  }
  roundClean() {
    tt(xt, kt);
  }
  destroy() {
    this.destroyed = !0, tt(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class j0 extends z0 {
  Ah = Ee[0] | 0;
  Al = Ee[1] | 0;
  Bh = Ee[2] | 0;
  Bl = Ee[3] | 0;
  Ch = Ee[4] | 0;
  Cl = Ee[5] | 0;
  Dh = Ee[6] | 0;
  Dl = Ee[7] | 0;
  Eh = Ee[8] | 0;
  El = Ee[9] | 0;
  Fh = Ee[10] | 0;
  Fl = Ee[11] | 0;
  Gh = Ee[12] | 0;
  Gl = Ee[13] | 0;
  Hh = Ee[14] | 0;
  Hl = Ee[15] | 0;
  constructor() {
    super(64);
  }
}
const q0 = /* @__PURE__ */ ji(
  () => new $0(),
  /* @__PURE__ */ Dc(1)
), W0 = /* @__PURE__ */ ji(
  () => new j0(),
  /* @__PURE__ */ Dc(3)
);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Se = (s, e, t) => Ce(s, e, t), sd = mt, nd = He, $a = (...s) => Pu(...s), G0 = (s) => Ie(s), Z0 = Pc, rd = (s) => Fu(s), tr = /* @__PURE__ */ BigInt(0), Ti = /* @__PURE__ */ BigInt(1);
function sr(s, e = "") {
  if (typeof s != "boolean") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected boolean, got type=" + typeof s);
  }
  return s;
}
function K0(s) {
  if (typeof s == "bigint") {
    if (!On(s))
      throw new RangeError("positive bigint expected, got " + s);
  } else
    sd(s);
  return s;
}
function Ci(s, e = "") {
  if (typeof s != "number") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected number, got type=" + typeof s);
  }
  if (!Number.isSafeInteger(s)) {
    const t = e && `"${e}" `;
    throw new RangeError(t + "expected safe integer, got " + s);
  }
}
function id(s) {
  if (typeof s != "string")
    throw new TypeError("hex string expected, got " + typeof s);
  return s === "" ? tr : BigInt("0x" + s);
}
function X0(s) {
  return id(He(s));
}
function ns(s) {
  return id(He(on(Ce(s)).reverse()));
}
function od(s, e) {
  if (mt(e), e === 0)
    throw new RangeError("zero length");
  s = K0(s);
  const t = s.toString(16);
  if (t.length > e * 2)
    throw new RangeError("number too large");
  return Ie(t.padStart(e * 2, "0"));
}
function ad(s, e) {
  return od(s, e).reverse();
}
function Y0(s, e) {
  if (s = Se(s), e = Se(e), s.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < s.length; n++)
    t |= s[n] ^ e[n];
  return t === 0;
}
function on(s) {
  return Uint8Array.from(Se(s));
}
const On = (s) => typeof s == "bigint" && tr <= s;
function Q0(s, e, t) {
  return On(s) && On(e) && On(t) && e <= s && s < t;
}
function nr(s, e, t, n) {
  if (!Q0(e, t, n))
    throw new RangeError("expected valid " + s + ": " + t + " <= n < " + n + ", got " + e);
}
function J0(s) {
  if (s < tr)
    throw new Error("expected non-negative bigint, got " + s);
  let e;
  for (e = 0; s > tr; s >>= Ti, e += 1)
    ;
  return e;
}
const ew = (s) => (Ti << BigInt(s)) - Ti;
function mr(s, e = {}, t = {}) {
  if (Object.prototype.toString.call(s) !== "[object Object]")
    throw new TypeError("expected valid options object");
  function n(i, o, a) {
    if (!a && o !== "function" && !Object.hasOwn(s, i))
      throw new TypeError(`param "${i}" is invalid: expected own property`);
    const c = s[i];
    if (a && c === void 0)
      return;
    const l = typeof c;
    if (l !== o || c === null)
      throw new TypeError(`param "${i}" is invalid: expected ${o}, got ${l}`);
  }
  const r = (i, o) => Object.entries(i).forEach(([a, c]) => n(a, c, o));
  r(e, !1), r(t, !0);
}
const Va = () => {
  throw new Error("not implemented");
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Te = /* @__PURE__ */ BigInt(0), ke = /* @__PURE__ */ BigInt(1), Gt = /* @__PURE__ */ BigInt(2), cd = /* @__PURE__ */ BigInt(3), ld = /* @__PURE__ */ BigInt(4), dd = /* @__PURE__ */ BigInt(5), tw = /* @__PURE__ */ BigInt(7), ud = /* @__PURE__ */ BigInt(8), sw = /* @__PURE__ */ BigInt(9), hd = /* @__PURE__ */ BigInt(16);
function fe(s, e) {
  if (e <= Te)
    throw new Error("mod: expected positive modulus, got " + e);
  const t = s % e;
  return t >= Te ? t : e + t;
}
function Ne(s, e, t) {
  if (e < Te)
    throw new Error("pow2: expected non-negative exponent, got " + e);
  let n = s;
  for (; e-- > Te; )
    n *= n, n %= t;
  return n;
}
function Ha(s, e) {
  if (s === Te)
    throw new Error("invert: expected non-zero number");
  if (e <= Te)
    throw new Error("invert: expected positive modulus, got " + e);
  let t = fe(s, e), n = e, r = Te, i = ke;
  for (; t !== Te; ) {
    const a = n / t, c = n - t * a, l = r - i * a;
    n = t, t = c, r = i, i = l;
  }
  if (n !== ke)
    throw new Error("invert: does not exist");
  return fe(r, e);
}
function yo(s, e, t) {
  const n = s;
  if (!n.eql(n.sqr(e), t))
    throw new Error("Cannot find square root");
}
function fd(s, e) {
  const t = s, n = (t.ORDER + ke) / ld, r = t.pow(e, n);
  return yo(t, r, e), r;
}
function nw(s, e) {
  const t = s, n = (t.ORDER - dd) / ud, r = t.mul(e, Gt), i = t.pow(r, n), o = t.mul(e, i), a = t.mul(t.mul(o, Gt), i), c = t.mul(o, t.sub(a, t.ONE));
  return yo(t, c, e), c;
}
function rw(s) {
  const e = wo(s), t = pd(s), n = t(e, e.neg(e.ONE)), r = t(e, n), i = t(e, e.neg(n)), o = (s + tw) / hd;
  return ((a, c) => {
    const l = a;
    let d = l.pow(c, o), u = l.mul(d, n);
    const h = l.mul(d, r), f = l.mul(d, i), g = l.eql(l.sqr(u), c), m = l.eql(l.sqr(h), c);
    d = l.cmov(d, u, g), u = l.cmov(f, h, m);
    const p = l.eql(l.sqr(u), c), b = l.cmov(d, u, p);
    return yo(l, b, c), b;
  });
}
function pd(s) {
  if (s < cd)
    throw new Error("sqrt is not defined for small field");
  let e = s - ke, t = 0;
  for (; e % Gt === Te; )
    e /= Gt, t++;
  let n = Gt;
  const r = wo(s);
  for (; za(r, n) === 1; )
    if (n++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (t === 1)
    return fd;
  let i = r.pow(n, e);
  const o = (e + ke) / Gt;
  return function(c, l) {
    const d = c;
    if (d.is0(l))
      return l;
    if (za(d, l) !== 1)
      throw new Error("Cannot find square root");
    let u = t, h = d.mul(d.ONE, i), f = d.pow(l, e), g = d.pow(l, o);
    for (; !d.eql(f, d.ONE); ) {
      if (d.is0(f))
        return d.ZERO;
      let m = 1, p = d.sqr(f);
      for (; !d.eql(p, d.ONE); )
        if (m++, p = d.sqr(p), m === u)
          throw new Error("Cannot find square root");
      const b = ke << BigInt(u - m - 1), y = d.pow(h, b);
      u = m, h = d.sqr(y), f = d.mul(f, h), g = d.mul(g, y);
    }
    return g;
  };
}
function iw(s) {
  return s % ld === cd ? fd : s % ud === dd ? nw : s % hd === sw ? rw(s) : pd(s);
}
const zt = (s, e) => (fe(s, e) & ke) === ke, ow = [
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
function aw(s) {
  const e = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, t = ow.reduce((n, r) => (n[r] = "function", n), e);
  if (mr(s, t), Ci(s.BYTES, "BYTES"), Ci(s.BITS, "BITS"), s.BYTES < 1 || s.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (s.ORDER <= ke)
    throw new Error("invalid field: expected ORDER > 1, got " + s.ORDER);
  return s;
}
function cw(s, e, t) {
  const n = s;
  if (t < Te)
    throw new Error("invalid exponent, negatives unsupported");
  if (t === Te)
    return n.ONE;
  if (t === ke)
    return e;
  let r = n.ONE, i = e;
  for (; t > Te; )
    t & ke && (r = n.mul(r, i)), i = n.sqr(i), t >>= ke;
  return r;
}
function md(s, e, t = !1) {
  const n = s, r = new Array(e.length).fill(t ? n.ZERO : void 0), i = e.reduce((a, c, l) => n.is0(c) ? a : (r[l] = a, n.mul(a, c)), n.ONE), o = n.inv(i);
  return e.reduceRight((a, c, l) => n.is0(c) ? a : (r[l] = n.mul(a, r[l]), n.mul(a, c)), o), r;
}
function za(s, e) {
  const t = s, n = (t.ORDER - ke) / Gt, r = t.pow(e, n), i = t.eql(r, t.ONE), o = t.eql(r, t.ZERO), a = t.eql(r, t.neg(t.ONE));
  if (!i && !o && !a)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function lw(s, e) {
  if (e !== void 0 && sd(e), s <= Te)
    throw new Error("invalid n length: expected positive n, got " + s);
  if (e !== void 0 && e < 1)
    throw new Error("invalid n length: expected positive bit length, got " + e);
  const t = J0(s);
  if (e !== void 0 && e < t)
    throw new Error(`invalid n length: expected bit length (${t}) >= n.length (${e})`);
  const n = e !== void 0 ? e : t, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
const ja = /* @__PURE__ */ new WeakMap();
class gd {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = Te;
  ONE = ke;
  _lengths;
  _mod;
  constructor(e, t = {}) {
    if (e <= ke)
      throw new Error("invalid field: expected ORDER > 1, got " + e);
    let n;
    this.isLE = !1, t != null && typeof t == "object" && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: t.sqrt, enumerable: !0 }), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
    const { nBitLength: r, nByteLength: i } = lw(e, n);
    if (i > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = e, this.BITS = r, this.BYTES = i, Object.freeze(this);
  }
  create(e) {
    return fe(e, this.ORDER);
  }
  isValid(e) {
    if (typeof e != "bigint")
      throw new TypeError("invalid field element: expected bigint, got " + typeof e);
    return Te <= e && e < this.ORDER;
  }
  is0(e) {
    return e === Te;
  }
  // is valid and invertible
  isValidNot0(e) {
    return !this.is0(e) && this.isValid(e);
  }
  isOdd(e) {
    return (e & ke) === ke;
  }
  neg(e) {
    return fe(-e, this.ORDER);
  }
  eql(e, t) {
    return e === t;
  }
  sqr(e) {
    return fe(e * e, this.ORDER);
  }
  add(e, t) {
    return fe(e + t, this.ORDER);
  }
  sub(e, t) {
    return fe(e - t, this.ORDER);
  }
  mul(e, t) {
    return fe(e * t, this.ORDER);
  }
  pow(e, t) {
    return cw(this, e, t);
  }
  div(e, t) {
    return fe(e * Ha(t, this.ORDER), this.ORDER);
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
    return Ha(e, this.ORDER);
  }
  sqrt(e) {
    let t = ja.get(this);
    return t || ja.set(this, t = iw(this.ORDER)), t(this, e);
  }
  toBytes(e) {
    return this.isLE ? ad(e, this.BYTES) : od(e, this.BYTES);
  }
  fromBytes(e, t = !1) {
    Se(e);
    const { _lengths: n, BYTES: r, isLE: i, ORDER: o, _mod: a } = this;
    if (n) {
      if (e.length < 1 || !n.includes(e.length) || e.length > r)
        throw new Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
      const l = new Uint8Array(r);
      l.set(e, i ? 0 : l.length - e.length), e = l;
    }
    if (e.length !== r)
      throw new Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
    let c = i ? ns(e) : X0(e);
    if (a && (c = fe(c, o)), !t && !this.isValid(c))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return c;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(e) {
    return md(this, e);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(e, t, n) {
    return sr(n, "condition"), n ? t : e;
  }
}
Object.freeze(gd.prototype);
function wo(s, e = {}) {
  return new gd(s, e);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const rr = /* @__PURE__ */ BigInt(0), Ai = /* @__PURE__ */ BigInt(1);
function qa(s, e) {
  const t = e.negate();
  return s ? t : e;
}
function Hr(s, e) {
  const t = md(s.Fp, e.map((n) => n.Z));
  return e.map((n, r) => s.fromAffine(n.toAffine(t[r])));
}
function yd(s, e) {
  if (!Number.isSafeInteger(s) || s <= 0 || s > e)
    throw new Error("invalid window size, expected [1.." + e + "], got W=" + s);
}
function zr(s, e) {
  yd(s, e);
  const t = Math.ceil(e / s) + 1, n = 2 ** (s - 1), r = 2 ** s, i = ew(s), o = BigInt(s);
  return { windows: t, windowSize: n, mask: i, maxNumber: r, shiftBy: o };
}
function Wa(s, e, t) {
  const { windowSize: n, mask: r, maxNumber: i, shiftBy: o } = t;
  let a = Number(s & r), c = s >> o;
  a > n && (a -= i, c += Ai);
  const l = e * n, d = l + Math.abs(a) - 1, u = a === 0, h = a < 0, f = e % 2 !== 0;
  return { nextN: c, offset: d, isZero: u, isNeg: h, isNegF: f, offsetF: l };
}
const jr = /* @__PURE__ */ new WeakMap(), wd = /* @__PURE__ */ new WeakMap();
function qr(s) {
  return wd.get(s) || 1;
}
function Ga(s) {
  if (s !== rr)
    throw new Error("invalid wNAF");
}
class dw {
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
    let r = e;
    for (; t > rr; )
      t & Ai && (n = n.add(r)), r = r.double(), t >>= Ai;
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
    const { windows: n, windowSize: r } = zr(t, this.bits), i = [];
    let o = e, a = o;
    for (let c = 0; c < n; c++) {
      a = o, i.push(a);
      for (let l = 1; l < r; l++)
        a = a.add(o), i.push(a);
      o = a.double();
    }
    return i;
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
    let r = this.ZERO, i = this.BASE;
    const o = zr(e, this.bits);
    for (let a = 0; a < o.windows; a++) {
      const { nextN: c, offset: l, isZero: d, isNeg: u, isNegF: h, offsetF: f } = Wa(n, a, o);
      n = c, d ? i = i.add(qa(h, t[f])) : r = r.add(qa(u, t[l]));
    }
    return Ga(n), { p: r, f: i };
  }
  /**
   * Implements unsafe EC multiplication using precomputed tables
   * and w-ary non-adjacent form.
   * @param acc - accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(e, t, n, r = this.ZERO) {
    const i = zr(e, this.bits);
    for (let o = 0; o < i.windows && n !== rr; o++) {
      const { nextN: a, offset: c, isZero: l, isNeg: d } = Wa(n, o, i);
      if (n = a, !l) {
        const u = t[c];
        r = r.add(d ? u.negate() : u);
      }
    }
    return Ga(n), r;
  }
  getPrecomputes(e, t, n) {
    let r = jr.get(t);
    return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), jr.set(t, r))), r;
  }
  cached(e, t, n) {
    const r = qr(e);
    return this.wNAF(r, this.getPrecomputes(r, e, n), t);
  }
  unsafe(e, t, n, r) {
    const i = qr(e);
    return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(e, t) {
    yd(t, this.bits), wd.set(e, t), jr.delete(e);
  }
  hasCache(e) {
    return qr(e) !== 1;
  }
}
function Za(s, e, t) {
  if (e) {
    if (e.ORDER !== s)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return aw(e), e;
  } else
    return wo(s, { isLE: t });
}
function uw(s, e, t = {}, n) {
  if (n === void 0 && (n = s === "edwards"), !e || typeof e != "object")
    throw new Error(`expected valid ${s} CURVE object`);
  for (const c of ["p", "n", "h"]) {
    const l = e[c];
    if (!(typeof l == "bigint" && l > rr))
      throw new Error(`CURVE.${c} must be positive bigint`);
  }
  const r = Za(e.p, t.Fp, n), i = Za(e.n, t.Fn, n), a = ["Gx", "Gy", "a", "d"];
  for (const c of a)
    if (!r.isValid(e[c]))
      throw new Error(`CURVE.${c} must be valid field element of CURVE.Fp`);
  return e = Object.freeze(Object.assign({}, e)), { CURVE: e, Fp: r, Fn: i };
}
function bd(s, e) {
  return function(n) {
    const r = s(n);
    return { secretKey: r, publicKey: e(r) };
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Et = /* @__PURE__ */ BigInt(0), be = /* @__PURE__ */ BigInt(1), Wr = /* @__PURE__ */ BigInt(2), hw = /* @__PURE__ */ BigInt(8);
function fw(s, e, t, n) {
  const r = s.sqr(t), i = s.sqr(n), o = s.add(s.mul(e.a, r), i), a = s.add(s.ONE, s.mul(e.d, s.mul(r, i)));
  return s.eql(o, a);
}
function pw(s, e = {}) {
  const t = e, n = uw("edwards", s, t, t.FpFnLE), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: a } = o;
  mr(t, {}, { uvRatio: "function" });
  const c = Wr << BigInt(i.BYTES * 8) - be, l = (m) => r.create(m), d = t.uvRatio === void 0 ? (m, p) => {
    try {
      return { isValid: !0, value: r.sqrt(r.div(m, p)) };
    } catch {
      return { isValid: !1, value: Et };
    }
  } : t.uvRatio;
  if (!fw(r, o, o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  function u(m, p, b = !1) {
    const y = b ? be : Et;
    return nr("coordinate " + m, p, y, c), p;
  }
  function h(m) {
    if (!(m instanceof f))
      throw new Error("EdwardsPoint expected");
  }
  class f {
    // base / generator point
    static BASE = new f(o.Gx, o.Gy, be, l(o.Gx * o.Gy));
    // zero / infinity / identity point
    static ZERO = new f(Et, be, be, Et);
    // 0, 1, 1, 0
    // math field
    static Fp = r;
    // scalar field
    static Fn = i;
    X;
    Y;
    Z;
    T;
    constructor(p, b, y, k) {
      this.X = u("x", p), this.Y = u("y", b), this.Z = u("z", y, !0), this.T = u("t", k), Object.freeze(this);
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
      const { x: b, y } = p || {};
      return u("x", b), u("y", y), new f(b, y, be, l(b * y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(p, b = !1) {
      const y = r.BYTES, { a: k, d: U } = o;
      p = on(Se(p, y, "point")), sr(b, "zip215");
      const q = on(p), G = p[y - 1];
      q[y - 1] = G & -129;
      const L = ns(q), j = b ? c : r.ORDER;
      nr("point.y", L, Et, j);
      const V = l(L * L), te = l(V - be), K = l(U * V - k);
      let { isValid: _, value: I } = d(te, K);
      if (!_)
        throw new Error("bad point: invalid y coordinate");
      const A = (I & be) === be, P = (G & 128) !== 0;
      if (!b && I === Et && P)
        throw new Error("bad point: x=0 and x_0=1");
      return P !== A && (I = l(-I)), f.fromAffine({ x: I, y: L });
    }
    static fromHex(p, b = !1) {
      return f.fromBytes(G0(p), b);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(p = 8, b = !0) {
      return g.createCache(this, p), b || this.multiply(Wr), this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this, { a: b, d: y } = o;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X: k, Y: U, Z: q, T: G } = p, L = l(k * k), j = l(U * U), V = l(q * q), te = l(V * V), K = l(L * b), _ = l(V * l(K + j)), I = l(te + l(y * l(L * j)));
      if (_ !== I)
        throw new Error("bad point: equation left != right (1)");
      const A = l(k * U), P = l(q * G);
      if (A !== P)
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(p) {
      h(p);
      const { X: b, Y: y, Z: k } = this, { X: U, Y: q, Z: G } = p, L = l(b * G), j = l(U * k), V = l(y * G), te = l(q * k);
      return L === j && V === te;
    }
    is0() {
      return this.equals(f.ZERO);
    }
    negate() {
      return new f(l(-this.X), this.Y, this.Z, l(-this.T));
    }
    // Fast algo for doubling Extended Point.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
    // Cost: 4M + 4S + 1*a + 6add + 1*2.
    double() {
      const { a: p } = o, { X: b, Y: y, Z: k } = this, U = l(b * b), q = l(y * y), G = l(Wr * l(k * k)), L = l(p * U), j = b + y, V = l(l(j * j) - U - q), te = L + q, K = te - G, _ = L - q, I = l(V * K), A = l(te * _), P = l(V * _), M = l(K * te);
      return new f(I, A, M, P);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(p) {
      h(p);
      const { a: b, d: y } = o, { X: k, Y: U, Z: q, T: G } = this, { X: L, Y: j, Z: V, T: te } = p, K = l(k * L), _ = l(U * j), I = l(G * y * te), A = l(q * V), P = l((k + U) * (L + j) - K - _), M = A - I, W = A + I, ee = l(_ - b * K), le = l(P * M), xe = l(W * ee), Me = l(P * ee), Be = l(M * W);
      return new f(le, xe, Be, Me);
    }
    subtract(p) {
      return h(p), this.add(p.negate());
    }
    // Constant-time multiplication.
    multiply(p) {
      if (!i.isValidNot0(p))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p: b, f: y } = g.cached(this, p, (k) => Hr(f, k));
      return Hr(f, [b, y])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(p) {
      if (!i.isValid(p))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      return p === Et ? f.ZERO : this.is0() || p === be ? this : g.unsafe(this, p, (b) => Hr(f, b));
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
      return g.unsafe(this, o.n).is0();
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    toAffine(p) {
      const b = this;
      let y = p;
      const { X: k, Y: U, Z: q } = b, G = b.is0();
      y == null && (y = G ? hw : r.inv(q));
      const L = l(k * y), j = l(U * y), V = r.mul(q, y);
      if (G)
        return { x: Et, y: be };
      if (V !== be)
        throw new Error("invZ was invalid");
      return { x: L, y: j };
    }
    clearCofactor() {
      return a === be ? this : this.multiplyUnsafe(a);
    }
    toBytes() {
      const { x: p, y: b } = this.toAffine(), y = r.toBytes(b);
      return y[y.length - 1] |= p & be ? 128 : 0, y;
    }
    toHex() {
      return nd(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const g = new dw(f, i.BITS);
  return i.BITS >= 8 && f.BASE.precompute(8), Object.freeze(f.prototype), Object.freeze(f), f;
}
class mw {
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
    Va();
  }
  static fromHex(e) {
    Va();
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
    return nd(this.toBytes());
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
function gw(s, e, t = {}) {
  if (typeof e != "function")
    throw new Error('"hash" function param is required');
  const n = e, r = t;
  mr(r, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    zip215: "boolean",
    mapToCurve: "function"
  });
  const { prehash: i } = r, { BASE: o, Fp: a, Fn: c } = s, l = n.outputLen, d = 2 * a.BYTES;
  if (l !== void 0 && (Ci(l, "hash.outputLen"), l !== d))
    throw new Error(`hash.outputLen must be ${d}, got ${l}`);
  const u = r.randomBytes === void 0 ? rd : r.randomBytes, h = r.adjustScalarBytes === void 0 ? (_) => _ : r.adjustScalarBytes, f = r.domain === void 0 ? (_, I, A) => {
    if (sr(A, "phflag"), I.length || A)
      throw new Error("Contexts/pre-hash are not supported");
    return _;
  } : r.domain;
  function g(_) {
    return c.create(ns(_));
  }
  function m(_) {
    const I = L.secretKey;
    Se(_, L.secretKey, "secretKey");
    const A = Se(n(_), 2 * I, "hashedSecretKey"), P = h(A.slice(0, I)), M = A.slice(I, 2 * I), W = g(P);
    return { head: P, prefix: M, scalar: W };
  }
  function p(_) {
    const { head: I, prefix: A, scalar: P } = m(_), M = o.multiply(P), W = M.toBytes();
    return { head: I, prefix: A, scalar: P, point: M, pointBytes: W };
  }
  function b(_) {
    return p(_).pointBytes;
  }
  function y(_ = Uint8Array.of(), ...I) {
    const A = $a(...I);
    return g(n(f(A, Se(_, void 0, "context"), !!i)));
  }
  function k(_, I, A = {}) {
    _ = Se(_, void 0, "message"), i && (_ = i(_));
    const { prefix: P, scalar: M, pointBytes: W } = p(I), ee = y(A.context, P, _), le = o.multiply(ee).toBytes(), xe = y(A.context, le, W, _), Me = c.create(ee + xe * M);
    if (!c.isValid(Me))
      throw new Error("sign failed: invalid s");
    const Be = $a(le, c.toBytes(Me));
    return Se(Be, L.signature, "result");
  }
  const U = {
    zip215: r.zip215
  };
  function q(_, I, A, P = U) {
    const { context: M } = P, W = P.zip215 === void 0 ? !!U.zip215 : P.zip215, ee = L.signature;
    _ = Se(_, ee, "signature"), I = Se(I, void 0, "message"), A = Se(A, L.publicKey, "publicKey"), W !== void 0 && sr(W, "zip215"), i && (I = i(I));
    const le = ee / 2, xe = _.subarray(0, le), Me = ns(_.subarray(le, ee));
    let Be, hn, os;
    try {
      Be = s.fromBytes(A, W), hn = s.fromBytes(xe, W), os = o.multiplyUnsafe(Me);
    } catch {
      return !1;
    }
    if (!W && Be.isSmallOrder())
      return !1;
    const fn = y(M, xe, A, I);
    return hn.add(Be.multiplyUnsafe(fn)).subtract(os).clearCofactor().is0();
  }
  const G = a.BYTES, L = {
    secretKey: G,
    publicKey: G,
    signature: 2 * G,
    seed: G
  };
  function j(_) {
    return _ = _ === void 0 ? u(L.seed) : _, Se(_, L.seed, "seed");
  }
  function V(_) {
    return Z0(_) && _.length === L.secretKey;
  }
  function te(_, I) {
    try {
      return !!s.fromBytes(_, I === void 0 ? U.zip215 : I);
    } catch {
      return !1;
    }
  }
  const K = {
    getExtendedPublicKey: p,
    randomSecretKey: j,
    isValidSecretKey: V,
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
    toMontgomery(_) {
      const { y: I } = s.fromBytes(_), A = L.publicKey, P = A === 32;
      if (!P && A !== 57)
        throw new Error("only defined for 25519 and 448");
      const M = P ? a.div(be + I, be - I) : a.div(I - be, I + be);
      return a.toBytes(M);
    },
    toMontgomerySecret(_) {
      const I = L.secretKey;
      Se(_, I);
      const A = n(_.subarray(0, I));
      return h(A).subarray(0, I);
    }
  };
  return Object.freeze(L), Object.freeze(K), Object.freeze({
    keygen: bd(j, b),
    getPublicKey: b,
    sign: k,
    verify: q,
    utils: K,
    Point: s,
    lengths: L
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vs = BigInt(0), ds = BigInt(1), xn = BigInt(2);
function yw(s) {
  return mr(s, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function"
  }), Object.freeze({ ...s });
}
function ww(s) {
  const e = yw(s), { P: t, type: n, adjustScalarBytes: r, powPminus2: i, randomBytes: o } = e, a = n === "x25519";
  if (!a && n !== "x448")
    throw new Error("invalid type");
  const c = o === void 0 ? rd : o, l = a ? 255 : 448, d = a ? 32 : 56, u = BigInt(a ? 9 : 5), h = BigInt(a ? 121665 : 39081), f = a ? xn ** BigInt(254) : xn ** BigInt(447), g = a ? BigInt(8) * xn ** BigInt(251) - ds : BigInt(4) * xn ** BigInt(445) - ds, m = f + g + ds, p = (A) => fe(A, t), b = y(u);
  function y(A) {
    return ad(p(A), d);
  }
  function k(A) {
    const P = on(Se(A, d, "uCoordinate"));
    return a && (P[31] &= 127), p(ns(P));
  }
  function U(A) {
    return ns(r(on(Se(A, d, "scalar"))));
  }
  function q(A, P) {
    const M = te(k(P), U(A));
    if (M === Vs)
      throw new Error("invalid private or public key received");
    return y(M);
  }
  function G(A) {
    return q(A, b);
  }
  const L = G, j = q;
  function V(A, P, M) {
    const W = p(A * (P - M));
    return P = p(P - W), M = p(M + W), { x_2: P, x_3: M };
  }
  function te(A, P) {
    nr("u", A, Vs, t), nr("scalar", P, f, m);
    const M = P, W = A;
    let ee = ds, le = Vs, xe = A, Me = ds, Be = Vs;
    for (let os = BigInt(l - 1); os >= Vs; os--) {
      const fn = M >> os & ds;
      Be ^= fn, { x_2: ee, x_3: xe } = V(Be, ee, xe), { x_2: le, x_3: Me } = V(Be, le, Me), Be = fn;
      const pn = ee + le, mn = p(pn * pn), yr = ee - le, xo = p(yr * yr), ko = mn - xo, qd = xe + Me, Wd = xe - Me, Eo = p(Wd * pn), To = p(qd * yr), Co = Eo + To, Ao = Eo - To;
      xe = p(Co * Co), Me = p(W * p(Ao * Ao)), ee = p(mn * xo), le = p(ko * (mn + p(h * ko)));
    }
    ({ x_2: ee, x_3: xe } = V(Be, ee, xe)), { x_2: le, x_3: Me } = V(Be, le, Me);
    const hn = i(le);
    return p(ee * hn);
  }
  const K = {
    secretKey: d,
    publicKey: d,
    seed: d
  }, _ = (A) => (A = A === void 0 ? c(d) : A, Se(A, K.seed, "seed"), A), I = { randomSecretKey: _ };
  return Object.freeze(K), Object.freeze(I), Object.freeze({
    keygen: bd(_, L),
    getSharedSecret: j,
    getPublicKey: L,
    scalarMult: q,
    scalarMultBase: G,
    utils: I,
    GuBytes: b.slice(),
    lengths: K
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bw = /* @__PURE__ */ BigInt(0), Ys = /* @__PURE__ */ BigInt(1), Ka = /* @__PURE__ */ BigInt(2), vw = /* @__PURE__ */ BigInt(3), Sw = /* @__PURE__ */ BigInt(5), _w = /* @__PURE__ */ BigInt(8), Is = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), vd = {
  p: Is,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: _w,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
};
function Sd(s) {
  const e = BigInt(10), t = BigInt(20), n = BigInt(40), r = BigInt(80), i = Is, a = s * s % i * s % i, c = Ne(a, Ka, i) * a % i, l = Ne(c, Ys, i) * s % i, d = Ne(l, Sw, i) * l % i, u = Ne(d, e, i) * d % i, h = Ne(u, t, i) * u % i, f = Ne(h, n, i) * h % i, g = Ne(f, r, i) * f % i, m = Ne(g, r, i) * f % i, p = Ne(m, e, i) * d % i;
  return { pow_p_5_8: Ne(p, Ka, i) * s % i, b2: a };
}
function _d(s) {
  return s[0] &= 248, s[31] &= 127, s[31] |= 64, s;
}
const Mi = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function xd(s, e) {
  const t = Is, n = fe(e * e * e, t), r = fe(n * n * e, t), i = Sd(s * r).pow_p_5_8;
  let o = fe(s * n * i, t);
  const a = fe(e * o * o, t), c = o, l = fe(o * Mi, t), d = a === s, u = a === fe(-s, t), h = a === fe(-s * Mi, t);
  return d && (o = c), (u || h) && (o = l), zt(o, t) && (o = fe(-o, t)), { isValid: d || u, value: o };
}
const Zt = /* @__PURE__ */ pw(vd, { uvRatio: xd }), jt = Zt.Fp, xw = Zt.Fn;
function kw(s) {
  return gw(Zt, W0, Object.assign({ adjustScalarBytes: _d, zip215: !0 }, s));
}
const Fs = /* @__PURE__ */ kw({}), bo = /* @__PURE__ */ (() => {
  const s = Is;
  return ww({
    P: s,
    type: "x25519",
    powPminus2: (e) => {
      const { pow_p_5_8: t, b2: n } = Sd(e);
      return fe(Ne(t, vw, s) * n, s);
    },
    adjustScalarBytes: _d
  });
})(), Xa = Mi, Ew = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), Ya = (s) => xd(Ys, s), Tw = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), Cw = (s) => jt.create(ns(s) & Tw);
class Pe extends mw {
  // Do NOT change syntax: the following gymnastics is done,
  // because typescript strips comments, which makes bundlers disable tree-shaking.
  // prettier-ignore
  static BASE = new Pe(Zt.BASE);
  // prettier-ignore
  static ZERO = new Pe(Zt.ZERO);
  // prettier-ignore
  static Fp = jt;
  // prettier-ignore
  static Fn = xw;
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
    return new Pe(Zt.fromAffine(e));
  }
  assertSame(e) {
    if (!(e instanceof Pe))
      throw new Error("RistrettoPoint expected");
  }
  init(e) {
    return new Pe(e);
  }
  static fromBytes(e) {
    Ce(e, 32);
    const { a: t, d: n } = vd, r = Is, i = (U) => jt.create(U), o = Cw(e);
    if (!Y0(jt.toBytes(o), e) || zt(o, r))
      throw new Error("invalid ristretto255 encoding 1");
    const a = i(o * o), c = i(Ys + t * a), l = i(Ys - t * a), d = i(c * c), u = i(l * l), h = i(t * n * d - u), { isValid: f, value: g } = Ya(i(h * u)), m = i(g * l), p = i(g * m * h);
    let b = i((o + o) * m);
    zt(b, r) && (b = i(-b));
    const y = i(c * p), k = i(b * y);
    if (!f || zt(k, r) || y === bw)
      throw new Error("invalid ristretto255 encoding 2");
    return new Pe(new Zt(b, y, Ys, k));
  }
  /**
   * Converts ristretto-encoded string to ristretto point.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
   * @param hex - Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
   */
  static fromHex(e) {
    return Pe.fromBytes(Ie(e));
  }
  /**
   * Encodes ristretto point to Uint8Array.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
   */
  toBytes() {
    let { X: e, Y: t, Z: n, T: r } = this.ep;
    const i = Is, o = (p) => jt.create(p), a = o(o(n + t) * o(n - t)), c = o(e * t), l = o(c * c), { value: d } = Ya(o(a * l)), u = o(d * a), h = o(d * c), f = o(u * h * r);
    let g;
    if (zt(r * f, i)) {
      let p = o(t * Xa), b = o(e * Xa);
      e = p, t = b, g = o(u * Ew);
    } else
      g = h;
    zt(e * f, i) && (t = o(-t));
    let m = o((n - t) * g);
    return zt(m, i) && (m = o(-m)), jt.toBytes(m);
  }
  /**
   * Compares two Ristretto points.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
   */
  equals(e) {
    this.assertSame(e);
    const { X: t, Y: n } = this.ep, { X: r, Y: i } = e.ep, o = (l) => jt.create(l), a = o(t * i) === o(n * r), c = o(n * i) === o(t * r);
    return a || c;
  }
  is0() {
    return this.equals(Pe.ZERO);
  }
}
Object.freeze(Pe.BASE);
Object.freeze(Pe.ZERO);
Object.freeze(Pe.prototype);
Object.freeze(Pe);
class Qa {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = !1;
  finished = !1;
  destroyed = !1;
  constructor(e, t) {
    if (Hi(e), Ce(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const n = this.blockLen, r = new Uint8Array(n);
    r.set(t.length > n ? e.create().update(t).digest() : t);
    for (let i = 0; i < r.length; i++)
      r[i] ^= 54;
    this.iHash.update(r), this.oHash = e.create();
    for (let i = 0; i < r.length; i++)
      r[i] ^= 106;
    this.oHash.update(r), tt(r);
  }
  update(e) {
    return ks(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ks(this), zi(e, this), this.finished = !0;
    const t = e.subarray(0, this.outputLen);
    this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: t, iHash: n, finished: r, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = r, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const kd = /* @__PURE__ */ (() => {
  const s = ((e, t, n) => new Qa(e, t).update(n).digest());
  return s.create = (e, t) => new Qa(e, t), s;
})();
function Aw(s, e, t) {
  return Hi(s), t === void 0 && (t = new Uint8Array(s.outputLen)), kd(s, t, e);
}
const Gr = /* @__PURE__ */ Uint8Array.of(0), Ja = /* @__PURE__ */ Uint8Array.of();
function Mw(s, e, t, n = 32) {
  Hi(s), mt(n, "length"), Ce(e, void 0, "prk");
  const r = s.outputLen;
  if (e.length < r)
    throw new Error('"prk" must be at least HashLen octets');
  if (n > 255 * r)
    throw new Error("Length must be <= 255*HashLen");
  const i = Math.ceil(n / r);
  t === void 0 ? t = Ja : Ce(t, void 0, "info");
  const o = new Uint8Array(i * r), a = kd.create(s, e), c = a._cloneInto(), l = new Uint8Array(a.outputLen);
  for (let d = 0; d < i; d++)
    Gr[0] = d + 1, c.update(d === 0 ? Ja : l).update(t).update(Gr).digestInto(l), o.set(l, r * d), a._cloneInto(c);
  return a.destroy(), c.destroy(), tt(l, Gr), o.slice(0, n);
}
const Bw = (s, e, t, n, r) => Mw(s, Aw(s, e, t), n, r), Ed = Q("swarm.seal"), kn = new TextEncoder().encode("spotlight:sdp-seal:v1"), Zr = 5e4;
function Iw() {
  const { secretKey: s, publicKey: e } = bo.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: He(e) };
}
function Td(s, e, t) {
  const n = new Uint8Array(kn.length + e.length + t.length);
  return n.set(kn, 0), n.set(e, kn.length), n.set(t, kn.length + e.length), Bw(q0, s, void 0, n, 32);
}
function Cd(s, e) {
  const t = bo.getSharedSecret(s, e);
  if (t.every((n) => n === 0)) throw new Error("low-order X25519 public key");
  return t;
}
async function Ad(s, e) {
  return crypto.subtle.importKey("raw", s, "AES-GCM", !1, [e]);
}
async function Bi(s, e) {
  const t = new TextEncoder().encode(e);
  if (t.length === 0 || t.length > Zr)
    throw Ed.error("sdp seal failed: size out of range", {
      bytes: t.length,
      max: Zr,
      to: ve(s)
    }), new Error(`sdp size ${t.length} outside (0, ${Zr}]`);
  const n = Ie(s), r = bo.keygen(), i = Td(
    Cd(r.secretKey, n),
    r.publicKey,
    n
  ), o = await Ad(i, "encrypt"), a = crypto.getRandomValues(new Uint8Array(12)), c = await crypto.subtle.encrypt({ name: "AES-GCM", iv: a }, o, t);
  return {
    epk: He(r.publicKey),
    iv: He(a),
    ct: He(new Uint8Array(c))
  };
}
async function Ii(s, e) {
  try {
    const t = Ie(e.epk), n = Td(
      Cd(s.secretKey, t),
      t,
      s.publicKey
    ), r = await Ad(n, "decrypt"), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Ie(e.iv) },
      r,
      Ie(e.ct)
    );
    return new TextDecoder().decode(i);
  } catch (t) {
    throw Ed.warn("sealed sdp did not open", {
      epk: ve(e.epk),
      self: ve(s.publicKeyHex),
      ctBytes: e.ct.length / 2,
      err: t
    }), t;
  }
}
function Ri() {
  return { host: 0, srflx: 0, prflx: 0, relay: 0, other: 0, udp: 0, tcp: 0, total: 0 };
}
function Oi(s, e, t) {
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
function Pi(s) {
  const e = Ri();
  if (!s) return e;
  const t = /^a=candidate:\S+ \d+ (\S+) \d+ \S+ \d+ typ (\S+)/gm;
  let n;
  for (; (n = t.exec(s)) !== null; )
    Oi(e, n[2], n[1]);
  return e;
}
function an(s) {
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
function Rw(s) {
  const e = [];
  for (const n of s) {
    const r = Array.isArray(n.urls) ? n.urls : [n.urls];
    for (const i of r) typeof i == "string" && e.push(i);
  }
  const t = (n) => e.filter((r) => r.startsWith(`${n}:`)).length;
  return { stun: t("stun"), turn: t("turn"), turns: t("turns"), urls: e };
}
function Ow(s) {
  const e = s;
  return {
    type: s.type ?? Pw(s.candidate, "typ"),
    protocol: s.protocol ?? null,
    address: s.address ?? null,
    port: s.port ?? null,
    relatedAddress: s.relatedAddress ?? null,
    url: e.url ?? null
  };
}
function Pw(s, e) {
  const t = s.split(" "), n = t.indexOf(e);
  return n >= 0 && n + 1 < t.length ? t[n + 1] : null;
}
function Fw(s) {
  const e = s;
  return {
    url: e.url ?? null,
    errorCode: e.errorCode ?? null,
    errorText: e.errorText ?? null,
    address: e.address ?? null,
    port: e.port ?? null
  };
}
function Lw(s, e) {
  if (s === null && e === null) return null;
  if (s === "relay" || e === "relay") return "turn";
  const t = (n) => n === "srflx" || n === "prflx";
  return t(s) || t(e) ? "stun" : "direct";
}
function Uw(s) {
  const e = /* @__PURE__ */ new Map();
  s.forEach((i) => e.set(i.id, i));
  const t = Ri(), n = Ri(), r = [];
  for (const i of e.values()) {
    const o = typeof i.candidateType == "string" ? i.candidateType : void 0, a = typeof i.protocol == "string" ? i.protocol : void 0;
    if (i.type === "local-candidate") Oi(t, o, a);
    else if (i.type === "remote-candidate") Oi(n, o, a);
    else if (i.type === "candidate-pair") {
      const c = typeof i.localCandidateId == "string" ? e.get(i.localCandidateId) : void 0, l = typeof i.remoteCandidateId == "string" ? e.get(i.remoteCandidateId) : void 0;
      r.push({
        state: typeof i.state == "string" ? i.state : "unknown",
        local: ec(c),
        remote: ec(l),
        nominated: i.nominated === !0,
        requestsSent: typeof i.requestsSent == "number" ? i.requestsSent : 0,
        responsesReceived: typeof i.responsesReceived == "number" ? i.responsesReceived : 0
      });
    }
  }
  return { local: an(t), remote: an(n), pairs: r };
}
function ec(s) {
  if (!s) return "?";
  const e = typeof s.candidateType == "string" ? s.candidateType : "?", t = typeof s.protocol == "string" ? s.protocol : "?";
  return `${e}/${t}`;
}
const ae = Q("swarm.peer"), tc = new TextEncoder(), Dw = 3, Nw = Sl / 4;
class Fi {
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
  invalidCap = ne(Dw);
  /** Result of the last `linkStats()` call that found a selected pair. */
  lastLink = null;
  openedAtMs = null;
  /** Payload bytes moved on both channels, for the `peer closed` record. */
  bytesIn = 0;
  bytesOut = 0;
  constructor(e, t) {
    this.addr = e, this.gatherTimeoutMs = t?.gatherTimeoutMs ?? Dp, this.connectTimeoutMs = t?.connectTimeoutMs ?? Np;
    const n = t?.iceServers ?? U0(), r = L0() ? "relay" : "all";
    this.pc = new RTCPeerConnection({ iceServers: n, iceTransportPolicy: r }), ae.debug("peer created", {
      peer: v(e),
      policy: r,
      ice: Rw(n)
    }), this.pc.onicecandidate = (o) => {
      o.candidate ? ae.debug("local candidate", {
        peer: v(this.addr),
        ...Ow(o.candidate)
      }) : ae.debug("local candidates complete", {
        peer: v(this.addr),
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.pc.onicecandidateerror = (o) => {
      ae.warn("ice candidate error", { peer: v(this.addr), ...Fw(o) });
    }, this.pc.onicegatheringstatechange = () => {
      ae.debug("ice gathering state", {
        peer: v(this.addr),
        state: this.pc.iceGatheringState,
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.ctrl = this.pc.createDataChannel("ctrl", { negotiated: !0, id: 0, ordered: !0 }), this.bulk = this.pc.createDataChannel("bulk", { negotiated: !0, id: 1, ordered: !1 }), this.bulk.binaryType = "arraybuffer", this.bulk.bufferedAmountLowThreshold = Nw, this.ctrl.onmessage = (o) => {
      if (typeof o.data != "string") {
        this.reportInvalid("binary-on-ctrl"), this.handlers?.onInvalidCtrl?.("binary-on-ctrl");
        return;
      }
      this.bytesIn += tc.encode(o.data).byteLength;
      const a = mm(o.data);
      a.kind === "ok" ? this.handlers?.onCtrl(a.msg) : a.kind === "invalid" && (this.reportInvalid(a.error), this.handlers?.onInvalidCtrl?.(a.error));
    }, this.bulk.onmessage = (o) => {
      const a = o.data;
      if (!(a instanceof ArrayBuffer)) {
        this.reportInvalid("non-binary-on-bulk"), this.handlers?.onInvalidSlice?.("non-binary-on-bulk");
        return;
      }
      this.bytesIn += a.byteLength;
      const c = wm(new Uint8Array(a));
      c.kind === "ok" ? this.handlers?.onSlice(c.frame) : (this.reportInvalid(c.error), this.handlers?.onInvalidSlice?.(c.error));
    }, this.bulk.onbufferedamountlow = () => this.handlers?.onBulkDrain?.();
    const i = () => {
      if (!(this.openFired || this.closed) && this.ctrl.readyState === "open" && this.bulk.readyState === "open") {
        this.openFired = !0, this.openedAtMs = Date.now(), ae.info("channels open", {
          peer: v(this.addr),
          elapsedMs: Date.now() - this.createdAtMs
        }), this.clearConnectTimer(), this.linkStats().then((o) => {
          ae.info("selected ice pair", { peer: v(this.addr), ...o });
        });
        for (const o of this.openWaiters.splice(0)) o.resolve();
        this.handlers?.onOpen?.();
      }
    };
    this.ctrl.onopen = i, this.bulk.onopen = i, this.pc.onconnectionstatechange = () => {
      const o = this.pc.connectionState;
      if (ae.info("connection state", { peer: v(this.addr), state: o }), o === "failed" || o === "closed") {
        this.closeReasonValue ??= o === "failed" ? "ice-failed" : "local", this.close();
        return;
      }
      o === "disconnected" ? this.armDisconnectTimer() : this.clearDisconnectTimer();
    }, this.pc.oniceconnectionstatechange = () => {
      const o = this.pc.iceConnectionState;
      ae.debug("ice state", { peer: v(this.addr), state: o }), (o === "failed" || o === "disconnected") && this.dumpIceStats(`ice ${o}`);
    };
  }
  /** One line per bad-frame reason on this link, then a count only. */
  reportInvalid(e) {
    this.invalidCap.allow(e) && ae.warn("bad frame dropped", {
      peer: v(this.addr),
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
    await this.pc.setLocalDescription(e), await sc(this.pc, this.gatherTimeoutMs);
    const t = this.pc.localDescription ?? e;
    return this.logLocalSdp("offer", t), t;
  }
  /** Answerer side: consume the offer, return a fully-gathered answer. */
  async acceptOffer(e) {
    if (this.closed) throw new Error(`peer ${this.addr} closed`);
    this.armConnectTimer(), this.logRemoteSdp("offer", e), await this.pc.setRemoteDescription(e);
    const t = await this.pc.createAnswer();
    await this.pc.setLocalDescription(t), await sc(this.pc, this.gatherTimeoutMs);
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
    const n = Pi(t.sdp), r = {
      peer: v(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      gatherState: this.pc.iceGatheringState,
      ...an(n)
    };
    n.total === 0 ? ae.warn("local sdp has no ice candidates", r) : n.srflx === 0 && n.relay === 0 ? ae.warn("local sdp has host candidates only", r) : ae.info("local sdp candidates", r);
  }
  /** Candidate mix the remote sent us — the other half of the picture. */
  logRemoteSdp(e, t) {
    const n = Pi(t.sdp), r = {
      peer: v(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      ...an(n)
    };
    n.total === 0 ? ae.warn("remote sdp has no ice candidates", r) : n.srflx === 0 && n.relay === 0 ? ae.warn("remote sdp has host candidates only", r) : ae.info("remote sdp candidates", r);
  }
  /** Candidate pairs and their check states at the moment a link dies. */
  async dumpIceStats(e) {
    if (this.closed) return;
    let t;
    try {
      t = await this.pc.getStats();
    } catch (r) {
      ae.debug("ice stats unavailable", { peer: v(this.addr), reason: e, err: r });
      return;
    }
    const n = Uw(t);
    ae.warn("ice pairs", {
      peer: v(this.addr),
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
      const t = pm(e);
      return this.ctrl.send(t), this.bytesOut += tc.encode(t).byteLength, !0;
    } catch {
      return !1;
    }
  }
  sendSlice(e) {
    if (this.bulk.readyState !== "open") return !1;
    try {
      const t = ym(e);
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
    let r;
    for (const u of n.values())
      if (u.type === "transport" && typeof u.selectedCandidatePairId == "string" && (r = n.get(u.selectedCandidatePairId), r))
        break;
    if (!r) {
      for (const u of n.values())
        if (u.type === "candidate-pair" && u.state === "succeeded" && (u.selected === !0 || u.nominated === !0)) {
          r = u;
          break;
        }
    }
    if (!r) return e;
    const i = typeof r.localCandidateId == "string" ? n.get(r.localCandidateId) : void 0, o = typeof r.remoteCandidateId == "string" ? n.get(r.remoteCandidateId) : void 0, a = (u) => typeof u == "string" ? u : null, c = a(i?.candidateType), l = a(o?.candidateType), d = {
      path: Lw(c, l),
      candidateType: c,
      remoteCandidateType: l,
      relayProtocol: a(i?.relayProtocol),
      relayUrl: a(i?.url),
      rttMs: typeof r.currentRoundTripTime == "number" ? Math.round(r.currentRoundTripTime * 1e3) : null
    };
    return this.lastLink = d, d;
  }
  close() {
    if (!this.closed) {
      this.closed = !0, this.closeReasonValue ??= "local", ae.info("peer closed", {
        peer: v(this.addr),
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
      this.connectTimer = null, this.openFired || (ae.warn("connect timed out before both channels opened", {
        peer: v(this.addr),
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
      this.disconnectTimer = null, !(this.closed || this.pc.connectionState !== "disconnected") && (ae.warn("link stayed disconnected past the grace — closing", {
        peer: v(this.addr),
        state: this.pc.connectionState,
        graceMs: da
      }), this.closeReasonValue ??= "disconnected", this.close());
    }, da));
  }
  clearDisconnectTimer() {
    this.disconnectTimer && (clearTimeout(this.disconnectTimer), this.disconnectTimer = null);
  }
}
function sc(s, e) {
  if (s.iceGatheringState === "complete") return Promise.resolve();
  const t = Date.now();
  return new Promise((n) => {
    const r = () => {
      s.removeEventListener("icegatheringstatechange", i), clearTimeout(o);
      const a = s.iceGatheringState, c = {
        elapsedMs: Date.now() - t,
        state: a,
        timeoutMs: e,
        ...an(Pi(s.localDescription?.sdp))
      };
      a === "complete" ? ae.debug("ice gathering done", c) : ae.warn("ice gathering cut by timeout", c), n();
    }, i = () => {
      s.iceGatheringState === "complete" && r();
    };
    s.addEventListener("icegatheringstatechange", i);
    const o = setTimeout(r, e);
  });
}
const we = Q("swarm.join"), $w = new TextEncoder();
function Kr(s) {
  return s === void 0 ? 0 : $w.encode(s).length;
}
class Vw {
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
        we.debug("join dropped: from self", { from: v(e.from) });
        return;
      }
      if (e.timestamp < Date.now() - this.staleMs) {
        we.warn("join dropped: stale", {
          ageMs: Date.now() - e.timestamp,
          staleMs: this.staleMs
        });
        return;
      }
      const t = Am(e, Tm);
      if (!t) {
        we.debug("join dropped: bad payload", { from: v(e.from) });
        return;
      }
      if (t.responder !== this.opts.selfAddr) {
        we.debug("join dropped: responder mismatch", {
          joinResponder: v(t.responder),
          self: v(this.opts.selfAddr)
        });
        return;
      }
      const n = this.lastJoinTs.get(t.viewerAddress);
      if (n !== void 0 && e.timestamp <= n) {
        we.warn("join dropped: replay", {
          viewer: v(t.viewerAddress),
          envTs: e.timestamp,
          lastTs: n
        });
        return;
      }
      const r = this.pending.get(t.viewerAddress);
      r && (we.warn("join supersedes an answer still in flight", {
        viewer: v(t.viewerAddress),
        envTs: e.timestamp,
        lastTs: n
      }), this.superseded.add(r), r.close(), this.pending.delete(t.viewerAddress), this.board.delete(t.viewerAddress)), this.lastJoinTs.set(t.viewerAddress, e.timestamp), we.info("join accepted", {
        viewer: v(t.viewerAddress),
        name: t.viewerName
      }), this.answer(t);
    }));
  }
  stop() {
    this.unsubscribe?.(), this.unsubscribe = null;
  }
  testFailAnsweredJoins(e) {
    this.testFailAnsweredJoinsOn = e, we.warn("test hook set answered-join failure", { on: e });
  }
  async answer(e) {
    const n = (this.opts.createPeer ?? ((c, l) => new Fi(c, l)))(e.viewerAddress, this.opts.peerOpts);
    this.pending.set(e.viewerAddress, n);
    const r = Date.now(), i = v(e.viewerAddress);
    let o = "open-offer", a = null;
    try {
      const c = await Ii(this.opts.boxKey, e.sealedSdp);
      we.debug("offer opened", { viewer: i, sdpBytes: Kr(c) }), o = "accept-offer";
      const l = await n.acceptOffer({ type: "offer", sdp: c });
      this.throwIfSuperseded(n), we.debug("offer accepted", { viewer: i, sdpBytes: Kr(l.sdp) }), o = "submit-welcome";
      const d = await Bi(e.boxPub, l.sdp ?? "");
      this.throwIfSuperseded(n), a = {
        at: Date.now(),
        answer: {
          to: e.viewerAddress,
          sealedSdp: d,
          sdpType: "answer",
          // The joiner dials these over relayed SDP to reach
          // TARGET_DEGREE without more statements.
          seeds: this.opts.getSeeds().filter((h) => h.addr !== e.viewerAddress),
          edgeSeq: this.opts.getEdgeSeq(),
          epoch: this.opts.getEpoch()
        }
      }, this.board.set(e.viewerAddress, a), we.info("answer on the board", { to: i, sdpBytes: Kr(l.sdp) });
      const u = Date.now();
      await this.publishBoard(), we.debug("board with the answer submitted", { to: i, latencyMs: Date.now() - u }), this.testFailAnsweredJoinsOn && (we.warn("test hook closed the answered join link", { viewer: i }), n.close()), o = "wait-open", await n.waitOpen(), we.info("viewer channels open", { viewer: i, totalMs: Date.now() - r }), this.opts.onPeer(n, e.viewerAddress, e.viewerName);
    } catch (c) {
      this.superseded.has(n) ? we.info("join answer abandoned: a newer join took over", { viewer: i, stage: o }) : o === "open-offer" ? we.error("join answer failed: offer did not open", { viewer: i, err: c }) : we.error("join answer failed", { viewer: i, stage: o, err: c }), n.close();
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
      const r = new Promise((i, o) => {
        t = i, n = o;
      });
      this.nextRound = { done: r, resolve: t, reject: n };
    }
    const { done: e } = this.nextRound;
    return this.boardBusy || this.flushBoard(), e;
  }
  async flushBoard() {
    for (this.boardBusy = !0; this.nextRound; ) {
      const e = this.nextRound;
      this.nextRound = null;
      const t = this.boardAnswers(Date.now());
      we.info("submitting welcome board", { answers: t.length });
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
    for (const [n, r] of this.board)
      e - r.at > _l * 1e3 && this.board.delete(n);
    const t = [...this.board.entries()].sort((n, r) => n[1].at - r[1].at);
    for (const [n] of t.splice(0, Math.max(0, t.length - xl)))
      this.board.delete(n);
    return t.map(([, n]) => n.answer);
  }
  throwIfSuperseded(e) {
    if (this.superseded.has(e)) throw new Error("superseded by a newer join");
  }
}
const Hw = Q("swarm.seal"), zw = 5, nc = ne(zw);
function Rt(s, e, t) {
  const n = `${s}:${e}`;
  return nc.allow(n) && Hw.warn(`${s} verification failed: ${e}`, { ...t, seen: nc.count(n) }), !1;
}
function jw() {
  const { secretKey: s, publicKey: e } = Fs.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: He(e) };
}
function Md(s) {
  return He(dr(s, { dkLen: 32 }));
}
function vo(s) {
  const e = new Uint8Array(64), t = new DataView(e.buffer);
  return t.setBigUint64(0, BigInt(s.epoch), !0), t.setUint32(8, s.seq, !0), t.setBigUint64(12, BigInt(s.tsUs), !0), t.setBigUint64(20, BigInt(s.durUs), !0), t.setUint32(28, s.size, !0), e.set(Ie(s.hash), 32), e;
}
function qw(s, e, t) {
  const n = {
    epoch: t,
    seq: e.seq,
    tsUs: e.tsUs,
    durUs: e.durUs,
    size: e.payload.length,
    hash: Md(e.payload)
  }, r = He(Fs.sign(vo(n), s.secretKey));
  return { ...n, sig: r };
}
function Ww(s, e) {
  try {
    return Fs.verify(Ie(e.sig), vo(e), Ie(s)) || Rt("chunk meta", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Rt("chunk meta", "malformed key or signature", { seq: e.seq });
  }
}
function Gw(s, e, t) {
  try {
    return t.length !== e.size ? Rt("chunk", "wrong size", { seq: e.seq, got: t.length, want: e.size }) : Md(t) !== e.hash ? Rt("chunk", "hash mismatch", { seq: e.seq, bytes: t.length }) : Fs.verify(Ie(e.sig), vo(e), Ie(s)) || Rt("chunk", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Rt("chunk", "malformed key or signature", { seq: e.seq });
  }
}
function Bd(s) {
  const e = new Uint8Array(12), t = new DataView(e.buffer);
  return e.set([69, 78, 68, 33], 0), t.setBigUint64(4, BigInt(s), !0), e;
}
function Zw(s, e) {
  return He(Fs.sign(Bd(e), s.secretKey));
}
function Kw(s, e, t) {
  try {
    return Fs.verify(Ie(t), Bd(e), Ie(s)) || Rt("stream end", "bad signature", { epoch: e });
  } catch {
    return Rt("stream end", "malformed key or signature", { epoch: e });
  }
}
const En = Q("swarm.chunk"), rc = 5, Xw = 25;
class Yw {
  chunks = /* @__PURE__ */ new Map();
  capacity;
  currentEpoch = null;
  /** Highest seq ever stored this epoch, -1 when empty. */
  maxSeq = -1;
  rejectCap = ne(rc);
  missCap = ne(rc);
  storedSinceRollup = 0;
  evictedSinceRollup = 0;
  constructor(e = yi) {
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
    En.info("store reset", { epoch: e, from: this.currentEpoch, dropped: this.chunks.size }), this.chunks.clear(), this.currentEpoch = e, this.maxSeq = -1, this.rejectCap.reset(), this.missCap.reset(), this.storedSinceRollup = 0, this.evictedSinceRollup = 0;
  }
  /** One line per reject reason while it is new, then a count only. */
  rejected(e, t) {
    return this.rejectCap.allow(e) && En.debug(`chunk rejected: ${e}`, { seq: t, epoch: this.currentEpoch, size: this.chunks.size }), !1;
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
    for (const r of this.chunks.keys())
      r <= n && (this.chunks.delete(r), this.evictedSinceRollup++);
    return this.storedSinceRollup++, this.storedSinceRollup >= Xw && (En.debug("chunks stored", {
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
    return !t && this.missCap.allow() && En.debug("chunk requested but missing", {
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
    return e < 0 ? { base: 0, bitmapHex: "" } : gm(e, this.chunks.keys(), this.capacity);
  }
}
const Qw = 2;
class Jw {
  votes = /* @__PURE__ */ new Map();
  /** `addr`'s hello named `epoch`. A newer vote replaces its older one; an
   *  older one is ignored. */
  record(e, t, n) {
    const r = this.votes.get(e);
    r && r.epoch > t || this.votes.set(e, { epoch: t, isHost: n });
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
    for (const [i, o] of this.votes) {
      if (o.epoch <= e) continue;
      if (o.isHost) {
        (!n || o.epoch > n.epoch) && (n = { epoch: o.epoch, voters: [i], viaHost: !0 });
        continue;
      }
      const a = t.get(o.epoch) ?? [];
      a.push(i), t.set(o.epoch, a);
    }
    if (n) return n;
    let r = null;
    for (const [i, o] of t)
      o.length < Qw || (!r || i > r.epoch) && (r = { epoch: i, voters: o, viaHost: !1 });
    return r;
  }
}
const ir = Q("swarm.gossip"), eb = 50, Id = 3;
class tb {
  /** Map preserves insertion order → oldest entry is first (LRU eviction). */
  seen = /* @__PURE__ */ new Map();
  capacity;
  ttlMs;
  duplicatesSinceRollup = 0;
  evictCap = ne(1);
  constructor(e) {
    this.capacity = e?.capacity ?? Op, this.ttlMs = e?.ttlMs ?? Pp;
  }
  /**
   * True exactly once per id within the TTL: the caller should process and
   * re-forward the message. False → duplicate, drop silently.
   */
  firstSight(e, t) {
    const n = this.seen.get(e), r = n !== void 0 && t - n < this.ttlMs;
    if (this.seen.delete(e), this.seen.set(e, t), this.seen.size > this.capacity) {
      const i = this.seen.keys().next().value;
      i !== void 0 && this.seen.delete(i), this.evictCap.allow() && ir.debug("dedup table at capacity", { capacity: this.capacity });
    }
    return r && (this.duplicatesSinceRollup++, this.duplicatesSinceRollup >= eb && (ir.debug("flood duplicates dropped", {
      dropped: this.duplicatesSinceRollup,
      tracked: this.seen.size
    }), this.duplicatesSinceRollup = 0)), !r;
  }
  get size() {
    return this.seen.size;
  }
}
class sb {
  peers = /* @__PURE__ */ new Map();
  ttlMs;
  expiryCap = ne(Id);
  constructor(e) {
    this.ttlMs = e?.ttlMs ?? Ip;
  }
  touch(e, t, n, r) {
    this.peers.set(e, { addr: e, name: t, ts: n, lastSeenMs: r });
  }
  remove(e) {
    this.peers.delete(e);
  }
  /** Peers seen within the TTL. Prunes expired entries as a side effect. */
  live(e) {
    const t = [];
    for (const [n, r] of this.peers)
      e - r.lastSeenMs >= this.ttlMs ? (this.peers.delete(n), this.expiryCap.allow() && ir.debug("presence expired", {
        peer: v(n),
        quietMs: e - r.lastSeenMs,
        expired: this.expiryCap.count()
      })) : t.push(r);
    return t;
  }
  liveCount(e) {
    return this.live(e).length;
  }
}
class nb {
  constructor(e, t, n = 1e3) {
    this.senderCap = e, this.aggregateCap = t, this.windowMs = n;
  }
  perSender = /* @__PURE__ */ new Map();
  aggregate = [];
  capReported = ne(Id);
  /** True if the message is within budget (and counts it), false → drop. */
  allow(e, t) {
    const n = t - this.windowMs;
    if (this.aggregate = this.aggregate.filter((i) => i > n), this.aggregate.length >= this.aggregateCap)
      return this.report("aggregate", e, this.aggregateCap), !1;
    const r = (this.perSender.get(e) ?? []).filter((i) => i > n);
    return r.length >= this.senderCap ? (this.perSender.set(e, r), this.report("sender", e, this.senderCap), !1) : (r.push(t), this.perSender.set(e, r), this.aggregate.push(t), !0);
  }
  report(e, t, n) {
    const r = `${e}:${t}`;
    this.capReported.allow(r) && ir.warn("flood dropped: over the rate cap", {
      scope: e,
      sender: v(t),
      cap: n,
      windowMs: this.windowMs
    });
  }
}
const pe = Q("swarm.book"), rb = 3, ib = 0.3, ob = 0.5, ab = 0.2, cb = 1e6, lb = 0.2;
function us(s, e) {
  return s + ib * (e - s);
}
class ic {
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
  poolFullCap = ne(rb);
  dialCapLog = ne(5);
  /** No replacement before this (cooldown after one, hold after an epoch reset). */
  replaceHoldUntilMs = 0;
  /** Addresses refused from the pool until the time given (scoring prunes). */
  bannedUntil = /* @__PURE__ */ new Map();
  keptCap = ne(3);
  /** Distinct targets whose outbound dial was answered but never opened,
   *  counted while a host link was up. A link to another viewer opening, or
   *  the degree reaching 0, clears it. */
  failedTargets = /* @__PURE__ */ new Set();
  /** No mesh dials before this while a host link is open (0 = not paused). */
  dialPausedUntilMs = 0;
  /** Last relayOnly verdict, so the log line fires on a flip only. */
  relayOnlyLogged = !1;
  constructor(e, t) {
    this.selfAddr = e, this.minDegree = t?.minDegree ?? op, this.targetDegree = t?.targetDegree ?? ap, this.maxDegree = t?.maxDegree ?? cp, this.strikeLimit = t?.badChunkStrikes ?? Rp, this.candidatePoolCap = t?.candidatePoolCap ?? 64, this.hostAddr = t?.hostAddr ?? null;
  }
  // ── Neighbor set ───────────────────────────────────────────────────────────
  addNeighbor(e, t, n, r) {
    const i = this.neighbors.get(e);
    if (i) return i;
    const o = {
      addr: e,
      name: t,
      connectedAtMs: n,
      isHostLink: r?.isHostLink ?? !1,
      responder: r?.responder ?? !1,
      boxPub: null,
      fulfillEwma: ob,
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
    return this.candidateSeenAt.delete(e), pe.info("neighbor added", {
      peer: v(e),
      degree: this.neighbors.size,
      isHostLink: o.isHostLink,
      responder: o.responder,
      promoted: a
    }), this.noteRelayOnly(), o;
  }
  removeNeighbor(e) {
    this.neighbors.delete(e) && (pe.info("neighbor removed", { peer: v(e), degree: this.neighbors.size }), this.neighbors.size === 0 && this.clearDialFailures("mesh-dial failures dropped: no links left"), this.noteRelayOnly());
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
    t && (t.fulfillEwma = us(t.fulfillEwma, 1), t.denyEwma = us(t.denyEwma, 0));
  }
  /** A want to this peer timed out (no first slice / never completed). */
  recordTimeout(e) {
    const t = this.neighbors.get(e);
    t && (t.fulfillEwma = us(t.fulfillEwma, 0));
  }
  /** The peer denied a want. Cheap and honest — penalized far less than a timeout. */
  recordDeny(e) {
    const t = this.neighbors.get(e);
    t && (t.denyEwma = us(t.denyEwma, 1));
  }
  /** A completed chunk delivery: `bytes` over `elapsedMs`. */
  recordDelivery(e, t, n) {
    const r = this.neighbors.get(e);
    !r || n <= 0 || (r.throughputBpsEwma = us(r.throughputBpsEwma, t * 8 * 1e3 / n));
  }
  /** A want to this peer produced its first slice `chunks` chunk-spacings
   *  after it was sent. */
  recordFirstSlice(e, t) {
    const n = this.neighbors.get(e);
    !n || !Number.isFinite(t) || t < 0 || (n.firstSliceChunksEwma = us(n.firstSliceChunksEwma, t));
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
    const n = Math.min(1, t.throughputBpsEwma / cb);
    return t.fulfillEwma - 0.25 * t.denyEwma + ab * n - lb * Math.min(1, t.firstSliceChunksEwma);
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
    return pe.warn("bad chunk strike", {
      peer: v(e),
      strikes: t.badChunkStrikes,
      limit: this.strikeLimit,
      disconnect: n
    }), n;
  }
  // ── Liveness via summaries (plan §6.4) ─────────────────────────────────────
  recordSummary(e, t, n, r) {
    const i = this.neighbors.get(e);
    i && (i.lastSummaryAtMs = t, this.recordDegreeReport(e, n, r));
  }
  /** One degree report (hello or summary). An absent degree (an older build's
   *  hello) leaves the count alone; an absent relayOnly reads as false. */
  recordDegreeReport(e, t, n) {
    const r = this.neighbors.get(e);
    r && (t !== void 0 && (r.remoteDegree = t, r.lowDegreeReports = t <= 1 ? r.lowDegreeReports + 1 : 0), r.relayOnly = n ?? !1);
  }
  // ── Host-only neighbors (host side) ────────────────────────────────────────
  /** Reaches only us: it said so, or reported degree ≤ 1 in
   *  HOST_ONLY_CONFIRM_REPORTS reports in a row. */
  hostOnly(e) {
    return e.relayOnly || e.lowDegreeReports >= zp;
  }
  /** The host-only neighbors that hold the `slots` seats: advertised
   *  relayOnly first, then longest uptime. */
  hostOnlyCarried(e) {
    if (e <= 0) return /* @__PURE__ */ new Set();
    const t = this.list().filter((n) => this.hostOnly(n)).sort((n, r) => Number(r.relayOnly) - Number(n.relayOnly) || n.connectedAtMs - r.connectedAtMs);
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
      if (this.failedTargets.add(e), this.failedTargets.size >= vi) {
        const r = this.dialsPaused(t);
        this.dialPausedUntilMs = t + n, r || pe.warn("mesh dials paused: links to other viewers fail to open", {
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
    this.failedTargets.size === 0 && this.dialPausedUntilMs === 0 || (pe.info(e, { streakWas: this.failedTargets.size }), this.failedTargets.clear(), this.dialPausedUntilMs = 0);
  }
  /** Only the host is reachable: MESH_DIAL_FAIL_STREAK failed dials and our
   *  one link is the host. Streak-based, so a probe window cannot flap it. */
  get relayOnly() {
    if (this.failedTargets.size < vi || this.neighbors.size !== 1) return !1;
    const [e] = this.neighbors.values();
    return this.isHost(e);
  }
  noteRelayOnly() {
    const e = this.relayOnly;
    e !== this.relayOnlyLogged && (this.relayOnlyLogged = e, e ? pe.warn("relay-only: only the host is reachable", { streak: this.failedTargets.size }) : pe.info("relay-only cleared", {
      streak: this.failedTargets.size,
      degree: this.neighbors.size
    }));
  }
  /** Neighbors silent for longer than `cutoffMs` (two missed summaries plus
   *  slack) → presumed dead. A link with no summary yet is judged from
   *  connect time. */
  deadPeers(e, t = vl) {
    return this.list().filter((n) => e - n.lastSummaryAtMs > t).map((n) => n.addr);
  }
  // ── PEX candidate pool ─────────────────────────────────────────────────────
  addCandidates(e, t = Date.now()) {
    let n = 0, r = 0, i = 0, o = !1;
    for (const a of e)
      if (!(a.addr === this.selfAddr || this.neighbors.has(a.addr))) {
        if (this.isBanned(a.addr, t)) {
          r++;
          continue;
        }
        if (this.candidates.size >= this.candidatePoolCap && !this.candidates.has(a.addr) && (o || (o = !0, this.expireCandidates(t)), this.candidates.size >= this.candidatePoolCap)) {
          i++;
          continue;
        }
        this.candidates.has(a.addr) || n++, this.candidates.set(a.addr, a), this.candidateSeenAt.set(a.addr, t);
      }
    (n > 0 || r > 0) && pe.debug("candidates added", {
      added: n,
      banned: r,
      offered: e.length,
      pool: this.candidates.size
    }), i > 0 && this.poolFullCap.allow() && pe.warn("candidate pool full", { turnedAway: i, cap: this.candidatePoolCap });
  }
  /** Drop pooled candidates nobody has re-offered within CANDIDATE_TTL_MS. */
  expireCandidates(e) {
    let t = 0;
    for (const [n, r] of this.candidateSeenAt)
      e - r > Ds && (this.candidates.delete(n), this.candidateSeenAt.delete(n), t++);
    return t > 0 && pe.debug("stale candidates dropped", { expired: t, ttlMs: Ds, pool: this.candidates.size }), t;
  }
  isBanned(e, t) {
    const n = this.bannedUntil.get(e);
    return n === void 0 ? !1 : t < n ? !0 : (this.bannedUntil.delete(e), !1);
  }
  /** Refuse `addr` from the pool for REPLACE_BAN_MS: it was pruned for its
   *  score, or pruned us for ours. Links it opens to us are not blocked. */
  banCandidate(e, t) {
    this.candidates.delete(e), this.candidateSeenAt.delete(e), this.bannedUntil.set(e, t + Mr), pe.debug("candidate banned", { peer: v(e), banMs: Mr });
  }
  get candidateCount() {
    return this.candidates.size;
  }
  /** TEST HOOK (issue-#7 orphan repro): empty the candidate pool. */
  clearCandidates() {
    pe.warn("candidate pool cleared", { dropped: this.candidates.size }), this.candidates.clear(), this.candidateSeenAt.clear();
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
    const r = this.maxDialsInFlight, i = r - t, o = Math.min(n, i);
    if (i < n && this.candidates.size > 0 && this.dialCapLog.allow() && pe.debug("dial targets capped", {
      wanted: n,
      room: Math.max(0, i),
      inFlight: t,
      cap: r,
      starved: this.isStarved
    }), o <= 0) return [];
    const a = [];
    let c = 0;
    for (const [l, d] of this.candidates) {
      if (a.length >= o) break;
      this.candidates.delete(l);
      const u = this.candidateSeenAt.get(l) ?? e;
      if (this.candidateSeenAt.delete(l), e - u > Ds) {
        c++;
        continue;
      }
      a.push(d);
    }
    return c > 0 && pe.debug("stale candidates dropped", { expired: c, ttlMs: Ds }), a.length > 0 && pe.debug("dial targets picked", {
      picked: a.length,
      wanted: o,
      degree: this.neighbors.size,
      pool: this.candidates.size,
      inFlight: t,
      cap: r,
      starved: this.isStarved
    }), a;
  }
  /** Below MIN_DEGREE the node should dial urgently / keep its host link. */
  get isStarved() {
    return this.neighbors.size < this.minDegree;
  }
  /** Outbound dials allowed in flight: doubled while starved. */
  get maxDialsInFlight() {
    return this.isStarved ? Vp : $p;
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
    const n = this.rankedByScore().reverse().filter((r) => !r.isHostLink && e - r.connectedAtMs >= Qn).slice(0, t).map((r) => r.addr);
    return n.length > 0 && pe.info("pruning over max degree", {
      prune: n.length,
      excess: t,
      degree: this.neighbors.size,
      maxDegree: this.maxDegree
    }), n;
  }
  /** Hold replacements for REPLACE_COOLDOWN_MS (after an epoch reset, wants
   *  to neighbors still on the old epoch time out — not their fault). */
  holdReplacements(e) {
    this.replaceHoldUntilMs = Math.max(this.replaceHoldUntilMs, e + oa);
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
    for (const l of this.neighbors.values()) {
      if (l.isHostLink || l.addr === this.hostAddr || e - l.connectedAtMs < Qn) continue;
      const d = this.score(l.addr);
      d >= lp && l.denyEwma < ia || d < n && (t = l, n = d);
    }
    if (!t) return null;
    const r = (l) => (this.keptCap.allow(l) && pe.debug("weak neighbor kept", {
      peer: v(t.addr),
      score: n,
      deny: t.denyEwma,
      gate: l,
      kept: this.keptCap.count(l)
    }), null);
    if (this.neighbors.size - 1 < this.minDegree) return r("min-degree");
    if (e < this.replaceHoldUntilMs) return r("cooldown");
    let i = null, o = -1 / 0;
    for (const l of this.neighbors.values()) {
      if (l === t) continue;
      const d = this.score(l.addr);
      d > o && (i = l, o = d);
    }
    if (!i || o < dp)
      return this.keptCap.allow("no-reference") && pe.warn("slow neighbors kept: no healthy reference", {
        worst: v(t.addr),
        worstScore: n,
        bestScore: i ? o : null,
        degree: this.neighbors.size,
        kept: this.keptCap.count("no-reference")
      }), null;
    let a = null;
    for (const [l, d] of this.candidates) {
      const u = this.candidateSeenAt.get(l) ?? e;
      if (e - u > Ds) {
        this.candidates.delete(l), this.candidateSeenAt.delete(l);
        continue;
      }
      if (d.boxPub) {
        a = d;
        break;
      }
    }
    if (!a) return r("no-candidate");
    this.candidates.delete(a.addr), this.candidateSeenAt.delete(a.addr), this.replaceHoldUntilMs = e + oa, this.bannedUntil.set(t.addr, e + Mr);
    const c = t.denyEwma >= ia ? "deny" : "score";
    return pe.warn("replacing weak neighbor", {
      peer: v(t.addr),
      reason: c,
      score: n,
      fulfill: t.fulfillEwma,
      deny: t.denyEwma,
      throughputBps: Math.round(t.throughputBpsEwma),
      ageMs: e - t.connectedAtMs,
      reference: v(i.addr),
      referenceScore: o,
      candidate: v(a.addr),
      degree: this.neighbors.size,
      pool: this.candidates.size
    }), {
      victim: t,
      candidate: a,
      reason: c,
      score: n,
      reference: i.addr,
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
  pexSample(e = to, t) {
    const n = [];
    for (const r of this.neighbors.values()) {
      if (n.length >= e) return n;
      r.addr !== t && !r.relayOnly && n.push({ addr: r.addr, name: r.name, boxPub: r.boxPub ?? void 0 });
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
    const r = this.list().filter((i) => i.remoteDegree !== null && i.remoteDegree >= t).sort(
      (i, o) => (o.remoteDegree ?? 0) - (i.remoteDegree ?? 0) || i.connectedAtMs - o.connectedAtMs
    ).slice(0, n).map((i) => i.addr);
    return r.length > 0 && pe.info("re-homing bootstrap joiners", {
      prune: r.length,
      excess: n,
      degree: this.neighbors.size,
      maxNeighbors: e
    }), r;
  }
}
const hs = Q("swarm.sched"), db = 10;
class ub {
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
  logCap = ne(db);
  totals = {
    wantTimeouts: 0,
    progressTimeouts: 0,
    dupPulls: 0,
    deadlineSkips: 0
  };
  constructor(e) {
    this.chunkMs = e?.chunkMs ?? Xt, this.wantTimeoutChunks = e?.wantTimeoutChunks ?? pp, this.progressTimeoutChunks = e?.progressTimeoutChunks ?? wp, this.perPeerBudget = e?.maxInflightPerPeer ?? Tp, this.totalBudget = e?.maxInflightTotal ?? Cp, this.duplicateWindowChunks = e?.duplicateWindowChunks ?? mp, this.skipGraceChunks = e?.skipGraceChunks ?? gp;
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
  advancePlayhead(e, t, n, r) {
    if (!this.playheadInitialized)
      return this.setPlayhead(e, t), [];
    const i = this.playhead;
    if (e <= i)
      return this.playheadDueAtMs !== null && this.playheadDueAtMs <= r && t !== null || (this.playheadDueAtMs = t), [];
    const o = [];
    for (let a = i; a < e; a++)
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
    const r = this.inflight.get(e)?.find((i) => i.peer === t);
    return !r || (r.lastSliceAtMs = n, r.gotFirstSlice) ? !1 : (r.gotFirstSlice = !0, !0);
  }
  /** Chunk verified + stored. Clears all pulls for the seq (a concurrent
   *  duplicate pull is abandoned — its late slices get ignored). */
  onComplete(e) {
    this.inflight.delete(e), this.attempted.delete(e);
  }
  /** Peer denied the want — retry elsewhere immediately (next plan()). */
  onDeny(e, t) {
    const n = this.inflight.get(e)?.filter((r) => r.peer !== t) ?? [];
    n.length === 0 ? this.inflight.delete(e) : this.inflight.set(e, n), this.markAttempted(e, t);
  }
  /** Neighbor died: forget its pulls so they re-plan instantly (plan §6.4). */
  onPeerLost(e) {
    for (const [t, n] of this.inflight) {
      const r = n.filter((i) => i.peer !== e);
      r.length === 0 ? this.inflight.delete(t) : this.inflight.set(t, r);
    }
  }
  /** Host re-go-live: new epoch, new seq space. */
  reset() {
    hs.info("scheduler reset", { playhead: this.playhead, edge: this.edge }), this.logCap.reset(), this.playhead = 0, this.playheadDueAtMs = null, this.playheadInitialized = !1, this.chunkDurEwmaMs = null, this.edge = -1, this.inflight.clear(), this.attempted.clear(), this.skipped.clear();
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
      for (const r of n) r.peer === e && t++;
    return t;
  }
  // ── Planning ───────────────────────────────────────────────────────────────
  /**
   * One planning pass: expire stale pulls, skip a dry playhead's missing run,
   * then fill budgets deadline-first. Call on every scheduling tick and after
   * any have/deny/complete event.
   */
  plan(e, t, n) {
    const r = [], i = [...t].sort((a, c) => c.score - a.score), o = this.spacingMs();
    for (const [a, c] of this.inflight) {
      const l = [];
      for (const d of c) {
        const u = e - d.sentAtMs, h = e - (d.lastSliceAtMs ?? d.sentAtMs);
        let f = null;
        if (!d.gotFirstSlice && u >= this.wantTimeoutChunks * o ? (f = "first-slice", this.totals.wantTimeouts++) : d.gotFirstSlice && h >= this.progressTimeoutChunks * o && (f = "progress", this.totals.progressTimeouts++), f === null) {
          l.push(d);
          continue;
        }
        this.markAttempted(a, d.peer), r.push({ type: "cancel", seq: a, peer: d.peer, reason: f }), this.logCap.allow(f) && hs.warn("pull timed out — re-requesting", {
          seq: a,
          peer: v(d.peer),
          reason: f,
          idleMs: Math.round(h),
          sinceWantMs: Math.round(u),
          remainingMs: this.remainingMs(a, e),
          timedOut: f === "first-slice" ? this.totals.wantTimeouts : this.totals.progressTimeouts
        });
      }
      l.length === 0 ? this.inflight.delete(a) : this.inflight.set(a, l);
    }
    if (this.edge < 0) return r;
    this.skipDryRun(e, n, o, r);
    for (let a = this.playhead; a <= this.edge; a++) {
      if (n(a) || this.skipped.has(a)) continue;
      const c = this.deadlineAt(a, e), l = this.inflight.get(a) ?? [], d = l.length === 0, u = l.length === 1 && this.playheadDueAtMs !== null && c - e < this.duplicateWindowChunks * o;
      if (!d && !u || this.inflightTotal() >= this.totalBudget) continue;
      const h = new Set(l.map((p) => p.peer)), f = this.pickPeer(a, i, h);
      if (!f) {
        d && this.attempted.delete(a);
        continue;
      }
      const g = l[0];
      l.push({ peer: f, sentAtMs: e, gotFirstSlice: !1, lastSliceAtMs: null }), this.inflight.set(a, l);
      const m = Math.max(0, Math.round(c - e));
      u ? (r.push({ type: "want", seq: a, peer: f, deadlineMs: m, duplicate: !0 }), this.totals.dupPulls++, this.logCap.allow("duplicate") && hs.warn("duplicate pull", {
        seq: a,
        peer: v(f),
        firstPeer: v(g.peer),
        remainingMs: Math.round(c - e),
        sinceWantMs: Math.round(e - g.sentAtMs),
        duplicates: this.totals.dupPulls
      })) : r.push({ type: "want", seq: a, peer: f, deadlineMs: m });
    }
    return r.length > 0 && this.logPlan(r), r;
  }
  /** Step 2 of plan(): skip [playhead, nextHeld) once the player has been dry
   *  for the grace and a later chunk is held to hop to. */
  skipDryRun(e, t, n, r) {
    const i = this.playheadDueAtMs, o = this.playhead;
    if (i === null || o > this.edge || t(o) || this.skipped.has(o) || e < i + this.skipGraceChunks * n) return;
    let a = -1;
    for (let l = o + 1; l <= this.edge; l++)
      if (t(l)) {
        a = l;
        break;
      }
    if (a === -1) return;
    const c = [];
    for (let l = o; l < a; l++)
      if (!this.skipped.has(l)) {
        this.skipped.add(l);
        for (const d of this.inflight.get(l) ?? [])
          r.push({ type: "cancel", seq: l, peer: d.peer, reason: "deadline" }), c.push(v(d.peer));
        this.inflight.delete(l), this.attempted.delete(l), r.push({ type: "skip", seq: l }), this.totals.deadlineSkips++;
      }
    this.logCap.allow("skip") && hs.warn("deadline missed — skipping chunk", {
      seq: o,
      run: [o, a],
      hopTo: a,
      playhead: o,
      edge: this.edge,
      peers: c,
      lateMs: Math.round(e - i),
      remainingMs: Math.round(i - e),
      skipped: this.totals.deadlineSkips
    });
  }
  /** One tick summary instead of a line per action. */
  logPlan(e) {
    if (!hs.on("debug")) return;
    let t = 0, n = 0, r = 0;
    for (const i of e)
      i.type === "want" ? t++ : i.type === "cancel" ? n++ : r++;
    hs.debug("plan", {
      wants: t,
      cancels: n,
      skips: r,
      inflight: this.inflightTotal(),
      playhead: this.playhead,
      edge: this.edge
    });
  }
  /** Best-scored neighbor that has the seq, wasn't tried, and has budget. */
  pickPeer(e, t, n) {
    const r = this.attempted.get(e);
    for (const i of t)
      if (!(n.has(i.addr) || r?.has(i.addr)) && i.has(e) && !(this.inflightForPeer(i.addr) >= this.perPeerBudget))
        return i.addr;
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
const hb = 0.9;
function fb(s, e) {
  let t = 0, n = 0, r = 0, i = 0, o = 0;
  for (const l of s) {
    if (l.samples < e.windowSamples) continue;
    o = Math.max(o, l.max);
    const d = l.last.sent - l.first.sent, u = l.last.buffered - l.first.buffered;
    d === 0 && u === 0 || (t++, r += Math.max(0, d - u), l.min >= e.backlogBytes && (n++, i += l.min));
  }
  const a = n >= Math.max(2, Math.ceil(t / 2)), c = e.windowMs > 0 ? r * 8 * 1e3 / e.windowMs : 0;
  return {
    samples: e.windowSamples,
    active: t,
    backedUp: n,
    majority: a,
    drainedBytes: r,
    settledBytes: i,
    measuredBps: c,
    maxBuffered: o
  };
}
const oc = (s, e, t) => Math.min(t, Math.max(e, s));
function pb(s, e, t) {
  const { floorBps: n, ceilingBps: r } = t, i = [];
  let o = oc(s.budgetBps, n, r);
  const a = s.settledPrev !== null && e.settledBytes < hb * s.settledPrev, c = s.starvedRun > 0;
  if (e.majority) {
    if (e.samples >= wl && !a) {
      const u = oc(Math.min(o, xp * e.measuredBps), n, r);
      u < o && (o = u, c && u <= n || i.push("cut"));
    }
  } else e.samples >= 1 && o < r && (o = Math.min(r, kp * o), o >= r && i.push("restored"));
  let { starvedRun: l, starved: d } = s;
  return e.majority ? (l = o <= n ? l + 1 : 0, !d && l >= Ep && (d = !0, i.push("starved"))) : (l = 0, d && (d = !1, i.push("recovered"))), {
    state: { budgetBps: o, settledPrev: e.settledBytes, starvedRun: l, starved: d },
    events: i
  };
}
const ot = Q("swarm.serve"), mb = 5, gb = 6e4, yb = 0.2, wb = 10, ac = pt, Xr = () => Object.fromEntries(El.options.map((s) => [s, 0]));
class or {
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
  denyCap = ne(mb);
  dangerCap = ne(wb);
  ceilingCap = ne(1);
  queuedSinceRollup = 0;
  servedSinceRollup = 0;
  bytesSinceRollup = 0;
  hostOnlySinceRollup = 0;
  deniedSinceRollup = Xr();
  rollupStartMs = null;
  deniedTotal = Xr();
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
    this.ceilingBps = e?.uploadBudgetBps ?? fp, this.budgetBps = this.ceilingBps, this.budgetState = { budgetBps: this.budgetBps, settledPrev: null, starvedRun: 0, starved: !1 }, this.maxQueueDepth = e?.maxQueueDepth ?? 32, this.fanoutCap = e?.fanoutCap === void 0 ? null : e.fanoutCap, this.chunkMs = e?.chunkMs ?? Xt, this.tokens = this.budgetBps / 8;
  }
  static host(e) {
    return new or({ ...e, fanoutCap: up });
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
  request(e, t, n, r, i) {
    if (this.refill(r), i?.hasChunk === !1) return this.deny("missing", e, t);
    if (this.queue.length >= this.maxQueueDepth) return this.deny("busy", e, t);
    if (this.tokens < ac) return this.deny("budget", e, t);
    const o = this.fanoutCap !== null && (this.servedCount.get(t) ?? 0) >= this.fanoutCap, a = i?.hostOnly === "carried" && !this.carriedServed.get(t)?.has(e);
    if (o && i?.hostOnly === "refused") return this.deny("fanout", e, t, "host-full");
    if (o && !a) {
      if (!(n < Sp * this.chunkMs && i?.othersHave === !1) || this.dangerUsed.has(t))
        return this.deny("fanout", e, t);
      this.dangerUsed.add(t), this.dangerServes++, this.dangerCap.allow() && ot.info("fanout cap overridden: requester in its danger zone", {
        peer: v(e),
        seq: t,
        deadlineMs: n,
        dangerServes: this.dangerServes
      });
    }
    this.queue = this.queue.filter((l) => !(l.peer === e && l.seq === t));
    const c = { peer: e, seq: t, deadlineAtMs: r + n, enqueuedAtMs: r };
    return a && (c.carried = !0, c.overCap = o), this.queue.push(c), this.queuedSinceRollup++, { kind: "queued" };
  }
  countDeny(e) {
    this.deniedTotal[e]++, this.deniedSinceRollup[e]++;
  }
  /** One line per deny reason while it is new, then a count only. */
  deny(e, t, n, r) {
    return this.countDeny(e), this.denyCap.allow(e) && ot.debug(`want denied: ${e}`, {
      peer: v(t),
      seq: n,
      detail: r ?? null,
      depth: this.queue.length,
      denied: this.denyCap.count(e)
    }), r ? { kind: "deny", reason: e, detail: r } : { kind: "deny", reason: e };
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
    return t - e.enqueuedAtMs >= bp * this.chunkMs ? (this.countDeny("busy"), "deny") : (this.queue.push(e), "held");
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
    if (this.refill(e), this.tokens < ac) return null;
    const t = vp * this.chunkMs;
    if (this.queue = this.queue.filter((r) => r.deadlineAtMs + t > e), this.queue.length === 0) return null;
    let n = null;
    for (const r of this.queue) {
      if (!n) {
        n = r;
        continue;
      }
      if (!!r.carried != !!n.carried) {
        r.carried && (n = r);
        continue;
      }
      (r.deadlineAtMs < n.deadlineAtMs || r.deadlineAtMs === n.deadlineAtMs && (this.lastServedAt.get(r.peer) ?? 0) < (this.lastServedAt.get(n.peer) ?? 0)) && (n = r);
    }
    return this.queue = this.queue.filter((r) => r !== n), n;
  }
  /** Account a completed serve: consumes budget, counts fanout (a carried
   *  serve leaves the mesh's count alone). */
  onServed(e, t, n) {
    if (this.refill(n), this.tokens -= t, e.carried) {
      const r = this.carriedServed.get(e.seq) ?? /* @__PURE__ */ new Set();
      r.add(e.peer), this.carriedServed.set(e.seq, r);
    } else
      this.servedCount.set(e.seq, (this.servedCount.get(e.seq) ?? 0) + 1);
    e.overCap && (this.hostOnlyServedTotal++, this.hostOnlySinceRollup++), this.lastServedAt.set(e.peer, n), this.servedSinceRollup++, this.bytesSinceRollup += t;
  }
  // ── Measured budget ──────────────────────────────────────────────────────
  /** Feed one chunk (seeded or verified) into the stream-rate EWMAs. */
  observeChunk(e, t) {
    if (!Number.isFinite(e) || e <= 0 || !Number.isFinite(t) || t <= 0) return;
    const n = yb;
    this.chunkBytesEwma = this.chunkBytesEwma === null ? e : (1 - n) * this.chunkBytesEwma + n * e, this.chunkMsEwma = this.chunkMsEwma === null ? t : (1 - n) * this.chunkMsEwma + n * t;
  }
  /** Chunk duration from the stream EWMAs: paces the stream rate and the
   *  budget window. Kept apart from `chunkMs` (the scheduler's spacing, which
   *  the danger zone, expiry grace and hold limit use): that one restarts on
   *  an epoch reset, and these EWMAs carry over it. */
  get streamChunkMs() {
    return this.chunkMsEwma ?? Xt;
  }
  get chunkBytes() {
    return this.chunkBytesEwma ?? (gl + yl) * Xt / 8e3;
  }
  get streamBps() {
    return this.chunkBytes * 8 * 1e3 / this.streamChunkMs;
  }
  get floorBps() {
    return Math.min(this.ceilingBps, Br * this.streamBps);
  }
  get windowMs() {
    return Math.max(this.streamChunkMs, wl * bi);
  }
  /**
   * One tick's sample of every open link's bulk queue. Accumulates the
   * window; at its edge, sizes the budget from what the queues drained.
   * Also drives the time-based roll-up line.
   */
  observeLinks(e, t) {
    this.windowStartMs === null && (this.windowStartMs = t, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map()), this.windowSamples++;
    for (const { peer: n, buffered: r, sent: i } of e) {
      const o = this.linkWindows.get(n);
      o ? (o.samples++, o.min = Math.min(o.min, r), o.max = Math.max(o.max, r), o.last = { buffered: r, sent: i }) : this.linkWindows.set(n, {
        peer: n,
        samples: 1,
        min: r,
        max: r,
        first: { buffered: r, sent: i },
        last: { buffered: r, sent: i }
      });
    }
    t - this.windowStartMs >= this.windowMs && (this.closeWindow(t - this.windowStartMs, t), this.windowStartMs = null), this.rollup(t);
  }
  closeWindow(e, t) {
    const n = fb(this.linkWindows.values(), {
      windowSamples: this.windowSamples,
      backlogBytes: _p * this.chunkBytes,
      windowMs: e
    });
    this.linkWindows = /* @__PURE__ */ new Map(), this.measuredBps = n.measuredBps, this.backedUpLinks = n.backedUp, this.maxBufferedBytes = n.maxBuffered;
    const r = this.streamBps, i = this.floorBps;
    this.ceilingBps < Br * r && this.ceilingCap.allow() && ot.warn("upload ceiling below one full-rate copy", {
      ceilingBps: this.ceilingBps,
      floorBps: Math.round(Br * r),
      streamBps: Math.round(r)
    });
    const o = this.budgetBps, { state: a, events: c } = pb(this.budgetState, n, {
      floorBps: i,
      ceilingBps: this.ceilingBps
    });
    this.budgetState = a, a.budgetBps !== o && (this.refill(t), this.budgetBps = a.budgetBps, this.tokens = Math.min(this.tokens, this.budgetBps / 8));
    for (const l of c)
      switch (l) {
        case "cut":
          this.cuts++, this.limitedSinceMs ??= t, ot.info("upload budget cut", {
            fromBps: Math.round(o),
            toBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            floorBps: Math.round(i),
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
          ot.info("upload budget restored", {
            budgetBps: Math.round(this.budgetBps),
            limitedMs: this.limitedSinceMs === null ? null : t - this.limitedSinceMs
          }), this.limitedSinceMs = null;
          break;
        case "starved":
          this.starvedSinceMs = t, ot.warn("upload starved", {
            budgetBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            streamBps: Math.round(r),
            backedUp: n.backedUp
          });
          break;
        case "recovered":
          ot.info("upload recovered", {
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
    if (t < gb) return null;
    const n = Object.values(this.deniedSinceRollup).reduce((o, a) => o + a, 0), i = this.queuedSinceRollup + this.servedSinceRollup + n === 0 ? null : {
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
    return i && ot.debug("chunks served", { ...i }), this.clearRollup(), this.rollupStartMs = e, i;
  }
  clearRollup() {
    this.queuedSinceRollup = 0, this.servedSinceRollup = 0, this.bytesSinceRollup = 0, this.hostOnlySinceRollup = 0, this.deniedSinceRollup = Xr();
  }
  /** Epoch change / go-live reset. The link did not change, so the budget,
   *  the stream EWMAs and the deny/cut totals carry over. */
  reset() {
    ot.info("serve queue reset", { depth: this.queue.length }), this.queue = [], this.servedCount.clear(), this.carriedServed.clear(), this.lastServedAt.clear(), this.dangerUsed.clear(), this.denyCap.reset(), this.dangerCap.reset(), this.clearRollup(), this.rollupStartMs = null, this.windowStartMs = null, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map();
  }
  get depth() {
    return this.queue.length;
  }
  timesServed(e) {
    return this.servedCount.get(e) ?? 0;
  }
}
const $ = Q("swarm.node"), bb = 6e4, cc = 5;
class vb {
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
  lagChunksValue = ip;
  callbacks;
  now;
  /** Fed by noteEdge: one observation per edge advance. */
  edgeCadence;
  book;
  store;
  scheduler;
  serve;
  dedup = new tb();
  presence = new sb();
  reactionLimiter = new nb(
    Lp,
    Up
  );
  assembler = new vm();
  /** The last CHAT_BACKLOG_LINES chat lines of this epoch, for new neighbors. */
  chatLog = [];
  /** Which epoch the neighbors' hellos say is current (assessment gap 13). */
  epochVotes = new Jw();
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
  dialCap = ne(cc);
  sigCap = ne(20);
  expiryCap = ne(cc);
  /** Held-serve denies repeat while a requester's link stays congested. */
  heldCap = ne(10);
  /** Host-only peers already logged as carried (one line each). */
  carriedLogged = /* @__PURE__ */ new Set();
  /** A refused host-only viewer re-wants every chunk. */
  refusedCap = ne(5);
  constructor(e) {
    if (this.selfAddr = e.selfAddr, this.selfName = e.selfName, this.role = e.role, this.epoch = e.epoch, this.streamPubKeyHex = e.streamPubKeyHex, this.boxKey = e.boxKey, this.streamKey = e.streamKey ?? null, this.chunkMs = e.chunkMs ?? Xt, this.isResponder = e.responder ?? !1, this.callbacks = e.callbacks ?? {}, this.now = e.now ?? (() => Date.now()), e.role === "host" && !e.streamKey)
      throw new Error("host SwarmNode needs the stream signing key");
    this.book = e.role === "host" ? new ic(e.selfAddr, { minDegree: 0, targetDegree: 0, maxDegree: aa }) : new ic(e.selfAddr, { hostAddr: e.hostAddr }), this.store = new Yw(yi), this.store.reset(this.epoch), this.scheduler = new ub({
      chunkMs: this.chunkMs,
      wantTimeoutChunks: e.wantTimeoutChunks
    }), this.edgeCadence = new Ql(this.chunkMs);
    const t = e.fanoutCap !== void 0 ? e.fanoutCap : e.role === "host" ? void 0 : null;
    this.serve = t === void 0 ? or.host({ uploadBudgetBps: e.uploadBudgetBps, chunkMs: this.chunkMs }) : new or({
      uploadBudgetBps: e.uploadBudgetBps,
      fanoutCap: t,
      chunkMs: this.chunkMs
    });
  }
  // ── Lifecycle ──────────────────────────────────────────────────────────────
  start() {
    if (this.running) return;
    this.running = !0, $.info("node started", {
      self: v(this.selfAddr),
      role: this.role,
      epoch: this.epoch,
      tickMs: bi
    });
    const e = this.now();
    this.lastSummaryAt = e, this.lastPresenceAt = e, this.lastPexAt = e, this.lastLinkSummaryAt = e, this.tickTimer = setInterval(() => this.tick(), bi);
  }
  /** Tear down. `silent` skips the bye (spike uses it to simulate a crash). */
  stop(e) {
    $.info("node stopped", {
      role: this.role,
      neighbors: this.peers.size,
      silent: e?.silent ?? !1,
      ...this.counters
    }), this.tickTimer && (clearInterval(this.tickTimer), this.tickTimer = null), this.running = !1;
    for (const t of this.peers.values())
      e?.silent || t.sendCtrl({ v: me, t: "bye" }), t.close();
    for (const t of this.dials.values()) t.peer.close();
    this.peers.clear(), this.dials.clear(), this.attachOpts.clear(), this.neighborHaves.clear();
  }
  /** Host re-go-live / heartbeat announced a new epoch: new seq space. */
  resetEpoch(e, t) {
    $.info("epoch reset", {
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
    const r = this.epochVotes.decide(this.epoch);
    if (r) {
      if (r.viaHost) {
        this.resetEpoch(r.epoch), this.callbacks.onEpochReset?.(r.epoch);
        return;
      }
      r.epoch <= this.suspectedEpoch || (this.suspectedEpoch = r.epoch, $.info("neighbors agree on a newer epoch — asking for the heartbeat", {
        from: this.epoch,
        to: r.epoch,
        voters: r.voters.map(v)
      }), this.callbacks.onEpochSuspected?.(r.epoch));
    }
  }
  // ── Peers in/out ───────────────────────────────────────────────────────────
  /**
   * Adopt a SwarmPeer (from joinSignaling or a mesh dial): wires handlers and,
   * once both channels are open, adds it to the neighbor set + says hello.
   */
  attachPeer(e, t) {
    $.debug("peer attached", {
      peer: v(e.addr),
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
    const r = this.store.summary();
    e.sendCtrl({
      v: me,
      t: "hello",
      addr: this.selfAddr,
      name: this.selfName,
      epoch: this.epoch,
      edgeSeq: this.store.edgeSeq,
      have: r,
      responder: this.isResponder || void 0,
      boxPub: this.boxKey.publicKeyHex,
      degree: this.peers.size,
      relayOnly: this.book.relayOnly
    }), $.debug("hello sent", {
      peer: v(e.addr),
      degree: this.peers.size,
      epoch: this.epoch,
      edgeSeq: this.store.edgeSeq
    }), this.flood({ ...this.floodFields(), t: "presence", name: this.selfName });
    for (const i of this.chatLog) e.sendCtrl({ ...i, t: "chat-backlog", epoch: this.epoch });
    this.callbacks.onPeersChanged?.();
  }
  onPeerClosed(e) {
    this.dials.get(e.addr)?.peer === e && this.dials.delete(e.addr), this.peers.get(e.addr) === e && this.removePeer(e.addr);
  }
  /** Drop a neighbor: book/scheduler/serve bookkeeping + close. Plan §6.4 —
   *  no subtree exists; a peer death affects only its own links. */
  removePeer(e, t) {
    const n = this.peers.get(e);
    n && ($.info("link dropped", {
      peer: v(e),
      notice: t?.t ?? null,
      reason: t?.t === "prune" ? t.reason : null,
      degree: this.peers.size - 1
    }), t && n.sendCtrl(t), this.peers.delete(e), this.attachOpts.delete(e), this.neighborHaves.delete(e), this.epochVotes.forget(e), this.book.removeNeighbor(e), this.scheduler.onPeerLost(e), this.serve.cancel(e), this.carriedLogged.delete(e), n.close(), this.role === "viewer" && this.peers.size === 1 && ($.info("summary sent early: degree dropped", { degree: this.peers.size }), this.sendSummary(this.now())), this.callbacks.onPeersChanged?.());
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
      return this.testDropSeedsLeft--, $.warn("test hook dropped a seeded chunk", { seq: e.seq }), null;
    let t = e;
    if (this.testPoisonSeedsLeft > 0) {
      this.testPoisonSeedsLeft--;
      const r = e.payload.slice();
      for (let i = 4; i < Math.min(8, r.length); i++) r[i] ^= 255;
      t = { ...e, payload: r }, $.warn("test hook poisoned a seeded chunk", { seq: e.seq });
    }
    const n = qw(this.streamKey, t, this.epoch);
    return this.store.insert({ meta: n, payload: t.payload }), this.serve.observeChunk(t.payload.length, n.durUs / 1e3), this.metas.set(n.seq, n), this.noteEdge(n.seq, this.now()), this.scheduler.observeChunkDur(n.durUs / 1e3), this.broadcastHave(n.seq), this.callbacks.onChunk?.(n, t.payload, "self"), n;
  }
  // ── Gossip out ─────────────────────────────────────────────────────────────
  /** Fields every flooded message carries (plan §5): dedup id = from:ts:nonce. */
  floodFields() {
    return {
      v: me,
      from: this.selfAddr,
      ts: this.now(),
      nonce: Math.random().toString(36).slice(2, 10)
    };
  }
  /** Send a flooded message we authored (chat/reaction/poll/presence/end). */
  flood(e) {
    $.debug("flood tx", { type: e.t, neighbors: this.peers.size }), this.dedup.firstSight(vt(e), this.now()), e.t === "chat" && this.logChat(e), this.forwardFlood(e, null);
  }
  logChat(e) {
    const t = vt(e);
    this.chatLog.some((n) => vt(n) === t) || (this.chatLog.push(e), this.chatLog.length > Fp && this.chatLog.shift());
  }
  forwardFlood(e, t) {
    for (const [n, r] of this.peers)
      n !== t && r.sendCtrl(e);
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
    const r = this.scheduler.edgeSeq;
    r > n && this.edgeCadence.observe(t, r - n);
  }
  // ── Ctrl dispatch ──────────────────────────────────────────────────────────
  handleCtrl(e, t) {
    const n = this.now();
    switch (t.t) {
      case "hello": {
        const r = this.book.get(e.addr);
        r && (r.name = t.name, r.responder = t.responder ?? !1, r.boxPub = t.boxPub ?? r.boxPub), this.book.recordDegreeReport(e.addr, t.degree, t.relayOnly), r && this.role === "viewer" && this.considerEpoch(e.addr, t.epoch, r.isHostLink), this.neighborHaves.set(e.addr, fa(t.have)), this.noteEdge(t.edgeSeq, n);
        break;
      }
      case "have": {
        this.neighborHaves.get(e.addr)?.add(t.seq), this.noteEdge(Math.max(t.seq, t.edgeSeq), n);
        break;
      }
      case "summary": {
        this.neighborHaves.set(
          e.addr,
          fa({ base: t.base, bitmapHex: t.bitmapHex })
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
          t.peers.filter((r) => r.addr !== this.selfAddr),
          this.now()
        );
        break;
      }
      case "sig":
        this.handleSig(e, t);
        break;
      case "end": {
        if (!this.dedup.firstSight(vt(t), n)) break;
        if ($.info("stream end received", { from: v(t.from), epoch: t.epoch }), !Kw(this.streamPubKeyHex, t.epoch, t.sig)) {
          this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
          break;
        }
        this.forwardFlood(t, e.addr), this.callbacks.onEnd?.(t.epoch);
        break;
      }
      case "presence": {
        if (!this.dedup.firstSight(vt(t), n)) break;
        $.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), this.presence.touch(t.from, t.name, t.ts, n), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "reaction": {
        if (!this.dedup.firstSight(vt(t), n) || !this.reactionLimiter.allow(t.from, n)) break;
        $.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat":
      case "poll-open":
      case "poll-vote":
      case "poll-tally":
      case "poll-close": {
        if (!this.dedup.firstSight(vt(t), n)) break;
        $.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), t.t === "chat" && this.logChat(t), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat-backlog": {
        if (t.epoch !== this.epoch || !this.dedup.firstSight(vt(t), n)) break;
        const { epoch: r, ...i } = t, o = { ...i, t: "chat" };
        this.logChat(o), this.callbacks.onFlood?.(o);
        break;
      }
      case "bye": {
        this.presence.remove(e.addr), this.removePeer(e.addr);
        break;
      }
      case "prune": {
        $.info("pruned by neighbor", {
          peer: v(e.addr),
          reason: t.reason,
          degree: this.peers.size - 1
        }), t.reason === "scoring" && this.book.banCandidate(e.addr, n), this.removePeer(e.addr);
        break;
      }
    }
  }
  // ── Serving (plan §7.2) ────────────────────────────────────────────────────
  handleWant(e, t, n) {
    const r = this.now(), i = this.store.has(t);
    let o = !1;
    for (const [l, d] of this.neighborHaves)
      if (l !== e.addr && d.has(t)) {
        o = !0;
        break;
      }
    const a = this.hostOnlyStatus(e.addr), c = this.serve.request(e.addr, t, n, r, {
      hasChunk: i,
      othersHave: o,
      hostOnly: a
    });
    if (c.kind === "deny") {
      e.sendCtrl({ v: me, t: "deny", seq: t, reason: c.reason, detail: c.detail }), c.detail === "host-full" && this.refusedCap.allow() && $.warn("host-only slots full: requester refused", {
        peer: v(e.addr),
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
    return this.testHostOnlySlotsOverride ?? Math.min(Hp, Math.max(0, this.serve.upload.copies - 1));
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
    return this.book.hostOnlyCarried(n).has(e) ? (this.carriedLogged.has(e) || (this.carriedLogged.add(e), $.info("host-only neighbor carried past the fanout cap", {
      peer: v(e),
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
      const r = this.peers.get(n.peer);
      if (r?.isOpen) {
        if (r.bulkBufferedAmount > Sl) {
          t.push(n);
          continue;
        }
        this.serveChunk(r, n, e);
      }
    }
    for (const n of t) {
      if (this.serve.hold(n, e) === "held") continue;
      const r = this.peers.get(n.peer);
      r?.sendCtrl({ v: me, t: "deny", seq: n.seq, reason: "busy" }), this.counters.heldDenies++, this.heldCap.allow() && $.warn("serve held too long — denying", {
        peer: v(n.peer),
        seq: n.seq,
        heldMs: Math.round(e - n.enqueuedAtMs),
        bufferedAmount: r?.bulkBufferedAmount ?? 0,
        heldDenies: this.counters.heldDenies
      });
    }
  }
  serveChunk(e, t, n) {
    const r = this.store.get(t.seq);
    if (!r) {
      e.sendCtrl({ v: me, t: "deny", seq: t.seq, reason: "missing" });
      return;
    }
    let i = r.payload;
    const o = this.testCorruptServes.get(t.peer);
    o && (i = i.slice(), i[0] ^= 255, o <= 1 ? this.testCorruptServes.delete(t.peer) : this.testCorruptServes.set(t.peer, o - 1), this.testCorruptedServeCount += 1, $.warn("test hook corrupted a served chunk", {
      seq: t.seq,
      peer: v(t.peer)
    })), e.sendCtrl({ v: me, t: "meta", meta: r.meta });
    const a = bm(this.epoch, t.seq, i), c = this.testDelayServes.get(t.peer);
    if (c && a.length > 1)
      c.left <= 1 ? this.testDelayServes.delete(t.peer) : c.left--, this.testDelayedServeCount += 1, $.warn("test hook delayed a served chunk", {
        seq: t.seq,
        peer: v(t.peer),
        delayMs: c.delayMs
      }), e.sendSlice(a[0]), setTimeout(() => {
        if (e.isOpen)
          for (const l of a.slice(1)) e.sendSlice(l);
      }, c.delayMs);
    else
      for (const l of a) e.sendSlice(l);
    this.serve.onServed(t, r.payload.length, n), this.counters.chunksServed++, this.counters.upBytes += r.payload.length;
  }
  // ── Receiving chunks (plan §4, §7.1) ───────────────────────────────────────
  handleMeta(e, t) {
    if (t.epoch !== this.epoch) return;
    if (!this.metas.has(t.seq)) {
      if (!Ww(this.streamPubKeyHex, t)) {
        $.warn("chunk meta rejected", { from: v(e.addr), seq: t.seq }), this.counters.badChunks++, this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
        return;
      }
      this.metas.set(t.seq, t);
    }
    this.noteEdge(t.seq, this.now());
    const n = this.pendingVerify.get(t.seq);
    n && (this.pendingVerify.delete(t.seq), this.finalizeChunk(t.seq, n.payload, n.from));
  }
  handleSlice(e, t) {
    if (t.epochLow !== Bn(this.epoch) || this.store.has(t.seq)) return;
    const n = this.assembler.add(t);
    switch (n.kind) {
      case "invalid":
        this.counters.invalidSlices++;
        break;
      case "progress": {
        const r = this.now();
        if (this.scheduler.onSlice(t.seq, e.addr, r)) {
          const i = this.wantSentAt.get(`${t.seq}:${e.addr}`);
          i !== void 0 && this.book.recordFirstSlice(e.addr, (r - i) / this.scheduler.spacingMs());
        }
        break;
      }
      case "done":
        this.finalizeChunk(t.seq, n.payload, e.addr);
        break;
    }
  }
  finalizeChunk(e, t, n) {
    const r = this.metas.get(e);
    if (!r) {
      this.pendingVerify.set(e, { payload: t, from: n, atMs: this.now() });
      return;
    }
    if (!Gw(this.streamPubKeyHex, r, t)) {
      $.warn("chunk rejected: verification failed", {
        from: v(n),
        seq: e,
        bytes: t.length
      }), this.counters.badChunks++, this.scheduler.onDeny(e, n), this.book.recordBadChunk(n) && this.removePeer(n);
      return;
    }
    if (!this.store.insert({ meta: r, payload: t })) return;
    const i = this.book.get(n);
    i && this.book.isHost(i) && (this.lastHostChunkAt = this.now()), this.scheduler.onComplete(e), this.scheduler.observeChunkDur(r.durUs / 1e3), this.serve.observeChunk(t.length, r.durUs / 1e3), this.book.recordFulfilled(n);
    const o = `${e}:${n}`, a = this.wantSentAt.get(o);
    a !== void 0 && (this.book.recordDelivery(n, t.length, this.now() - a), this.wantSentAt.delete(o)), this.counters.chunksReceived++, this.counters.downBytes += t.length, this.receivedFrom.set(n, (this.receivedFrom.get(n) ?? 0) + 1), this.broadcastHave(e), this.callbacks.onChunk?.(r, t, n);
  }
  broadcastHave(e) {
    const t = { v: me, t: "have", seq: e, edgeSeq: this.store.edgeSeq };
    for (const n of this.peers.values()) n.sendCtrl(t);
  }
  // ── Relayed SDP (plan §6.3) ────────────────────────────────────────────────
  handleSig(e, t) {
    if (t.path.includes(this.selfAddr)) return;
    if (t.target === this.selfAddr) {
      t.kind === "offer" ? this.answerMeshOffer(t, e.addr) : this.completeMeshDial(t);
      return;
    }
    if (t.path.length > wi) {
      this.sigCap.allow("hop-cap") && $.debug("sig dropped: hop cap reached", {
        target: v(t.target),
        hops: t.path.length,
        cap: wi
      });
      return;
    }
    const n = { ...t, path: [...t.path, this.selfAddr] };
    let r = 0;
    const i = this.peers.get(t.target);
    if (i) {
      i.sendCtrl(n), this.counters.sigForwarded++, this.logSigForward(t, 1);
      return;
    }
    for (const [o, a] of this.peers)
      o === e.addr || t.path.includes(o) || (a.sendCtrl(n), this.counters.sigForwarded++, r++);
    this.logSigForward(t, r);
  }
  /** The relay line repeats on a busy mesh — cap it, then count only. */
  logSigForward(e, t) {
    t === 0 || !this.sigCap.allow() || $.debug("sig relayed", {
      kind: e.kind,
      from: v(e.from),
      target: v(e.target),
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
      this.dialCap.allow("no-box-key") && $.warn("mesh dial skipped: candidate has no box key", {
        target: v(t),
        skipped: this.dialCap.count("no-box-key")
      });
      return;
    }
    $.debug("mesh dial started", { target: v(t), degree: this.peers.size });
    const n = new Fi(t, { gatherTimeoutMs: ca });
    this.dials.set(t, { peer: n, atMs: this.now(), outbound: !0 }), this.attachPeer(n);
    try {
      const r = await n.createOffer();
      this.routeSig({
        v: me,
        t: "sig",
        target: t,
        from: this.selfAddr,
        kind: "offer",
        sealed: await Bi(e.boxPub, r.sdp ?? ""),
        boxPub: this.boxKey.publicKeyHex,
        path: [this.selfAddr]
      });
    } catch (r) {
      $.warn("mesh dial failed", { target: v(t), err: r }), this.dials.delete(t), n.close();
    }
  }
  async answerMeshOffer(e, t) {
    if (this.testRefuseMeshDialsOn) return;
    if (this.peers.has(e.from)) {
      this.dialCap.allow("offer-from-neighbor") && $.info("mesh offer ignored: still linked to the sender", {
        from: v(e.from),
        ignored: this.dialCap.count("offer-from-neighbor")
      });
      return;
    }
    let n;
    try {
      n = await Ii(this.boxKey, e.sealed);
    } catch {
      $.warn("mesh offer dropped: the sealed sdp did not open", {
        from: v(e.from),
        via: v(t)
      });
      return;
    }
    const r = this.dials.get(e.from);
    if (r) {
      if ($.debug("mesh dial glare", {
        from: v(e.from),
        ourOfferWins: this.selfAddr < e.from
      }), this.selfAddr < e.from) return;
      r.peer.close(), this.dials.delete(e.from);
    }
    const i = new Fi(e.from, { gatherTimeoutMs: ca });
    this.dials.set(e.from, { peer: i, atMs: this.now(), outbound: !1 }), this.attachPeer(i);
    try {
      const o = await i.acceptOffer({ type: "offer", sdp: n });
      this.routeSig(
        {
          v: me,
          t: "sig",
          target: e.from,
          from: this.selfAddr,
          kind: "answer",
          sealed: await Bi(e.boxPub, o.sdp ?? ""),
          boxPub: this.boxKey.publicKeyHex,
          path: [this.selfAddr]
        },
        t
      );
    } catch (o) {
      $.warn("mesh answer failed", { to: v(e.from), err: o }), this.dials.delete(e.from), i.close();
    }
  }
  async completeMeshDial(e) {
    const t = this.dials.get(e.from);
    if (t)
      try {
        const n = await Ii(this.boxKey, e.sealed);
        await t.peer.acceptAnswer({ type: "answer", sdp: n }), t.peer.waitOpen().catch(() => {
          this.running && this.onMeshDialFailed(e.from, t.peer.closeReason);
        }), this.testRefuseMeshDialsOn && ($.warn("test hook refused a mesh dial", { target: v(e.from) }), t.peer.close());
      } catch (n) {
        $.warn("mesh dial completion failed", { from: v(e.from), err: n }), this.dials.delete(e.from), t.peer.close();
      }
  }
  onMeshDialFailed(e, t) {
    this.book.recordDialFailure(e, this.now(), jp * this.scheduler.spacingMs()), $.warn("mesh dial failed after the answer arrived", {
      target: v(e),
      closeReason: t,
      streak: this.book.dialFailStreak,
      limit: vi
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
        const a = (d) => this.store.has(d), c = this.callbacks.getPlayhead?.() ?? null;
        let l;
        if (c === null)
          l = this.scheduler.advancePlayhead(
            Math.max(0, o - this.lagChunks),
            null,
            a,
            e
          );
        else {
          const d = o - (c.started ? this.lagChunks + yp : this.lagChunks);
          l = this.scheduler.advancePlayhead(
            Math.max(c.seq, d),
            c.remainingMs === null ? null : e + c.remainingMs,
            a,
            e
          );
        }
        for (const d of l)
          this.counters.skips++, this.assembler.drop(Bn(this.epoch), d), this.pendingVerify.delete(d), this.callbacks.onSkip?.(d);
      }
    }
    if (this.role === "viewer") {
      const o = this.book.list().map((c) => ({
        addr: c.addr,
        score: this.book.score(c.addr),
        has: (l) => this.neighborHaves.get(c.addr)?.has(l) ?? !1
      })), a = this.scheduler.plan(e, o, (c) => this.store.has(c));
      for (const c of a)
        switch (c.type) {
          case "want": {
            this.peers.get(c.peer)?.sendCtrl({
              v: me,
              t: "want",
              seq: c.seq,
              deadlineMs: Math.min(6e5, Math.max(0, c.deadlineMs))
            }) ? this.wantSentAt.set(`${c.seq}:${c.peer}`, e) : this.scheduler.onDeny(c.seq, c.peer);
            break;
          }
          case "cancel":
            this.book.recordTimeout(c.peer), this.wantSentAt.delete(`${c.seq}:${c.peer}`);
            break;
          case "skip":
            this.counters.skips++, this.assembler.drop(Bn(this.epoch), c.seq), this.pendingVerify.delete(c.seq), this.callbacks.onSkip?.(c.seq);
            break;
        }
    }
    this.serve.setChunkMs(this.scheduler.spacingMs()), this.pumpServe(), e - this.lastSummaryAt >= bl && this.sendSummary(e);
    for (const o of this.book.deadPeers(e))
      $.warn("neighbor missed its summaries — dropping", {
        peer: v(o),
        silentMs: e - (this.book.get(o)?.lastSummaryAtMs ?? e),
        limitMs: vl
      }), this.removePeer(o);
    if (e - this.lastPresenceAt >= Bp && (this.lastPresenceAt = e, this.flood({ ...this.floodFields(), t: "presence", name: this.selfName })), e - this.lastPexAt >= kl) {
      this.lastPexAt = e;
      for (const [o, a] of this.peers)
        a.sendCtrl({
          v: me,
          t: "pex",
          peers: this.book.pexSample(to, o)
        });
    }
    e - this.lastLinkSummaryAt >= bb && !this.linkSummaryRunning && (this.lastLinkSummaryAt = e, this.logLinkSummary());
    let t = 0;
    for (const o of this.dials.values()) o.outbound && t++;
    const n = this.book.dialTargets(e, t), r = this.book.maxDialsInFlight - t - n.length;
    for (const o of n)
      this.meshDial(o);
    if (this.role === "host")
      for (const o of this.book.hostPruneTargets(
        aa,
        hp
      ))
        this.removePeer(o, { v: me, t: "prune", reason: "bootstrap-rotation" });
    else {
      const o = this.book.pruneTargets(e);
      for (const a of o)
        this.removePeer(a, { v: me, t: "prune", reason: "over-degree" });
      if (o.length === 0 && r >= 1) {
        const a = this.book.replaceTarget(e);
        a && (this.removePeer(a.victim.addr, { v: me, t: "prune", reason: "scoring" }), this.meshDial(a.candidate));
      }
      this.book.isStarved && this.belowMinSinceMs === null ? (this.belowMinSinceMs = e, $.warn("degree below min", {
        degree: this.book.size,
        minDegree: this.book.minDegree,
        pool: this.book.candidateCount,
        dialsInFlight: t
      })) : !this.book.isStarved && this.belowMinSinceMs !== null && ($.info("degree restored", {
        degree: this.book.size,
        belowMs: e - this.belowMinSinceMs
      }), this.belowMinSinceMs = null);
    }
    for (const [o, a] of this.dials)
      e - a.atMs > ua && (this.dialCap.allow("timeout") && $.warn("mesh dial timed out", {
        target: v(o),
        timeoutMs: ua,
        timedOut: this.dialCap.count("timeout")
      }), this.dials.delete(o), a.peer.close());
    for (const [o, a] of this.pendingVerify)
      e - a.atMs > 3 * this.chunkMs && (this.expiryCap.allow("pending-verify") && $.warn("chunk dropped: its meta never arrived", {
        seq: o,
        from: v(a.from),
        expired: this.expiryCap.count("pending-verify")
      }), this.pendingVerify.delete(o), this.book.recordTimeout(a.from));
    const i = this.store.edgeSeq - 2 * yi;
    if (i > 0) {
      for (const o of this.metas.keys()) o < i && this.metas.delete(o);
      for (const o of this.wantSentAt.keys())
        Number(o.slice(0, o.indexOf(":"))) < i && this.wantSentAt.delete(o);
    }
  }
  /** Our HAVE window, edge, degree and relayOnly to every neighbor. */
  sendSummary(e) {
    this.lastSummaryAt = e;
    const t = this.store.summary(), n = {
      v: me,
      t: "summary",
      base: t.base,
      bitmapHex: t.bitmapHex,
      edgeSeq: this.store.edgeSeq,
      degree: this.peers.size,
      relayOnly: this.book.relayOnly
    };
    for (const r of this.peers.values()) r.sendCtrl(n);
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
    n && (n.fulfillEwma = t, $.warn("test hook set a neighbor score", { peer: v(e), fulfill: t }));
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
    if (this.testRefuseMeshDialsOn = e, $.warn("test hook set mesh-dial refusal", { on: e }), !!e) {
      for (const t of [...this.peers.keys()]) {
        const n = this.book.get(t);
        (!n || !this.book.isHost(n)) && this.removePeer(t);
      }
      for (const t of [...this.dials.values()]) t.peer.close();
    }
  }
  /** Host seats for host-only viewers; null restores the policy. */
  testHostOnlySlots(e) {
    this.testHostOnlySlotsOverride = e === null ? null : Math.max(0, Math.floor(e)), $.warn("test hook overrode host-only slots", { slots: this.testHostOnlySlotsOverride });
  }
  /** Sever every neighbor (no bye) and empty the candidate pool — the
   *  issue-#7 absorbing state (`neighbors=0, candidates=0`), reached
   *  deterministically instead of racing PEX against a neighbor kill. */
  testOrphan() {
    for (const e of [...this.peers.keys()]) this.removePeer(e);
    this.book.clearCandidates(), $.warn("test hook orphaned the node: neighbors severed, candidate pool cleared");
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
      const r = this.book.get(n);
      r && r.lastSummaryAtMs > t && (t = r.lastSummaryAtMs);
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
        const e = await Promise.all([...this.peers.values()].map((r) => r.linkStats())), t = { direct: 0, stun: 0, turn: 0, unknown: 0 }, n = { direct: [], stun: [], turn: [] };
        for (const { path: r, rttMs: i } of e) {
          if (!r) {
            t.unknown++;
            continue;
          }
          t[r]++, i !== null && n[r].push(i);
        }
        $.info("links", {
          total: e.length,
          ...t,
          rttMs: { direct: Yr(n.direct), stun: Yr(n.stun), turn: Yr(n.turn) }
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
function Yr(s) {
  if (s.length === 0) return null;
  const e = [...s].sort((n, r) => n - r), t = e.length >> 1;
  return e.length % 2 ? e[t] : Math.round((e[t - 1] + e[t]) / 2);
}
const Tt = Q("swarm.host");
class Sb {
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
    this.epoch = e.epoch, this.codecs = e.codecs, this.chunkMs = e.chunkMs ?? Xt, this.audioContext = e.audioContext, this.key = jw(), this.boxKey = Iw(), Tt.info("host created", {
      self: v(e.selfAddr),
      epoch: e.epoch,
      streamPubKey: ve(this.key.publicKeyHex),
      boxPub: ve(this.boxKey.publicKeyHex),
      codecs: e.codecs.mimeType
    });
    const t = e.callbacks ?? {};
    this.node = new vb({
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
    }), this.responder = new Vw({
      selfAddr: e.selfAddr,
      boxKey: this.boxKey,
      transport: e.transport,
      getEpoch: () => this.node.epoch,
      getEdgeSeq: () => this.node.store.edgeSeq,
      getSeeds: () => this.node.seedSample(la),
      onPeer: (n) => this.node.attachPeer(n)
    }), this.pipeline = new C0({
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
    if (this.started = !0, this.startedAtMs = Date.now(), Tt.info("go live started", { epoch: this.epoch, chunkMs: this.chunkMs }), this.audioContext.state === "suspended")
      try {
        await this.audioContext.resume();
      } catch {
      }
    this.node.start(), this.responder.start();
    try {
      await this.pipeline.start();
    } catch (e) {
      throw Tt.error("go live failed: the encoder did not start", {
        epoch: this.epoch,
        elapsedMs: Date.now() - this.startedAtMs,
        err: e
      }), this.stopSwarm(), e;
    }
    Tt.info("go live ready", { epoch: this.epoch, elapsedMs: Date.now() - this.startedAtMs });
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
    const e = this.node.book.responderSample(la).filter((n) => n.boxPub !== null), t = {
      [this.node.selfAddr]: this.boxKey.publicKeyHex
    };
    for (const n of e) t[n.addr] = n.boxPub;
    return e.length !== this.lastResponderCount && (Tt.info("responder list changed", {
      responders: e.length,
      was: this.lastResponderCount < 0 ? null : this.lastResponderCount,
      neighbors: this.node.book.size
    }), this.lastResponderCount = e.length), Tt.debug("heartbeat mesh", {
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
    const r = this.node.floodFields();
    n !== void 0 && (r.ts = n), this.node.flood({ ...r, t: "chat", senderName: e, text: t });
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
      this.ended = !0, Tt.info("stream ending", {
        epoch: this.epoch,
        liveMs: this.startedAtMs > 0 ? Date.now() - this.startedAtMs : 0,
        neighbors: this.node.book.size
      }), this.node.flood({
        ...this.node.floodFields(),
        t: "end",
        epoch: this.epoch,
        sig: Zw(this.key, this.epoch)
      });
      try {
        await this.pipeline.stop();
      } catch (e) {
        Tt.error("encoder stop failed — teardown continues", { epoch: this.epoch, err: e });
      }
      this.stopSwarm();
    }
  }
  stopSwarm() {
    this.responder.stop(), this.node.stop();
  }
}
class _b {
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
    this.ctx = new AudioContext({ sampleRate: np }), this.destination = this.ctx.createMediaStreamDestination(), this.masterBus = this.ctx.createGain(), this.masterBus.connect(this.destination), e.mic && this.setMicSource(e.mic), e.system && this.setSystemSource(e.system);
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
    const r = this.ctx.createGain();
    r.gain.value = t;
    const i = this.ctx.createGain();
    i.gain.value = t, n.connect(r).connect(this.masterBus), n.connect(i).connect(this.ctx.destination), await new Promise((o) => {
      const a = () => {
        try {
          n.disconnect();
        } catch {
        }
        try {
          r.disconnect();
        } catch {
        }
        try {
          i.disconnect();
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
const lc = /* @__PURE__ */ new Map();
function Ct(s) {
  const e = lc.get(s);
  if (e !== void 0) return e;
  if (typeof document > "u") return "";
  const t = getComputedStyle(document.documentElement).getPropertyValue(s).trim();
  return t && lc.set(s, t), t;
}
const xb = () => ({
  isHidden: () => document.visibilityState === "hidden",
  raf: (s) => requestAnimationFrame(s),
  caf: (s) => cancelAnimationFrame(s),
  startInterval: Jl
});
class kb {
  constructor(e, t, n = {}) {
    this.paint = e, this.periodMs = t, this.deps = { ...xb(), ...n };
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
const Qr = Q("media.compositor"), Eb = ne(3);
class Tb {
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
    this.width = e.width ?? 1280, this.height = e.height ?? 720, this.fps = e.fps ?? 30, this.pipScale = e.pipScale ?? 0.2, this.pipPadding = e.pipPadding ?? 24, this.pipRadius = e.pipRadius ?? 12, this.paintClock = new kb(() => this.paint(), 1e3 / this.fps), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height;
    const t = this.canvas.getContext("2d", { alpha: !1 });
    if (!t) throw new Error("CanvasCompositor: unable to acquire 2d context");
    this.ctx = t, this.screenVideo = dc(), this.cameraVideo = dc();
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
      e ? Tn(this.screenVideo) : Promise.resolve(),
      t ? Tn(this.cameraVideo) : Promise.resolve()
    ]), this.paint(), this.output = this.canvas.captureStream(this.fps), this.paintClock.start(), Qr.info("painting started", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    }), this.output;
  }
  /** Replace the camera source. Pass null to clear. */
  setCameraSource(e) {
    this.cameraVideo.srcObject = e, e && Tn(this.cameraVideo);
  }
  /** Replace the screen-share source. Pass null to clear. */
  setScreenSource(e) {
    this.screenVideo.srcObject = e, e && Tn(this.screenVideo);
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
    this.paintClock.onVisibilityChange() && Qr.info("visibility changed", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    });
  };
  paint() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Ct("--bg-surface-main"), e.fillRect(0, 0, t, n);
    const r = this.effectiveScene(this.scene);
    if (this.fadeFromScene != null) {
      const i = performance.now() - this.fadeStart, o = Math.min(1, i / this.fadeMs), a = Ab(o);
      if (o < 1) {
        const c = this.effectiveScene(this.fadeFromScene);
        e.save(), e.globalAlpha = 1 - a, this.paintScene(c), e.restore(), e.save(), e.globalAlpha = a, this.paintScene(r), e.restore();
      } else
        this.fadeFromScene = null, this.paintScene(r);
    } else
      this.paintScene(r);
    for (const i of this.overlays)
      try {
        i.draw({ ctx: e, width: t, height: n });
      } catch (o) {
        Eb.allow(i.id) && Qr.warn("overlay draw threw", { overlay: i.id, err: o });
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
    this.cameraVideo.readyState < 2 || uc(this.ctx, this.cameraVideo, 0, 0, this.width, this.height);
  }
  paintScreenFull() {
    this.screenVideo.readyState < 2 || Cb(this.ctx, this.screenVideo, 0, 0, this.width, this.height);
  }
  paintCameraPip() {
    const { ctx: e, width: t, height: n } = this;
    if (this.cameraVideo.readyState < 2) return;
    const r = Math.round(t * this.pipScale), i = Math.round(r * 9 / 16), o = t - r - this.pipPadding, a = n - i - this.pipPadding;
    e.save(), e.shadowColor = "rgba(0, 0, 0, 0.55)", e.shadowBlur = 18, e.shadowOffsetY = 4, Jr(e, o, a, r, i, this.pipRadius), e.fillStyle = Ct("--bg-surface-main"), e.fill(), e.restore(), e.save(), Jr(e, o, a, r, i, this.pipRadius), e.clip(), uc(e, this.cameraVideo, o, a, r, i), e.restore(), e.save(), e.strokeStyle = "rgba(255, 255, 255, 0.08)", e.lineWidth = 1, Jr(e, o + 0.5, a + 0.5, r - 1, i - 1, this.pipRadius), e.stroke(), e.restore();
  }
  paintBrb() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Ct("--bg-surface-main"), e.fillRect(0, 0, t, n), e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = Ct("--fg-primary");
    const r = Math.round(n * 0.12);
    e.font = `600 ${r}px ${Ct("--scale-font-family-accent")}, sans-serif`, e.fillText("Be right back", t / 2, n * 0.42);
    const i = this.brb.subtitle?.trim() || "Back in a moment.";
    e.fillStyle = Ct("--fg-secondary");
    const o = Math.round(n * 0.035);
    e.font = `${o}px ${Ct("--scale-font-family-sans")}, sans-serif`, e.fillText(i, t / 2, n * 0.58);
    const a = performance.now(), c = Math.round(n * 8e-3), l = Math.round(n * 0.03), d = t / 2 - l, u = n * 0.68;
    for (let h = 0; h < 3; h++) {
      const f = (a / 400 + h * 0.33) % 1, g = 0.35 + 0.65 * Math.sin(f * Math.PI);
      e.globalAlpha = g, e.fillStyle = Ct("--fg-secondary"), e.beginPath(), e.arc(d + h * l, u, c, 0, Math.PI * 2), e.fill();
    }
    e.globalAlpha = 1;
  }
}
function dc() {
  const s = document.createElement("video");
  return s.autoplay = !0, s.playsInline = !0, s.muted = !0, s;
}
async function Tn(s) {
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
function Cb(s, e, t, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const c = Math.min(r / o, i / a), l = o * c, d = a * c, u = t + (r - l) / 2, h = n + (i - d) / 2;
  s.drawImage(e, u, h, l, d);
}
function uc(s, e, t, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const c = Math.max(r / o, i / a), l = o * c, d = a * c, u = t + (r - l) / 2, h = n + (i - d) / 2;
  s.drawImage(e, u, h, l, d);
}
function Ab(s) {
  return s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2;
}
function Jr(s, e, t, n, r, i) {
  const o = Math.min(i, n / 2, r / 2);
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + n - o, t), s.quadraticCurveTo(e + n, t, e + n, t + o), s.lineTo(e + n, t + r - o), s.quadraticCurveTo(e + n, t + r, e + n - o, t + r), s.lineTo(e + o, t + r), s.quadraticCurveTo(e, t + r, e, t + r - o), s.lineTo(e, t + o), s.quadraticCurveTo(e, t, e + o, t), s.closePath();
}
function Mb() {
  if (typeof window > "u") return !1;
  if (window.__HOST_WEBVIEW_MARK__) return !0;
  try {
    return window !== window.top;
  } catch {
    return !0;
  }
}
const Bb = Q("media.permission");
async function Ib(s, e) {
  if (!Mb())
    return { camera: !0, microphone: !0 };
  const t = [];
  s && t.push("camera"), e && t.push("microphone");
  const n = await al(...t), r = {
    camera: s ? n.camera === "granted" : !0,
    microphone: e ? n.microphone === "granted" : !0
  };
  return Bb.info("device permissions resolved", { ...r, wantVideo: s, wantAudio: e }), r;
}
const Rb = Ib, Kt = Q("media.capture");
class xs extends Error {
  camera;
  microphone;
  constructor(e, t) {
    const n = [];
    e || n.push("camera"), t || n.push("microphone"), super(`Host denied access to: ${n.join(", ")}`), this.name = "HostMediaPermissionError", this.camera = e, this.microphone = t;
  }
}
async function Li(s = !0, e = !0) {
  const t = await Rb(s, e);
  Kt.info("host permissions resolved", {
    camera: t.camera,
    microphone: t.microphone,
    wantVideo: s,
    wantAudio: e
  });
  const n = s && !t.camera, r = e && !t.microphone;
  if (n || r)
    throw new xs(t.camera, t.microphone);
  try {
    const i = await navigator.mediaDevices.getUserMedia({
      video: s ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : !1,
      audio: e ? { echoCancellation: !0, noiseSuppression: !0, autoGainControl: !0 } : !1
    });
    return Ob(), i;
  } catch (i) {
    const o = i;
    if (Kt.error("getUserMedia failed", { name: o.name, message: o.message, err: i }), s && e && o.name === "NotAllowedError") {
      let a = !1, c = !1;
      try {
        const u = await navigator.mediaDevices.getUserMedia({ video: !0 });
        a = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Kt.error("camera-only probe failed", { err: u });
      }
      try {
        const u = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        c = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Kt.error("microphone-only probe failed", { err: u });
      }
      const l = [];
      a || l.push("camera"), c || l.push("microphone");
      const d = await hc(l, s, e);
      if (d) return d;
      throw new xs(a, c);
    }
    if (o.name === "NotAllowedError") {
      const a = await hc(
        s ? ["camera"] : e ? ["microphone"] : [],
        s,
        e
      );
      if (a) return a;
    }
    throw i;
  }
}
const Ui = "spotlight.media.staleGrantRetry";
async function hc(s, e, t) {
  if (s.length === 0) return null;
  try {
    if (sessionStorage.getItem(Ui) === "1")
      return Kt.warn("already re-asked for a stale device grant this session — not looping", { blocked: s }), null;
    sessionStorage.setItem(Ui, "1");
  } catch {
    return null;
  }
  Kt.warn("the OS refused a device we had remembered as granted — re-asking once", { blocked: s }), cf(...s);
  try {
    return await Li(e, t);
  } catch (n) {
    return Kt.warn("the device was still refused after re-asking", { blocked: s, err: n }), null;
  }
}
function Ob() {
  try {
    sessionStorage.removeItem(Ui);
  } catch {
  }
}
function Hs(s) {
  s && s.getTracks().forEach((e) => e.stop());
}
function Pb(s, e) {
  if (s.match(/^[a-z]+:\/\//i))
    return s;
  if (s.match(/^\/\//))
    return window.location.protocol + s;
  if (s.match(/^[a-z]+:/i))
    return s;
  const t = document.implementation.createHTMLDocument(), n = t.createElement("base"), r = t.createElement("a");
  return t.head.appendChild(n), t.body.appendChild(r), e && (n.href = e), r.href = s, r.href;
}
const Fb = /* @__PURE__ */ (() => {
  let s = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (s += 1, `u${e()}${s}`);
})();
function Ft(s) {
  const e = [];
  for (let t = 0, n = s.length; t < n; t++)
    e.push(s[t]);
  return e;
}
let fs = null;
function Rd(s = {}) {
  return fs || (s.includeStyleProperties ? (fs = s.includeStyleProperties, fs) : (fs = Ft(window.getComputedStyle(document.documentElement)), fs));
}
function ar(s, e) {
  const n = (s.ownerDocument.defaultView || window).getComputedStyle(s).getPropertyValue(e);
  return n ? parseFloat(n.replace("px", "")) : 0;
}
function Lb(s) {
  const e = ar(s, "border-left-width"), t = ar(s, "border-right-width");
  return s.clientWidth + e + t;
}
function Ub(s) {
  const e = ar(s, "border-top-width"), t = ar(s, "border-bottom-width");
  return s.clientHeight + e + t;
}
function Od(s, e = {}) {
  const t = e.width || Lb(s), n = e.height || Ub(s);
  return { width: t, height: n };
}
function Db() {
  let s, e;
  try {
    e = process;
  } catch {
  }
  const t = e && e.env ? e.env.devicePixelRatio : null;
  return t && (s = parseInt(t, 10), Number.isNaN(s) && (s = 1)), s || window.devicePixelRatio || 1;
}
const Oe = 16384;
function Nb(s) {
  (s.width > Oe || s.height > Oe) && (s.width > Oe && s.height > Oe ? s.width > s.height ? (s.height *= Oe / s.width, s.width = Oe) : (s.width *= Oe / s.height, s.height = Oe) : s.width > Oe ? (s.height *= Oe / s.width, s.width = Oe) : (s.width *= Oe / s.height, s.height = Oe));
}
function cr(s) {
  return new Promise((e, t) => {
    const n = new Image();
    n.onload = () => {
      n.decode().then(() => {
        requestAnimationFrame(() => e(n));
      });
    }, n.onerror = t, n.crossOrigin = "anonymous", n.decoding = "async", n.src = s;
  });
}
async function $b(s) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(s)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Vb(s, e, t) {
  const n = "http://www.w3.org/2000/svg", r = document.createElementNS(n, "svg"), i = document.createElementNS(n, "foreignObject");
  return r.setAttribute("width", `${e}`), r.setAttribute("height", `${t}`), r.setAttribute("viewBox", `0 0 ${e} ${t}`), i.setAttribute("width", "100%"), i.setAttribute("height", "100%"), i.setAttribute("x", "0"), i.setAttribute("y", "0"), i.setAttribute("externalResourcesRequired", "true"), r.appendChild(i), i.appendChild(s), $b(r);
}
const Re = (s, e) => {
  if (s instanceof e)
    return !0;
  const t = Object.getPrototypeOf(s);
  return t === null ? !1 : t.constructor.name === e.name || Re(t, e);
};
function Hb(s) {
  const e = s.getPropertyValue("content");
  return `${s.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function zb(s, e) {
  return Rd(e).map((t) => {
    const n = s.getPropertyValue(t), r = s.getPropertyPriority(t);
    return `${t}: ${n}${r ? " !important" : ""};`;
  }).join(" ");
}
function jb(s, e, t, n) {
  const r = `.${s}:${e}`, i = t.cssText ? Hb(t) : zb(t, n);
  return document.createTextNode(`${r}{${i}}`);
}
function fc(s, e, t, n) {
  const r = window.getComputedStyle(s, t), i = r.getPropertyValue("content");
  if (i === "" || i === "none")
    return;
  const o = Fb();
  try {
    e.className = `${e.className} ${o}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(jb(o, t, r, n)), e.appendChild(a);
}
function qb(s, e, t) {
  fc(s, e, ":before", t), fc(s, e, ":after", t);
}
const pc = "application/font-woff", mc = "image/jpeg", Wb = {
  woff: pc,
  woff2: pc,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: mc,
  jpeg: mc,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Gb(s) {
  const e = /\.([^./]*?)$/g.exec(s);
  return e ? e[1] : "";
}
function So(s) {
  const e = Gb(s).toLowerCase();
  return Wb[e] || "";
}
function Zb(s) {
  return s.split(/,/)[1];
}
function Di(s) {
  return s.search(/^(data:)/) !== -1;
}
function Kb(s, e) {
  return `data:${e};base64,${s}`;
}
async function Pd(s, e, t) {
  const n = await fetch(s, e);
  if (n.status === 404)
    throw new Error(`Resource "${n.url}" not found`);
  const r = await n.blob();
  return new Promise((i, o) => {
    const a = new FileReader();
    a.onerror = o, a.onloadend = () => {
      try {
        i(t({ res: n, result: a.result }));
      } catch (c) {
        o(c);
      }
    }, a.readAsDataURL(r);
  });
}
const ei = {};
function Xb(s, e, t) {
  let n = s.replace(/\?.*/, "");
  return t && (n = s), /ttf|otf|eot|woff2?/i.test(n) && (n = n.replace(/.*\//, "")), e ? `[${e}]${n}` : n;
}
async function _o(s, e, t) {
  const n = Xb(s, e, t.includeQueryParams);
  if (ei[n] != null)
    return ei[n];
  t.cacheBust && (s += (/\?/.test(s) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let r;
  try {
    const i = await Pd(s, t.fetchRequestInit, ({ res: o, result: a }) => (e || (e = o.headers.get("Content-Type") || ""), Zb(a)));
    r = Kb(i, e);
  } catch (i) {
    r = t.imagePlaceholder || "";
    let o = `Failed to fetch resource: ${s}`;
    i && (o = typeof i == "string" ? i : i.message), o && console.warn(o);
  }
  return ei[n] = r, r;
}
async function Yb(s) {
  const e = s.toDataURL();
  return e === "data:," ? s.cloneNode(!1) : cr(e);
}
async function Qb(s, e) {
  if (s.currentSrc) {
    const i = document.createElement("canvas"), o = i.getContext("2d");
    i.width = s.clientWidth, i.height = s.clientHeight, o?.drawImage(s, 0, 0, i.width, i.height);
    const a = i.toDataURL();
    return cr(a);
  }
  const t = s.poster, n = So(t), r = await _o(t, n, e);
  return cr(r);
}
async function Jb(s, e) {
  var t;
  try {
    if (!((t = s?.contentDocument) === null || t === void 0) && t.body)
      return await gr(s.contentDocument.body, e, !0);
  } catch {
  }
  return s.cloneNode(!1);
}
async function ev(s, e) {
  return Re(s, HTMLCanvasElement) ? Yb(s) : Re(s, HTMLVideoElement) ? Qb(s, e) : Re(s, HTMLIFrameElement) ? Jb(s, e) : s.cloneNode(Fd(s));
}
const tv = (s) => s.tagName != null && s.tagName.toUpperCase() === "SLOT", Fd = (s) => s.tagName != null && s.tagName.toUpperCase() === "SVG";
async function sv(s, e, t) {
  var n, r;
  if (Fd(e))
    return e;
  let i = [];
  return tv(s) && s.assignedNodes ? i = Ft(s.assignedNodes()) : Re(s, HTMLIFrameElement) && (!((n = s.contentDocument) === null || n === void 0) && n.body) ? i = Ft(s.contentDocument.body.childNodes) : i = Ft(((r = s.shadowRoot) !== null && r !== void 0 ? r : s).childNodes), i.length === 0 || Re(s, HTMLVideoElement) || await i.reduce((o, a) => o.then(() => gr(a, t)).then((c) => {
    c && e.appendChild(c);
  }), Promise.resolve()), e;
}
function nv(s, e, t) {
  const n = e.style;
  if (!n)
    return;
  const r = window.getComputedStyle(s);
  r.cssText ? (n.cssText = r.cssText, n.transformOrigin = r.transformOrigin) : Rd(t).forEach((i) => {
    let o = r.getPropertyValue(i);
    i === "font-size" && o.endsWith("px") && (o = `${Math.floor(parseFloat(o.substring(0, o.length - 2))) - 0.1}px`), Re(s, HTMLIFrameElement) && i === "display" && o === "inline" && (o = "block"), i === "d" && e.getAttribute("d") && (o = `path(${e.getAttribute("d")})`), n.setProperty(i, o, r.getPropertyPriority(i));
  });
}
function rv(s, e) {
  Re(s, HTMLTextAreaElement) && (e.innerHTML = s.value), Re(s, HTMLInputElement) && e.setAttribute("value", s.value);
}
function iv(s, e) {
  if (Re(s, HTMLSelectElement)) {
    const n = Array.from(e.children).find((r) => s.value === r.getAttribute("value"));
    n && n.setAttribute("selected", "");
  }
}
function ov(s, e, t) {
  return Re(e, Element) && (nv(s, e, t), qb(s, e, t), rv(s, e), iv(s, e)), e;
}
async function av(s, e) {
  const t = s.querySelectorAll ? s.querySelectorAll("use") : [];
  if (t.length === 0)
    return s;
  const n = {};
  for (let i = 0; i < t.length; i++) {
    const a = t[i].getAttribute("xlink:href");
    if (a) {
      const c = s.querySelector(a), l = document.querySelector(a);
      !c && l && !n[a] && (n[a] = await gr(l, e, !0));
    }
  }
  const r = Object.values(n);
  if (r.length) {
    const i = "http://www.w3.org/1999/xhtml", o = document.createElementNS(i, "svg");
    o.setAttribute("xmlns", i), o.style.position = "absolute", o.style.width = "0", o.style.height = "0", o.style.overflow = "hidden", o.style.display = "none";
    const a = document.createElementNS(i, "defs");
    o.appendChild(a);
    for (let c = 0; c < r.length; c++)
      a.appendChild(r[c]);
    s.appendChild(o);
  }
  return s;
}
async function gr(s, e, t) {
  return !t && e.filter && !e.filter(s) ? null : Promise.resolve(s).then((n) => ev(n, e)).then((n) => sv(s, n, e)).then((n) => ov(s, n, e)).then((n) => av(n, e));
}
const Ld = /url\((['"]?)([^'"]+?)\1\)/g, cv = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, lv = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function dv(s) {
  const e = s.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function uv(s) {
  const e = [];
  return s.replace(Ld, (t, n, r) => (e.push(r), t)), e.filter((t) => !Di(t));
}
async function hv(s, e, t, n, r) {
  try {
    const i = t ? Pb(e, t) : e, o = So(e);
    let a;
    return r || (a = await _o(i, o, n)), s.replace(dv(e), `$1${a}$3`);
  } catch {
  }
  return s;
}
function fv(s, { preferredFontFormat: e }) {
  return e ? s.replace(lv, (t) => {
    for (; ; ) {
      const [n, , r] = cv.exec(t) || [];
      if (!r)
        return "";
      if (r === e)
        return `src: ${n};`;
    }
  }) : s;
}
function Ud(s) {
  return s.search(Ld) !== -1;
}
async function Dd(s, e, t) {
  if (!Ud(s))
    return s;
  const n = fv(s, t);
  return uv(n).reduce((i, o) => i.then((a) => hv(a, o, e, t)), Promise.resolve(n));
}
async function ps(s, e, t) {
  var n;
  const r = (n = e.style) === null || n === void 0 ? void 0 : n.getPropertyValue(s);
  if (r) {
    const i = await Dd(r, null, t);
    return e.style.setProperty(s, i, e.style.getPropertyPriority(s)), !0;
  }
  return !1;
}
async function pv(s, e) {
  await ps("background", s, e) || await ps("background-image", s, e), await ps("mask", s, e) || await ps("-webkit-mask", s, e) || await ps("mask-image", s, e) || await ps("-webkit-mask-image", s, e);
}
async function mv(s, e) {
  const t = Re(s, HTMLImageElement);
  if (!(t && !Di(s.src)) && !(Re(s, SVGImageElement) && !Di(s.href.baseVal)))
    return;
  const n = t ? s.src : s.href.baseVal, r = await _o(n, So(n), e);
  await new Promise((i, o) => {
    s.onload = i, s.onerror = e.onImageErrorHandler ? (...c) => {
      try {
        i(e.onImageErrorHandler(...c));
      } catch (l) {
        o(l);
      }
    } : o;
    const a = s;
    a.decode && (a.decode = i), a.loading === "lazy" && (a.loading = "eager"), t ? (s.srcset = "", s.src = r) : s.href.baseVal = r;
  });
}
async function gv(s, e) {
  const n = Ft(s.childNodes).map((r) => Nd(r, e));
  await Promise.all(n).then(() => s);
}
async function Nd(s, e) {
  Re(s, Element) && (await pv(s, e), await mv(s, e), await gv(s, e));
}
function yv(s, e) {
  const { style: t } = s;
  e.backgroundColor && (t.backgroundColor = e.backgroundColor), e.width && (t.width = `${e.width}px`), e.height && (t.height = `${e.height}px`);
  const n = e.style;
  return n != null && Object.keys(n).forEach((r) => {
    t[r] = n[r];
  }), s;
}
const gc = {};
async function yc(s) {
  let e = gc[s];
  if (e != null)
    return e;
  const n = await (await fetch(s)).text();
  return e = { url: s, cssText: n }, gc[s] = e, e;
}
async function wc(s, e) {
  let t = s.cssText;
  const n = /url\(["']?([^"')]+)["']?\)/g, i = (t.match(/url\([^)]+\)/g) || []).map(async (o) => {
    let a = o.replace(n, "$1");
    return a.startsWith("https://") || (a = new URL(a, s.url).href), Pd(a, e.fetchRequestInit, ({ result: c }) => (t = t.replace(o, `url(${c})`), [o, c]));
  });
  return Promise.all(i).then(() => t);
}
function bc(s) {
  if (s == null)
    return [];
  const e = [], t = /(\/\*[\s\S]*?\*\/)/gi;
  let n = s.replace(t, "");
  const r = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const c = r.exec(n);
    if (c === null)
      break;
    e.push(c[0]);
  }
  n = n.replace(r, "");
  const i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, o = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", a = new RegExp(o, "gi");
  for (; ; ) {
    let c = i.exec(n);
    if (c === null) {
      if (c = a.exec(n), c === null)
        break;
      i.lastIndex = a.lastIndex;
    } else
      a.lastIndex = i.lastIndex;
    e.push(c[0]);
  }
  return e;
}
async function wv(s, e) {
  const t = [], n = [];
  return s.forEach((r) => {
    if ("cssRules" in r)
      try {
        Ft(r.cssRules || []).forEach((i, o) => {
          if (i.type === CSSRule.IMPORT_RULE) {
            let a = o + 1;
            const c = i.href, l = yc(c).then((d) => wc(d, e)).then((d) => bc(d).forEach((u) => {
              try {
                r.insertRule(u, u.startsWith("@import") ? a += 1 : r.cssRules.length);
              } catch (h) {
                console.error("Error inserting rule from remote css", {
                  rule: u,
                  error: h
                });
              }
            })).catch((d) => {
              console.error("Error loading remote css", d.toString());
            });
            n.push(l);
          }
        });
      } catch (i) {
        const o = s.find((a) => a.href == null) || document.styleSheets[0];
        r.href != null && n.push(yc(r.href).then((a) => wc(a, e)).then((a) => bc(a).forEach((c) => {
          o.insertRule(c, o.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", i);
      }
  }), Promise.all(n).then(() => (s.forEach((r) => {
    if ("cssRules" in r)
      try {
        Ft(r.cssRules || []).forEach((i) => {
          t.push(i);
        });
      } catch (i) {
        console.error(`Error while reading CSS rules from ${r.href}`, i);
      }
  }), t));
}
function bv(s) {
  return s.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Ud(e.style.getPropertyValue("src")));
}
async function vv(s, e) {
  if (s.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const t = Ft(s.ownerDocument.styleSheets), n = await wv(t, e);
  return bv(n);
}
function $d(s) {
  return s.trim().replace(/["']/g, "");
}
function Sv(s) {
  const e = /* @__PURE__ */ new Set();
  function t(n) {
    (n.style.fontFamily || getComputedStyle(n).fontFamily).split(",").forEach((i) => {
      e.add($d(i));
    }), Array.from(n.children).forEach((i) => {
      i instanceof HTMLElement && t(i);
    });
  }
  return t(s), e;
}
async function Vd(s, e) {
  const t = await vv(s, e), n = Sv(s);
  return (await Promise.all(t.filter((i) => n.has($d(i.style.fontFamily))).map((i) => {
    const o = i.parentStyleSheet ? i.parentStyleSheet.href : null;
    return Dd(i.cssText, o, e);
  }))).join(`
`);
}
async function _v(s, e) {
  const t = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Vd(s, e);
  if (t) {
    const n = document.createElement("style"), r = document.createTextNode(t);
    n.appendChild(r), s.firstChild ? s.insertBefore(n, s.firstChild) : s.appendChild(n);
  }
}
async function xv(s, e = {}) {
  const { width: t, height: n } = Od(s, e), r = await gr(s, e, !0);
  return await _v(r, e), await Nd(r, e), yv(r, e), await Vb(r, t, n);
}
async function kv(s, e = {}) {
  const { width: t, height: n } = Od(s, e), r = await xv(s, e), i = await cr(r), o = document.createElement("canvas"), a = o.getContext("2d"), c = e.pixelRatio || Db(), l = e.canvasWidth || t, d = e.canvasHeight || n;
  return o.width = l * c, o.height = d * c, e.skipAutoScale || Nb(o), o.style.width = `${l}`, o.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, o.width, o.height)), a.drawImage(i, 0, 0, o.width, o.height), o;
}
async function Ev(s, e = {}) {
  return Vd(s, e);
}
const Tv = Q("sdk.capture"), Cv = 250, Av = 2e3;
function Mv(s, e = 1280, t = 720) {
  const n = document.createElement("canvas");
  n.width = e, n.height = t;
  const r = n.getContext("2d"), i = getComputedStyle(document.body).backgroundColor || "#000";
  let o = !0, a = !1, c = 0, l = !1, d = 0;
  const u = Ev(s).catch(() => ""), h = () => {
    r.fillStyle = i, r.fillRect(0, 0, e, t);
  }, f = async () => {
    a = !0, o = !1, c = Date.now();
    try {
      const p = await kv(s, {
        backgroundColor: i,
        pixelRatio: 1,
        fontEmbedCSS: await u,
        // The clone keeps the element's own margin (e.g. from a parent's
        // space-y-*) but not the room for it, which cuts off the bottom.
        style: { margin: "0" }
      });
      if (l || p.width === 0 || p.height === 0) return;
      const b = Math.min(e / p.width, t / p.height), y = p.width * b, k = p.height * b;
      h(), r.drawImage(p, (e - y) / 2, (t - k) / 2, y, k);
    } catch (p) {
      d++ < 3 && Tv.warn("element snapshot failed", { err: p });
    } finally {
      a = !1;
    }
  }, g = new MutationObserver(() => {
    o = !0;
  });
  g.observe(s, { subtree: !0, childList: !0, attributes: !0, characterData: !0 });
  const m = setInterval(() => {
    a || l || (o || Date.now() - c >= Av) && f();
  }, Cv);
  return h(), f(), {
    canvas: n,
    stop: () => {
      l = !0, clearInterval(m), g.disconnect();
    }
  };
}
const Bv = Q("sdk.media"), ti = 30;
class Qs {
  compositor = new Tb();
  mixer = new _b();
  appVideo;
  ownsAppVideo;
  stopCapture;
  camera = null;
  mic = null;
  micOn = !1;
  released = !1;
  constructor(e, t, n) {
    this.appVideo = e, this.ownsAppVideo = t, this.stopCapture = n;
  }
  /** Starts painting and mixing the app's media. Camera and mic start off. */
  static async start(e) {
    const { video: t } = e;
    let n;
    if (t instanceof MediaStream)
      n = new Qs(t, !1, null);
    else if (t instanceof HTMLCanvasElement)
      n = new Qs(t.captureStream(e.fps ?? ti), !0, null);
    else {
      const r = Mv(t);
      n = new Qs(r.canvas.captureStream(e.fps ?? ti), !0, r.stop);
    }
    try {
      await n.compositor.start(n.appVideo, null);
      const r = e.audio instanceof MediaStream ? e.audio.getAudioTracks()[0] ?? null : e.audio ?? null;
      if (n.mixer.start({ system: r }), !n.mixer.getContext() || !n.mixer.getOutputNode()) throw new Error("The audio graph did not start.");
      return n;
    } catch (r) {
      throw n.release(), r;
    }
  }
  /** The composite as viewers will see it, for a preview `<video>`. */
  previewStream() {
    return this.compositor.getCanvas().captureStream(ti);
  }
  get cameraOn() {
    return this.camera !== null;
  }
  get microphoneOn() {
    return this.micOn;
  }
  /**
   * Ask for both devices in one host round trip, as Spotlight's Open camera
   * does. A device the host refuses stays off; the other still starts.
   * Returns what was refused, for the caller to name.
   */
  async startDevices(e, t) {
    if (!e && !t) return { camera: !1, microphone: !1 };
    try {
      return this.adopt(await Li(e, t)), { camera: !1, microphone: !1 };
    } catch (n) {
      if (!(n instanceof xs)) throw n;
      Bv.warn("a device was refused — starting the other alone", { camera: n.camera, microphone: n.microphone });
      const r = e && n.camera, i = t && n.microphone;
      return (r || i) && this.adopt(await Li(r, i)), { camera: e && !n.camera, microphone: t && !n.microphone };
    }
  }
  /** Camera tile on or off. Off stops the camera, so its light goes out. */
  async setCamera(e) {
    if (!(e === this.cameraOn || this.released)) {
      if (e) {
        if ((await this.startDevices(!0, !1)).camera) throw new xs(!1, !0);
        return;
      }
      this.compositor.setScene("screen"), this.compositor.setCameraSource(null), Hs(this.camera), this.camera = null;
    }
  }
  /** Microphone on or off. Off mutes the track, so turning it back on asks nothing. */
  async setMicrophone(e) {
    if (!this.released) {
      if (e && !this.mic) {
        if ((await this.startDevices(!1, !0)).microphone) throw new xs(!0, !1);
        return;
      }
      for (const t of this.mic?.getAudioTracks() ?? []) t.enabled = e;
      this.micOn = e && this.mic !== null;
    }
  }
  release() {
    this.released || (this.released = !0, this.compositor.stop(), this.mixer.stop(), Hs(this.camera), Hs(this.mic), this.ownsAppVideo && Hs(this.appVideo), this.stopCapture?.());
  }
  adopt(e) {
    if (this.released) {
      Hs(e);
      return;
    }
    const [t] = e.getVideoTracks(), [n] = e.getAudioTracks();
    t && (this.camera = new MediaStream([t]), this.compositor.setCameraSource(this.camera), this.compositor.setScene("both")), n && (this.mic = new MediaStream([n]), this.mixer.setMicSource(n), this.micOn = !0);
  }
}
const bs = Q("sdk.broadcast"), Iv = 3e4, Rv = 2e3, Ov = 1e4, Pv = 1e4, Fv = 6e4, Lv = "spotlight-mesh";
function Jv() {
  return Gc(Wc());
}
async function Hd(s) {
  const e = ff(await hf());
  if (!e)
    throw new Error("This browser cannot host a stream: WebCodecs H.264 with Opus or AAC is required.");
  const t = await Qs.start(s);
  let n;
  try {
    n = await t.startDevices(s.camera ?? !1, s.microphone ?? !1);
  } catch (i) {
    throw t.release(), i;
  }
  let r = null;
  return {
    stream: t.previewStream(),
    refused: n,
    get camera() {
      return t.cameraOn;
    },
    get microphone() {
      return t.microphoneOn;
    },
    setCamera: (i) => t.setCamera(i),
    setMicrophone: (i) => t.setMicrophone(i),
    goLive: (i) => (r ??= Uv(t, e, i).catch((o) => {
      throw r = null, o;
    }), r),
    cancel: () => t.release()
  };
}
async function eS(s) {
  const e = await Hd(s);
  try {
    return await e.goLive(s);
  } catch (t) {
    throw e.cancel(), t;
  }
}
async function Uv(s, e, t) {
  const n = Kc(window.location), r = await Nv(n), i = (t.hostName || n).slice(0, 64), o = await af("statements", "statement-submit");
  for (const f of ["statements", "statement-submit"]) {
    const g = o[f];
    if (g && g !== "granted") throw new Error(lf[g]);
  }
  const a = zv(), c = new Vm({ claimSlotWhenFull: !0 });
  let l = null;
  if (c.onFatalError = (f) => {
    l ??= f, a.emit("error", { message: f.message, fatal: !0 });
  }, c.onSubmitError = (f) => a.emit("error", { message: f.message, fatal: !1 }), await c.connect(), !c.isConnected)
    throw c.destroy(), l ?? new Error("The host has no Statement Store, so the stream cannot be announced.");
  c.setProductAccount({ dotNsIdentifier: n, derivationIndex: 0 });
  const d = Date.now();
  jm();
  let u = null, h = null;
  try {
    const f = s.mixer.getContext(), g = s.mixer.getOutputNode();
    if (!f || !g) throw new Error("The audio graph did not start.");
    const m = Rm(r), p = new Sb({
      selfAddr: r,
      selfName: i,
      epoch: d,
      transport: Gm(c, m),
      codecs: e,
      canvas: s.compositor.getCanvas(),
      audioContext: f,
      audioSource: g,
      callbacks: {
        onFlood: (M) => $v(M, a),
        onPeersChanged: () => {
          queueMicrotask(() => {
            const M = p.node.neighborAddrs.length;
            M < b && h?.reopen("neighbor dropped", { degree: M }), b = M;
          });
        },
        onEncoderError: (M) => {
          bs.error("encoder pipeline failed", { err: M }), a.emit("error", { message: M.message, fatal: !0 });
        }
      }
    });
    let b = 0;
    await p.start(), u = p;
    const y = Hv(c, m, () => p.joinsInFlight);
    h = y;
    const k = await mf(r), U = Im(), q = Om(), G = /* @__PURE__ */ new Set(), L = async (M) => {
      let W;
      try {
        W = c.submit(
          U,
          {
            type: "heartbeat",
            from: r,
            timestamp: Date.now(),
            payload: {
              roomHash: k,
              hostAddress: r,
              hostName: i,
              title: t.title.slice(0, 200),
              viewerCount: p.node.stats().presenceCount,
              startedAt: d,
              mesh: p.mesh(),
              ...M ? { ended: !0 } : {}
            }
          },
          { channel: q }
        ), M || G.add(W), await W;
      } catch (ee) {
        if (Vh(ee)) return;
        bs.error("heartbeat failed", { err: ee });
      } finally {
        W && G.delete(W);
      }
    };
    L(!1);
    const j = setInterval(() => void L(!1), Iv), V = setInterval(() => {
      a.emit("viewers", p.node.stats().presenceCount);
    }, Rv);
    let te = document.visibilityState === "hidden";
    const K = () => {
      if (document.visibilityState === "hidden") {
        te = !0;
        return;
      }
      L(!1), te && (te = !1, c.refreshAllSubscriptions());
    }, _ = () => {
      L(!1), c.refreshAllSubscriptions();
    }, I = (M) => {
      M.persisted || P();
    };
    document.addEventListener("visibilitychange", K), window.addEventListener("online", _), window.addEventListener("pagehide", I);
    let A = null;
    const P = () => (A ??= (async () => {
      clearInterval(j), clearInterval(V), y.stop(), document.removeEventListener("visibilitychange", K), window.removeEventListener("online", _), window.removeEventListener("pagehide", I);
      try {
        await p.end();
      } catch (M) {
        bs.warn("swarm end failed — teardown continues", { err: M });
      }
      await Promise.allSettled([...G]), await L(!0), s.release(), c.destroy(), a.emit("ended", void 0), a.clear();
    })(), A);
    return {
      roomHash: k,
      roomUrl: Vv(k, t.spotlightOrigin),
      hostAddress: r,
      on: a.on,
      sendChat: (M) => p.sendChat(i, M.slice(0, 500), Date.now()),
      get camera() {
        return s.cameraOn;
      },
      get microphone() {
        return s.microphoneOn;
      },
      setCamera: (M) => s.setCamera(M),
      setMicrophone: (M) => s.setMicrophone(M),
      end: P
    };
  } catch (f) {
    throw bs.error("go live failed", { err: f }), h?.stop(), u && await u.end().catch(() => {
    }), c.destroy(), f;
  }
}
const Dv = Hc();
async function Nv(s) {
  const e = await Lt(eu(), Es.read, "getAccountsProvider");
  if (!e) throw new Error("Not inside a Polkadot host, so there is no account to stream from.");
  const t = await Lt(
    Promise.resolve(e.getProductAccount(s, 0)),
    Es.hostDialog,
    "getProductAccount"
  );
  if (t.isErr()) {
    const r = rh(t.error) ?? tu(t.error);
    throw new Error(`The host refused a product account for ${s}: ${r}`);
  }
  const { publicKey: n } = t.value;
  return Dv.dec(n);
}
function $v(s, e) {
  s.t === "chat" ? e.emit("chat", { from: s.from, senderName: s.senderName, text: s.text, timestamp: s.ts }) : s.t === "reaction" && e.emit("reaction", { from: s.from, emoji: s.emoji });
}
function Vv(s, e) {
  if (e) return `${e.replace(/\/+$/, "")}/#/room/${s}`;
  const { hostname: t, protocol: n } = window.location;
  if (n !== "https:" && n !== "http:" || /^[\d.]+$/.test(t) || t.includes(":") || t.endsWith(`.${Gi}`)) return null;
  const r = t.split(".");
  if (r.length < 3) return null;
  const i = r.slice(-2).join(".");
  return `${window.location.protocol}//${Lv}.${i}/#/room/${s}`;
}
function Hv(s, e, t) {
  let n = 0, r = null;
  const i = (a, c) => {
    const l = Date.now();
    if (t() > 0 || l - n < Pv) {
      r ??= { reason: a, sinceMs: l };
      return;
    }
    r = null, n = l;
    const d = s.reopenTopic(e);
    bs.info(`signal route reopen (${d ? "done" : "no live route"}): ${a}`, c);
  }, o = setInterval(() => {
    const a = s.silentMsFor(e);
    if (a !== null) {
      if (r) {
        const c = Date.now() - r.sinceMs;
        a < c ? r = null : i(`${r.reason}, deferred`, { waitedMs: c });
        return;
      }
      a >= Fv && i("topic quiet", { silentMs: a });
    }
  }, Ov);
  return { reopen: i, stop: () => clearInterval(o) };
}
function zv() {
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
        } catch (r) {
          bs.warn("event handler threw", { event: e, err: r });
        }
    },
    clear: () => s.clear()
  };
}
const zd = `
:host { all: initial; }
* { box-sizing: border-box; }
.surface { font: 14px/1.45 Inter, system-ui, -apple-system, sans-serif; color: #F4F4F5; }
button { font: inherit; min-height: 40px; padding: 8px 14px; border-radius: 10px; cursor: pointer;
  border: 1px solid #2C2E34; background: transparent; color: #F4F4F5;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
button:hover:not(:disabled) { background: #2C2E34; }
button:disabled { opacity: 0.5; cursor: default; }
button.toggle[aria-pressed="false"] { color: #8C8F98; }
button svg { width: 16px; height: 16px; flex: none; }
.primary { background: #FFFFFF; color: #0B0C0F; border-color: #FFFFFF; font-weight: 600; }
.primary:hover:not(:disabled) { background: #DADBE0; }
.error { color: #D9363E; font-size: 13px; }
.error:empty { display: none; }
`, jv = {
  camera: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  cameraOff: '<path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>',
  microphone: '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
  microphoneOff: '<path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
  link: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  log: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>'
};
function Cn(s) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${jv[s]}</svg>`;
}
function jd(s) {
  const e = document.createElement("div");
  e.setAttribute(s, "");
  for (const t of ["keydown", "keyup", "keypress"]) e.addEventListener(t, (n) => n.stopPropagation());
  return { host: e, root: e.attachShadow({ mode: "open" }) };
}
const qv = 6e3, Wv = `${zd}
.bar { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 6px 6px 12px;
  background: #1A1B20; border: 1px solid #2C2E34; border-radius: 14px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45); }
.floating { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000; max-width: calc(100vw - 32px); }
.live { display: flex; align-items: center; gap: 6px; color: #D9363E; font-weight: 600; margin-right: 4px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #D9363E; animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
button { min-height: 36px; padding: 6px 10px; }
.notice { flex-basis: 100%; margin: 0; padding: 0 2px 2px; font-size: 13px; color: #8C8F98; word-break: break-all; }
.notice:empty { display: none; }
.notice.error { color: #D9363E; }
`;
function Gv(s, e = {}) {
  const { host: t, root: n } = jd("data-spotlight-controls");
  n.innerHTML = `
    <style>${Wv}</style>
    <div class="surface bar ${e.container ? "" : "floating"}" role="toolbar" aria-label="Spotlight stream">
      <span class="live" aria-live="polite"><span class="dot"></span><span class="count">LIVE</span></span>
      <button class="toggle" data-device="camera"></button>
      <button class="toggle" data-device="microphone"></button>
      ${s.roomUrl ? `<button data-action="link" aria-label="Copy viewer link" title="Copy viewer link">${Cn("link")}</button>` : ""}
      <button data-action="log" aria-label="Copy stream log" title="Copy stream log">${Cn("log")}</button>
      <button data-action="end">End</button>
      <p class="notice" role="status"></p>
    </div>`;
  const r = (m) => n.querySelector(m), i = r(".count"), o = r(".notice"), a = r('[data-action="end"]'), c = {
    camera: r('[data-device="camera"]'),
    microphone: r('[data-device="microphone"]')
  };
  let l;
  const d = (m, p = !1) => {
    clearTimeout(l), o.textContent = m, o.classList.toggle("error", p), l = setTimeout(() => o.textContent = "", qv);
  }, u = async (m, p, b) => {
    try {
      await navigator.clipboard.writeText(m), d(p);
    } catch {
      d(b);
    }
  }, h = () => {
    const m = s.camera, p = s.microphone;
    c.camera.setAttribute("aria-pressed", String(m)), c.camera.setAttribute("aria-label", m ? "Turn camera off" : "Turn camera on"), c.camera.innerHTML = Cn(m ? "camera" : "cameraOff"), c.microphone.setAttribute("aria-pressed", String(p)), c.microphone.setAttribute("aria-label", p ? "Mute microphone" : "Unmute microphone"), c.microphone.innerHTML = Cn(p ? "microphone" : "microphoneOff");
  };
  for (const m of ["camera", "microphone"])
    c[m].addEventListener("click", async () => {
      const p = c[m];
      p.disabled = !0;
      try {
        m === "camera" ? await s.setCamera(!s.camera) : await s.setMicrophone(!s.microphone);
      } catch {
        d(`Polkadot did not allow the ${m}.`, !0);
      } finally {
        p.disabled = !1, h();
      }
    });
  n.querySelector('[data-action="link"]')?.addEventListener("click", () => {
    u(s.roomUrl, "Viewer link copied.", s.roomUrl);
  }), r('[data-action="log"]').addEventListener("click", () => {
    u(Gc(Wc()), "Stream log copied.", "Could not copy the stream log.");
  }), a.addEventListener("click", () => {
    a.disabled = !0, a.textContent = "Ending…", s.end();
  });
  const f = [
    s.on("viewers", (m) => i.textContent = `LIVE · ${m} ${m === 1 ? "viewer" : "viewers"}`),
    s.on("error", ({ message: m, fatal: p }) => d(p ? `Stream failed: ${m}` : m, !0)),
    s.on("ended", () => g())
  ], g = () => {
    clearTimeout(l);
    for (const m of f) m();
    t.remove();
  };
  return h(), (e.container ?? document.body).appendChild(t), g;
}
const vc = Q("sdk.launch"), Ni = "spotlight-broadcast.launchIntent", Zv = 2 * 6e4;
function Kv() {
  try {
    const s = Number(localStorage.getItem(Ni));
    return Number.isFinite(s) && s > 0 && Date.now() - s < Zv;
  } catch {
    return !1;
  }
}
function An(s) {
  try {
    s ? localStorage.setItem(Ni, String(Date.now())) : localStorage.removeItem(Ni);
  } catch {
  }
}
const Xv = `${zd}
.backdrop { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center;
  justify-content: center; padding: 16px; background: rgba(11, 12, 15, 0.72); }
.card { width: min(560px, 100%); max-height: calc(100vh - 32px); overflow: auto; background: #1A1B20;
  border: 1px solid #2C2E34; border-radius: 16px; padding: 20px; box-sizing: border-box;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5); }
h2 { margin: 0 0 4px; font-size: 18px; font-weight: 600; }
.sub { margin: 0 0 16px; color: #8C8F98; }
.preview { position: relative; aspect-ratio: 16 / 9; background: #0B0C0F; border-radius: 12px; overflow: hidden; }
video { width: 100%; height: 100%; display: block; object-fit: contain; }
.overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  color: #8C8F98; text-align: center; padding: 16px; }
.row { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
label { display: block; margin: 16px 0 6px; color: #8C8F98; font-size: 13px; }
input { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 1px solid #2C2E34;
  background: #0B0C0F; color: #F4F4F5; font: inherit; }
input:focus { outline: 2px solid #585B62; outline-offset: 1px; }
.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.hint { margin: 12px 0 0; color: #8C8F98; font-size: 13px; }
.error { margin: 12px 0 0; }
.hint:empty { display: none; }
`;
function Yv(s) {
  return new Promise((e) => {
    const { host: t, root: n } = jd("data-spotlight-launch");
    n.innerHTML = `
      <style>${Xv}</style>
      <div class="surface backdrop">
        <div class="card" role="dialog" aria-modal="true" aria-labelledby="t">
          <h2 id="t">Go live on Spotlight</h2>
          <p class="sub">Viewers see your game, with your camera in the corner.</p>
          <div class="preview">
            <video muted playsinline autoplay></video>
            <div class="overlay">Starting camera and microphone…</div>
          </div>
          <div class="row">
            <button class="toggle" data-device="camera" aria-pressed="false" disabled>Camera off</button>
            <button class="toggle" data-device="microphone" aria-pressed="false" disabled>Mic off</button>
          </div>
          <p class="hint">Polkadot may ask for your camera and microphone. Choose “Always allow” and it won’t ask again.</p>
          <label for="title">Stream title</label>
          <input id="title" maxlength="200" placeholder="What are you playing?" />
          <p class="error" role="alert"></p>
          <div class="actions">
            <button data-action="cancel">Cancel</button>
            <button class="primary" data-action="live" disabled>Go live</button>
          </div>
        </div>
      </div>`;
    const r = (y) => n.querySelector(y), i = r("video"), o = r(".overlay"), a = r("#title"), c = r(".error"), l = r('[data-action="live"]'), d = {
      camera: r('[data-device="camera"]'),
      microphone: r('[data-device="microphone"]')
    };
    a.value = (s.title ?? "").slice(0, 200);
    let u = null, h = !1, f = !1;
    const g = (y) => {
      f || (f = !0, An(!1), y || u?.cancel(), document.removeEventListener("keydown", m, !0), t.remove(), y && s.controls !== !1 && Gv(y, typeof s.controls == "object" ? s.controls : {}), e(y));
    }, m = (y) => {
      y.key === "Escape" && !h && g(null);
    };
    document.addEventListener("keydown", m, !0);
    const p = () => {
      for (const y of ["camera", "microphone"]) {
        const k = u?.[y] ?? !1, U = d[y];
        U.disabled = !u || h, U.setAttribute("aria-pressed", String(k)), U.textContent = y === "camera" ? k ? "Camera on" : "Camera off" : k ? "Mic on" : "Mic off";
      }
      l.disabled = !u || h || a.value.trim() === "", l.textContent = h ? "Going live…" : "Go live";
    }, b = (y) => {
      c.textContent = y instanceof xs ? `Polkadot did not allow the ${y.camera ? "microphone" : "camera"}. You can go live without it.` : y instanceof Error ? y.message : String(y);
    };
    for (const y of ["camera", "microphone"])
      d[y].addEventListener("click", async () => {
        if (u) {
          c.textContent = "", h = !0, p();
          try {
            y === "camera" ? await u.setCamera(!u.camera) : await u.setMicrophone(!u.microphone);
          } catch (k) {
            b(k);
          } finally {
            h = !1, p();
          }
        }
      });
    a.addEventListener("input", p), a.addEventListener("keydown", (y) => {
      y.key === "Enter" && !l.disabled && l.click();
    }), r('[data-action="cancel"]').addEventListener("click", () => {
      h || g(null);
    }), l.addEventListener("click", async () => {
      if (!(!u || h)) {
        c.textContent = "", h = !0, p();
        try {
          const y = await u.goLive({
            title: a.value.trim(),
            hostName: s.hostName,
            spotlightOrigin: s.spotlightOrigin
          });
          g(y);
        } catch (y) {
          vc.error("go live from the launch screen failed", { err: y }), b(y), h = !1, p();
        }
      }
    }), document.body.appendChild(t), a.focus(), An(!0), Hd({ ...s, camera: !0, microphone: !0 }).then(
      (y) => {
        if (An(!1), f) {
          y.cancel();
          return;
        }
        if (u = y, i.srcObject = y.stream, i.play().catch(() => {
        }), o.remove(), y.refused.camera || y.refused.microphone) {
          const k = [y.refused.camera && "camera", y.refused.microphone && "microphone"].filter(Boolean);
          c.textContent = `Polkadot did not allow the ${k.join(" or ")}. You can go live without it, or turn it on to ask again.`;
        }
        p();
      },
      (y) => {
        An(!1), vc.error("launch screen preview failed", { err: y }), o.textContent = "The preview could not start.", b(y);
      }
    );
  });
}
function tS(s, e) {
  const t = () => typeof e == "function" ? e() : e;
  let n = !1;
  const r = async () => {
    if (s.disabled) return;
    s.disabled = !0;
    const o = t(), a = await Yv(o);
    if (!a) {
      s.disabled = !1;
      return;
    }
    a.on("ended", () => {
      n || (s.disabled = !1);
    }), o.onLive?.(a);
  }, i = () => void r();
  return s.addEventListener("click", i), Kv() && r(), () => {
    n = !0, s.removeEventListener("click", i);
  };
}
export {
  Ni as LAUNCH_INTENT_KEY,
  tS as attachLaunchScreen,
  Mv as captureElement,
  Jv as getBroadcastLog,
  Kv as launchIntentPending,
  Gv as mountControlBar,
  Yv as openLaunchScreen,
  Hd as prepareBroadcast,
  eS as startBroadcast
};
