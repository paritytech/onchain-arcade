// Vendored from paritytech/spotlight-mesh@f6aa5b8 (`bun run build:sdk`). Do not edit; rebuild and copy.
import { requestResourceAllocation as Jd, HostResponseDecodeError as eu, getHostLocalStorage as tu, isInsideContainer as su, getStatementStore as Tc, requestPermission as nu, requestDevicePermission as ru, toHex as yn, fromHex as iu, getAccountsProvider as ou, formatHostError as au } from "@parity/product-sdk/host";
var cu = Object.defineProperty, lu = (t, e, s) => e in t ? cu(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, Io = (t, e, s) => (lu(t, typeof e != "symbol" ? e + "" : e, s), s), Sr = {
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
function du(t) {
  const e = t.length % 2, s = (t[1] === "x" ? 2 : 0) + e, n = (t.length - s) / 2 + e, r = new Uint8Array(n);
  e && (r[0] = 0 | Sr[t[2]]);
  for (let i = 0; i < n; ) {
    const o = s + i * 2, a = Sr[t[o]], l = Sr[t[o + 1]];
    r[e + i++] = a << 4 | l;
  }
  return r;
}
var Ro = class extends Uint8Array {
  constructor(t) {
    super(t), Io(this, "i", 0), Io(this, "v"), this.v = new DataView(t);
  }
}, Ps = (t) => (e) => t(e instanceof Ro ? e : new Ro(e instanceof Uint8Array ? e.buffer : typeof e == "string" ? du(e).buffer : e)), Hi = (t) => {
  const e = t.length;
  let s = 0;
  for (let r = 0; r < e; r++)
    s += t[r].length;
  const n = new Uint8Array(s);
  for (let r = 0, i = 0; r < e; r++) {
    const o = t[r];
    n.set(o, i), i += o.byteLength;
  }
  return n;
}, rt = (t, e) => {
  const s = [t, e];
  return s.enc = t, s.dec = e, s;
}, uu = (t, e) => (s) => t(e(s)), hu = (t, e) => (s) => e(t(s)), Cc = ([t, e], s, n) => rt(uu(t, s), hu(e, n));
function fu(t, e) {
  return Ps((s) => {
    const n = s.v[e](s.i, !0);
    return s.i += t, n;
  });
}
function pu(t, e) {
  return (s) => {
    const n = new Uint8Array(t);
    return new DataView(n.buffer)[e](0, s, !0), n;
  };
}
function Vt(t, e, s) {
  return rt(pu(t, s), fu(t, e));
}
var en = Vt(1, "getUint8", "setUint8"), Fn = Vt(2, "getUint16", "setUint16"), Ln = Vt(4, "getUint32", "setUint32"), Ac = Vt(8, "getBigUint64", "setBigUint64");
Vt(1, "getInt8", "setInt8");
Vt(2, "getInt16", "setInt16");
Vt(4, "getInt32", "setInt32");
Vt(8, "getBigInt64", "setBigInt64");
var Mc = (t) => {
  const e = new Uint8Array(16), s = new DataView(e.buffer);
  return s.setBigInt64(0, t, !0), s.setBigInt64(8, t >> 64n, !0), e;
}, Bc = (t) => Ps((e) => {
  const { v: s, i: n } = e, r = s.getBigUint64(n, !0), i = s[t](n + 8, !0);
  return e.i += 16, i << 64n | r;
});
rt(Mc, Bc("getBigUint64"));
rt(Mc, Bc("getBigInt64"));
var Ic = (t) => {
  const e = new Uint8Array(32), s = new DataView(e.buffer);
  return s.setBigInt64(0, t, !0), s.setBigInt64(8, t >> 64n, !0), s.setBigInt64(16, t >> 128n, !0), s.setBigInt64(24, t >> 192n, !0), e;
}, Rc = (t) => Ps((e) => {
  let s = e.v.getBigUint64(e.i, !0);
  return e.i += 8, s |= e.v.getBigUint64(e.i, !0) << 64n, e.i += 8, s |= e.v.getBigUint64(e.i, !0) << 128n, e.i += 8, s |= e.v[t](e.i, !0) << 192n, e.i += 8, s;
});
rt(Ic, Rc("getBigUint64"));
rt(Ic, Rc("getBigInt64"));
Cc(en, (t) => t ? 1 : 0, Boolean);
var mu = [en[1], Fn[1], Ln[1]], gu = Ps((t) => {
  const e = t[t.i], s = e & 3;
  if (s < 3)
    return mu[s](t) >>> 2;
  const n = (e >>> 2) + 4;
  t.i++;
  let r = 0n;
  const i = n / 8 | 0;
  let o = 0n;
  for (let l = 0; l < i; l++)
    r = Ac[1](t) << o | r, o += 64n;
  let a = n % 8;
  return a > 3 && (r = BigInt(Ln[1](t)) << o | r, o += 32n, a -= 4), a > 1 && (r = BigInt(Fn[1](t)) << o | r, o += 16n, a -= 2), a && (r = BigInt(en[1](t)) << o | r), r;
}), yu = 1n << 56n, wu = 1 << 24, bu = 256, vu = 4294967295n, Su = 64, _u = 16384, xu = 1 << 30, ku = (t) => {
  if (t < 0)
    throw new Error(`Wrong compact input (${t})`);
  const e = Number(t) << 2;
  if (t < Su)
    return en[0](e);
  if (t < _u)
    return Fn[0](e | 1);
  if (t < xu)
    return Ln[0](e | 2);
  let s = [new Uint8Array(1)], n = BigInt(t);
  for (; n >= yu; )
    s.push(Ac[0](n)), n >>= 64n;
  n >= wu && (s.push(Ln[0](Number(n & vu))), n >>= 32n);
  let r = Number(n);
  r >= bu && (s.push(Fn[0](r)), r >>= 16), r && s.push(en[0](r));
  const i = Hi(s);
  return i[0] = i.length - 5 << 2 | 3, i;
}, hr = rt(ku, gu), Eu = new TextEncoder(), Tu = (t) => {
  const e = Eu.encode(t);
  return Hi([hr.enc(e.length), e]);
}, Cu = new TextDecoder(), Au = Ps((t) => {
  let e = hr.dec(t);
  const s = new DataView(t.buffer, t.i, e);
  return t.i += e, Cu.decode(s);
});
rt(Tu, Au);
var Mu = () => {
}, Bu = new Uint8Array(0);
rt(() => Bu, Mu);
var Oc = (t) => t === void 0 ? (e) => Hi([hr.enc(e.length), e]) : (e) => e.length === t ? e : e.slice(0, t), Pc = (t) => Ps((e) => {
  const s = t === void 0 ? hr.dec(e) : t !== 1 / 0 ? t : e.byteLength - e.i, n = new Uint8Array(e.buffer.slice(e.i, e.i + s));
  return e.i += s, n;
}), zi = (t) => rt(Oc(t), Pc(t));
zi.enc = Oc;
zi.dec = Pc;
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Iu(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in t && t.BYTES_PER_ELEMENT === 1;
}
function Fc(t, e) {
  return Array.isArray(e) ? e.length === 0 ? !0 : t ? e.every((s) => typeof s == "string") : e.every((s) => Number.isSafeInteger(s)) : !1;
}
function ii(t, e) {
  if (typeof e != "string")
    throw new TypeError(`${t}: string expected`);
  return !0;
}
function Lc(t) {
  if (typeof t != "number")
    throw new TypeError(`number expected, got ${typeof t}`);
  if (!Number.isSafeInteger(t))
    throw new RangeError(`invalid integer: ${t}`);
}
function oi(t) {
  if (!Array.isArray(t))
    throw new TypeError("array expected");
}
function Uc(t, e) {
  if (!Fc(!0, e))
    throw new TypeError(`${t}: array of strings expected`);
}
function Ru(t, e) {
  if (!Fc(!1, e))
    throw new TypeError(`${t}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Ou(...t) {
  const e = (i) => i, s = (i, o) => (a) => i(o(a)), n = t.map((i) => i.encode).reduceRight(s, e), r = t.map((i) => i.decode).reduce(s, e);
  return { encode: n, decode: r };
}
// @__NO_SIDE_EFFECTS__
function Pu(t) {
  const e = typeof t == "string" ? t.split("") : t, s = e.length;
  Uc("alphabet", e);
  const n = new Map(e.map((r, i) => [r, i]));
  return {
    encode: (r) => (oi(r), r.map((i) => {
      if (!Number.isSafeInteger(i) || i < 0 || i >= s)
        throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${t}`);
      return e[i];
    })),
    decode: (r) => (oi(r), r.map((i) => {
      ii("alphabet.decode", i);
      const o = n.get(i);
      if (o === void 0)
        throw new Error(`Unknown letter: "${i}". Allowed: ${t}`);
      return o;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Fu(t = "") {
  return ii("join", t), {
    encode: (e) => (Uc("join.decode", e), e.join(t)),
    decode: (e) => (ii("join.decode", e), e.split(t))
  };
}
function Oo(t, e, s) {
  if (e < 2)
    throw new RangeError(`convertRadix: invalid from=${e}, base cannot be less than 2`);
  if (s < 2)
    throw new RangeError(`convertRadix: invalid to=${s}, base cannot be less than 2`);
  if (oi(t), !t.length)
    return [];
  let n = 0;
  const r = [], i = Array.from(t, (a) => {
    if (Lc(a), a < 0 || a >= e)
      throw new Error(`invalid integer: ${a}`);
    return a;
  }), o = i.length;
  for (; ; ) {
    let a = 0, l = !0;
    for (let c = n; c < o; c++) {
      const d = i[c], u = e * a, h = u + d;
      if (!Number.isSafeInteger(h) || u / e !== a || h - d !== u)
        throw new Error("convertRadix: carry overflow");
      const f = h / s;
      a = h % s;
      const g = Math.floor(f);
      if (i[c] = g, !Number.isSafeInteger(g) || g * s + a !== h)
        throw new Error("convertRadix: carry overflow");
      if (l)
        g ? l = !1 : n = c;
      else continue;
    }
    if (r.push(a), l)
      break;
  }
  for (let a = 0; a < t.length - 1 && t[a] === 0; a++)
    r.push(0);
  return r.reverse();
}
// @__NO_SIDE_EFFECTS__
function Lu(t) {
  Lc(t);
  const e = 2 ** 8;
  return {
    encode: (s) => {
      if (!Iu(s))
        throw new TypeError("radix.encode input should be Uint8Array");
      return Oo(Array.from(s), e, t);
    },
    decode: (s) => (Ru("radix.decode", s), Uint8Array.from(Oo(s, t, e)))
  };
}
const Uu = /* @__NO_SIDE_EFFECTS__ */ (t) => /* @__PURE__ */ Ou(/* @__PURE__ */ Lu(58), /* @__PURE__ */ Pu(t), /* @__PURE__ */ Fu("")), Dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Uu("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
function Nc(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in t && t.BYTES_PER_ELEMENT === 1;
}
function mt(t, e = "") {
  if (typeof t != "number") {
    const s = e && `"${e}" `;
    throw new TypeError(`${s}expected number, got ${typeof t}`);
  }
  if (!Number.isSafeInteger(t) || t < 0) {
    const s = e && `"${e}" `;
    throw new RangeError(`${s}expected integer >= 0, got ${t}`);
  }
}
function Ce(t, e, s = "") {
  const n = Nc(t), r = t?.length, i = e !== void 0;
  if (!n || i && r !== e) {
    const o = s && `"${s}" `, a = i ? ` of length ${e}` : "", l = n ? `length=${r}` : `type=${typeof t}`, c = o + "expected Uint8Array" + a + ", got " + l;
    throw n ? new RangeError(c) : new TypeError(c);
  }
  return t;
}
function ji(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new TypeError("Hash must wrapped by utils.createHasher");
  if (mt(t.outputLen), mt(t.blockLen), t.outputLen < 1)
    throw new Error('"outputLen" must be >= 1');
  if (t.blockLen < 1)
    throw new Error('"blockLen" must be >= 1');
}
function Ts(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qi(t, e) {
  Ce(t, void 0, "digestInto() output");
  const s = e.outputLen;
  if (t.length < s)
    throw new RangeError('"digestInto() output" expected to be of length >=' + s);
}
function Un(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function tt(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function _r(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function qe(t, e) {
  return t << 32 - e | t >>> e;
}
const $c = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Vc(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const at = $c ? (t) => t : (t) => Vc(t) >>> 0;
function Du(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Vc(t[e]);
  return t;
}
const as = $c ? (t) => t : Du, Hc = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Nu = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function He(t) {
  if (Ce(t), Hc)
    return t.toHex();
  let e = "";
  for (let s = 0; s < t.length; s++)
    e += Nu[t[s]];
  return e;
}
const it = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Po(t) {
  if (t >= it._0 && t <= it._9)
    return t - it._0;
  if (t >= it.A && t <= it.F)
    return t - (it.A - 10);
  if (t >= it.a && t <= it.f)
    return t - (it.a - 10);
}
function Ie(t) {
  if (typeof t != "string")
    throw new TypeError("hex string expected, got " + typeof t);
  if (Hc)
    try {
      return Uint8Array.fromHex(t);
    } catch (r) {
      throw r instanceof SyntaxError ? new RangeError(r.message) : r;
    }
  const e = t.length, s = e / 2;
  if (e % 2)
    throw new RangeError("hex string expected, got unpadded hex of length " + e);
  const n = new Uint8Array(s);
  for (let r = 0, i = 0; r < s; r++, i += 2) {
    const o = Po(t.charCodeAt(i)), a = Po(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const l = t[i] + t[i + 1];
      throw new RangeError('hex string expected, got non-hex character "' + l + '" at index ' + i);
    }
    n[r] = o * 16 + a;
  }
  return n;
}
function $u(...t) {
  let e = 0;
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    Ce(r), e += r.length;
  }
  const s = new Uint8Array(e);
  for (let n = 0, r = 0; n < t.length; n++) {
    const i = t[n];
    s.set(i, r), r += i.length;
  }
  return s;
}
function Wi(t, e = {}) {
  const s = (r, i) => t(i).update(r).digest(), n = t(void 0);
  return s.outputLen = n.outputLen, s.blockLen = n.blockLen, s.canXOF = n.canXOF, s.create = (r) => t(r), Object.assign(s, e), Object.freeze(s);
}
function Vu(t = 32) {
  mt(t, "bytesLength");
  const e = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof e?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (t > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${t}`);
  return e.getRandomValues(new Uint8Array(t));
}
const zc = (t) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, t])
}), Hu = /* @__PURE__ */ Uint8Array.from([
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
function zu(t, e, s) {
  return t & e ^ ~t & s;
}
function ju(t, e, s) {
  return t & e ^ t & s ^ e & s;
}
class jc {
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
  constructor(e, s, n, r) {
    this.blockLen = e, this.outputLen = s, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = _r(this.buffer);
  }
  update(e) {
    Ts(this), Ce(e);
    const { view: s, buffer: n, blockLen: r } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(r - this.pos, i - o);
      if (a === r) {
        const l = _r(e);
        for (; r <= i - o; o += r)
          this.process(l, o);
        continue;
      }
      n.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === r && (this.process(s, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ts(this), qi(e, this), this.finished = !0;
    const { buffer: s, view: n, blockLen: r, isLE: i } = this;
    let { pos: o } = this;
    s[o++] = 128, tt(this.buffer.subarray(o)), this.padOffset > r - o && (this.process(n, 0), o = 0);
    for (let u = o; u < r; u++)
      s[u] = 0;
    n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const a = _r(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const c = l / 4, d = this.get();
    if (c > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < c; u++)
      a.setUint32(4 * u, d[u], i);
  }
  digest() {
    const { buffer: e, outputLen: s } = this;
    this.digestInto(e);
    const n = e.slice(0, s);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e ||= new this.constructor(), e.set(...this.get());
    const { blockLen: s, buffer: n, length: r, finished: i, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = i, e.length = r, e.pos = a, r % s && e.buffer.set(n), e;
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
]), wn = /* @__PURE__ */ BigInt(2 ** 32 - 1), Fo = /* @__PURE__ */ BigInt(32);
function qc(t, e = !1) {
  return e ? { h: Number(t & wn), l: Number(t >> Fo & wn) } : { h: Number(t >> Fo & wn) | 0, l: Number(t & wn) | 0 };
}
function qu(t, e = !1) {
  const s = t.length;
  let n = new Uint32Array(s), r = new Uint32Array(s);
  for (let i = 0; i < s; i++) {
    const { h: o, l: a } = qc(t[i], e);
    [n[i], r[i]] = [o, a];
  }
  return [n, r];
}
const Lo = (t, e, s) => t >>> s, Uo = (t, e, s) => t << 32 - s | e >>> s, At = (t, e, s) => t >>> s | e << 32 - s, Mt = (t, e, s) => t << 32 - s | e >>> s, js = (t, e, s) => t << 64 - s | e >>> s - 32, qs = (t, e, s) => t >>> s - 32 | e << 64 - s, Wu = (t, e) => e, Gu = (t, e) => t;
function $e(t, e, s, n) {
  const r = (e >>> 0) + (n >>> 0);
  return { h: t + s + (r / 2 ** 32 | 0) | 0, l: r | 0 };
}
const Gi = (t, e, s) => (t >>> 0) + (e >>> 0) + (s >>> 0), Zi = (t, e, s, n) => e + s + n + (t / 2 ** 32 | 0) | 0, Zu = (t, e, s, n) => (t >>> 0) + (e >>> 0) + (s >>> 0) + (n >>> 0), Ku = (t, e, s, n, r) => e + s + n + r + (t / 2 ** 32 | 0) | 0, Xu = (t, e, s, n, r) => (t >>> 0) + (e >>> 0) + (s >>> 0) + (n >>> 0) + (r >>> 0), Yu = (t, e, s, n, r, i) => e + s + n + r + i + (t / 2 ** 32 | 0) | 0, we = /* @__PURE__ */ Uint32Array.from([
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
]), C = /* @__PURE__ */ new Uint32Array(32);
function wt(t, e, s, n, r, i) {
  const o = r[i], a = r[i + 1];
  let l = C[2 * t], c = C[2 * t + 1], d = C[2 * e], u = C[2 * e + 1], h = C[2 * s], f = C[2 * s + 1], g = C[2 * n], m = C[2 * n + 1], p = Gi(l, d, o);
  c = Zi(p, c, u, a), l = p | 0, { Dh: m, Dl: g } = { Dh: m ^ c, Dl: g ^ l }, { Dh: m, Dl: g } = { Dh: Wu(m, g), Dl: Gu(m) }, { h: f, l: h } = $e(f, h, m, g), { Bh: u, Bl: d } = { Bh: u ^ f, Bl: d ^ h }, { Bh: u, Bl: d } = { Bh: At(u, d, 24), Bl: Mt(u, d, 24) }, C[2 * t] = l, C[2 * t + 1] = c, C[2 * e] = d, C[2 * e + 1] = u, C[2 * s] = h, C[2 * s + 1] = f, C[2 * n] = g, C[2 * n + 1] = m;
}
function bt(t, e, s, n, r, i) {
  const o = r[i], a = r[i + 1];
  let l = C[2 * t], c = C[2 * t + 1], d = C[2 * e], u = C[2 * e + 1], h = C[2 * s], f = C[2 * s + 1], g = C[2 * n], m = C[2 * n + 1], p = Gi(l, d, o);
  c = Zi(p, c, u, a), l = p | 0, { Dh: m, Dl: g } = { Dh: m ^ c, Dl: g ^ l }, { Dh: m, Dl: g } = { Dh: At(m, g, 16), Dl: Mt(m, g, 16) }, { h: f, l: h } = $e(f, h, m, g), { Bh: u, Bl: d } = { Bh: u ^ f, Bl: d ^ h }, { Bh: u, Bl: d } = { Bh: js(u, d, 63), Bl: qs(u, d, 63) }, C[2 * t] = l, C[2 * t + 1] = c, C[2 * e] = d, C[2 * e + 1] = u, C[2 * s] = h, C[2 * s + 1] = f, C[2 * n] = g, C[2 * n + 1] = m;
}
function Qu(t, e = {}, s, n, r) {
  if (mt(s), t <= 0 || t > s)
    throw new Error("outputLen bigger than keyLen");
  const { key: i, salt: o, personalization: a } = e;
  if (i !== void 0 && (i.length < 1 || i.length > s))
    throw new Error('"key" expected to be undefined or of length=1..' + s);
  o !== void 0 && Ce(o, n, "salt"), a !== void 0 && Ce(a, r, "personalization");
}
class Ju {
  buffer;
  buffer32;
  finished = !1;
  destroyed = !1;
  length = 0;
  pos = 0;
  blockLen;
  outputLen;
  canXOF = !1;
  constructor(e, s) {
    mt(e), mt(s), this.blockLen = e, this.outputLen = s, this.buffer = new Uint8Array(e), this.buffer32 = Un(this.buffer);
  }
  update(e) {
    Ts(this), Ce(e);
    const { blockLen: s, buffer: n, buffer32: r } = this, i = e.length, o = e.byteOffset, a = e.buffer;
    for (let l = 0; l < i; ) {
      this.pos === s && (as(r), this.compress(r, 0, !1), as(r), this.pos = 0);
      const c = Math.min(s - this.pos, i - l), d = o + l;
      if (c === s && !(d % 4) && l + c < i) {
        const u = new Uint32Array(a, d, Math.floor((i - l) / 4));
        as(u);
        for (let h = 0; l + s < i; h += r.length, l += s)
          this.length += s, this.compress(u, h, !1);
        as(u);
        continue;
      }
      n.set(e.subarray(l, l + c), this.pos), this.pos += c, this.length += c, l += c;
    }
    return this;
  }
  digestInto(e) {
    Ts(this), qi(e, this);
    const { pos: s, buffer32: n } = this;
    if (this.finished = !0, tt(this.buffer.subarray(s)), as(n), this.compress(n, 0, !0), as(n), e.byteOffset & 3)
      throw new RangeError('"digestInto() output" expected 4-byte aligned byteOffset, got ' + e.byteOffset);
    const r = this.get(), i = Un(e), o = Math.floor(this.outputLen / 4);
    for (let d = 0; d < o; d++)
      i[d] = at(r[d]);
    const a = this.outputLen % 4;
    if (!a)
      return;
    const l = o * 4, c = r[o];
    for (let d = 0; d < a; d++)
      e[l + d] = c >>> 8 * d;
  }
  digest() {
    const { buffer: e, outputLen: s } = this;
    this.digestInto(e);
    const n = e.slice(0, s);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    const { buffer: s, length: n, finished: r, destroyed: i, outputLen: o, pos: a } = this;
    return e ||= new this.constructor({ dkLen: o }), e.set(...this.get()), e.buffer.set(s), e.destroyed = i, e.finished = r, e.length = n, e.pos = a, e.outputLen = o, e;
  }
  clone() {
    return this._cloneInto();
  }
}
class eh extends Ju {
  // Same IV words as SHA-512 / BLAKE2b, encoded as LE u32 low/high halves.
  v0l = we[0] | 0;
  v0h = we[1] | 0;
  v1l = we[2] | 0;
  v1h = we[3] | 0;
  v2l = we[4] | 0;
  v2h = we[5] | 0;
  v3l = we[6] | 0;
  v3h = we[7] | 0;
  v4l = we[8] | 0;
  v4h = we[9] | 0;
  v5l = we[10] | 0;
  v5h = we[11] | 0;
  v6l = we[12] | 0;
  v6h = we[13] | 0;
  v7l = we[14] | 0;
  v7h = we[15] | 0;
  constructor(e = {}) {
    const s = e.dkLen === void 0 ? 64 : e.dkLen;
    super(128, s), Qu(s, e, 64, 16, 16);
    let { key: n, personalization: r, salt: i } = e, o = 0;
    if (n !== void 0 && (Ce(n, void 0, "key"), o = n.length), this.v0l ^= this.outputLen | o << 8 | 65536 | 1 << 24, i !== void 0) {
      Ce(i, void 0, "salt");
      const a = Un(i);
      this.v4l ^= at(a[0]), this.v4h ^= at(a[1]), this.v5l ^= at(a[2]), this.v5h ^= at(a[3]);
    }
    if (r !== void 0) {
      Ce(r, void 0, "personalization");
      const a = Un(r);
      this.v6l ^= at(a[0]), this.v6h ^= at(a[1]), this.v7l ^= at(a[2]), this.v7h ^= at(a[3]);
    }
    if (n !== void 0) {
      const a = new Uint8Array(this.blockLen);
      a.set(n), this.update(a);
    }
  }
  // prettier-ignore
  get() {
    let { v0l: e, v0h: s, v1l: n, v1h: r, v2l: i, v2h: o, v3l: a, v3h: l, v4l: c, v4h: d, v5l: u, v5h: h, v6l: f, v6h: g, v7l: m, v7h: p } = this;
    return [e, s, n, r, i, o, a, l, c, d, u, h, f, g, m, p];
  }
  // prettier-ignore
  set(e, s, n, r, i, o, a, l, c, d, u, h, f, g, m, p) {
    this.v0l = e | 0, this.v0h = s | 0, this.v1l = n | 0, this.v1h = r | 0, this.v2l = i | 0, this.v2h = o | 0, this.v3l = a | 0, this.v3h = l | 0, this.v4l = c | 0, this.v4h = d | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = f | 0, this.v6h = g | 0, this.v7l = m | 0, this.v7h = p | 0;
  }
  compress(e, s, n) {
    this.get().forEach((l, c) => C[c] = l), C.set(we, 16);
    let { h: r, l: i } = qc(BigInt(this.length));
    C[24] = we[8] ^ i, C[25] = we[9] ^ r, n && (C[28] = ~C[28], C[29] = ~C[29]);
    let o = 0;
    const a = Hu;
    for (let l = 0; l < 12; l++)
      wt(0, 4, 8, 12, e, s + 2 * a[o++]), bt(0, 4, 8, 12, e, s + 2 * a[o++]), wt(1, 5, 9, 13, e, s + 2 * a[o++]), bt(1, 5, 9, 13, e, s + 2 * a[o++]), wt(2, 6, 10, 14, e, s + 2 * a[o++]), bt(2, 6, 10, 14, e, s + 2 * a[o++]), wt(3, 7, 11, 15, e, s + 2 * a[o++]), bt(3, 7, 11, 15, e, s + 2 * a[o++]), wt(0, 5, 10, 15, e, s + 2 * a[o++]), bt(0, 5, 10, 15, e, s + 2 * a[o++]), wt(1, 6, 11, 12, e, s + 2 * a[o++]), bt(1, 6, 11, 12, e, s + 2 * a[o++]), wt(2, 7, 8, 13, e, s + 2 * a[o++]), bt(2, 7, 8, 13, e, s + 2 * a[o++]), wt(3, 4, 9, 14, e, s + 2 * a[o++]), bt(3, 4, 9, 14, e, s + 2 * a[o++]);
    this.v0l ^= C[0] ^ C[16], this.v0h ^= C[1] ^ C[17], this.v1l ^= C[2] ^ C[18], this.v1h ^= C[3] ^ C[19], this.v2l ^= C[4] ^ C[20], this.v2h ^= C[5] ^ C[21], this.v3l ^= C[6] ^ C[22], this.v3h ^= C[7] ^ C[23], this.v4l ^= C[8] ^ C[24], this.v4h ^= C[9] ^ C[25], this.v5l ^= C[10] ^ C[26], this.v5h ^= C[11] ^ C[27], this.v6l ^= C[12] ^ C[28], this.v6h ^= C[13] ^ C[29], this.v7l ^= C[14] ^ C[30], this.v7h ^= C[15] ^ C[31], tt(C);
  }
  destroy() {
    this.destroyed = !0, tt(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const fr = /* @__PURE__ */ Wi((t) => new eh(t)), Wc = new TextEncoder().encode("SS58PRE"), ai = 2, th = (t) => {
  try {
    const e = Dc.decode(t), s = e.subarray(0, e[0] & 64 ? 2 : 1), n = e.subarray(
      s.length,
      e.length - ai
    ), r = e.subarray(s.length + n.length), i = fr(
      Uint8Array.of(...Wc, ...s, ...n),
      {
        dkLen: 64
      }
    ).subarray(0, ai);
    return r[0] === i[0] && r[1] === i[1] ? {
      isValid: !0,
      ss58Format: sh(s),
      publicKey: n.slice()
    } : { isValid: !1 };
  } catch {
    return { isValid: !1 };
  }
}, sh = (t) => {
  const e = new DataView(t.buffer, t.byteOffset, t.byteLength);
  return e.byteLength === 1 ? e.getUint8(0) : e.getUint16(0);
}, nh = (t) => {
  let e = 0n;
  const s = new DataView(t.buffer), n = Math.floor(t.length / 8);
  for (let r = 0; r < n; r++)
    e = e << 64n | s.getBigUint64(r * 8);
  for (let r = n * 8; r < t.length; r++)
    e = e << 8n | BigInt(s.getUint8(r));
  return e;
}, rh = (t) => {
  let e = /* @__PURE__ */ new Map(), s = 0, n = 0;
  const r = () => {
    s === n ? (e.clear(), s = n = 0) : (n = s, setTimeout(r, 0));
  };
  return (i) => {
    ++s === 1 && r();
    const o = nh(i);
    return e.has(o) || e.set(o, t(i)), e.get(o);
  };
}, ih = (t) => {
  const e = t < 64 ? Uint8Array.of(t) : Uint8Array.of(
    (t & 252) >> 2 | 64,
    t >> 8 | (t & 3) << 6
  );
  return rh((s) => {
    const n = fr(
      Uint8Array.of(...Wc, ...e, ...s),
      {
        dkLen: 64
      }
    ).subarray(0, ai);
    return Dc.encode(
      Uint8Array.of(...e, ...s, ...n)
    );
  });
};
function oh(t, e) {
  return (s) => {
    const n = th(s);
    if (!n.isValid) throw new Error("Invalid checksum");
    const { publicKey: r } = n;
    if (r.length !== t)
      throw new Error("Invalid public key length");
    return r;
  };
}
const Gc = (t = 42, e = 32) => Cc(
  zi(e),
  oh(e),
  ih(t)
), ah = { dkLen: 32 }, ch = (t) => fr(t, ah);
function lh(t) {
  return t === "Domain" || /^V\d+$/.test(t);
}
function dh(t) {
  let e = t;
  for (let s = 0; s < 4; s++) {
    if (typeof e != "object" || e === null || !("tag" in e)) return null;
    const n = e, r = String(n.tag);
    if (!lh(r)) {
      const i = n.value?.reason;
      return i ? `${r}: ${i}` : r;
    }
    if (n.value === void 0) return r;
    e = n.value;
  }
  return null;
}
const uh = Date.now(), Do = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", No = 5;
function hh() {
  const t = new Uint8Array(No);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(t);
  else
    for (let s = 0; s < No; s += 1) t[s] = Math.floor(Math.random() * 256);
  let e = "";
  for (const s of t) e += Do[s % Do.length];
  return e;
}
const Zc = hh(), fh = "spotlight-broadcast-sdk · 6b6309c · 2026-10-26", ph = 4, xr = 2e3, $o = 8, mh = "[circular]", gh = "[deep]";
function kr(t) {
  return t.length <= xr ? t : `${t.slice(0, xr)}…(${t.length - xr} more)`;
}
function yh(t) {
  const e = t.subarray(0, $o);
  let s = "";
  for (const n of e) s += n.toString(16).padStart(2, "0");
  return `0x${s}${t.length > $o ? "…" : ""}`;
}
function wh(t) {
  return `[fn ${t.name || "(anonymous)"}]`;
}
function ys(t, e, s) {
  if (e > ph) return gh;
  if (t === null) return null;
  switch (typeof t) {
    case "string":
      return kr(t);
    case "number":
      return Number.isFinite(t) ? t : String(t);
    case "boolean":
      return t;
    case "undefined":
      return;
    case "bigint":
      return `${t.toString()}n`;
    case "function":
      return wh(t);
    case "symbol":
      return t.toString();
  }
  const n = t;
  if (s.has(n)) return mh;
  if (n instanceof Error)
    return {
      name: n.name,
      message: kr(n.message),
      stack: typeof n.stack == "string" ? kr(n.stack) : void 0
    };
  if (n instanceof Uint8Array) return yh(n);
  if (n instanceof Date) return n.toISOString();
  s.add(n);
  try {
    if (Array.isArray(n))
      return n.map((i) => ys(i, e + 1, s));
    if (n instanceof Map) {
      const i = {};
      for (const [o, a] of n)
        i[typeof o == "string" ? o : String(ys(o, e + 1, s))] = ys(
          a,
          e + 1,
          s
        );
      return i;
    }
    if (n instanceof Set)
      return [...n].map((i) => ys(i, e + 1, s));
    const r = {};
    for (const [i, o] of Object.entries(n))
      r[i] = ys(o, e + 1, s);
    return r;
  } finally {
    s.delete(n);
  }
}
function bh(t, e = 0) {
  try {
    return ys(t, e, /* @__PURE__ */ new Set());
  } catch {
    return "[unserializable]";
  }
}
function vh(t) {
  if (t === void 0) return;
  const e = bh(t);
  return typeof e != "object" || e === null ? { value: e } : e;
}
const Vo = 5e3, Dn = { debug: 0, info: 1, warn: 2, error: 3 };
let Ws = [], Sh = 0, Kc = "debug";
const Xc = /* @__PURE__ */ new Set();
let Zs = null, _s = null;
function Er() {
  Zs !== null && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(Zs), Zs = null, _s !== null && (clearTimeout(_s), _s = null);
  for (const t of Xc)
    try {
      t();
    } catch {
    }
}
function _h() {
  Xc.size !== 0 && (Zs !== null || _s !== null || (typeof requestAnimationFrame == "function" ? (Zs = requestAnimationFrame(Er), _s = setTimeout(Er, 100)) : _s = setTimeout(Er, 0)));
}
function bn(t, e, s, n) {
  if (Dn[t] < Dn[Kc]) return;
  const r = { seq: ++Sh, sid: Zc, ts: Date.now(), level: t, ns: e, msg: String(s) }, i = vh(n);
  i !== void 0 && (r.data = i), Ws.length >= Vo && Ws.splice(0, Ws.length - Vo + 1), Ws.push(r), _h();
}
function xh(t) {
  return Dn[t] >= Dn[Kc];
}
function Yc() {
  return Ws.slice();
}
function J(t) {
  return {
    ns: t,
    debug(e, s) {
      bn("debug", t, e, s);
    },
    info(e, s) {
      bn("info", t, e, s);
    },
    warn(e, s) {
      bn("warn", t, e, s);
    },
    error(e, s) {
      bn("error", t, e, s);
    },
    on(e) {
      return xh(e);
    }
  };
}
const Ho = 8, kh = 8;
function _(t) {
  return t == null ? String(t) : t.length > Ho ? `${t.slice(0, Ho)}…` : t;
}
function Se(t) {
  const e = t.startsWith("0x") ? t.slice(2) : t, s = e.slice(0, kh * 2);
  return `0x${s}${e.length > s.length ? "…" : ""}`;
}
function re(t) {
  const e = /* @__PURE__ */ new Map();
  return {
    allow(s = "") {
      const n = (e.get(s) ?? 0) + 1;
      return e.set(s, n), n <= t;
    },
    count(s = "") {
      return e.get(s) ?? 0;
    },
    reset() {
      e.clear();
    }
  };
}
const Eh = 18, vn = 120, Th = 13;
function Ch(t) {
  return t.toUpperCase().padEnd(5);
}
function Ah(t) {
  if (typeof t == "string") return t;
  if (typeof t == "number" || typeof t == "boolean" || t === null)
    return String(t);
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return "[unserializable]";
  }
}
function Mh(t) {
  const e = [];
  for (const [r, i] of Object.entries(t))
    e.push(`${r}=${Ah(i)}`);
  if (e.length === 0) return [];
  const s = [];
  let n = "";
  for (const r of e)
    for (n !== "" && n.length + 1 + r.length > vn && (s.push(n), n = ""), n = n === "" ? `    ${r}` : `${n} ${r}`; n.length > vn; )
      s.push(n.slice(0, vn)), n = `    ${n.slice(vn)}`;
  return n !== "" && s.push(n), s;
}
function Bh(t) {
  const s = `${new Date(t.ts).toISOString()}  ${Ch(t.level)}  ${t.sid}  ${t.ns.padEnd(Eh)}${t.msg}`;
  return !t.data || Object.keys(t.data).length === 0 ? [s] : [s, ...Mh(t.data)];
}
function Ih() {
  return typeof location > "u" ? "(unknown)" : location.href;
}
function Rh() {
  return typeof navigator > "u" ? "(unknown)" : navigator.userAgent;
}
function Qc(t, e = {}) {
  const s = e.page ?? Ih(), n = e.userAgent ?? Rh(), r = e.sessionStartMs ?? uh, i = e.build ?? fh, o = (c) => `${c} `.padEnd(Math.max(Th, c.length + 1), " "), a = [
    "# spotlight debug log",
    `# ${o("build")}${i}`,
    `# ${o("session start")}${new Date(r).toISOString()}`,
    `# ${o("page")}${s}`,
    `# ${o("user agent")}${n}`,
    `# ${o("entries")}${t.length}`,
    `# ${o("session id")}${e.sessionId ?? Zc} (this page load)`
  ];
  for (const c of e.earlier ?? [])
    a.push(
      `# ${o("earlier")}${c.sid}  start ${new Date(c.startMs).toISOString()}  entries ${c.entries}  build ${c.build}  page ${c.page}`
    );
  const l = [];
  for (const c of t) l.push(...Bh(c));
  return `${[...a, ...l].join(`
`)}
`;
}
const Oh = J("triangle"), Jc = {
  // paseo-next-v2 Asset Hub — the network the dotns deploy targets
  // (.github/workflows/deploy-dotns.yml passes `--env paseo-next-v2`).
  // Verified against wss://paseo-asset-hub-next-rpc.polkadot.io on 2026-09-07,
  // after the chain was re-genesised AGAIN (third hash in a month:
  // 0xbf0488db… → 0x23e730eb… → this one). Each wipe also destroys the
  // deployed tip contract at CONTRACT_ADDRESS.
  // Testnets get re-genesised: if the host answers "chain not supported",
  // re-read the hash with chainSpec_v1_genesisHash before you debug anything else.
  "paseo-asset-hub-next": "0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a"
}, zo = Jc["paseo-asset-hub-next"], Ph = {
  [Jc["paseo-asset-hub-next"]]: "paseo"
};
function Fh() {
  const t = Ph[zo.toLowerCase()];
  return t || (Oh.error(
    "no DotNS TLD known for this genesis — the host will refuse the product account with DomainNotValid, and there will be no wallet, no statements and no tips. Set VITE_DOTNS_SUFFIX to this network's TLD, or add the genesis to DOTNS_SUFFIX_BY_GENESIS in src/lib/triangle/constants.ts.",
    { genesis: Se(zo), fallback: "paseo" }
  ), "paseo");
}
const Ki = Fh(), Lh = J("wallet");
function el(t, e = Ki) {
  const s = t.hostname.toLowerCase(), n = t.host.toLowerCase();
  if (t.protocol === "dot:") return s;
  if (s === "localhost" || s === "127.0.0.1" || s.endsWith(".localhost"))
    return n;
  const r = s.split(".");
  if (s.endsWith(`.${e}`))
    return r.length > 2 ? r.slice(-2).join(".") : s;
  if (r.length >= 3) {
    let i = r.slice(0, -2);
    if (i[i.length - 1] === "app" && (i = i.slice(0, -1)), i[0] === "app" && (i = i.slice(1)), i.length > 0) return `${i.join(".")}.${e}`;
  }
  return n;
}
const Uh = typeof window > "u" ? "" : el(window.location);
typeof window < "u" && Lh.info("product identifier derived", {
  identifier: Uh,
  origin: `${window.location.protocol}//${window.location.host}`,
  suffix: `.${Ki}`
});
class tl extends Error {
  constructor(e, s) {
    super(`${e} timed out after ${s}ms`), this.label = e, this.elapsedMs = s, this.name = "DeadlineError";
  }
  kind = "DeadlineError";
}
function sl(t) {
  return t instanceof tl;
}
const Cs = {
  /** Quick chain read (ReviveApi.call dry-run, Assets.Account balance, ...). */
  read: 45e3,
  /** Submit + best-block inclusion via signSubmitAndWatch. */
  submit: 6e4,
  /** User-gated sign action — mobile wallet round-trip + user finding the app. */
  sign: 9e4,
  /** Host-bridge permission / allowance dialog. */
  hostDialog: 9e4
};
async function Lt(t, e, s) {
  const n = Date.now(), r = typeof t == "function" ? t() : t;
  let i;
  const o = new Promise((a, l) => {
    i = setTimeout(() => l(new tl(s, Date.now() - n)), e);
  });
  try {
    return await Promise.race([r, o]);
  } finally {
    i && clearTimeout(i);
  }
}
const Sn = J("statement.alloc");
async function Dh(t, e, s) {
  try {
    const n = await Lt(
      async () => Jd(t),
      e,
      `requestResourceAllocation(${s})`
    );
    if (!n.ok) {
      const o = jo(n.error), a = Nh(n.error);
      return Sn.warn("resource allocation failed", { label: s, detail: o, answered: a }), { status: "error", detail: o, answered: a };
    }
    const r = {}, i = [];
    return n.value.forEach((o, a) => {
      const l = t[a]?.tag;
      i.push(`${l ?? a}=${o}`), l && (r[l] = o);
    }), Sn.info("allowance outcomes", { label: s, outcomes: i.join(" ") }), { status: "ok", outcomes: r };
  } catch (n) {
    if (sl(n))
      return Sn.warn("resource allocation: no answer inside the deadline", { label: s, timeoutMs: e }), { status: "timeout" };
    const r = jo(n);
    return Sn.warn("resource allocation threw", { label: s, detail: r }), { status: "error", detail: r, answered: !1 };
  }
}
function Nh(t) {
  return !(t instanceof eu);
}
function jo(t) {
  if (t instanceof Error) return t.message;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
const Xi = J("host.grants"), ln = "spotlight/host-grants/v1", $h = 864e5;
function Yi(t = Date.now()) {
  return Math.floor(t / $h);
}
function Vh(t, e, s = Yi()) {
  return t ? e === "forever" || t.slot === s : !1;
}
let Ye = null, Tr = null, Cr = null;
function Qi() {
  return Cr ??= tu().catch((t) => (Cr = null, Xi.warn("host local storage unavailable — falling back to page storage", { err: t }), null)), Cr;
}
function Hh(t) {
  if (!t) return {};
  try {
    const e = JSON.parse(t);
    return e && typeof e == "object" ? e : {};
  } catch {
    return {};
  }
}
function zh() {
  try {
    return localStorage.getItem(ln);
  } catch {
    return null;
  }
}
function nl(t) {
  try {
    localStorage.setItem(ln, t);
  } catch {
  }
}
function rl() {
  return Ye ? Promise.resolve(Ye) : (Tr ??= (async () => {
    const t = await Lt(
      (async () => {
        const e = await Qi();
        return (e ? await e.readString(ln).catch(() => null) : null) ?? zh();
      })(),
      Cs.read,
      "loadGrants"
    ).catch((e) => (Xi.warn("could not read remembered grants — asking as if nothing were", { err: e }), null));
    return Ye = Hh(t), Ye;
  })().finally(() => {
    Tr = null;
  }), Tr);
}
function Ji(t, e) {
  const s = { ...Ye ?? {}, [t]: { outcome: e, slot: Yi() } };
  Ye = s;
  const n = JSON.stringify(s);
  nl(n), (async () => await (await Qi())?.writeString(ln, n).catch((i) => {
    Xi.warn("could not persist a grant to host storage", { grant: t, err: i });
  }))();
}
function il(t) {
  if (!Ye || !(t in Ye)) return;
  const e = { ...Ye };
  delete e[t], Ye = e;
  const s = JSON.stringify(e);
  nl(s), (async () => await (await Qi())?.writeString(ln, s).catch(() => {
  }))();
}
let Ds = null, ol = 0;
const jh = /* @__PURE__ */ new Set();
function al(t) {
  if (Ds !== t && !(Ds && t && Ds.outcome === t.outcome && Ds.message === t.message)) {
    Ds = t;
    for (const e of jh)
      try {
        e();
      } catch {
      }
  }
}
function qh(t = Date.now()) {
  ol = t, al(null);
}
function Wh() {
  return ol;
}
const qo = [6e4, 12e4, 24e4, 48e4, 9e5];
class ci extends Error {
  until;
  constructor(e, s) {
    super(
      `Signaling is paused until ${Zh(e)}: the Polkadot app could not sign for Spotlight.`,
      s
    ), this.name = "SignalingPausedError", this.until = e;
  }
}
function Gh(t) {
  return t instanceof ci;
}
function Zh(t) {
  return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
let Xe = null;
const Kh = /* @__PURE__ */ new Set();
function Xh(t = Date.now()) {
  return Xe && t < Xe.until ? Xe.until : null;
}
function cl(t = Date.now()) {
  if (Xe && t < Xe.until) return Xe;
  const e = (Xe?.strikes ?? 0) + 1, s = qo[Math.min(e, qo.length) - 1];
  return ll({ until: t + s, strikes: e }), Xe;
}
function Yh() {
  Xe && ll(null);
}
function ll(t) {
  Xe = t;
  for (const e of Kh)
    try {
      e();
    } catch {
    }
}
const Je = J("host.grants"), Qh = {
  statements: "day-slot",
  contracts: "day-slot",
  "statement-submit": "session",
  "chain-submit": "session",
  camera: "forever",
  microphone: "forever"
}, Mn = ["contracts"], Jh = {
  contracts: "SmartContractAllowance"
}, ef = {
  "statement-submit": { tag: "StatementSubmit", value: void 0 },
  "chain-submit": { tag: "ChainSubmit", value: void 0 }
}, tf = {
  camera: "Camera",
  microphone: "Microphone"
}, sf = [
  { tag: "SmartContractAllowance", value: { tag: "Index", value: 0 } },
  { tag: "AutoSigning", value: void 0 }
];
function nf() {
  return {
    proof: void 0,
    decryptionKey: void 0,
    expiry: BigInt(Math.floor(Date.now() / 1e3) + 60) << 32n,
    channel: void 0,
    topics: [],
    data: "0x00"
  };
}
const Nn = 12e4, li = 6e4, dl = {
  // The host reports a refusal, a phone with no free slot and an offline phone
  // as the same `UnableToSign`, so this line has to cover all three.
  declined: "The Polkadot app did not let Spotlight publish to the Statement Store — the approval was declined, or no slot is free — so streams cannot be announced or joined. Try again to ask once more.",
  timeout: "The approval is still waiting in the Polkadot app. Answer it, then try again.",
  unavailable: "The host could not grant Spotlight permission to publish. Try again in a moment — if it keeps failing, reopen Spotlight from Polkadot Desktop or the browser host."
}, Yt = /* @__PURE__ */ new Map(), pr = /* @__PURE__ */ new Map();
let di = 0, Wo = Promise.resolve(), Ar = null;
function rf() {
  return Ar ??= Lt(su(), Cs.read, "isInsideContainer").catch(
    (t) => (Je.warn("could not tell whether this is a host — treating grants as unavailable", { err: t }), Ar = null, "unknown")
  ), Ar;
}
function of(...t) {
  return ul(t, !1);
}
function ul(t, e) {
  const s = Wo.then(
    () => Go(t, e),
    () => Go(t, e)
    // one gate's failure must not poison the chain
  );
  return Wo = s.catch(() => {
  }), s;
}
function af(...t) {
  return ul(t, !0);
}
async function cf(t) {
  const e = await rl();
  for (const s of t)
    e[s] && e[s].outcome !== "granted" && il(s), Yt.get(s) !== "granted" && Yt.delete(s), pr.delete(s);
  di = 0;
}
async function Go(t, e) {
  const s = Date.now();
  e && await cf(t);
  const n = await rl(), r = Yi(), i = {}, o = [];
  for (const l of t) {
    const c = Qh[l], d = Yt.get(l) ?? (c !== "session" && Vh(n[l], c, r) ? n[l].outcome : void 0);
    if (d) {
      i[l] = d;
      continue;
    }
    if (Date.now() < (pr.get(l) ?? 0)) {
      i[l] = "unavailable";
      continue;
    }
    o.push(l);
  }
  if (o.length === 0) return Ns(i, s);
  if (Date.now() < di) {
    for (const l of o) i[l] = "unavailable";
    return Ns(i, s);
  }
  const a = await rf();
  if (a === "unknown") {
    di = Date.now() + li;
    for (const l of o) i[l] = "unavailable";
    return Ns(i, s);
  }
  if (!a) {
    for (const l of o) i[l] = "granted";
    return Ns(i, s);
  }
  Je.info("asking the host for grants", { missing: o, slot: r }), o.includes("statements") && (i.statements = await lf()), o.some((l) => Mn.includes(l)) && Object.assign(i, await df());
  for (const l of o) {
    const c = ef[l];
    if (!c) continue;
    const d = await Zo(l, () => nu(c));
    i[l] = d, (d === "granted" || d === "declined") && Yt.set(l, d);
  }
  for (const l of o) {
    const c = tf[l];
    if (!c) continue;
    const d = await Zo(l, () => ru(c));
    i[l] = d, (d === "granted" || d === "declined") && Ji(l, d);
  }
  return Ns(i, s);
}
function Ns(t, e) {
  const s = t.statements;
  return !s || s !== "granted" && Wh() >= e || al(
    s === "granted" ? null : { outcome: s, message: dl[s] }
  ), t;
}
async function lf() {
  let t;
  try {
    t = await Lt(Tc(), Cs.read, "getStatementStore");
  } catch (e) {
    return Je.warn("statement store unreachable for the allowance probe", { err: e }), Ot("statements"), "unavailable";
  }
  if (!t)
    return Ot("statements"), "unavailable";
  try {
    await Lt(
      t.createProofAuthorized(nf()),
      Nn,
      "createProofAuthorized (allowance probe)"
    );
  } catch (e) {
    if (sl(e))
      return Je.warn("no answer from the host on the allowance probe", { timeoutMs: Nn }), Ot("statements"), "timeout";
    const s = e instanceof Error ? e.message : String(e), n = /\bUnableToSign\b/.test(s) ? "declined" : "unavailable";
    return Je.warn("allowance probe failed", { outcome: n, err: e }), Yt.set("statements", n), n === "declined" && cl(), n;
  }
  return Ji("statements", "granted"), "granted";
}
async function df() {
  const t = await Dh(sf, Nn, "grants"), e = {};
  if (t.status === "timeout") {
    Je.warn("no answer from the host on the allowance batch", {
      timeoutMs: Nn
    });
    for (const s of Mn)
      e[s] = "timeout", Ot(s);
    return e;
  }
  if (t.status === "error") {
    for (const s of Mn)
      e[s] = "unavailable", t.answered ? Yt.set(s, "unavailable") : Ot(s);
    return e;
  }
  for (const s of Mn) {
    const n = uf(t.outcomes, s);
    e[s] = n, n === "timeout" ? Ot(s) : Ji(s, n);
  }
  return Je.info("allowance batch settled", {
    outcomes: Object.entries(t.outcomes).map(([s, n]) => `${s}=${n}`).join(" "),
    autoSigning: t.outcomes.AutoSigning ?? "unanswered"
  }), e;
}
function uf(t, e) {
  const s = Jh[e], n = s ? t[s] : void 0;
  return n === "Allocated" ? "granted" : n === "Rejected" ? "declined" : n === "NotAvailable" ? "unavailable" : (Je.warn("the host named no outcome for a requested resource", { grant: e, tag: s }), "timeout");
}
async function Zo(t, e) {
  try {
    const s = await Lt(e, Cs.hostDialog, `grant(${t})`);
    return s.ok ? s.value === !0 ? "granted" : "declined" : (Ot(t), "unavailable");
  } catch (s) {
    return Je.warn("grant request did not settle", { grant: t, err: s }), Ot(t), "timeout";
  }
}
function Ot(t) {
  pr.set(t, Date.now() + li), Je.info("grant will be retried", { grant: t, inSecs: li / 1e3 });
}
function hf(...t) {
  for (const e of t)
    il(e), Yt.delete(e), pr.delete(e);
}
const hl = of, ff = af, pf = hf, mf = dl, It = "avc1.64001f", $n = "opus", Vn = "mp4a.40.2";
function Hn(t, e) {
  return `video/mp4; codecs="${t}, ${e}"`;
}
function gf() {
  const t = globalThis;
  return t.MediaSource ?? t.ManagedMediaSource;
}
function Mr(t) {
  const e = gf();
  return !!e && e.isTypeSupported(t);
}
async function yf(t) {
  if (typeof VideoEncoder > "u") return !1;
  try {
    const { supported: e } = await VideoEncoder.isConfigSupported({
      codec: t,
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
async function Ko(t) {
  if (typeof AudioEncoder > "u") return !1;
  try {
    const { supported: e } = await AudioEncoder.isConfigSupported({
      codec: t,
      sampleRate: 48e3,
      numberOfChannels: 2,
      bitrate: 96e3
    });
    return e === !0;
  } catch {
    return !1;
  }
}
async function wf() {
  const t = globalThis, [e, s, n] = await Promise.all([
    yf(It),
    Ko($n),
    Ko(Vn)
  ]);
  return {
    userAgent: typeof navigator < "u" ? navigator.userAgent : "unknown",
    webCodecs: typeof VideoEncoder < "u" && typeof AudioEncoder < "u" && typeof VideoFrame < "u",
    managedMediaSource: typeof t.ManagedMediaSource < "u",
    mediaSource: typeof t.MediaSource < "u",
    videoEncoderAvc: e,
    audioEncoderOpus: s,
    audioEncoderAac: n,
    mseAvcOpus: Mr(Hn(It, $n)),
    mseAvcAac: Mr(Hn(It, Vn)),
    mseAvcOnly: Mr(`video/mp4; codecs="${It}"`)
  };
}
function bf(t) {
  return !t.webCodecs || !t.videoEncoderAvc ? null : t.audioEncoderAac && t.mseAvcAac ? {
    videoCodec: It,
    audioCodec: Vn,
    muxAudioCodec: "aac",
    mimeType: Hn(It, Vn)
  } : t.audioEncoderOpus && t.mseAvcOpus ? {
    videoCodec: It,
    audioCodec: $n,
    muxAudioCodec: "opus",
    mimeType: Hn(It, $n)
  } : null;
}
const vf = 8;
async function Sf(t) {
  const e = new TextEncoder().encode(`spotlight:room:v1:${t}`), s = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(s)).slice(0, vf).map((r) => r.toString(16).padStart(2, "0")).join("");
}
const Br = " unchannelled", Xo = J("statement.expiry"), Yo = 900;
function _f(t = Date.now) {
  const e = /* @__PURE__ */ new Map();
  let s = 0n;
  const n = () => BigInt(Math.floor(t() / 1e3));
  return {
    next(r, i = Br) {
      const o = n() + BigInt(r) << 32n | s++ & 0xffffffffn, a = e.get(i), l = a !== void 0 && o <= a ? a + 1n : o;
      return i !== Br && e.set(i, l), l;
    },
    raiseFloor(r, i = Br) {
      if (r >> 32n > n() + BigInt(Yo))
        return Xo.warn("ignoring an implausible priority floor — reading it as a misparse", {
          min: r,
          expiration: new Date(Number(r >> 32n) * 1e3).toISOString(),
          horizonSecs: Yo
        }), !1;
      const o = e.get(i);
      return o !== void 0 && r < o ? !1 : (e.set(i, r), Xo.debug("priority floor adopted", { channel: i, min: r }), !0);
    }
  };
}
const xf = /channel_?priority_?too_?low|expiry_?too_?low/i, kf = 1n << 12n, Ef = /account_?full/i;
function Tf(t) {
  return eo(t) || !Af(t) ? null : fl(t);
}
function Cf(t) {
  if (!eo(t)) return null;
  const e = fl(t);
  return e === null ? null : (e + kf >> 32n) + 1n << 32n;
}
function fl(t) {
  const e = /* @__PURE__ */ new Set(), s = (n, r) => {
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
      const a = s(o, r + 1);
      if (a !== null) return a;
    }
    return null;
  };
  return s(t instanceof Error ? t.message : t, 0) ?? s(t, 0);
}
function eo(t) {
  return pl(t, Ef);
}
function Af(t) {
  return pl(t, xf);
}
function pl(t, e) {
  const s = /* @__PURE__ */ new Set(), n = (r, i) => r == null || i > 4 || s.has(r) ? !1 : typeof r == "string" ? e.test(r) : typeof r != "object" ? !1 : (s.add(r), Object.entries(r).some(
    ([o, a]) => e.test(o) || n(a, i + 1)
  ));
  return t instanceof Error && e.test(t.message) ? !0 : n(t, 0);
}
function Mf() {
  const t = /* @__PURE__ */ new Set();
  return {
    begin(e) {
      const s = { type: e, overlapAll: 0 };
      for (const n of t)
        s.overlapAll++, n.overlapAll++;
      return t.add(s), {
        overlap: () => ({ overlapAll: s.overlapAll }),
        end: () => {
          t.delete(s);
        }
      };
    },
    snapshot() {
      const e = {};
      for (const { type: s } of t) e[s] = (e[s] ?? 0) + 1;
      return e;
    }
  };
}
var Q;
(function(t) {
  t.assertEqual = (r) => {
  };
  function e(r) {
  }
  t.assertIs = e;
  function s(r) {
    throw new Error();
  }
  t.assertNever = s, t.arrayToEnum = (r) => {
    const i = {};
    for (const o of r)
      i[o] = o;
    return i;
  }, t.getValidEnumValues = (r) => {
    const i = t.objectKeys(r).filter((a) => typeof r[r[a]] != "number"), o = {};
    for (const a of i)
      o[a] = r[a];
    return t.objectValues(o);
  }, t.objectValues = (r) => t.objectKeys(r).map(function(i) {
    return r[i];
  }), t.objectKeys = typeof Object.keys == "function" ? (r) => Object.keys(r) : (r) => {
    const i = [];
    for (const o in r)
      Object.prototype.hasOwnProperty.call(r, o) && i.push(o);
    return i;
  }, t.find = (r, i) => {
    for (const o of r)
      if (i(o))
        return o;
  }, t.isInteger = typeof Number.isInteger == "function" ? (r) => Number.isInteger(r) : (r) => typeof r == "number" && Number.isFinite(r) && Math.floor(r) === r;
  function n(r, i = " | ") {
    return r.map((o) => typeof o == "string" ? `'${o}'` : o).join(i);
  }
  t.joinValues = n, t.jsonStringifyReplacer = (r, i) => typeof i == "bigint" ? i.toString() : i;
})(Q || (Q = {}));
var Qo;
(function(t) {
  t.mergeShapes = (e, s) => ({
    ...e,
    ...s
    // second overwrites first
  });
})(Qo || (Qo = {}));
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
]), Bt = (t) => {
  switch (typeof t) {
    case "undefined":
      return B.undefined;
    case "string":
      return B.string;
    case "number":
      return Number.isNaN(t) ? B.nan : B.number;
    case "boolean":
      return B.boolean;
    case "function":
      return B.function;
    case "bigint":
      return B.bigint;
    case "symbol":
      return B.symbol;
    case "object":
      return Array.isArray(t) ? B.array : t === null ? B.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? B.promise : typeof Map < "u" && t instanceof Map ? B.map : typeof Set < "u" && t instanceof Set ? B.set : typeof Date < "u" && t instanceof Date ? B.date : B.object;
    default:
      return B.unknown;
  }
}, x = Q.arrayToEnum([
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
    const s = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, s) : this.__proto__ = s, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const s = e || function(i) {
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
          n._errors.push(s(o));
        else {
          let a = n, l = 0;
          for (; l < o.path.length; ) {
            const c = o.path[l];
            l === o.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(s(o))) : a[c] = a[c] || { _errors: [] }, a = a[c], l++;
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
    return JSON.stringify(this.issues, Q.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (s) => s.message) {
    const s = {}, n = [];
    for (const r of this.issues)
      if (r.path.length > 0) {
        const i = r.path[0];
        s[i] = s[i] || [], s[i].push(e(r));
      } else
        n.push(e(r));
    return { formErrors: n, fieldErrors: s };
  }
  get formErrors() {
    return this.flatten();
  }
}
gt.create = (t) => new gt(t);
const ui = (t, e) => {
  let s;
  switch (t.code) {
    case x.invalid_type:
      t.received === B.undefined ? s = "Required" : s = `Expected ${t.expected}, received ${t.received}`;
      break;
    case x.invalid_literal:
      s = `Invalid literal value, expected ${JSON.stringify(t.expected, Q.jsonStringifyReplacer)}`;
      break;
    case x.unrecognized_keys:
      s = `Unrecognized key(s) in object: ${Q.joinValues(t.keys, ", ")}`;
      break;
    case x.invalid_union:
      s = "Invalid input";
      break;
    case x.invalid_union_discriminator:
      s = `Invalid discriminator value. Expected ${Q.joinValues(t.options)}`;
      break;
    case x.invalid_enum_value:
      s = `Invalid enum value. Expected ${Q.joinValues(t.options)}, received '${t.received}'`;
      break;
    case x.invalid_arguments:
      s = "Invalid function arguments";
      break;
    case x.invalid_return_type:
      s = "Invalid function return type";
      break;
    case x.invalid_date:
      s = "Invalid date";
      break;
    case x.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (s = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (s = `${s} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? s = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? s = `Invalid input: must end with "${t.validation.endsWith}"` : Q.assertNever(t.validation) : t.validation !== "regex" ? s = `Invalid ${t.validation}` : s = "Invalid";
      break;
    case x.too_small:
      t.type === "array" ? s = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? s = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? s = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "bigint" ? s = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? s = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : s = "Invalid input";
      break;
    case x.too_big:
      t.type === "array" ? s = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? s = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? s = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? s = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? s = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : s = "Invalid input";
      break;
    case x.custom:
      s = "Invalid input";
      break;
    case x.invalid_intersection_types:
      s = "Intersection results could not be merged";
      break;
    case x.not_multiple_of:
      s = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case x.not_finite:
      s = "Number must be finite";
      break;
    default:
      s = e.defaultError, Q.assertNever(t);
  }
  return { message: s };
};
let Bf = ui;
function If() {
  return Bf;
}
const Rf = (t) => {
  const { data: e, path: s, errorMaps: n, issueData: r } = t, i = [...s, ...r.path || []], o = {
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
  const l = n.filter((c) => !!c).slice().reverse();
  for (const c of l)
    a = c(o, { data: e, defaultError: a }).message;
  return {
    ...r,
    path: i,
    message: a
  };
};
function A(t, e) {
  const s = If(), n = Rf({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      // contextual error map is first priority
      t.schemaErrorMap,
      // then schema-bound map if available
      s,
      // then global override map
      s === ui ? void 0 : ui
      // then global default map
    ].filter((r) => !!r)
  });
  t.common.issues.push(n);
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
  static mergeArray(e, s) {
    const n = [];
    for (const r of s) {
      if (r.status === "aborted")
        return V;
      r.status === "dirty" && e.dirty(), n.push(r.value);
    }
    return { status: e.value, value: n };
  }
  static async mergeObjectAsync(e, s) {
    const n = [];
    for (const r of s) {
      const i = await r.key, o = await r.value;
      n.push({
        key: i,
        value: o
      });
    }
    return Ae.mergeObjectSync(e, n);
  }
  static mergeObjectSync(e, s) {
    const n = {};
    for (const r of s) {
      const { key: i, value: o } = r;
      if (i.status === "aborted" || o.status === "aborted")
        return V;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || r.alwaysSet) && (n[i.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const V = Object.freeze({
  status: "aborted"
}), Gs = (t) => ({ status: "dirty", value: t }), Le = (t) => ({ status: "valid", value: t }), Jo = (t) => t.status === "aborted", ea = (t) => t.status === "dirty", As = (t) => t.status === "valid", zn = (t) => typeof Promise < "u" && t instanceof Promise;
var R;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e?.message;
})(R || (R = {}));
class st {
  constructor(e, s, n, r) {
    this._cachedPath = [], this.parent = e, this.data = s, this._path = n, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const ta = (t, e) => {
  if (As(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const s = new gt(t.common.issues);
      return this._error = s, this._error;
    }
  };
};
function G(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: s, required_error: n, description: r } = t;
  if (e && (s || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (o, a) => {
    const { message: l } = t;
    return o.code === "invalid_enum_value" ? { message: l ?? a.defaultError } : typeof a.data > "u" ? { message: l ?? n ?? a.defaultError } : o.code !== "invalid_type" ? { message: a.defaultError } : { message: l ?? s ?? a.defaultError };
  }, description: r };
}
class K {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Bt(e.data);
  }
  _getOrReturnCtx(e, s) {
    return s || {
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
    const s = this._parse(e);
    if (zn(s))
      throw new Error("Synchronous parse encountered promise.");
    return s;
  }
  _parseAsync(e) {
    const s = this._parse(e);
    return Promise.resolve(s);
  }
  parse(e, s) {
    const n = this.safeParse(e, s);
    if (n.success)
      return n.data;
    throw n.error;
  }
  safeParse(e, s) {
    const n = {
      common: {
        issues: [],
        async: s?.async ?? !1,
        contextualErrorMap: s?.errorMap
      },
      path: s?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Bt(e)
    }, r = this._parseSync({ data: e, path: n.path, parent: n });
    return ta(n, r);
  }
  "~validate"(e) {
    const s = {
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
        const n = this._parseSync({ data: e, path: [], parent: s });
        return As(n) ? {
          value: n.value
        } : {
          issues: s.common.issues
        };
      } catch (n) {
        n?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), s.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: s }).then((n) => As(n) ? {
      value: n.value
    } : {
      issues: s.common.issues
    });
  }
  async parseAsync(e, s) {
    const n = await this.safeParseAsync(e, s);
    if (n.success)
      return n.data;
    throw n.error;
  }
  async safeParseAsync(e, s) {
    const n = {
      common: {
        issues: [],
        contextualErrorMap: s?.errorMap,
        async: !0
      },
      path: s?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Bt(e)
    }, r = this._parse({ data: e, path: n.path, parent: n }), i = await (zn(r) ? r : Promise.resolve(r));
    return ta(n, i);
  }
  refine(e, s) {
    const n = (r) => typeof s == "string" || typeof s > "u" ? { message: s } : typeof s == "function" ? s(r) : s;
    return this._refinement((r, i) => {
      const o = e(r), a = () => i.addIssue({
        code: x.custom,
        ...n(r)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((l) => l ? !0 : (a(), !1)) : o ? !0 : (a(), !1);
    });
  }
  refinement(e, s) {
    return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof s == "function" ? s(n, r) : s), !1));
  }
  _refinement(e) {
    return new es({
      schema: this,
      typeName: H.ZodEffects,
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
      validate: (s) => this["~validate"](s)
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
    return Kn.create(this, this._def);
  }
  or(e) {
    return qn.create([this, e], this._def);
  }
  and(e) {
    return Wn.create(this, e, this._def);
  }
  transform(e) {
    return new es({
      ...G(this._def),
      schema: this,
      typeName: H.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const s = typeof e == "function" ? e : () => e;
    return new Xn({
      ...G(this._def),
      innerType: this,
      defaultValue: s,
      typeName: H.ZodDefault
    });
  }
  brand() {
    return new wl({
      typeName: H.ZodBranded,
      type: this,
      ...G(this._def)
    });
  }
  catch(e) {
    const s = typeof e == "function" ? e : () => e;
    return new Yn({
      ...G(this._def),
      innerType: this,
      catchValue: s,
      typeName: H.ZodCatch
    });
  }
  describe(e) {
    const s = this.constructor;
    return new s({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return so.create(this, e);
  }
  readonly() {
    return Qn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Of = /^c[^\s-]{8,}$/i, Pf = /^[0-9a-z]+$/, Ff = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Lf = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Uf = /^[a-z0-9_-]{21}$/i, Df = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Nf = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, $f = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Vf = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let Ir;
const Hf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, zf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, jf = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, qf = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Wf = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Gf = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, ml = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Zf = new RegExp(`^${ml}$`);
function gl(t) {
  let e = "[0-5]\\d";
  t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`);
  const s = t.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${s}`;
}
function Kf(t) {
  return new RegExp(`^${gl(t)}$`);
}
function Xf(t) {
  let e = `${ml}T${gl(t)}`;
  const s = [];
  return s.push(t.local ? "Z?" : "Z"), t.offset && s.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${s.join("|")})`, new RegExp(`^${e}$`);
}
function Yf(t, e) {
  return !!((e === "v4" || !e) && Hf.test(t) || (e === "v6" || !e) && jf.test(t));
}
function Qf(t, e) {
  if (!Df.test(t))
    return !1;
  try {
    const [s] = t.split(".");
    if (!s)
      return !1;
    const n = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + (4 - s.length % 4) % 4, "="), r = JSON.parse(atob(n));
    return !(typeof r != "object" || r === null || "typ" in r && r?.typ !== "JWT" || !r.alg || e && r.alg !== e);
  } catch {
    return !1;
  }
}
function Jf(t, e) {
  return !!((e === "v4" || !e) && zf.test(t) || (e === "v6" || !e) && qf.test(t));
}
class ut extends K {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== B.string) {
      const i = this._getOrReturnCtx(e);
      return A(i, {
        code: x.invalid_type,
        expected: B.string,
        received: i.parsedType
      }), V;
    }
    const n = new Ae();
    let r;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (r = this._getOrReturnCtx(e, r), A(r, {
          code: x.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), n.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (r = this._getOrReturnCtx(e, r), A(r, {
          code: x.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), n.dirty());
      else if (i.kind === "length") {
        const o = e.data.length > i.value, a = e.data.length < i.value;
        (o || a) && (r = this._getOrReturnCtx(e, r), o ? A(r, {
          code: x.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : a && A(r, {
          code: x.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), n.dirty());
      } else if (i.kind === "email")
        $f.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "email",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "emoji")
        Ir || (Ir = new RegExp(Vf, "u")), Ir.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "emoji",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "uuid")
        Lf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "uuid",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "nanoid")
        Uf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "nanoid",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid")
        Of.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "cuid",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid2")
        Pf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "cuid2",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "ulid")
        Ff.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
          validation: "ulid",
          code: x.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          r = this._getOrReturnCtx(e, r), A(r, {
            validation: "url",
            code: x.invalid_string,
            message: i.message
          }), n.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "regex",
        code: x.invalid_string,
        message: i.message
      }), n.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), n.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), n.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), n.dirty()) : i.kind === "datetime" ? Xf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: "datetime",
        message: i.message
      }), n.dirty()) : i.kind === "date" ? Zf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: "date",
        message: i.message
      }), n.dirty()) : i.kind === "time" ? Kf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.invalid_string,
        validation: "time",
        message: i.message
      }), n.dirty()) : i.kind === "duration" ? Nf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "duration",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "ip" ? Yf(e.data, i.version) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "ip",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "jwt" ? Qf(e.data, i.alg) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "jwt",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "cidr" ? Jf(e.data, i.version) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "cidr",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64" ? Wf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "base64",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64url" ? Gf.test(e.data) || (r = this._getOrReturnCtx(e, r), A(r, {
        validation: "base64url",
        code: x.invalid_string,
        message: i.message
      }), n.dirty()) : Q.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _regex(e, s, n) {
    return this.refinement((r) => e.test(r), {
      validation: s,
      code: x.invalid_string,
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
  regex(e, s) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...R.errToObj(s)
    });
  }
  includes(e, s) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: s?.position,
      ...R.errToObj(s?.message)
    });
  }
  startsWith(e, s) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...R.errToObj(s)
    });
  }
  endsWith(e, s) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...R.errToObj(s)
    });
  }
  min(e, s) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...R.errToObj(s)
    });
  }
  max(e, s) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...R.errToObj(s)
    });
  }
  length(e, s) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...R.errToObj(s)
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
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
}
ut.create = (t) => new ut({
  checks: [],
  typeName: H.ZodString,
  coerce: t?.coerce ?? !1,
  ...G(t)
});
function ep(t, e) {
  const s = (t.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, r = s > n ? s : n, i = Number.parseInt(t.toFixed(r).replace(".", "")), o = Number.parseInt(e.toFixed(r).replace(".", ""));
  return i % o / 10 ** r;
}
class Ms extends K {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== B.number) {
      const i = this._getOrReturnCtx(e);
      return A(i, {
        code: x.invalid_type,
        expected: B.number,
        received: i.parsedType
      }), V;
    }
    let n;
    const r = new Ae();
    for (const i of this._def.checks)
      i.kind === "int" ? Q.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), r.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? ep(e.data, i.value) !== 0 && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.not_finite,
        message: i.message
      }), r.dirty()) : Q.assertNever(i);
    return { status: r.value, value: e.data };
  }
  gte(e, s) {
    return this.setLimit("min", e, !0, R.toString(s));
  }
  gt(e, s) {
    return this.setLimit("min", e, !1, R.toString(s));
  }
  lte(e, s) {
    return this.setLimit("max", e, !0, R.toString(s));
  }
  lt(e, s) {
    return this.setLimit("max", e, !1, R.toString(s));
  }
  setLimit(e, s, n, r) {
    return new Ms({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: s,
          inclusive: n,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Ms({
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
  multipleOf(e, s) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: R.toString(s)
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
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && Q.isInteger(e.value));
  }
  get isFinite() {
    let e = null, s = null;
    for (const n of this._def.checks) {
      if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf")
        return !0;
      n.kind === "min" ? (s === null || n.value > s) && (s = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    }
    return Number.isFinite(s) && Number.isFinite(e);
  }
}
Ms.create = (t) => new Ms({
  checks: [],
  typeName: H.ZodNumber,
  coerce: t?.coerce || !1,
  ...G(t)
});
class tn extends K {
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
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), r.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (n = this._getOrReturnCtx(e, n), A(n, {
        code: x.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : Q.assertNever(i);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const s = this._getOrReturnCtx(e);
    return A(s, {
      code: x.invalid_type,
      expected: B.bigint,
      received: s.parsedType
    }), V;
  }
  gte(e, s) {
    return this.setLimit("min", e, !0, R.toString(s));
  }
  gt(e, s) {
    return this.setLimit("min", e, !1, R.toString(s));
  }
  lte(e, s) {
    return this.setLimit("max", e, !0, R.toString(s));
  }
  lt(e, s) {
    return this.setLimit("max", e, !1, R.toString(s));
  }
  setLimit(e, s, n, r) {
    return new tn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: s,
          inclusive: n,
          message: R.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new tn({
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
  multipleOf(e, s) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: R.toString(s)
    });
  }
  get minValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e;
  }
}
tn.create = (t) => new tn({
  checks: [],
  typeName: H.ZodBigInt,
  coerce: t?.coerce ?? !1,
  ...G(t)
});
class hi extends K {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== B.boolean) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.boolean,
        received: n.parsedType
      }), V;
    }
    return Le(e.data);
  }
}
hi.create = (t) => new hi({
  typeName: H.ZodBoolean,
  coerce: t?.coerce || !1,
  ...G(t)
});
class jn extends K {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== B.date) {
      const i = this._getOrReturnCtx(e);
      return A(i, {
        code: x.invalid_type,
        expected: B.date,
        received: i.parsedType
      }), V;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return A(i, {
        code: x.invalid_date
      }), V;
    }
    const n = new Ae();
    let r;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), n.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (r = this._getOrReturnCtx(e, r), A(r, {
        code: x.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), n.dirty()) : Q.assertNever(i);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new jn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, s) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: R.toString(s)
    });
  }
  max(e, s) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: R.toString(s)
    });
  }
  get minDate() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "min" && (e === null || s.value > e) && (e = s.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const s of this._def.checks)
      s.kind === "max" && (e === null || s.value < e) && (e = s.value);
    return e != null ? new Date(e) : null;
  }
}
jn.create = (t) => new jn({
  checks: [],
  coerce: t?.coerce || !1,
  typeName: H.ZodDate,
  ...G(t)
});
class sa extends K {
  _parse(e) {
    if (this._getType(e) !== B.symbol) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.symbol,
        received: n.parsedType
      }), V;
    }
    return Le(e.data);
  }
}
sa.create = (t) => new sa({
  typeName: H.ZodSymbol,
  ...G(t)
});
class fi extends K {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.undefined,
        received: n.parsedType
      }), V;
    }
    return Le(e.data);
  }
}
fi.create = (t) => new fi({
  typeName: H.ZodUndefined,
  ...G(t)
});
class pi extends K {
  _parse(e) {
    if (this._getType(e) !== B.null) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.null,
        received: n.parsedType
      }), V;
    }
    return Le(e.data);
  }
}
pi.create = (t) => new pi({
  typeName: H.ZodNull,
  ...G(t)
});
class na extends K {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Le(e.data);
  }
}
na.create = (t) => new na({
  typeName: H.ZodAny,
  ...G(t)
});
class mi extends K {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Le(e.data);
  }
}
mi.create = (t) => new mi({
  typeName: H.ZodUnknown,
  ...G(t)
});
class Ut extends K {
  _parse(e) {
    const s = this._getOrReturnCtx(e);
    return A(s, {
      code: x.invalid_type,
      expected: B.never,
      received: s.parsedType
    }), V;
  }
}
Ut.create = (t) => new Ut({
  typeName: H.ZodNever,
  ...G(t)
});
class ra extends K {
  _parse(e) {
    if (this._getType(e) !== B.undefined) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.void,
        received: n.parsedType
      }), V;
    }
    return Le(e.data);
  }
}
ra.create = (t) => new ra({
  typeName: H.ZodVoid,
  ...G(t)
});
class et extends K {
  _parse(e) {
    const { ctx: s, status: n } = this._processInputParams(e), r = this._def;
    if (s.parsedType !== B.array)
      return A(s, {
        code: x.invalid_type,
        expected: B.array,
        received: s.parsedType
      }), V;
    if (r.exactLength !== null) {
      const o = s.data.length > r.exactLength.value, a = s.data.length < r.exactLength.value;
      (o || a) && (A(s, {
        code: o ? x.too_big : x.too_small,
        minimum: a ? r.exactLength.value : void 0,
        maximum: o ? r.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: r.exactLength.message
      }), n.dirty());
    }
    if (r.minLength !== null && s.data.length < r.minLength.value && (A(s, {
      code: x.too_small,
      minimum: r.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.minLength.message
    }), n.dirty()), r.maxLength !== null && s.data.length > r.maxLength.value && (A(s, {
      code: x.too_big,
      maximum: r.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: r.maxLength.message
    }), n.dirty()), s.common.async)
      return Promise.all([...s.data].map((o, a) => r.type._parseAsync(new st(s, o, s.path, a)))).then((o) => Ae.mergeArray(n, o));
    const i = [...s.data].map((o, a) => r.type._parseSync(new st(s, o, s.path, a)));
    return Ae.mergeArray(n, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, s) {
    return new et({
      ...this._def,
      minLength: { value: e, message: R.toString(s) }
    });
  }
  max(e, s) {
    return new et({
      ...this._def,
      maxLength: { value: e, message: R.toString(s) }
    });
  }
  length(e, s) {
    return new et({
      ...this._def,
      exactLength: { value: e, message: R.toString(s) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
et.create = (t, e) => new et({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: H.ZodArray,
  ...G(e)
});
function ws(t) {
  if (t instanceof ye) {
    const e = {};
    for (const s in t.shape) {
      const n = t.shape[s];
      e[s] = ft.create(ws(n));
    }
    return new ye({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof et ? new et({
    ...t._def,
    type: ws(t.element)
  }) : t instanceof ft ? ft.create(ws(t.unwrap())) : t instanceof ts ? ts.create(ws(t.unwrap())) : t instanceof Qt ? Qt.create(t.items.map((e) => ws(e))) : t;
}
class ye extends K {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), s = Q.objectKeys(e);
    return this._cached = { shape: e, keys: s }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== B.object) {
      const c = this._getOrReturnCtx(e);
      return A(c, {
        code: x.invalid_type,
        expected: B.object,
        received: c.parsedType
      }), V;
    }
    const { status: n, ctx: r } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), a = [];
    if (!(this._def.catchall instanceof Ut && this._def.unknownKeys === "strip"))
      for (const c in r.data)
        o.includes(c) || a.push(c);
    const l = [];
    for (const c of o) {
      const d = i[c], u = r.data[c];
      l.push({
        key: { status: "valid", value: c },
        value: d._parse(new st(r, u, r.path, c)),
        alwaysSet: c in r.data
      });
    }
    if (this._def.catchall instanceof Ut) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const d of a)
          l.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: r.data[d] }
          });
      else if (c === "strict")
        a.length > 0 && (A(r, {
          code: x.unrecognized_keys,
          keys: a
        }), n.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const d of a) {
        const u = r.data[d];
        l.push({
          key: { status: "valid", value: d },
          value: c._parse(
            new st(r, u, r.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
      const c = [];
      for (const d of l) {
        const u = await d.key, h = await d.value;
        c.push({
          key: u,
          value: h,
          alwaysSet: d.alwaysSet
        });
      }
      return c;
    }).then((c) => Ae.mergeObjectSync(n, c)) : Ae.mergeObjectSync(n, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return R.errToObj, new ye({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (s, n) => {
          const r = this._def.errorMap?.(s, n).message ?? n.defaultError;
          return s.code === "unrecognized_keys" ? {
            message: R.errToObj(e).message ?? r
          } : {
            message: r
          };
        }
      } : {}
    });
  }
  strip() {
    return new ye({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ye({
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
    return new ye({
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
    return new ye({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: H.ZodObject
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
  setKey(e, s) {
    return this.augment({ [e]: s });
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
    return new ye({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const s = {};
    for (const n of Q.objectKeys(e))
      e[n] && this.shape[n] && (s[n] = this.shape[n]);
    return new ye({
      ...this._def,
      shape: () => s
    });
  }
  omit(e) {
    const s = {};
    for (const n of Q.objectKeys(this.shape))
      e[n] || (s[n] = this.shape[n]);
    return new ye({
      ...this._def,
      shape: () => s
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return ws(this);
  }
  partial(e) {
    const s = {};
    for (const n of Q.objectKeys(this.shape)) {
      const r = this.shape[n];
      e && !e[n] ? s[n] = r : s[n] = r.optional();
    }
    return new ye({
      ...this._def,
      shape: () => s
    });
  }
  required(e) {
    const s = {};
    for (const n of Q.objectKeys(this.shape))
      if (e && !e[n])
        s[n] = this.shape[n];
      else {
        let i = this.shape[n];
        for (; i instanceof ft; )
          i = i._def.innerType;
        s[n] = i;
      }
    return new ye({
      ...this._def,
      shape: () => s
    });
  }
  keyof() {
    return yl(Q.objectKeys(this.shape));
  }
}
ye.create = (t, e) => new ye({
  shape: () => t,
  unknownKeys: "strip",
  catchall: Ut.create(),
  typeName: H.ZodObject,
  ...G(e)
});
ye.strictCreate = (t, e) => new ye({
  shape: () => t,
  unknownKeys: "strict",
  catchall: Ut.create(),
  typeName: H.ZodObject,
  ...G(e)
});
ye.lazycreate = (t, e) => new ye({
  shape: t,
  unknownKeys: "strip",
  catchall: Ut.create(),
  typeName: H.ZodObject,
  ...G(e)
});
class qn extends K {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = this._def.options;
    function r(i) {
      for (const a of i)
        if (a.result.status === "valid")
          return a.result;
      for (const a of i)
        if (a.result.status === "dirty")
          return s.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((a) => new gt(a.ctx.common.issues));
      return A(s, {
        code: x.invalid_union,
        unionErrors: o
      }), V;
    }
    if (s.common.async)
      return Promise.all(n.map(async (i) => {
        const o = {
          ...s,
          common: {
            ...s.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: s.data,
            path: s.path,
            parent: o
          }),
          ctx: o
        };
      })).then(r);
    {
      let i;
      const o = [];
      for (const l of n) {
        const c = {
          ...s,
          common: {
            ...s.common,
            issues: []
          },
          parent: null
        }, d = l._parseSync({
          data: s.data,
          path: s.path,
          parent: c
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: c }), c.common.issues.length && o.push(c.common.issues);
      }
      if (i)
        return s.common.issues.push(...i.ctx.common.issues), i.result;
      const a = o.map((l) => new gt(l));
      return A(s, {
        code: x.invalid_union,
        unionErrors: a
      }), V;
    }
  }
  get options() {
    return this._def.options;
  }
}
qn.create = (t, e) => new qn({
  options: t,
  typeName: H.ZodUnion,
  ...G(e)
});
const ct = (t) => t instanceof yi ? ct(t.schema) : t instanceof es ? ct(t.innerType()) : t instanceof Zn ? [t.value] : t instanceof Jt ? t.options : t instanceof wi ? Q.objectValues(t.enum) : t instanceof Xn ? ct(t._def.innerType) : t instanceof fi ? [void 0] : t instanceof pi ? [null] : t instanceof ft ? [void 0, ...ct(t.unwrap())] : t instanceof ts ? [null, ...ct(t.unwrap())] : t instanceof wl || t instanceof Qn ? ct(t.unwrap()) : t instanceof Yn ? ct(t._def.innerType) : [];
class to extends K {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    if (s.parsedType !== B.object)
      return A(s, {
        code: x.invalid_type,
        expected: B.object,
        received: s.parsedType
      }), V;
    const n = this.discriminator, r = s.data[n], i = this.optionsMap.get(r);
    return i ? s.common.async ? i._parseAsync({
      data: s.data,
      path: s.path,
      parent: s
    }) : i._parseSync({
      data: s.data,
      path: s.path,
      parent: s
    }) : (A(s, {
      code: x.invalid_union_discriminator,
      options: Array.from(this.optionsMap.keys()),
      path: [n]
    }), V);
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
  static create(e, s, n) {
    const r = /* @__PURE__ */ new Map();
    for (const i of s) {
      const o = ct(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const a of o) {
        if (r.has(a))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
        r.set(a, i);
      }
    }
    return new to({
      typeName: H.ZodDiscriminatedUnion,
      discriminator: e,
      options: s,
      optionsMap: r,
      ...G(n)
    });
  }
}
function gi(t, e) {
  const s = Bt(t), n = Bt(e);
  if (t === e)
    return { valid: !0, data: t };
  if (s === B.object && n === B.object) {
    const r = Q.objectKeys(e), i = Q.objectKeys(t).filter((a) => r.indexOf(a) !== -1), o = { ...t, ...e };
    for (const a of i) {
      const l = gi(t[a], e[a]);
      if (!l.valid)
        return { valid: !1 };
      o[a] = l.data;
    }
    return { valid: !0, data: o };
  } else if (s === B.array && n === B.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let i = 0; i < t.length; i++) {
      const o = t[i], a = e[i], l = gi(o, a);
      if (!l.valid)
        return { valid: !1 };
      r.push(l.data);
    }
    return { valid: !0, data: r };
  } else return s === B.date && n === B.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class Wn extends K {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e), r = (i, o) => {
      if (Jo(i) || Jo(o))
        return V;
      const a = gi(i.value, o.value);
      return a.valid ? ((ea(i) || ea(o)) && s.dirty(), { status: s.value, value: a.data }) : (A(n, {
        code: x.invalid_intersection_types
      }), V);
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
Wn.create = (t, e, s) => new Wn({
  left: t,
  right: e,
  typeName: H.ZodIntersection,
  ...G(s)
});
class Qt extends K {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.array)
      return A(n, {
        code: x.invalid_type,
        expected: B.array,
        received: n.parsedType
      }), V;
    if (n.data.length < this._def.items.length)
      return A(n, {
        code: x.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), V;
    !this._def.rest && n.data.length > this._def.items.length && (A(n, {
      code: x.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), s.dirty());
    const i = [...n.data].map((o, a) => {
      const l = this._def.items[a] || this._def.rest;
      return l ? l._parse(new st(n, o, n.path, a)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(i).then((o) => Ae.mergeArray(s, o)) : Ae.mergeArray(s, i);
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
Qt.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Qt({
    items: t,
    typeName: H.ZodTuple,
    rest: null,
    ...G(e)
  });
};
class Gn extends K {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.object)
      return A(n, {
        code: x.invalid_type,
        expected: B.object,
        received: n.parsedType
      }), V;
    const r = [], i = this._def.keyType, o = this._def.valueType;
    for (const a in n.data)
      r.push({
        key: i._parse(new st(n, a, n.path, a)),
        value: o._parse(new st(n, n.data[a], n.path, a)),
        alwaysSet: a in n.data
      });
    return n.common.async ? Ae.mergeObjectAsync(s, r) : Ae.mergeObjectSync(s, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, s, n) {
    return s instanceof K ? new Gn({
      keyType: e,
      valueType: s,
      typeName: H.ZodRecord,
      ...G(n)
    }) : new Gn({
      keyType: ut.create(),
      valueType: e,
      typeName: H.ZodRecord,
      ...G(s)
    });
  }
}
class ia extends K {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.map)
      return A(n, {
        code: x.invalid_type,
        expected: B.map,
        received: n.parsedType
      }), V;
    const r = this._def.keyType, i = this._def.valueType, o = [...n.data.entries()].map(([a, l], c) => ({
      key: r._parse(new st(n, a, n.path, [c, "key"])),
      value: i._parse(new st(n, l, n.path, [c, "value"]))
    }));
    if (n.common.async) {
      const a = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of o) {
          const c = await l.key, d = await l.value;
          if (c.status === "aborted" || d.status === "aborted")
            return V;
          (c.status === "dirty" || d.status === "dirty") && s.dirty(), a.set(c.value, d.value);
        }
        return { status: s.value, value: a };
      });
    } else {
      const a = /* @__PURE__ */ new Map();
      for (const l of o) {
        const c = l.key, d = l.value;
        if (c.status === "aborted" || d.status === "aborted")
          return V;
        (c.status === "dirty" || d.status === "dirty") && s.dirty(), a.set(c.value, d.value);
      }
      return { status: s.value, value: a };
    }
  }
}
ia.create = (t, e, s) => new ia({
  valueType: e,
  keyType: t,
  typeName: H.ZodMap,
  ...G(s)
});
class sn extends K {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== B.set)
      return A(n, {
        code: x.invalid_type,
        expected: B.set,
        received: n.parsedType
      }), V;
    const r = this._def;
    r.minSize !== null && n.data.size < r.minSize.value && (A(n, {
      code: x.too_small,
      minimum: r.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.minSize.message
    }), s.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (A(n, {
      code: x.too_big,
      maximum: r.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: r.maxSize.message
    }), s.dirty());
    const i = this._def.valueType;
    function o(l) {
      const c = /* @__PURE__ */ new Set();
      for (const d of l) {
        if (d.status === "aborted")
          return V;
        d.status === "dirty" && s.dirty(), c.add(d.value);
      }
      return { status: s.value, value: c };
    }
    const a = [...n.data.values()].map((l, c) => i._parse(new st(n, l, n.path, c)));
    return n.common.async ? Promise.all(a).then((l) => o(l)) : o(a);
  }
  min(e, s) {
    return new sn({
      ...this._def,
      minSize: { value: e, message: R.toString(s) }
    });
  }
  max(e, s) {
    return new sn({
      ...this._def,
      maxSize: { value: e, message: R.toString(s) }
    });
  }
  size(e, s) {
    return this.min(e, s).max(e, s);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
sn.create = (t, e) => new sn({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: H.ZodSet,
  ...G(e)
});
class yi extends K {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    return this._def.getter()._parse({ data: s.data, path: s.path, parent: s });
  }
}
yi.create = (t, e) => new yi({
  getter: t,
  typeName: H.ZodLazy,
  ...G(e)
});
class Zn extends K {
  _parse(e) {
    if (e.data !== this._def.value) {
      const s = this._getOrReturnCtx(e);
      return A(s, {
        received: s.data,
        code: x.invalid_literal,
        expected: this._def.value
      }), V;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Zn.create = (t, e) => new Zn({
  value: t,
  typeName: H.ZodLiteral,
  ...G(e)
});
function yl(t, e) {
  return new Jt({
    values: t,
    typeName: H.ZodEnum,
    ...G(e)
  });
}
class Jt extends K {
  _parse(e) {
    if (typeof e.data != "string") {
      const s = this._getOrReturnCtx(e), n = this._def.values;
      return A(s, {
        expected: Q.joinValues(n),
        received: s.parsedType,
        code: x.invalid_type
      }), V;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const s = this._getOrReturnCtx(e), n = this._def.values;
      return A(s, {
        received: s.data,
        code: x.invalid_enum_value,
        options: n
      }), V;
    }
    return Le(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  get Values() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  get Enum() {
    const e = {};
    for (const s of this._def.values)
      e[s] = s;
    return e;
  }
  extract(e, s = this._def) {
    return Jt.create(e, {
      ...this._def,
      ...s
    });
  }
  exclude(e, s = this._def) {
    return Jt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...s
    });
  }
}
Jt.create = yl;
class wi extends K {
  _parse(e) {
    const s = Q.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== B.string && n.parsedType !== B.number) {
      const r = Q.objectValues(s);
      return A(n, {
        expected: Q.joinValues(r),
        received: n.parsedType,
        code: x.invalid_type
      }), V;
    }
    if (this._cache || (this._cache = new Set(Q.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = Q.objectValues(s);
      return A(n, {
        received: n.data,
        code: x.invalid_enum_value,
        options: r
      }), V;
    }
    return Le(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
wi.create = (t, e) => new wi({
  values: t,
  typeName: H.ZodNativeEnum,
  ...G(e)
});
class Kn extends K {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    if (s.parsedType !== B.promise && s.common.async === !1)
      return A(s, {
        code: x.invalid_type,
        expected: B.promise,
        received: s.parsedType
      }), V;
    const n = s.parsedType === B.promise ? s.data : Promise.resolve(s.data);
    return Le(n.then((r) => this._def.type.parseAsync(r, {
      path: s.path,
      errorMap: s.common.contextualErrorMap
    })));
  }
}
Kn.create = (t, e) => new Kn({
  type: t,
  typeName: H.ZodPromise,
  ...G(e)
});
class es extends K {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === H.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
      addIssue: (o) => {
        A(n, o), o.fatal ? s.abort() : s.dirty();
      },
      get path() {
        return n.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
      const o = r.transform(n.data, i);
      if (n.common.async)
        return Promise.resolve(o).then(async (a) => {
          if (s.value === "aborted")
            return V;
          const l = await this._def.schema._parseAsync({
            data: a,
            path: n.path,
            parent: n
          });
          return l.status === "aborted" ? V : l.status === "dirty" || s.value === "dirty" ? Gs(l.value) : l;
        });
      {
        if (s.value === "aborted")
          return V;
        const a = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? V : a.status === "dirty" || s.value === "dirty" ? Gs(a.value) : a;
      }
    }
    if (r.type === "refinement") {
      const o = (a) => {
        const l = r.refinement(a, i);
        if (n.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return a;
      };
      if (n.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? V : (a.status === "dirty" && s.dirty(), o(a.value), { status: s.value, value: a.value });
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((a) => a.status === "aborted" ? V : (a.status === "dirty" && s.dirty(), o(a.value).then(() => ({ status: s.value, value: a.value }))));
    }
    if (r.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!As(o))
          return V;
        const a = r.transform(o.value, i);
        if (a instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: s.value, value: a };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => As(o) ? Promise.resolve(r.transform(o.value, i)).then((a) => ({
          status: s.value,
          value: a
        })) : V);
    Q.assertNever(r);
  }
}
es.create = (t, e, s) => new es({
  schema: t,
  typeName: H.ZodEffects,
  effect: e,
  ...G(s)
});
es.createWithPreprocess = (t, e, s) => new es({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: H.ZodEffects,
  ...G(s)
});
class ft extends K {
  _parse(e) {
    return this._getType(e) === B.undefined ? Le(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ft.create = (t, e) => new ft({
  innerType: t,
  typeName: H.ZodOptional,
  ...G(e)
});
class ts extends K {
  _parse(e) {
    return this._getType(e) === B.null ? Le(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ts.create = (t, e) => new ts({
  innerType: t,
  typeName: H.ZodNullable,
  ...G(e)
});
class Xn extends K {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e);
    let n = s.data;
    return s.parsedType === B.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: s.path,
      parent: s
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Xn.create = (t, e) => new Xn({
  innerType: t,
  typeName: H.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...G(e)
});
class Yn extends K {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = {
      ...s,
      common: {
        ...s.common,
        issues: []
      }
    }, r = this._def.innerType._parse({
      data: n.data,
      path: n.path,
      parent: {
        ...n
      }
    });
    return zn(r) ? r.then((i) => ({
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
Yn.create = (t, e) => new Yn({
  innerType: t,
  typeName: H.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...G(e)
});
class oa extends K {
  _parse(e) {
    if (this._getType(e) !== B.nan) {
      const n = this._getOrReturnCtx(e);
      return A(n, {
        code: x.invalid_type,
        expected: B.nan,
        received: n.parsedType
      }), V;
    }
    return { status: "valid", value: e.data };
  }
}
oa.create = (t) => new oa({
  typeName: H.ZodNaN,
  ...G(t)
});
class wl extends K {
  _parse(e) {
    const { ctx: s } = this._processInputParams(e), n = s.data;
    return this._def.type._parse({
      data: n,
      path: s.path,
      parent: s
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class so extends K {
  _parse(e) {
    const { status: s, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return i.status === "aborted" ? V : i.status === "dirty" ? (s.dirty(), Gs(i.value)) : this._def.out._parseAsync({
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
      return r.status === "aborted" ? V : r.status === "dirty" ? (s.dirty(), {
        status: "dirty",
        value: r.value
      }) : this._def.out._parseSync({
        data: r.value,
        path: n.path,
        parent: n
      });
    }
  }
  static create(e, s) {
    return new so({
      in: e,
      out: s,
      typeName: H.ZodPipeline
    });
  }
}
class Qn extends K {
  _parse(e) {
    const s = this._def.innerType._parse(e), n = (r) => (As(r) && (r.value = Object.freeze(r.value)), r);
    return zn(s) ? s.then((r) => n(r)) : n(s);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Qn.create = (t, e) => new Qn({
  innerType: t,
  typeName: H.ZodReadonly,
  ...G(e)
});
var H;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(H || (H = {}));
const ue = ut.create, oe = Ms.create, bi = hi.create, tp = mi.create;
Ut.create;
const rs = et.create, ee = ye.create;
qn.create;
const sp = to.create;
Wn.create;
Qt.create;
const bl = Gn.create, le = Zn.create, Fs = Jt.create;
Kn.create;
ft.create;
ts.create;
const np = 32 * 1024, rp = Math.ceil(np / 3) * 4, ip = ["video/mp4", "image/jpeg"], op = { BASE_URL: "/", DEV: !1, MODE: "production", PROD: !0, SSR: !1 };
function vl(t) {
  const s = op?.[t];
  return s === void 0 || s === "" ? void 0 : s;
}
function Ue(t, e) {
  const s = vl(t);
  if (s === void 0) return e;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) && n > 0 ? n : e;
}
function ap(t, e) {
  const s = vl(t);
  if (s === void 0) return e;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : e;
}
const Xt = Ue("VITE_CHUNK_MS", 2e3), Sl = Ue("VITE_VIDEO_BITRATE", 12e5), _l = 96e3, cp = 30, lp = 48e3, dp = 960, up = 3;
Ue("VITE_LAG_DECAY_CHUNKS", 30);
const vi = 30, pt = 16 * 1024, hp = 3, fp = 6, pp = 12, Jn = 3e4, mp = 0.3, aa = 0.9, gp = 0.7, ca = Jn, Rr = 2 * Jn, la = 20, yp = Ue("VITE_HOST_FANOUT", 4), wp = 3, bp = Ue("VITE_UPLOAD_BUDGET", 4e6), vp = 1, Sp = 1, _p = 0.25, xp = 3, kp = ap("VITE_PROGRESS_TIMEOUT_CHUNKS", 0.5), Ep = 0.5, Tp = 1, Cp = 1, Or = 1.25, Ap = 0.25, Mp = 0.9, Bp = 1.1, xl = 4, Ip = 3, Rp = 2, Op = 6, kl = 4e3, Pp = 2, Fp = Ue("VITE_SUMMARY_MISS_SLACK_MS", 1500), El = kl * Pp + Fp, Lp = 3e4, Up = 9e4;
Ue("VITE_JOIN_WATCHDOG_MS", 22e3);
Ue("VITE_ORPHAN_REJOIN_MS", 3e3);
const da = 2e3, Dp = 2, Tl = 1024 * 1024, Cl = 60, Al = 32, ua = 8, Np = 4096, $p = 12e4, Vp = 30, Hp = 5, zp = 50, Si = 2, no = 16, jp = Ue("VITE_JOIN_GATHER_MS", 3e3), qp = 3e4, ha = Ue("VITE_ICE_DISCONNECT_GRACE_MS", 3e3), _i = 250, Ml = 1e4, $s = 3 * Ml, fa = 1e4, Wp = 2, Gp = 4, Zp = Ue("VITE_HOST_ONLY_SLOTS", 1), Kp = 2, xi = 3, Xp = Ue("VITE_MESH_DIAL_BACKOFF_CHUNKS", 30), Dt = J("swarm.wire"), ro = 5, er = re(ro), pa = re(ro), ge = 1, xs = ue().min(1).max(64), mr = ue().max(64), Ls = oe().int().min(0).max(2 ** 32 - 1), gr = oe().int().min(0), ki = oe().int().min(0), Yp = ue().min(1).max(32), Nt = ue().regex(/^[0-9a-f]*$/), Qp = ee({
  base: Ls,
  bitmapHex: Nt.max(256)
  // ≤128 bytes ⇒ ≤1024-chunk window
}), Jp = ee({
  epoch: gr,
  seq: Ls,
  tsUs: oe().int().min(0),
  durUs: oe().int().min(0),
  size: oe().int().min(1).max(32 * 1024 * 1024),
  hash: Nt.length(64),
  sig: Nt.length(128)
}), is = Nt.length(64), io = ee({
  epk: is,
  iv: Nt.length(24),
  ct: Nt.min(2).max(102400)
}), Ht = { from: xs, ts: ki, nonce: Yp }, xe = { v: le(ge) }, em = ee({
  ...xe,
  t: le("hello"),
  addr: xs,
  name: mr,
  epoch: gr,
  edgeSeq: oe().int().min(-1),
  have: Qp,
  /** Opt-in flag: willing to act as a delegated join responder (§6.2a). */
  responder: bi().optional(),
  /** Sender's session box pubkey — lets neighbors seal SDP to us and lets
   *  PEX/heartbeats redistribute the key. Optional for wire compat only;
   *  peers without one are never mesh-dialed. */
  boxPub: is.optional(),
  /** Sender's neighbor count, this link included: the host's first
   *  host-only report (summary.degree carries the next ones). */
  degree: oe().int().min(0).max(256).optional(),
  /** Sender reaches only the host (PeerBook.relayOnly). Absent = false. */
  relayOnly: bi().optional()
}), tm = ee({
  ...xe,
  t: le("have"),
  seq: Ls,
  edgeSeq: oe().int().min(-1)
}), sm = ee({
  ...xe,
  t: le("summary"),
  base: Ls,
  bitmapHex: Nt.max(256),
  edgeSeq: oe().int().min(-1),
  /** Sender's current neighbor count. Drives the host's §6.2 bootstrap
   *  prune: a joiner is only re-homed once it reports enough links. */
  degree: oe().int().min(0).max(256).optional(),
  /** As in hello: the sender reaches only the host. Absent = false. */
  relayOnly: bi().optional()
}), nm = ee({
  ...xe,
  t: le("want"),
  seq: Ls,
  /** ms until the requester's playhead reaches this seq (serve priority). */
  deadlineMs: oe().int().min(0).max(6e5)
}), Bl = Fs(["busy", "missing", "fanout", "budget"]), rm = Fs(["host-full"]), im = ee({
  ...xe,
  t: le("deny"),
  seq: Ls,
  reason: Bl,
  /** 'host-full': a fanout deny to a host-only viewer the host has no seat for. */
  detail: rm.optional().catch(void 0)
}), om = ee({
  ...xe,
  t: le("meta"),
  meta: Jp
}), am = ee({
  ...xe,
  t: le("pex"),
  peers: rs(ee({ addr: xs, name: mr, boxPub: is.optional() })).max(no)
}), cm = ee({
  ...xe,
  t: le("sig"),
  target: xs,
  from: xs,
  kind: Fs(["offer", "answer"]),
  /** SDP sealed to the target's session box key — relaying peers carry
   *  ciphertext, so they can't harvest the endpoints' IP addresses. */
  sealed: io,
  /** Sender's session box pubkey — the answer is sealed back to this. */
  boxPub: is,
  /** Addresses this message has traversed; forwarding stops at SIG_MAX_HOPS. */
  path: rs(xs).max(Si + 1)
}), lm = ee({ ...xe, t: le("presence"), ...Ht, name: mr }), Il = ee({
  ...xe,
  t: le("chat"),
  ...Ht,
  senderName: mr,
  text: ue().min(1).max(500)
}), dm = Il.extend({
  t: le("chat-backlog"),
  epoch: gr
}), um = ee({
  ...xe,
  t: le("reaction"),
  ...Ht,
  emoji: ue().min(1).max(16)
}), hm = ee({
  ...xe,
  t: le("poll-open"),
  ...Ht,
  pollId: ue().min(1).max(64),
  question: ue().min(1).max(200),
  options: rs(ue().min(1).max(100)).min(2).max(4),
  openedAt: ki,
  closesAt: ki.optional()
}), fm = ee({
  ...xe,
  t: le("poll-vote"),
  ...Ht,
  pollId: ue().min(1).max(64),
  optionIdx: oe().int().min(0).max(3)
}), pm = ee({
  ...xe,
  t: le("poll-tally"),
  ...Ht,
  pollId: ue().min(1).max(64),
  tallies: rs(oe().int().min(0)).max(4),
  totalVotes: oe().int().min(0)
}), mm = ee({
  ...xe,
  t: le("poll-close"),
  ...Ht,
  pollId: ue().min(1).max(64)
}), gm = ee({
  ...xe,
  t: le("end"),
  ...Ht,
  epoch: gr,
  sig: Nt.length(128)
}), ym = ee({
  ...xe,
  t: le("prune"),
  reason: Fs(["bootstrap-rotation", "over-degree", "scoring"])
}), wm = ee({ ...xe, t: le("bye") }), Rl = sp("t", [
  em,
  tm,
  sm,
  nm,
  im,
  om,
  am,
  cm,
  lm,
  Il,
  dm,
  um,
  hm,
  fm,
  pm,
  mm,
  gm,
  ym,
  wm
]), bm = new Set(Rl.options.map((t) => t.shape.t.value));
function vt(t) {
  return `${t.from}:${t.ts}:${t.nonce}`;
}
function vm(t) {
  return JSON.stringify(t);
}
function Sm(t) {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return Pr("not-json");
  }
  if (!e || typeof e != "object") return Pr("not-object");
  const { v: s, t: n } = e;
  if (s !== ge || typeof n != "string" || !bm.has(n)) {
    const i = `v=${String(s)} t=${String(n)}`;
    return er.allow(i) && Dt.debug("ctrl ignored: unknown version or type", { v: s, type: n, seen: er.count(i) }), { kind: "ignore" };
  }
  const r = Rl.safeParse(e);
  return r.success ? { kind: "ok", msg: r.data } : Pr(r.error.issues[0]?.message ?? "invalid", String(n));
}
function Pr(t, e) {
  return er.allow(t) && Dt.warn("ctrl message dropped: decode failed", { error: t, type: e, seen: er.count(t) }), { kind: "invalid", error: t };
}
function _m(t, e, s) {
  const n = new Uint8Array(Math.ceil(s / 8));
  for (const i of e) {
    const o = i - t;
    o < 0 || o >= s || (n[o >> 3] |= 128 >> (o & 7));
  }
  let r = "";
  for (const i of n) r += i.toString(16).padStart(2, "0");
  return { base: t, bitmapHex: r };
}
function ma(t) {
  const e = /* @__PURE__ */ new Set(), { base: s, bitmapHex: n } = t;
  for (let r = 0; r * 2 < n.length; r++) {
    const i = Number.parseInt(n.slice(r * 2, r * 2 + 2), 16);
    if (i)
      for (let o = 0; o < 8; o++)
        i & 128 >> o && e.add(s + r * 8 + o);
  }
  return e;
}
const Ks = 24, Ol = 21328;
function Bn(t) {
  return t % 4294967296;
}
function xm(t) {
  if (t.payload.length === 0 || t.payload.length > pt)
    throw Dt.error("slice encode failed: payload out of range", {
      seq: t.seq,
      bytes: t.payload.length,
      max: pt
    }), new Error(`slice payload ${t.payload.length} outside (0, ${pt}]`);
  if (t.sliceIdx >= t.sliceCount)
    throw Dt.error("slice encode failed: index past the count", {
      seq: t.seq,
      sliceIdx: t.sliceIdx,
      sliceCount: t.sliceCount
    }), new Error(`sliceIdx ${t.sliceIdx} >= sliceCount ${t.sliceCount}`);
  const e = new Uint8Array(Ks + t.payload.length), s = new DataView(e.buffer);
  return s.setUint16(0, Ol, !0), s.setUint8(2, ge), s.setUint8(3, 0), s.setUint32(4, t.seq, !0), s.setUint16(8, t.sliceIdx, !0), s.setUint16(10, t.sliceCount, !0), s.setUint32(12, t.payload.length, !0), s.setUint32(16, t.epochLow, !0), s.setUint32(20, 0, !0), e.set(t.payload, Ks), e;
}
function km(t) {
  if (t.length < Ks) return cs("short-header");
  const e = new DataView(t.buffer, t.byteOffset, t.byteLength);
  if (e.getUint16(0, !0) !== Ol) return cs("bad-magic");
  if (e.getUint8(2) !== ge) return cs("bad-version");
  const s = e.getUint32(4, !0), n = e.getUint16(8, !0), r = e.getUint16(10, !0), i = e.getUint32(12, !0), o = e.getUint32(16, !0);
  return r === 0 || n >= r ? cs("bad-slice-index", s) : i === 0 || i > pt ? cs("bad-payload-len", s) : t.length !== Ks + i ? cs("length-mismatch", s) : {
    kind: "ok",
    frame: {
      epochLow: o,
      seq: s,
      sliceIdx: n,
      sliceCount: r,
      payload: t.subarray(Ks)
    }
  };
}
function cs(t, e) {
  return pa.allow(t) && Dt.warn("slice dropped: decode failed", { error: t, seq: e, seen: pa.count(t) }), { kind: "invalid", error: t };
}
function Em(t, e, s) {
  if (s.length === 0)
    throw Dt.error("chunk slicing failed: empty payload", { seq: e, epoch: t }), new Error("empty chunk payload");
  const n = Math.ceil(s.length / pt);
  if (n > 65535)
    throw Dt.error("chunk slicing failed: too many slices", { seq: e, sliceCount: n, bytes: s.length }), new Error(`chunk needs ${n} slices > u16`);
  const r = Bn(t), i = [];
  for (let o = 0; o < n; o++)
    i.push({
      epochLow: r,
      seq: e,
      sliceIdx: o,
      sliceCount: n,
      payload: s.subarray(o * pt, Math.min((o + 1) * pt, s.length))
    });
  return i;
}
class Tm {
  partials = /* @__PURE__ */ new Map();
  assembleCap = re(ro);
  key(e, s) {
    return `${e}:${s}`;
  }
  add(e) {
    const s = this.key(e.epochLow, e.seq);
    let n = this.partials.get(s);
    if (n || (n = { sliceCount: e.sliceCount, received: 0, slices: new Array(e.sliceCount) }, this.partials.set(s, n)), e.sliceCount !== n.sliceCount)
      return this.partials.delete(s), this.bad("slice-count-mismatch", e.seq);
    if (e.sliceIdx < e.sliceCount - 1 && e.payload.length !== pt)
      return this.partials.delete(s), this.bad("short-interior-slice", e.seq);
    const r = n.received === 0;
    if (n.slices[e.sliceIdx] || (n.slices[e.sliceIdx] = e.payload, n.received++), n.received < n.sliceCount)
      return { kind: "progress", received: n.received, total: n.sliceCount, firstSlice: r };
    this.partials.delete(s);
    const i = n.slices.reduce((l, c) => l + (c?.length ?? 0), 0), o = new Uint8Array(i);
    let a = 0;
    for (const l of n.slices)
      o.set(l, a), a += l.length;
    return { kind: "done", payload: o };
  }
  bad(e, s) {
    return this.assembleCap.allow(e) && Dt.warn("chunk reassembly failed", { error: e, seq: s, seen: this.assembleCap.count(e) }), { kind: "invalid", error: e };
  }
  /** Discard a partial (deadline expiry, cancelled want, epoch reset). */
  drop(e, s) {
    this.partials.delete(this.key(e, s));
  }
  clear() {
    this.partials.clear();
  }
  get pendingCount() {
    return this.partials.size;
  }
}
const Ei = J("statement.schema"), bs = re(5), Cm = Fs([
  "heartbeat",
  "swarm-join",
  "welcome-board"
]), Am = ee({
  type: Cm,
  from: ue(),
  to: ue().optional(),
  timestamp: oe(),
  payload: bl(tp()).optional()
}), ss = ue().min(1).max(64), oo = ue().max(64), Mm = ue().regex(/^[0-9a-f]*$/), Bm = ee({
  /** Ephemeral per-stream ed25519 public key, hex (plan §4). */
  streamPubKey: Mm.length(64),
  /** Stream session id (go-live timestamp ms); resets the chunk seq space. */
  epoch: oe().int().min(0),
  chunkMs: oe().int().min(200).max(1e4),
  /** MSE codec string, e.g. `video/mp4; codecs="avc1.64001f, mp4a.40.2"`. */
  codecs: ue().min(1).max(200),
  edgeSeq: oe().int().min(-1),
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
  boxPubs: bl(ss, is).optional()
}), Im = ee({
  mime: Fs(ip),
  data: ue().min(4).max(rp).regex(/^[A-Za-z0-9+/]+={0,2}$/)
});
ee({
  roomHash: ue().min(1).max(128),
  hostAddress: ss,
  hostName: oo,
  title: ue().max(200),
  viewerCount: oe().int().min(0).max(1e4),
  startedAt: oe(),
  /** Tip goal for this session, in whole PAS. 0/absent = no goal set. */
  tipGoal: oe().int().min(0).max(1e6).optional(),
  /** Host's authoritative session tip total, in PAS planck (string — JSON has
   *  no bigint). Viewers render the goal bar from this so it's identical for
   *  everyone regardless of join time. */
  tippedPlanck: ue().max(40).optional(),
  /** Swarm join/trust info. Optional so the lobby stays tolerant of hosts
   *  running builds without the mesh (and vice versa). */
  mesh: Bm.optional(),
  /** The lobby card preview. Absent = no preview. */
  clip: Im.optional(),
  /** The host ended this stream. Absent = live. */
  ended: le(!0).optional()
});
const Rm = ee({
  viewerAddress: ss,
  viewerName: oo,
  /** The peer this join is addressed to; others on the topic ignore it. */
  responder: ss,
  /** Viewer's session box pubkey — the welcome answer is sealed back to it. */
  boxPub: is,
  sealedSdp: io,
  sdpType: le("offer")
}), Om = ee({
  /** The joiner this answer is for. */
  to: ss,
  sealedSdp: io,
  sdpType: le("answer"),
  /** Sample of live peers to dial for additional mesh links. `boxPub` lets
   *  the joiner seal its mesh-dial offers to them (§6.3). */
  seeds: rs(ee({ addr: ss, name: oo, boxPub: is.optional() })).max(8),
  edgeSeq: oe().int().min(-1),
  epoch: oe().int().min(0)
});
ee({
  answers: rs(Om).max(Al)
});
function Pm(t, e) {
  const s = e.safeParse(t.payload);
  return s.success ? s.data : (bs.allow(`payload:${t.type}`) && Ei.warn("dropping a message: invalid payload", {
    type: t.type,
    from: _(t.from),
    issues: s.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: bs.count(`payload:${t.type}`)
  }), null);
}
function Fm(t) {
  let e;
  try {
    e = JSON.parse(t);
  } catch {
    return bs.allow("envelope:json") && Ei.debug("dropping a statement: the data is not JSON", {
      bytes: t.length,
      seen: bs.count("envelope:json")
    }), null;
  }
  const s = Am.safeParse(e);
  return s.success ? s.data : (bs.allow("envelope:schema") && Ei.debug("dropping a statement: the envelope does not match the schema", {
    issues: s.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: bs.count("envelope:schema")
  }), null);
}
const Lm = new TextEncoder();
function dn(t) {
  return ch(Lm.encode(t));
}
function Um() {
  return dn("spotlight:lobby:v1");
}
function Dm(t) {
  return dn(`spotlight:signal:v1:${t}`);
}
function Nm() {
  return dn("spotlight:heartbeat-channel:v1");
}
function $m() {
  return dn("spotlight:join-channel:v1");
}
function Vm() {
  return dn("spotlight:welcome-board-channel:v1");
}
function ls(t) {
  let e = "";
  for (let s = 0; s < t.length; s++)
    e += t[s].toString(16).padStart(2, "0");
  return e;
}
const ae = J("statement.client"), ga = Gc();
function Hm(t) {
  if (!t) return null;
  try {
    switch (t.tag) {
      case "Sr25519":
      case "Ed25519":
      case "Ecdsa":
        return ga.dec(t.value.signer);
      case "OnChain":
        return ga.dec(t.value.who);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
const zm = new TextEncoder(), jm = new TextDecoder(), qm = 300, Wm = {
  timeout: "The host has not confirmed permission to publish signaling, so streams cannot be announced or joined. If an approval is waiting in the Polkadot app, answer it — this clears on its own.",
  declined: "Permission to publish signaling was declined, so streams cannot be announced or joined. Start a stream or rejoin the room to be asked again.",
  unavailable: "The host did not grant Spotlight permission to publish signaling, so streams cannot be announced or joined. Retrying — if this persists, reopen Spotlight from Polkadot Desktop or the browser host."
};
class Gm {
  store = null;
  productAccount = null;
  subscribers = /* @__PURE__ */ new Map();
  routes = /* @__PURE__ */ new Map();
  nextSubId = 0;
  disposed = !1;
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements can't tie (see ./expiry.ts). */
  expiry = _f();
  /** Submits in flight by type, so each submit line says what it shared the
   *  bridge with. Observability only. */
  inflight = Mf();
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
      e = await Tc();
    } catch (s) {
      if (this.disposed) return;
      const n = s instanceof Error ? s.message : String(s);
      ae.error("host statement store unavailable", { detail: n, err: s }), this.onFatalError?.(
        new Error(`Statement Store unavailable: ${n}. Reload to try again.`)
      );
      return;
    }
    if (!this.disposed) {
      if (!e) {
        ae.warn("no host statement store — not inside a host container"), this.onFatalError?.(
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
    this.productAccount = e, ae.info(e ? "product account wired" : "product account cleared"), e && this.primeGrants();
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
    hl("statement-submit").then(({ "statement-submit": e }) => {
      e && (e === "granted" || this.disposed || this.reportedGrantOutcome !== e && (this.reportedGrantOutcome = e, ae.error("statement grants not available", { outcome: e }), this.onFatalError?.(new Error(Wm[e]))));
    });
  }
  get isConnected() {
    return this._ready;
  }
  /**
   * Subscribe a handler to a topic. Multiple handlers on the same topic
   * share a single upstream subscription.
   */
  async subscribe(e, s) {
    if (this.disposed || !this.store) throw new Error("Signaling not ready");
    const n = `sub-${++this.nextSubId}`;
    this.subscribers.set(n, { topic: e, handler: s });
    const r = ls(e), i = this.routes.get(r);
    if (ae.debug("subscribe", {
      subId: n,
      topic: Se(r),
      route: i ? "shared" : "new"
    }), i)
      i.handlers.add(s);
    else {
      const o = /* @__PURE__ */ new Set([s]), a = () => {
        if (!this.store || this.disposed) return { unsubscribe: () => {
        } };
        const c = this.store.subscribe(
          { matchAll: [yn(e)] },
          (d) => {
            let u = 0, h = 0;
            for (const g of d.statements) {
              const m = Km(g);
              if (!m) {
                h++;
                continue;
              }
              u++;
              for (const p of o)
                try {
                  p(m.envelope, m.signedBy);
                } catch (v) {
                  ae.error("handler threw", { topic: Se(r), err: v });
                }
            }
            const f = this.routes.get(r);
            f && (f.lastPageAt = Date.now()), ae.debug("page received", {
              topic: Se(r),
              statements: d.statements.length,
              decoded: u,
              dropped: h
            });
          }
        );
        return c.onInterrupt((d) => {
          ae.warn("upstream subscription interrupted — resubscribing", {
            topic: Se(r),
            payload: d
          });
          const u = this.routes.get(r);
          if (!u || this.disposed) return;
          const h = a();
          u.unsubscribe = h.unsubscribe, u.lastPageAt = Date.now();
        }), { unsubscribe: c.unsubscribe };
      }, l = a();
      this.routes.set(r, {
        topic: e,
        handlers: o,
        unsubscribe: l.unsubscribe,
        lastPageAt: Date.now(),
        resubscribe: () => {
          const c = this.routes.get(r);
          if (!c || this.disposed) return;
          try {
            c.unsubscribe();
          } catch {
          }
          const d = a();
          c.unsubscribe = d.unsubscribe, c.lastPageAt = Date.now();
        }
      });
    }
    return n;
  }
  /** Milliseconds since this topic last delivered a page, or null when no
   *  route is open for it. Null means "cannot answer" — never "silent". */
  silentMsFor(e) {
    const s = this.routes.get(ls(e));
    return s ? Date.now() - s.lastPageAt : null;
  }
  /** Reopen ONE topic's upstream, leaving every other route untouched.
   *
   *  `refreshAllSubscriptions` is the blunt instrument: it reopens everything,
   *  which is why useLobby fires it only on a real hidden→visible transition —
   *  churning a viewer's signal route mid-handshake drops the offer and strands
   *  it on "Connecting…". Repairing a single stalled route needs neither that
   *  blast radius nor that caution. */
  reopenTopic(e) {
    const s = ls(e), n = this.routes.get(s);
    if (!n || this.disposed) return !1;
    ae.info("reopening one topic", { topic: Se(s) });
    try {
      n.resubscribe();
    } catch (r) {
      return ae.warn("reopen failed", { topic: Se(s), err: r }), !1;
    }
    return !0;
  }
  /** Force every active topic subscription to reopen. Use after a tab
   *  visibility / focus change to recover from a possibly-stale upstream. */
  refreshAllSubscriptions() {
    ae.info("refreshing every subscription", { routes: this.routes.size });
    for (const e of this.routes.values())
      try {
        e.resubscribe();
      } catch (s) {
        ae.warn("subscription refresh failed", { topic: Se(ls(e.topic)), err: s });
      }
  }
  unsubscribe(e) {
    const s = this.subscribers.get(e);
    if (!s) return;
    this.subscribers.delete(e);
    const n = ls(s.topic), r = this.routes.get(n);
    if (r && (r.handlers.delete(s.handler), ae.debug("unsubscribe", {
      subId: e,
      topic: Se(n),
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
  async submit(e, s, n) {
    const r = (h) => {
      n?.quiet || this.onSubmitError?.(h);
    };
    if (this.disposed) throw new Error("Signaling disposed");
    if (!this.store) throw new Error("Statement store not initialised");
    if (!this.productAccount)
      throw new Error(
        "No product account — sign in via the host before broadcasting."
      );
    const i = Xh();
    if (i !== null) throw new ci(i);
    this.primeGrants();
    const o = zm.encode(JSON.stringify(s)), a = n?.expirySecs ?? qm, l = n?.channel ? yn(n.channel) : void 0, c = Date.now(), d = this.inflight.snapshot();
    ae.debug("submit started", {
      type: s.type,
      to: _(s.to),
      topic: Se(ls(e)),
      bytes: o.length,
      expirySecs: a,
      channel: l ? Se(l) : null,
      inflight: d
    });
    const u = this.inflight.begin(s.type);
    try {
      for (let h = 0; ; h++) {
        const f = {
          proof: void 0,
          decryptionKey: void 0,
          expiry: this.expiry.next(a, l),
          channel: l,
          topics: [yn(e)],
          data: yn(o)
        };
        let g;
        const m = Date.now();
        try {
          g = await this.store.createProofAuthorized(f);
        } catch (v) {
          const y = v instanceof Error ? v : new Error(String(v));
          if (Zm(y)) {
            const w = cl();
            throw ae.error("createProof failed with UnableToSign — submits paused", {
              type: s.type,
              attempt: h,
              strikes: w.strikes,
              pauseS: Math.round((w.until - Date.now()) / 1e3),
              err: y,
              proofMs: Date.now() - m,
              ...u.overlap()
            }), new ci(w.until, { cause: y });
          }
          throw ae.error("createProof failed", {
            type: s.type,
            attempt: h,
            err: y,
            proofMs: Date.now() - m,
            ...u.overlap()
          }), r(y), y;
        }
        const p = Date.now() - m;
        try {
          await this.store.submit({ ...f, proof: g }), qh(), Yh(), ae.debug("submit succeeded", {
            type: s.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap()
          });
          return;
        } catch (v) {
          const y = v instanceof Error ? v : new Error(String(v)), w = h === 0 ? Tf(v) : null;
          if (w !== null && this.expiry.raiseFloor(w, l)) {
            ae.warn("statement rejected below the priority floor — re-minting above it", {
              type: s.type,
              min: w,
              channel: l ? Se(l) : null
            });
            continue;
          }
          const S = h === 0 && this.claimSlotWhenFull ? Cf(v) : null;
          if (S !== null && this.expiry.raiseFloor(S, l)) {
            ae.warn("statement store account is full — claiming the earliest-expiring slot", {
              type: s.type,
              min: S,
              channel: l ? Se(l) : null
            });
            continue;
          }
          throw eo(v) ? (ae.error("statement store account is full — submits rejected until slots free", {
            type: s.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap(),
            err: y
          }), r(y), y) : (ae.error("statement submit rejected", {
            type: s.type,
            attempt: h,
            latencyMs: Date.now() - c,
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
    ae.info("client destroyed", {
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
    e !== this._ready && (this._ready = e, ae.info(e ? "store connected" : "store disconnected"), this.onConnectionChange?.(e));
  }
}
function Zm(t) {
  return /\bUnableToSign\b/.test(t.message);
}
function Km(t) {
  if (!t.data || t.data.length <= 2) return null;
  try {
    const e = jm.decode(iu(t.data)), s = Fm(e);
    return s ? { envelope: s, signedBy: Hm(t.proof) } : null;
  } catch {
    return null;
  }
}
const qt = J("swarm.transport"), Wt = /* @__PURE__ */ new Map(), Ti = 600 * 1e3, Fr = 1e3;
function Xm() {
  Wt.clear(), Xs.clear();
}
function Ym(t) {
  let e = 0;
  for (const [s, n] of Wt)
    t - n.seenAt >= Ti && (Wt.delete(s), Xs.delete(s), e++);
  return e;
}
const Xs = /* @__PURE__ */ new Set();
function Qm(t, e, s) {
  const n = Date.now(), r = Wt.get(t);
  if (r && n - r.seenAt < Ti) {
    if (r.signer === e)
      return r.seenAt = n, !0;
    if (!Xs.has(t)) {
      Xs.add(t);
      const i = Math.round((Ti - (n - r.seenAt)) / 1e3);
      qt.warn("sender binding mismatch — statement dropped", {
        type: s,
        from: _(t),
        boundSigner: _(r.signer),
        signedBy: _(e),
        lapsesInSec: i
      });
    }
    return !1;
  }
  if (!r && Wt.size >= Fr) {
    const i = Ym(n);
    if (Wt.size >= Fr)
      return qt.warn("sender binding table full", {
        type: s,
        from: _(t),
        cap: Fr
      }), !1;
    qt.debug("sender bindings swept", { swept: i, from: _(t) });
  }
  return Wt.set(t, { signer: e, seenAt: n }), Xs.delete(t), !0;
}
function Jm(t, e) {
  return {
    submit(s) {
      if (s.type === "welcome-board") {
        const r = { expirySecs: Cl, channel: Vm() };
        return qt.debug("tx", { type: s.type, channel: r.channel }), t.submit(e, s, r);
      }
      const n = { channel: $m() };
      return qt.debug("tx", { type: s.type, channel: n.channel, to: _(s.to) }), t.submit(e, s, n);
    },
    subscribe(s) {
      let n = !0, r = null;
      return t.subscribe(e, (i, o) => {
        n && (o !== null && !Qm(i.from, o, i.type) || (qt.debug("rx", {
          type: i.type,
          from: _(i.from),
          signedBy: _(o)
        }), s(i, o)));
      }).then((i) => {
        n ? r = i : t.unsubscribe(i);
      }).catch((i) => {
        qt.error("transport subscribe failed", { err: i });
      }), () => {
        n = !1, r !== null && t.unsubscribe(r);
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
function T(t) {
  if (!t)
    throw new Error("Assertion failed.");
}
const vs = (t) => t && t[t.length - 1], $t = (t) => t >= 0 && t < 2 ** 32, E = (t) => {
  let e = 0;
  for (; t.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + t.readBits(e);
}, ht = (t) => {
  const e = E(t);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, un = (t) => t.constructor === Uint8Array ? t : ArrayBuffer.isView(t) ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(t), Pl = (t) => t.constructor === DataView ? t : ArrayBuffer.isView(t) ? new DataView(t.buffer, t.byteOffset, t.byteLength) : new DataView(t), Qe = /* @__PURE__ */ new TextEncoder(), ao = {
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
}, co = {
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
}, lo = {
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
}, eg = (t) => !!t && !!t.primaries && !!t.transfer && !!t.matrix && t.fullRange !== void 0, Fl = (t) => t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer || ArrayBuffer.isView(t);
class Ll {
  constructor() {
    this.currentPromise = Promise.resolve(), this.pending = 0;
  }
  async acquire() {
    let e;
    const s = new Promise((r) => {
      let i = !1;
      e = () => {
        i || (r(), this.pending--, i = !0);
      };
    }), n = this.currentPromise;
    return this.currentPromise = s, this.pending++, await n, e;
  }
}
const tg = () => {
  let t, e;
  return { promise: new Promise((n, r) => {
    t = n, e = r;
  }), resolve: t, reject: e };
}, Ul = (t) => {
  throw new Error(`Unexpected value: ${t}`);
}, sg = (t, e, s, n) => {
  s = s >>> 0, s = s & 16777215, t.setUint8(e, s >>> 16 & 255), t.setUint8(e + 1, s >>> 8 & 255), t.setUint8(e + 2, s & 255);
}, ng = "und", rg = /^[a-z]{3}$/, ig = (t) => rg.test(t), ya = 1e6 * (1 + Number.EPSILON), og = (t, e) => {
  const s = t < 0 ? -1 : 1;
  t = Math.abs(t);
  let n = 0, r = 1, i = 1, o = 0, a = t;
  for (; ; ) {
    const l = Math.floor(a), c = l * i + n, d = l * o + r;
    if (d > e)
      return {
        num: s * i,
        den: o
      };
    if (n = i, r = o, i = c, o = d, a = 1 / (a - l), !isFinite(a))
      break;
  }
  return {
    num: s * i,
    den: o
  };
}, Dl = function* (t) {
  for (const e in t) {
    const s = t[e];
    s !== void 0 && (yield { key: e, value: s });
  }
}, ag = (t) => {
  T(Number.isInteger(t.num)), T(Number.isInteger(t.den)), T(t.den !== 0);
  let e = Math.abs(t.num), s = Math.abs(t.den);
  for (; s !== 0; ) {
    const r = e % s;
    e = s, s = r;
  }
  const n = e || 1;
  return {
    num: t.num / n,
    den: t.den / n
  };
}, wa = (t) => Array.isArray(t) ? t : [t];
class uo {
  constructor() {
    this._listeners = /* @__PURE__ */ new Map();
  }
  /** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
  on(e, s, n) {
    this._listeners.has(e) || this._listeners.set(e, /* @__PURE__ */ new Set());
    const r = { fn: s, once: n?.once ?? !1 };
    return this._listeners.get(e).add(r), () => {
      this._listeners.get(e)?.delete(r);
    };
  }
  /** @internal */
  _emit(...e) {
    const [s, n] = e, r = this._listeners.get(s);
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
const cg = (t) => t !== null && typeof t == "object" && Object.getPrototypeOf(t) === Object.prototype && Object.values(t).every((e) => typeof e == "string");
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Ke;
(function(t) {
  t[t.Silent = 0] = "Silent", t[t.Errors = 1] = "Errors", t[t.Warnings = 2] = "Warnings", t[t.Info = 3] = "Info";
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
    return he._emitterInstance ??= new uo();
  }
  /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
  static on(e, s, n) {
    return he._emitter.on(e, s, n);
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
class Nl {
  /** Creates a new {@link RichImageData}. */
  constructor(e, s) {
    if (this.data = e, this.mimeType = s, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof s != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class lg {
  /** Creates a new {@link AttachedFile}. */
  constructor(e, s, n, r) {
    if (this.data = e, this.mimeType = s, this.name = n, this.description = r, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (s !== void 0 && typeof s != "string")
      throw new TypeError("mimeType, when provided, must be a string.");
    if (n !== void 0 && typeof n != "string")
      throw new TypeError("name, when provided, must be a string.");
    if (r !== void 0 && typeof r != "string")
      throw new TypeError("description, when provided, must be a string.");
  }
}
const dg = (t) => {
  if (!t || typeof t != "object")
    throw new TypeError("tags must be an object.");
  if (t.title !== void 0 && typeof t.title != "string")
    throw new TypeError("tags.title, when provided, must be a string.");
  if (t.description !== void 0 && typeof t.description != "string")
    throw new TypeError("tags.description, when provided, must be a string.");
  if (t.artist !== void 0 && typeof t.artist != "string")
    throw new TypeError("tags.artist, when provided, must be a string.");
  if (t.album !== void 0 && typeof t.album != "string")
    throw new TypeError("tags.album, when provided, must be a string.");
  if (t.albumArtist !== void 0 && typeof t.albumArtist != "string")
    throw new TypeError("tags.albumArtist, when provided, must be a string.");
  if (t.trackNumber !== void 0 && (!Number.isInteger(t.trackNumber) || t.trackNumber <= 0))
    throw new TypeError("tags.trackNumber, when provided, must be a positive integer.");
  if (t.tracksTotal !== void 0 && (!Number.isInteger(t.tracksTotal) || t.tracksTotal <= 0))
    throw new TypeError("tags.tracksTotal, when provided, must be a positive integer.");
  if (t.discNumber !== void 0 && (!Number.isInteger(t.discNumber) || t.discNumber <= 0))
    throw new TypeError("tags.discNumber, when provided, must be a positive integer.");
  if (t.discsTotal !== void 0 && (!Number.isInteger(t.discsTotal) || t.discsTotal <= 0))
    throw new TypeError("tags.discsTotal, when provided, must be a positive integer.");
  if (t.genre !== void 0 && typeof t.genre != "string")
    throw new TypeError("tags.genre, when provided, must be a string.");
  if (t.date !== void 0 && (!(t.date instanceof Date) || Number.isNaN(t.date.getTime())))
    throw new TypeError("tags.date, when provided, must be a valid Date.");
  if (t.lyrics !== void 0 && typeof t.lyrics != "string")
    throw new TypeError("tags.lyrics, when provided, must be a string.");
  if (t.images !== void 0) {
    if (!Array.isArray(t.images))
      throw new TypeError("tags.images, when provided, must be an array.");
    for (const e of t.images) {
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
  if (t.comment !== void 0 && typeof t.comment != "string")
    throw new TypeError("tags.comment, when provided, must be a string.");
  if (t.raw !== void 0) {
    if (!t.raw || typeof t.raw != "object")
      throw new TypeError("tags.raw, when provided, must be an object.");
    for (const e of Object.values(t.raw))
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof Nl) && !(e instanceof lg) && !cg(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, ug = (t) => {
  if (!t || typeof t != "object")
    throw new TypeError("disposition must be an object.");
  if (t.default !== void 0 && typeof t.default != "boolean")
    throw new TypeError("disposition.default must be a boolean.");
  if (t.primary !== void 0 && typeof t.primary != "boolean")
    throw new TypeError("disposition.primary must be a boolean.");
  if (t.forced !== void 0 && typeof t.forced != "boolean")
    throw new TypeError("disposition.forced must be a boolean.");
  if (t.original !== void 0 && typeof t.original != "boolean")
    throw new TypeError("disposition.original must be a boolean.");
  if (t.commentary !== void 0 && typeof t.commentary != "boolean")
    throw new TypeError("disposition.commentary must be a boolean.");
  if (t.hearingImpaired !== void 0 && typeof t.hearingImpaired != "boolean")
    throw new TypeError("disposition.hearingImpaired must be a boolean.");
  if (t.visuallyImpaired !== void 0 && typeof t.visuallyImpaired != "boolean")
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
    const e = Math.floor(this.pos / 8), s = this.bytes[e] ?? 0, n = 7 - (this.pos & 7), r = (s & 1 << n) >> n;
    return this.pos++, r;
  }
  readBits(e) {
    if (e === 1)
      return this.readBit();
    let s = 0;
    for (let n = 0; n < e; n++)
      s <<= 1, s |= this.readBit();
    return s;
  }
  writeBits(e, s) {
    const n = this.pos + e;
    for (let r = this.pos; r < n; r++) {
      const i = Math.floor(r / 8);
      let o = this.bytes[i];
      const a = 7 - (r & 7);
      o &= ~(1 << a), o |= (s & 1 << n - r - 1) >> n - r - 1 << a, this.bytes[i] = o;
    }
    this.pos = n;
  }
  readAlignedByte() {
    if (this.pos % 8 !== 0)
      throw new Error("Bitstream is not byte-aligned.");
    const e = this.pos / 8, s = this.bytes[e] ?? 0;
    return this.pos += 8, s;
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
const $l = [
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
], Vl = [-1, 1, 2, 3, 4, 5, 6, 8], hg = (t) => {
  let e = $l.indexOf(t.sampleRate), s = null;
  e === -1 && (e = 15, s = t.sampleRate);
  const n = Vl.indexOf(t.numberOfChannels);
  if (n === -1)
    throw new TypeError(`Unsupported number of channels: ${t.numberOfChannels}`);
  let r = 13;
  t.objectType >= 32 && (r += 6), e === 15 && (r += 24);
  const i = Math.ceil(r / 8), o = new Uint8Array(i), a = new je(o);
  return t.objectType < 32 ? a.writeBits(5, t.objectType) : (a.writeBits(5, 31), a.writeBits(6, t.objectType - 32)), a.writeBits(4, e), e === 15 && a.writeBits(24, s), a.writeBits(4, n), o;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Bs = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8",
  "prores"
], Is = [
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
], ho = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3"
], tr = [
  ...ho,
  ...Is
], nn = [
  "webvtt"
], ba = [
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
], fg = (t) => {
  const e = t.split("."), r = (1 << 7) + 1, i = Number(e[1]), o = e[2], a = Number(o.slice(0, -1)), l = (i << 5) + a, c = o.slice(-1) === "H" ? 1 : 0, u = Number(e[3]) === 8 ? 0 : 1, h = 0, f = e[4] ? Number(e[4]) : 0, g = e[5] ? Number(e[5][0]) : 1, m = e[5] ? Number(e[5][1]) : 1, p = e[5] ? Number(e[5][2]) : 0, v = (c << 7) + (u << 6) + (h << 5) + (f << 4) + (g << 3) + (m << 2) + p;
  return [r, l, v, 0];
}, pg = /^pcm-([usf])(\d+)(be)?$/, Rs = (t) => {
  if (T(Is.includes(t)), t === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (t === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = pg.exec(t);
  T(e);
  let s;
  e[1] === "u" ? s = "unsigned" : e[1] === "s" ? s = "signed" : s = "float";
  const n = Number(e[2]) / 8, r = e[3] !== "be", i = t === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: s, sampleSize: n, littleEndian: r, silentValue: i };
}, mg = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01", ...In], gg = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, yg = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, wg = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, bg = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, vg = (t) => {
  if (!t)
    throw new TypeError("Video chunk metadata must be provided.");
  if (typeof t != "object")
    throw new TypeError("Video chunk metadata must be an object.");
  if (!t.decoderConfig)
    throw new TypeError("Video chunk metadata must include a decoder configuration.");
  if (typeof t.decoderConfig != "object")
    throw new TypeError("Video chunk metadata decoder configuration must be an object.");
  if (typeof t.decoderConfig.codec != "string")
    throw new TypeError("Video chunk metadata decoder configuration must specify a codec string.");
  if (!mg.some((e) => t.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(t.decoderConfig.codedWidth) || t.decoderConfig.codedWidth <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).");
  if (!Number.isInteger(t.decoderConfig.codedHeight) || t.decoderConfig.codedHeight <= 0)
    throw new TypeError("Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).");
  if (t.decoderConfig.displayAspectWidth !== void 0 && (!Number.isInteger(t.decoderConfig.displayAspectWidth) || t.decoderConfig.displayAspectWidth <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectWidth, when defined, must be a positive integer.");
  if (t.decoderConfig.displayAspectHeight !== void 0 && (!Number.isInteger(t.decoderConfig.displayAspectHeight) || t.decoderConfig.displayAspectHeight <= 0))
    throw new TypeError("Video chunk metadata decoder configuration displayAspectHeight, when defined, must be a positive integer.");
  if (t.decoderConfig.displayAspectWidth !== void 0 != (t.decoderConfig.displayAspectHeight !== void 0))
    throw new TypeError("Video chunk metadata decoder configuration must specify both displayAspectWidth and displayAspectHeight, or neither.");
  if (t.decoderConfig.description !== void 0 && !Fl(t.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (t.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = t.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const s = Object.keys(ao);
    if (e.primaries != null && !s.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${s.join(", ")}.`);
    const n = Object.keys(co);
    if (e.transfer != null && !n.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${n.join(", ")}.`);
    const r = Object.keys(lo);
    if (e.matrix != null && !r.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${r.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (t.decoderConfig.codec.startsWith("avc1") || t.decoderConfig.codec.startsWith("avc3")) {
    if (!gg.test(t.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (t.decoderConfig.codec.startsWith("hev1") || t.decoderConfig.codec.startsWith("hvc1")) {
    if (!yg.test(t.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (t.decoderConfig.codec.startsWith("vp8")) {
    if (t.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (t.decoderConfig.codec.startsWith("vp09")) {
    if (!wg.test(t.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (t.decoderConfig.codec.startsWith("av01")) {
    if (!bg.test(t.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
  } else if (In.some((e) => t.decoderConfig.codec.startsWith(e)) && !In.some((e) => t.decoderConfig.codec === e))
    throw new TypeError(`Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes four-character codes: ${In.join(", ")}.`);
}, Sg = [
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
], _g = (t) => {
  if (!t)
    throw new TypeError("Audio chunk metadata must be provided.");
  if (typeof t != "object")
    throw new TypeError("Audio chunk metadata must be an object.");
  if (!t.decoderConfig)
    throw new TypeError("Audio chunk metadata must include a decoder configuration.");
  if (typeof t.decoderConfig != "object")
    throw new TypeError("Audio chunk metadata decoder configuration must be an object.");
  if (typeof t.decoderConfig.codec != "string")
    throw new TypeError("Audio chunk metadata decoder configuration must specify a codec string.");
  if (!Sg.some((e) => t.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(t.decoderConfig.sampleRate) || t.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(t.decoderConfig.numberOfChannels) || t.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (t.decoderConfig.description !== void 0 && !Fl(t.decoderConfig.description))
    throw new TypeError("Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (t.decoderConfig.codec.startsWith("mp4a") && t.decoderConfig.codec !== "mp4a.69" && t.decoderConfig.codec !== "mp4a.6B" && t.decoderConfig.codec !== "mp4a.6b") {
    if (!["mp4a.40.2", "mp4a.40.02", "mp4a.40.5", "mp4a.40.05", "mp4a.40.29", "mp4a.67"].includes(t.decoderConfig.codec))
      throw new TypeError("Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.");
  } else if (t.decoderConfig.codec.startsWith("mp3") || t.decoderConfig.codec.startsWith("mp4a")) {
    if (t.decoderConfig.codec !== "mp3" && t.decoderConfig.codec !== "mp4a.69" && t.decoderConfig.codec !== "mp4a.6B" && t.decoderConfig.codec !== "mp4a.6b")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".');
  } else if (t.decoderConfig.codec.startsWith("opus")) {
    if (t.decoderConfig.codec !== "opus")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Opus must be "opus".');
    if (t.decoderConfig.description && t.decoderConfig.description.byteLength < 18)
      throw new TypeError("Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.");
  } else if (t.decoderConfig.codec.startsWith("vorbis")) {
    if (t.decoderConfig.codec !== "vorbis")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".');
    if (!t.decoderConfig.description)
      throw new TypeError("Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.");
  } else if (t.decoderConfig.codec.startsWith("flac")) {
    if (t.decoderConfig.codec !== "flac")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for FLAC must be "flac".');
    if (!t.decoderConfig.description || t.decoderConfig.description.byteLength < 42)
      throw new TypeError("Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.");
  } else if (t.decoderConfig.codec.startsWith("ac-3") || t.decoderConfig.codec.startsWith("ac3")) {
    if (t.decoderConfig.codec !== "ac-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for AC-3 must be "ac-3".');
  } else if (t.decoderConfig.codec.startsWith("ec-3") || t.decoderConfig.codec.startsWith("eac3")) {
    if (t.decoderConfig.codec !== "ec-3")
      throw new TypeError('Audio chunk metadata decoder configuration codec string for EC-3 must be "ec-3".');
  } else if ((t.decoderConfig.codec.startsWith("pcm") || t.decoderConfig.codec.startsWith("ulaw") || t.decoderConfig.codec.startsWith("alaw")) && !Is.includes(t.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${Is.join(", ")}).`);
}, xg = (t) => {
  if (!t)
    throw new TypeError("Subtitle metadata must be provided.");
  if (typeof t != "object")
    throw new TypeError("Subtitle metadata must be an object.");
  if (!t.config)
    throw new TypeError("Subtitle metadata must include a config object.");
  if (typeof t.config != "object")
    throw new TypeError("Subtitle metadata config must be an object.");
  if (typeof t.config.description != "string")
    throw new TypeError("Subtitle metadata config description must be a string.");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const kg = [48e3, 44100, 32e3], Eg = [24e3, 22050, 16e3];
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var Ys;
(function(t) {
  t[t.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", t[t.SLICE_DPA = 2] = "SLICE_DPA", t[t.SLICE_DPB = 3] = "SLICE_DPB", t[t.SLICE_DPC = 4] = "SLICE_DPC", t[t.IDR = 5] = "IDR", t[t.SEI = 6] = "SEI", t[t.SPS = 7] = "SPS", t[t.PPS = 8] = "PPS", t[t.AUD = 9] = "AUD", t[t.SPS_EXT = 13] = "SPS_EXT";
})(Ys || (Ys = {}));
var Ze;
(function(t) {
  t[t.RASL_N = 8] = "RASL_N", t[t.RASL_R = 9] = "RASL_R", t[t.BLA_W_LP = 16] = "BLA_W_LP", t[t.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", t[t.VPS_NUT = 32] = "VPS_NUT", t[t.SPS_NUT = 33] = "SPS_NUT", t[t.PPS_NUT = 34] = "PPS_NUT", t[t.AUD_NUT = 35] = "AUD_NUT", t[t.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", t[t.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(Ze || (Ze = {}));
const fo = function* (t) {
  let e = 0, s = -1;
  for (; e < t.length - 2; ) {
    const n = t.indexOf(0, e);
    if (n === -1 || n >= t.length - 2)
      break;
    e = n;
    let r = 0;
    if (e + 3 < t.length && t[e + 1] === 0 && t[e + 2] === 0 && t[e + 3] === 1 ? r = 4 : t[e + 1] === 0 && t[e + 2] === 1 && (r = 3), r === 0) {
      e++;
      continue;
    }
    s !== -1 && e > s && (yield {
      offset: s,
      length: e - s
    }), s = e + r, e = s;
  }
  s !== -1 && s < t.length && (yield {
    offset: s,
    length: t.length - s
  });
}, Tg = (t) => t & 31, po = (t) => {
  const e = [], s = t.length;
  for (let n = 0; n < s; n++)
    n + 2 < s && t[n] === 0 && t[n + 1] === 0 && t[n + 2] === 3 ? (e.push(0, 0), n += 2) : e.push(t[n]);
  return new Uint8Array(e);
}, Cg = (t, e) => {
  const s = t.reduce((i, o) => i + e + o.byteLength, 0), n = new Uint8Array(s);
  let r = 0;
  for (const i of t) {
    const o = new DataView(n.buffer, n.byteOffset, n.byteLength);
    switch (e) {
      case 1:
        o.setUint8(r, i.byteLength);
        break;
      case 2:
        o.setUint16(r, i.byteLength, !1);
        break;
      case 3:
        sg(o, r, i.byteLength);
        break;
      case 4:
        o.setUint32(r, i.byteLength, !1);
        break;
    }
    r += e, n.set(i, r), r += i.byteLength;
  }
  return n;
}, Ag = (t) => {
  try {
    const e = [], s = [], n = [];
    for (const a of fo(t)) {
      const l = t.subarray(a.offset, a.offset + a.length), c = Tg(l[0]);
      c === Ys.SPS ? e.push(l) : c === Ys.PPS ? s.push(l) : c === Ys.SPS_EXT && n.push(l);
    }
    if (e.length === 0 || s.length === 0)
      return null;
    const r = e[0], i = Bg(r);
    T(i !== null);
    const o = i.profileIdc === 100 || i.profileIdc === 110 || i.profileIdc === 122 || i.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: i.profileIdc,
      profileCompatibility: i.constraintFlags,
      avcLevelIndication: i.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: e,
      pictureParameterSets: s,
      chromaFormat: o ? i.chromaFormatIdc : null,
      bitDepthLumaMinus8: o ? i.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: o ? i.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: o ? n : null
    };
  } catch (e) {
    return he._error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, Mg = (t) => {
  const e = [];
  e.push(t.configurationVersion), e.push(t.avcProfileIndication), e.push(t.profileCompatibility), e.push(t.avcLevelIndication), e.push(252 | t.lengthSizeMinusOne & 3), e.push(224 | t.sequenceParameterSets.length & 31);
  for (const s of t.sequenceParameterSets) {
    const n = s.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let r = 0; r < n; r++)
      e.push(s[r]);
  }
  e.push(t.pictureParameterSets.length);
  for (const s of t.pictureParameterSets) {
    const n = s.byteLength;
    e.push(n >> 8), e.push(n & 255);
    for (let r = 0; r < n; r++)
      e.push(s[r]);
  }
  if (t.avcProfileIndication === 100 || t.avcProfileIndication === 110 || t.avcProfileIndication === 122 || t.avcProfileIndication === 144) {
    T(t.chromaFormat !== null), T(t.bitDepthLumaMinus8 !== null), T(t.bitDepthChromaMinus8 !== null), T(t.sequenceParameterSetExt !== null), e.push(252 | t.chromaFormat & 3), e.push(248 | t.bitDepthLumaMinus8 & 7), e.push(248 | t.bitDepthChromaMinus8 & 7), e.push(t.sequenceParameterSetExt.length);
    for (const s of t.sequenceParameterSetExt) {
      const n = s.byteLength;
      e.push(n >> 8), e.push(n & 255);
      for (let r = 0; r < n; r++)
        e.push(s[r]);
    }
  }
  return new Uint8Array(e);
}, Hl = {
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
}, Bg = (t) => {
  try {
    const e = new je(po(t));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const n = e.readAlignedByte(), r = e.readAlignedByte(), i = e.readAlignedByte();
    E(e);
    let o = 1, a = 0, l = 0, c = 0;
    if ((n === 100 || n === 110 || n === 122 || n === 244 || n === 44 || n === 83 || n === 86 || n === 118 || n === 128) && (o = E(e), o === 3 && (c = e.readBits(1)), a = E(e), l = E(e), e.skipBits(1), e.readBits(1))) {
      for (let k = 0; k < (o !== 3 ? 8 : 12); k++)
        if (e.readBits(1)) {
          const M = k < 6 ? 16 : 64;
          let F = 8, $ = 8;
          for (let Z = 0; Z < M; Z++) {
            if ($ !== 0) {
              const U = ht(e);
              $ = (F + U + 256) % 256;
            }
            F = $ === 0 ? F : $;
          }
        }
    }
    E(e);
    const d = E(e);
    if (d === 0)
      E(e);
    else if (d === 1) {
      e.skipBits(1), ht(e), ht(e);
      const Y = E(e);
      for (let k = 0; k < Y; k++)
        ht(e);
    }
    E(e), e.skipBits(1);
    const u = E(e), h = E(e), f = 16 * (u + 1), g = 16 * (h + 1);
    let m = f, p = g;
    const v = e.readBits(1);
    if (v || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const Y = E(e), k = E(e), I = E(e), M = E(e);
      let F, $;
      if ((c === 0 ? o : 0) === 0)
        F = 1, $ = 2 - v;
      else {
        const U = o === 3 ? 1 : 2, te = o === 1 ? 2 : 1;
        F = U, $ = te * (2 - v);
      }
      m -= F * (Y + k), p -= $ * (I + M);
    }
    let w = 2, S = 2, P = 2, j = 0, D = { num: 1, den: 1 }, q = null, N = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const te = e.readBits(8);
        if (te === 255)
          D = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const pe = Hl[te];
          pe && (D = pe);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), j = e.readBits(1), e.readBits(1) && (w = e.readBits(8), S = e.readBits(8), P = e.readBits(8))), e.readBits(1) && (E(e), E(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const $ = e.readBits(1);
      $ && va(e);
      const Z = e.readBits(1);
      Z && va(e), ($ || Z) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), E(e), E(e), E(e), E(e), q = E(e), N = E(e));
    }
    if (q === null) {
      T(N === null);
      const Y = r & 16;
      if ((n === 44 || n === 86 || n === 100 || n === 110 || n === 122 || n === 244) && Y)
        q = 0, N = 0;
      else {
        const k = u + 1, I = h + 1, M = (2 - v) * I, F = ba.find((Z) => Z.level >= i) ?? vs(ba), $ = Math.min(Math.floor(F.maxDpbMbs / (k * M)), 16);
        q = $, N = $;
      }
    }
    return T(N !== null), {
      profileIdc: n,
      constraintFlags: r,
      levelIdc: i,
      frameMbsOnlyFlag: v,
      chromaFormatIdc: o,
      bitDepthLumaMinus8: a,
      bitDepthChromaMinus8: l,
      codedWidth: f,
      codedHeight: g,
      displayWidth: m,
      displayHeight: p,
      pixelAspectRatio: D,
      colourPrimaries: w,
      matrixCoefficients: P,
      transferCharacteristics: S,
      fullRangeFlag: j,
      numReorderFrames: q,
      maxDecFrameBuffering: N
    };
  } catch (e) {
    return he._error("Error parsing AVC SPS:", e), null;
  }
}, va = (t) => {
  const e = E(t);
  t.skipBits(4), t.skipBits(4);
  for (let s = 0; s <= e; s++)
    E(t), E(t), t.skipBits(1);
  t.skipBits(5), t.skipBits(5), t.skipBits(5), t.skipBits(5);
}, Sa = (t) => t >> 1 & 63, Ig = (t) => {
  try {
    const e = new je(po(t));
    e.skipBits(16), e.readBits(4);
    const s = e.readBits(3), n = e.readBits(1), { general_profile_space: r, general_tier_flag: i, general_profile_idc: o, general_profile_compatibility_flags: a, general_constraint_indicator_flags: l, general_level_idc: c } = Og(e, s);
    E(e);
    const d = E(e);
    let u = 0;
    d === 3 && (u = e.readBits(1));
    const h = E(e), f = E(e);
    let g = h, m = f;
    if (e.readBits(1)) {
      const k = E(e), I = E(e), M = E(e), F = E(e);
      let $ = 1, Z = 1;
      const U = u === 0 ? d : 0;
      U === 1 ? ($ = 2, Z = 2) : U === 2 && ($ = 2, Z = 1), g -= (k + I) * $, m -= (M + F) * Z;
    }
    const p = E(e), v = E(e);
    E(e);
    const w = e.readBits(1) ? 0 : s;
    let S = 0;
    for (let k = w; k <= s; k++)
      E(e), S = E(e), E(e);
    E(e), E(e), E(e), E(e), E(e), E(e), e.readBits(1) && e.readBits(1) && Pg(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), E(e), E(e), e.skipBits(1));
    const P = E(e);
    if (Fg(e, P), e.readBits(1)) {
      const k = E(e);
      for (let I = 0; I < k; I++)
        E(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let j = 2, D = 2, q = 2, N = 0, ne = 0, Y = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const k = Ug(e, s);
      Y = k.pixelAspectRatio, j = k.colourPrimaries, D = k.transferCharacteristics, q = k.matrixCoefficients, N = k.fullRangeFlag, ne = k.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: g,
      displayHeight: m,
      pixelAspectRatio: Y,
      colourPrimaries: j,
      transferCharacteristics: D,
      matrixCoefficients: q,
      fullRangeFlag: N,
      maxDecFrameBuffering: S + 1,
      spsMaxSubLayersMinus1: s,
      spsTemporalIdNestingFlag: n,
      generalProfileSpace: r,
      generalTierFlag: i,
      generalProfileIdc: o,
      generalProfileCompatibilityFlags: a,
      generalConstraintIndicatorFlags: l,
      generalLevelIdc: c,
      chromaFormatIdc: d,
      bitDepthLumaMinus8: p,
      bitDepthChromaMinus8: v,
      minSpatialSegmentationIdc: ne
    };
  } catch (e) {
    return he._error("Error parsing HEVC SPS:", e), null;
  }
}, Rg = (t) => {
  try {
    const e = [], s = [], n = [], r = [];
    for (const c of fo(t)) {
      const d = t.subarray(c.offset, c.offset + c.length), u = Sa(d[0]);
      u === Ze.VPS_NUT ? e.push(d) : u === Ze.SPS_NUT ? s.push(d) : u === Ze.PPS_NUT ? n.push(d) : (u === Ze.PREFIX_SEI_NUT || u === Ze.SUFFIX_SEI_NUT) && r.push(d);
    }
    if (s.length === 0 || n.length === 0)
      return null;
    const i = Ig(s[0]);
    if (!i)
      return null;
    let o = 0;
    if (n.length > 0) {
      const c = n[0], d = new je(po(c));
      d.skipBits(16), E(d), E(d), d.skipBits(1), d.skipBits(1), d.skipBits(3), d.skipBits(1), d.skipBits(1), E(d), E(d), ht(d), d.skipBits(1), d.skipBits(1), d.readBits(1) && E(d), ht(d), ht(d), d.skipBits(1), d.skipBits(1), d.skipBits(1), d.skipBits(1);
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
      ...s.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: Ze.SPS_NUT,
          nalUnits: s
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
          nalUnitType: Sa(r[0][0]),
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
}, Og = (t, e) => {
  const s = t.readBits(2), n = t.readBits(1), r = t.readBits(5);
  let i = 0;
  for (let d = 0; d < 32; d++)
    i = i << 1 | t.readBits(1);
  const o = new Uint8Array(6);
  for (let d = 0; d < 6; d++)
    o[d] = t.readBits(8);
  const a = t.readBits(8), l = [], c = [];
  for (let d = 0; d < e; d++)
    l.push(t.readBits(1)), c.push(t.readBits(1));
  if (e > 0)
    for (let d = e; d < 8; d++)
      t.skipBits(2);
  for (let d = 0; d < e; d++)
    l[d] && t.skipBits(88), c[d] && t.skipBits(8);
  return {
    general_profile_space: s,
    general_tier_flag: n,
    general_profile_idc: r,
    general_profile_compatibility_flags: i,
    general_constraint_indicator_flags: o,
    general_level_idc: a
  };
}, Pg = (t) => {
  for (let e = 0; e < 4; e++)
    for (let s = 0; s < (e === 3 ? 2 : 6); s++)
      if (!t.readBits(1))
        E(t);
      else {
        const r = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && ht(t);
        for (let i = 0; i < r; i++)
          ht(t);
      }
}, Fg = (t, e) => {
  const s = [];
  for (let n = 0; n < e; n++)
    s[n] = Lg(t, n, e, s);
}, Lg = (t, e, s, n) => {
  let r = 0, i = 0, o = 0;
  if (e !== 0 && (i = t.readBits(1)), i) {
    if (e === s) {
      const l = E(t);
      o = e - (l + 1);
    } else
      o = e - 1;
    t.readBits(1), E(t);
    const a = n[o] ?? 0;
    for (let l = 0; l <= a; l++)
      t.readBits(1) || t.readBits(1);
    r = n[o];
  } else {
    const a = E(t), l = E(t);
    for (let c = 0; c < a; c++)
      E(t), t.readBits(1);
    for (let c = 0; c < l; c++)
      E(t), t.readBits(1);
    r = a + l;
  }
  return r;
}, Ug = (t, e) => {
  let s = 2, n = 2, r = 2, i = 0, o = 0, a = { num: 1, den: 1 };
  if (t.readBits(1)) {
    const l = t.readBits(8);
    if (l === 255)
      a = {
        num: t.readBits(16),
        den: t.readBits(16)
      };
    else {
      const c = Hl[l];
      c && (a = c);
    }
  }
  return t.readBits(1) && t.readBits(1), t.readBits(1) && (t.readBits(3), i = t.readBits(1), t.readBits(1) && (s = t.readBits(8), n = t.readBits(8), r = t.readBits(8))), t.readBits(1) && (E(t), E(t)), t.readBits(1), t.readBits(1), t.readBits(1), t.readBits(1) && (E(t), E(t), E(t), E(t)), t.readBits(1) && (t.readBits(32), t.readBits(32), t.readBits(1) && E(t), t.readBits(1) && Dg(t, !0, e)), t.readBits(1) && (t.readBits(1), t.readBits(1), t.readBits(1), o = E(t), E(t), E(t), E(t), E(t)), {
    pixelAspectRatio: a,
    colourPrimaries: s,
    transferCharacteristics: n,
    matrixCoefficients: r,
    fullRangeFlag: i,
    minSpatialSegmentationIdc: o
  };
}, Dg = (t, e, s) => {
  let n = !1, r = !1, i = !1;
  n = t.readBits(1) === 1, r = t.readBits(1) === 1, (n || r) && (i = t.readBits(1) === 1, i && (t.readBits(8), t.readBits(5), t.readBits(1), t.readBits(5)), t.readBits(4), t.readBits(4), i && t.readBits(4), t.readBits(5), t.readBits(5), t.readBits(5));
  for (let o = 0; o <= s; o++) {
    const a = t.readBits(1) === 1;
    let l = !0;
    a || (l = t.readBits(1) === 1);
    let c = !1;
    l ? E(t) : c = t.readBits(1) === 1;
    let d = 1;
    c || (d = E(t) + 1), n && _a(t, d, i), r && _a(t, d, i);
  }
}, _a = (t, e, s) => {
  for (let n = 0; n < e; n++)
    E(t), E(t), s && (E(t), E(t)), t.readBits(1);
}, Ng = (t) => {
  const e = [];
  e.push(t.configurationVersion), e.push((t.generalProfileSpace & 3) << 6 | (t.generalTierFlag & 1) << 5 | t.generalProfileIdc & 31), e.push(t.generalProfileCompatibilityFlags >>> 24 & 255), e.push(t.generalProfileCompatibilityFlags >>> 16 & 255), e.push(t.generalProfileCompatibilityFlags >>> 8 & 255), e.push(t.generalProfileCompatibilityFlags & 255), e.push(...t.generalConstraintIndicatorFlags), e.push(t.generalLevelIdc & 255), e.push(240 | t.minSpatialSegmentationIdc >> 8 & 15), e.push(t.minSpatialSegmentationIdc & 255), e.push(252 | t.parallelismType & 3), e.push(252 | t.chromaFormatIdc & 3), e.push(248 | t.bitDepthLumaMinus8 & 7), e.push(248 | t.bitDepthChromaMinus8 & 7), e.push(t.avgFrameRate >> 8 & 255), e.push(t.avgFrameRate & 255), e.push((t.constantFrameRate & 3) << 6 | (t.numTemporalLayers & 7) << 3 | (t.temporalIdNested & 1) << 2 | t.lengthSizeMinusOne & 3), e.push(t.arrays.length & 255);
  for (const s of t.arrays) {
    e.push((s.arrayCompleteness & 1) << 7 | 0 | s.nalUnitType & 63), e.push(s.nalUnits.length >> 8 & 255), e.push(s.nalUnits.length & 255);
    for (const n of s.nalUnits) {
      e.push(n.length >> 8 & 255), e.push(n.length & 255);
      for (let r = 0; r < n.length; r++)
        e.push(n[r]);
    }
  }
  return new Uint8Array(e);
};
var xa;
(function(t) {
  t[t.audAllowed = 0] = "audAllowed", t[t.beforeFirstVcl = 1] = "beforeFirstVcl", t[t.afterFirstVcl = 2] = "afterFirstVcl", t[t.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", t[t.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(xa || (xa = {}));
const $g = (t) => {
  const e = Pl(t), s = e.getUint8(9), n = e.getUint16(10, !0), r = e.getUint32(12, !0), i = e.getInt16(16, !0), o = e.getUint8(18);
  let a = null;
  return o && (a = t.subarray(19, 21 + s)), {
    outputChannelCount: s,
    preSkip: n,
    inputSampleRate: r,
    outputGain: i,
    channelMappingFamily: o,
    channelMappingTable: a
  };
};
var ka;
(function(t) {
  t[t.STREAMINFO = 0] = "STREAMINFO", t[t.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", t[t.PICTURE = 6] = "PICTURE";
})(ka || (ka = {}));
const Vg = (t) => {
  if (t.length < 7 || t[0] !== 11 || t[1] !== 119)
    return null;
  const e = new je(t);
  e.skipBits(16), e.skipBits(16);
  const s = e.readBits(2);
  if (s === 3)
    return null;
  const n = e.readBits(6), r = e.readBits(5);
  if (r > 8)
    return null;
  const i = e.readBits(3), o = e.readBits(3);
  (o & 1) !== 0 && o !== 1 && e.skipBits(2), (o & 4) !== 0 && e.skipBits(2), o === 2 && e.skipBits(2);
  const a = e.readBits(1), l = Math.floor(n / 2);
  return { fscod: s, bsid: r, bsmod: i, acmod: o, lfeon: a, bitRateCode: l };
}, Hg = [1, 2, 3, 6], zg = (t) => {
  if (t.length < 6 || t[0] !== 11 || t[1] !== 119)
    return null;
  const e = new je(t);
  e.skipBits(16);
  const s = e.readBits(2);
  if (e.skipBits(3), s !== 0 && s !== 2)
    return null;
  const n = e.readBits(11), r = e.readBits(2);
  let i = 0, o;
  r === 3 ? (i = e.readBits(2), o = 3) : o = e.readBits(2);
  const a = e.readBits(3), l = e.readBits(1), c = e.readBits(5);
  if (c < 11 || c > 16)
    return null;
  const d = Hg[o];
  let u;
  return r < 3 ? u = kg[r] / 1e3 : u = Eg[i] / 1e3, {
    dataRate: Math.round((n + 1) * u / (d * 16)),
    substreams: [{
      fscod: r,
      fscod2: i,
      bsid: c,
      bsmod: 0,
      acmod: a,
      lfeon: l,
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
const Ea = /* @__PURE__ */ new Uint8Array(0);
class Pt {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, s, n, r, i = -1, o, a) {
    if (this.data = e, this.type = s, this.timestamp = n, this.duration = r, this.sequenceNumber = i, e === Ea && o === void 0)
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    if (o === void 0 && (o = e.byteLength), !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (s !== "key" && s !== "delta")
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
    return this.data === Ea;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(ya * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ya * this.duration);
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
  static fromEncodedChunk(e, s) {
    if (!(e instanceof EncodedVideoChunk || e instanceof EncodedAudioChunk))
      throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
    const n = new Uint8Array(e.byteLength);
    return e.copyTo(n), new Pt(n, e.type, e.timestamp / 1e6, (e.duration ?? 0) / 1e6, void 0, void 0, s);
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
const jg = (t) => {
  let s = (t.hasVideo ? "video/" : t.hasAudio ? "audio/" : "application/") + (t.isQuickTime ? "quicktime" : "mp4");
  if (t.codecStrings.length > 0) {
    const n = [...new Set(t.codecStrings)];
    s += `; codecs="${n.join(", ")}"`;
  }
  return s;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Lr = 8, Ta = 16;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const qg = 7, Wg = 9, Ca = (t) => {
  const e = t.filePos, s = Zg(t, 9), n = new je(s);
  if (n.readBits(12) !== 4095 || (n.skipBits(1), n.readBits(2) !== 0))
    return null;
  const o = n.readBits(1), a = n.readBits(2) + 1, l = n.readBits(4);
  if (l === 15)
    return null;
  n.skipBits(1);
  const c = n.readBits(3);
  if (c === 0)
    throw new Error("ADTS frames with channel configuration 0 are not supported.");
  n.skipBits(1), n.skipBits(1), n.skipBits(1), n.skipBits(1);
  const d = n.readBits(13);
  n.skipBits(11);
  const u = n.readBits(2) + 1;
  if (u !== 1)
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  let h = null;
  return o === 1 ? t.filePos -= 2 : h = n.readBits(16), {
    objectType: a,
    samplingFrequencyIndex: l,
    channelConfiguration: c,
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
class rn {
  constructor(e, s, n, r, i) {
    this.bytes = e, this.view = s, this.offset = n, this.start = r, this.end = i, this.bufferPos = r - n;
  }
  static tempFromBytes(e) {
    return new rn(e, Pl(e), 0, 0, e.length);
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
  slice(e, s = this.end - e) {
    if (e < this.start || e + s > this.end)
      throw new RangeError("Slicing outside of original slice.");
    return new rn(this.bytes, this.view, this.offset, e, e + s);
  }
}
const Gg = (t, e) => {
  if (t.filePos < t.start || t.filePos + e > t.end)
    throw new RangeError(`Tried reading [${t.filePos}, ${t.filePos + e}), but slice is [${t.start}, ${t.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, Zg = (t, e) => {
  Gg(t, e);
  const s = t.bytes.subarray(t.bufferPos, t.bufferPos + e);
  return t.bufferPos += e, s;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Kg {
  constructor(e) {
    this.mutex = new Ll(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTrackClose(e) {
  }
  validateTimestamp(e, s, n) {
    if (s < 0)
      throw new Error(`Timestamps must be non-negative (got ${s}s).`);
    let r = this.trackTimestampInfo.get(e);
    if (r) {
      if (n && (r.maxTimestampBeforeLastKeyPacket = r.maxTimestamp), r.maxTimestampBeforeLastKeyPacket !== null && s < r.maxTimestampBeforeLastKeyPacket)
        throw new Error(`Timestamps cannot be smaller than the largest timestamp of the previous GOP (a GOP begins with a key packet and ends right before the next key packet). Got ${s}s, but largest timestamp is ${r.maxTimestampBeforeLastKeyPacket}s.`);
      r.maxTimestamp = Math.max(r.maxTimestamp, s);
    } else {
      if (!n)
        throw new Error("First packet must be a key packet.");
      r = {
        maxTimestamp: s,
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
const Aa = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, Xg = (t) => {
  const e = Math.floor(t / 36e5), s = Math.floor(t % (3600 * 1e3) / (60 * 1e3)), n = Math.floor(t % (60 * 1e3) / 1e3), r = t % 1e3;
  return e.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0") + ":" + n.toString().padStart(2, "0") + "." + r.toString().padStart(3, "0");
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class _n {
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
    for (let s = 0; s < e.length; s++)
      this.helperView.setUint8(s % 8, e.charCodeAt(s)), s % 8 === 7 && this.writer.write(this.helper);
    e.length % 8 !== 0 && this.writer.write(this.helper.subarray(0, e.length % 8));
  }
  writeBox(e) {
    if (this.offsets.set(e, this.writer.getPos()), e.contents && !e.children)
      this.writeBoxHeader(e, e.size ?? e.contents.byteLength + 8), this.writer.write(e.contents);
    else {
      const s = this.writer.getPos();
      if (this.writeBoxHeader(e, 0), e.contents && this.writer.write(e.contents), e.children)
        for (const i of e.children)
          i && this.writeBox(i);
      const n = this.writer.getPos(), r = e.size ?? n - s;
      this.writer.seek(s), this.writeBoxHeader(e, r), this.writer.seek(n);
    }
  }
  writeBoxHeader(e, s) {
    this.writeU32(e.largeSize ? 1 : s), this.writeAscii(e.type), e.largeSize && this.writeU64(s);
  }
  measureBoxHeader(e) {
    return 8 + (e.largeSize ? 8 : 0);
  }
  patchBox(e) {
    const s = this.offsets.get(e);
    T(s !== void 0);
    const n = this.writer.getPos();
    this.writer.seek(s), this.writeBox(e), this.writer.seek(n);
  }
  measureBox(e) {
    if (e.contents && !e.children)
      return this.measureBoxHeader(e) + e.contents.byteLength;
    {
      let s = this.measureBoxHeader(e);
      if (e.contents && (s += e.contents.byteLength), e.children)
        for (const n of e.children)
          n && (s += this.measureBox(n));
      return s;
    }
  }
}
const W = /* @__PURE__ */ new Uint8Array(8), Fe = /* @__PURE__ */ new DataView(W.buffer), de = (t) => [(t % 256 + 256) % 256], L = (t) => (Fe.setUint16(0, t, !1), [W[0], W[1]]), mo = (t) => (Fe.setInt16(0, t, !1), [W[0], W[1]]), zl = (t) => (Fe.setUint32(0, t, !1), [W[1], W[2], W[3]]), b = (t) => (Fe.setUint32(0, t, !1), [W[0], W[1], W[2], W[3]]), dt = (t) => (Fe.setInt32(0, t, !1), [W[0], W[1], W[2], W[3]]), nt = (t) => (Fe.setUint32(0, Math.floor(t / 2 ** 32), !1), Fe.setUint32(4, t, !1), [W[0], W[1], W[2], W[3], W[4], W[5], W[6], W[7]]), Yg = (t) => (Fe.setInt32(0, Math.floor(t / 2 ** 32), !1), Fe.setUint32(4, t, !1), [W[0], W[1], W[2], W[3], W[4], W[5], W[6], W[7]]), jl = (t) => (Fe.setInt16(0, 2 ** 8 * t, !1), [W[0], W[1]]), Ve = (t) => (Fe.setInt32(0, 2 ** 16 * t, !1), [W[0], W[1], W[2], W[3]]), Ur = (t) => (Fe.setInt32(0, 2 ** 30 * t, !1), [W[0], W[1], W[2], W[3]]), Dr = (t, e) => {
  const s = [];
  let n = t;
  do {
    let r = n & 127;
    n >>= 7, s.length > 0 && (r |= 128), s.push(r);
  } while (n > 0 || e);
  return s.reverse();
}, se = (t, e = !1) => {
  const s = Array(t.length).fill(null).map((n, r) => t.charCodeAt(r));
  return e && s.push(0), s;
}, ql = (t) => {
  const e = t * (Math.PI / 180), s = Math.round(Math.cos(e)), n = Math.round(Math.sin(e));
  return [
    s,
    n,
    0,
    -n,
    s,
    0,
    0,
    0,
    1
  ];
}, Wl = /* @__PURE__ */ ql(0), Gl = (t) => [
  Ve(t[0]),
  Ve(t[1]),
  Ur(t[2]),
  Ve(t[3]),
  Ve(t[4]),
  Ur(t[5]),
  Ve(t[6]),
  Ve(t[7]),
  Ur(t[8])
], O = (t, e, s) => ({
  type: t,
  contents: e && new Uint8Array(e.flat(10)),
  children: s
}), X = (t, e, s, n, r) => O(t, [de(e), zl(s), n ?? []], r), Qg = (t) => t.isQuickTime ? O("ftyp", [
  se("qt  "),
  // Major brand
  b(512),
  // Minor version
  // Compatible brands
  se("qt  ")
]) : t.fragmented ? t.cmaf ? O("ftyp", [
  se("iso5"),
  // Major brand
  b(512),
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
  b(512),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41")
]) : O("ftyp", [
  se("isom"),
  // Major brand
  b(512),
  // Minor version
  // Compatible brands
  se("isom"),
  t.holdsAvc ? se("avc1") : [],
  se("mp41")
]), Ma = () => O("styp", [
  se("iso5"),
  // Major brand
  b(0),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41"),
  se("cmfc"),
  se("dash")
]), Ba = (t, e) => {
  let s = t.maxWrittenEndTimestamp - t.minWrittenTimestamp;
  return Number.isFinite(s) || (s = 0), X("sidx", 1, 0, [
    b(1),
    // Reference ID
    b(ze),
    // Timescale
    nt(ie(t.minWrittenTimestamp, ze)),
    // Earliest presentation time
    nt(0),
    // First offset
    L(0),
    // Reserved
    L(1),
    // Reference count
    b(e & 2147483647),
    // Reference type (0) + referenced size
    b(ie(s, ze)),
    // Subsegment duration
    b(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, xn = (t) => ({ type: "mdat", largeSize: t }), Jg = (t) => ({ type: "free", size: t }), Vs = (t) => O("moov", void 0, [
  ey(t.creationTime, t.trackDatas),
  ...t.trackDatas.map((e) => ty(e, t.creationTime)),
  t.isFragmented ? $y(t.trackDatas) : null,
  Jy(t)
]), ey = (t, e) => {
  const s = Math.max(0, ...e.map((o) => ie(yr(o), ze) + ie(o.startTimestampOffset ?? 0, ze))), n = Math.max(0, ...e.map((o) => o.track.id)) + 1, r = !$t(t) || !$t(s), i = r ? nt : b;
  return X("mvhd", +r, 0, [
    i(t),
    // Creation time
    i(t),
    // Modification time
    b(ze),
    // Timescale
    i(s),
    // Duration
    Ve(1),
    // Preferred rate
    jl(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    Gl(Wl),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    b(n)
    // Next track ID
  ]);
}, yr = (t) => {
  if (t.samples.length === 0)
    return 0;
  let e = 1 / 0, s = -1 / 0;
  for (let n = 0; n < t.samples.length; n++) {
    const r = t.samples[n];
    r.timestamp < e && (e = r.timestamp), r.timestamp + r.duration > s && (s = r.timestamp + r.duration);
  }
  return e === 1 / 0 ? 0 : s - e;
}, ty = (t, e) => {
  const s = d0(t), n = t.startTimestampOffset !== null && t.startTimestampOffset > 0;
  return O("trak", void 0, [
    sy(t, e),
    n ? ny(t, t.startTimestampOffset) : null,
    ry(t, e),
    s.name !== void 0 ? O("udta", void 0, [
      O("name", [
        ...Qe.encode(s.name)
      ])
    ]) : null
  ]);
}, sy = (t, e) => {
  const s = ie(yr(t), ze) + ie(t.startTimestampOffset ?? 0, ze), n = !$t(e) || !$t(s), r = n ? nt : b;
  let i;
  if (t.type === "video") {
    const a = t.track.metadata.rotation;
    i = ql(a ?? 0);
  } else
    i = Wl;
  let o = 2;
  return t.track.metadata.disposition?.default !== !1 && (o |= 1), X("tkhd", +n, o, [
    r(e),
    // Creation time
    r(e),
    // Modification time
    b(t.track.id),
    // Track ID
    b(0),
    // Reserved
    r(s),
    // Duration
    Array(8).fill(0),
    // Reserved
    L(0),
    // Layer
    L(t.track.id),
    // Alternate group
    jl(t.type === "audio" ? 1 : 0),
    // Volume
    L(0),
    // Reserved
    Gl(i),
    // Matrix
    Ve(t.type === "video" ? t.info.width : 0),
    // Track width
    Ve(t.type === "video" ? t.info.height : 0)
    // Track height
  ]);
}, ny = (t, e) => {
  const s = ie(e, ze), n = ie(yr(t), ze), r = !$t(s) || !$t(n), i = r ? nt : b, o = r ? Yg : dt;
  return O("edts", void 0, [
    X("elst", r ? 1 : 0, 0, [
      b(2),
      // Entry count
      // #1
      i(s),
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
}, ry = (t, e) => O("mdia", void 0, [
  iy(t, e),
  go(!0, oy[t.type], ay[t.type]),
  cy(t)
]), iy = (t, e) => {
  const s = ie(yr(t), t.timescale), n = !$t(e) || !$t(s), r = n ? nt : b;
  return X("mdhd", +n, 0, [
    r(e),
    // Creation time
    r(e),
    // Modification time
    b(t.timescale),
    // Timescale
    r(s),
    // Duration
    L(Yl(t.track.metadata.languageCode ?? ng)),
    // Language
    L(0)
    // Quality
  ]);
}, oy = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, ay = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, go = (t, e, s, n = "\0\0\0\0") => X("hdlr", 0, 0, [
  t ? se("mhlr") : b(0),
  // Component type
  se(e),
  // Component subtype
  se(n),
  // Component manufacturer
  b(0),
  // Component flags
  b(0),
  // Component flags mask
  se(s, !0)
  // Component name
]), cy = (t) => O("minf", void 0, [
  hy[t.type](),
  fy(),
  gy(t)
]), ly = () => X("vmhd", 0, 1, [
  L(0),
  // Graphics mode
  L(0),
  // Opcolor R
  L(0),
  // Opcolor G
  L(0)
  // Opcolor B
]), dy = () => X("smhd", 0, 0, [
  L(0),
  // Balance
  L(0)
  // Reserved
]), uy = () => X("nmhd", 0, 0), hy = {
  video: ly,
  audio: dy,
  subtitle: uy
}, fy = () => O("dinf", void 0, [
  py()
]), py = () => X("dref", 0, 0, [
  b(1)
  // Entry count
], [
  my()
]), my = () => X("url ", 0, 1), gy = (t) => {
  const e = t.compositionTimeOffsetTable.length > 1 || t.compositionTimeOffsetTable.some((s) => s.sampleCompositionTimeOffset !== 0);
  return O("stbl", void 0, [
    yy(t),
    Oy(t),
    e ? Dy(t) : null,
    e ? Ny(t) : null,
    Fy(t),
    Ly(t),
    Uy(t),
    Py(t)
  ]);
}, yy = (t) => {
  let e;
  if (t.type === "video")
    e = wy(n0(t.track.source._codec, t.info.decoderConfig.codec), t);
  else if (t.type === "audio") {
    const s = Xl(t.track.source._codec, t.muxer.isQuickTime);
    T(s), e = ky(s, t);
  } else t.type === "subtitle" && (e = Iy(o0[t.track.source._codec], t));
  return T(e), X("stsd", 0, 0, [
    b(1)
    // Entry count
  ], [
    e
  ]);
}, wy = (t, e) => O(t, [
  Array(6).fill(0),
  // Reserved
  L(1),
  // Data reference index
  L(0),
  // Pre-defined
  L(0),
  // Reserved
  Array(12).fill(0),
  // Pre-defined
  L(e.info.width),
  // Width
  L(e.info.height),
  // Height
  b(4718592),
  // Horizontal resolution
  b(4718592),
  // Vertical resolution
  b(0),
  // Reserved
  L(1),
  // Frame count
  Array(32).fill(0),
  // Compressor name
  L(24),
  // Depth
  mo(65535)
  // Pre-defined
], [
  r0[e.track.source._codec]?.(e) ?? null,
  by(e),
  eg(e.info.decoderConfig.colorSpace) ? vy(e) : null
]), by = (t) => t.info.pixelAspectRatio.num === t.info.pixelAspectRatio.den ? null : O("pasp", [
  b(t.info.pixelAspectRatio.num),
  b(t.info.pixelAspectRatio.den)
]), vy = (t) => O("colr", [
  se(t.muxer.isQuickTime ? "nclc" : "nclx"),
  // Colour type
  L(ao[t.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  L(co[t.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  L(lo[t.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  t.muxer.isQuickTime ? [] : de((t.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), Sy = (t) => t.info.decoderConfig && O("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...un(t.info.decoderConfig.description)
]), _y = (t) => t.info.decoderConfig && O("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...un(t.info.decoderConfig.description)
]), Ia = (t) => {
  if (!t.info.decoderConfig)
    return null;
  const e = t.info.decoderConfig, s = e.codec.split("."), n = Number(s[1]), r = Number(s[2]), i = Number(s[3]), o = s[4] ? Number(s[4]) : 1, a = s[8] ? Number(s[8]) : Number(e.colorSpace?.fullRange ?? 0), l = (i << 4) + (o << 1) + a, c = s[5] ? Number(s[5]) : e.colorSpace?.primaries ? ao[e.colorSpace.primaries] : 2, d = s[6] ? Number(s[6]) : e.colorSpace?.transfer ? co[e.colorSpace.transfer] : 2, u = s[7] ? Number(s[7]) : e.colorSpace?.matrix ? lo[e.colorSpace.matrix] : 2;
  return X("vpcC", 1, 0, [
    de(n),
    // Profile
    de(r),
    // Level
    de(l),
    // Bit depth, chroma subsampling, full range
    de(c),
    // Colour primaries
    de(d),
    // Transfer characteristics
    de(u),
    // Matrix coefficients
    L(0)
    // Codec initialization data size
  ]);
}, xy = (t) => O("av1C", fg(t.info.decoderConfig.codec)), ky = (t, e) => {
  let s = 0, n, r = 16;
  const i = Is.includes(e.track.source._codec);
  if (i) {
    const o = e.track.source._codec, { sampleSize: a } = Rs(o);
    r = 8 * a, r > 16 && (s = 1);
  }
  if (e.muxer.isQuickTime && (s = 1), s === 0)
    n = [
      Array(6).fill(0),
      // Reserved
      L(1),
      // Data reference index
      L(s),
      // Version
      L(0),
      // Revision level
      b(0),
      // Vendor
      L(e.info.numberOfChannels),
      // Number of channels
      L(r),
      // Sample size (bits)
      L(0),
      // Compression ID
      L(0),
      // Packet size
      L(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      L(0)
      // Sample rate (lower)
    ];
  else {
    const o = i ? 0 : -2;
    n = [
      Array(6).fill(0),
      // Reserved
      L(1),
      // Data reference index
      L(s),
      // Version
      L(0),
      // Revision level
      b(0),
      // Vendor
      L(e.info.numberOfChannels),
      // Number of channels
      L(Math.min(r, 16)),
      // Sample size (bits)
      mo(o),
      // Compression ID
      L(0),
      // Packet size
      L(e.info.sampleRate < 2 ** 16 ? e.info.sampleRate : 0),
      // Sample rate (upper)
      L(0),
      // Sample rate (lower)
      i ? [
        b(1),
        // Samples per packet (must be 1 for uncompressed formats)
        b(r / 8),
        // Bytes per packet
        b(e.info.numberOfChannels * r / 8)
        // Bytes per frame
      ] : [
        b(0),
        // Samples per packet (don't bother, still works with 0)
        b(0),
        // Bytes per packet (variable)
        b(0)
        // Bytes per frame (variable)
      ],
      b(2)
      // Bytes per sample (constant in FFmpeg)
    ];
  }
  return O(t, n, [
    i0(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Nr = (t) => {
  let e;
  switch (t.track.source._codec) {
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
      throw new Error(`Unhandled audio codec: ${t.track.source._codec}`);
  }
  let s = [
    ...de(e),
    // Object type indication
    ...de(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...zl(0),
    // 24bit buffer size
    ...b(0),
    // max bitrate
    ...b(0)
    // avg bitrate
  ];
  if (t.info.decoderConfig.description) {
    const n = un(t.info.decoderConfig.description);
    s = [
      ...s,
      ...de(5),
      // TAG(5) = DecoderSpecificInfo
      ...Dr(n.byteLength),
      ...n
    ];
  }
  return s = [
    ...L(1),
    // ES_ID = 1
    ...de(0),
    // flags etc = 0
    ...de(4),
    // TAG(4) = ES Descriptor
    ...Dr(s.length),
    ...s,
    ...de(6),
    // TAG(6)
    ...de(1),
    // length
    ...de(2)
    // data
  ], s = [
    ...de(3),
    // TAG(3) = Object Descriptor
    ...Dr(s.length),
    ...s
  ], X("esds", 0, 0, s);
}, St = (t) => O("wave", void 0, [
  Ey(t),
  Ty(t),
  O("\0\0\0\0")
  // NULL tag at the end
]), Ey = (t) => O("frma", [
  se(Xl(t.track.source._codec, t.muxer.isQuickTime))
]), Ty = (t) => {
  const { littleEndian: e } = Rs(t.track.source._codec);
  return O("enda", [
    L(+e)
  ]);
}, Cy = (t) => {
  let e = t.info.numberOfChannels, s = 3840, n = t.info.sampleRate, r = 0, i = 0, o = new Uint8Array(0);
  const a = t.info.decoderConfig?.description;
  if (a) {
    T(a.byteLength >= 18);
    const l = un(a), c = $g(l);
    e = c.outputChannelCount, s = c.preSkip, n = c.inputSampleRate, r = c.outputGain, i = c.channelMappingFamily, c.channelMappingTable && (o = c.channelMappingTable);
  }
  return O("dOps", [
    de(0),
    // Version
    de(e),
    // OutputChannelCount
    L(s),
    // PreSkip
    b(n),
    // InputSampleRate
    mo(r),
    // OutputGain
    de(i),
    // ChannelMappingFamily
    ...o
  ]);
}, Ay = (t) => {
  const e = t.info.decoderConfig?.description;
  T(e);
  const s = un(e);
  return X("dfLa", 0, 0, [
    ...s.subarray(4)
  ]);
}, We = (t) => {
  const { littleEndian: e, sampleSize: s } = Rs(t.track.source._codec), n = +e;
  return X("pcmC", 0, 0, [
    de(n),
    de(8 * s)
  ]);
}, My = (t) => {
  const e = Vg(t.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const s = new Uint8Array(3), n = new je(s);
  return n.writeBits(2, e.fscod), n.writeBits(5, e.bsid), n.writeBits(3, e.bsmod), n.writeBits(3, e.acmod), n.writeBits(1, e.lfeon), n.writeBits(5, e.bitRateCode), n.writeBits(5, 0), O("dac3", [...s]);
}, By = (t) => {
  const e = zg(t.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let s = 16;
  for (const o of e.substreams)
    s += 23, o.numDepSub > 0 ? s += 9 : s += 1;
  const n = Math.ceil(s / 8), r = new Uint8Array(n), i = new je(r);
  i.writeBits(13, e.dataRate), i.writeBits(3, e.substreams.length - 1);
  for (const o of e.substreams)
    i.writeBits(2, o.fscod), i.writeBits(5, o.bsid), i.writeBits(1, 0), i.writeBits(1, 0), i.writeBits(3, o.bsmod), i.writeBits(3, o.acmod), i.writeBits(1, o.lfeon), i.writeBits(3, 0), i.writeBits(4, o.numDepSub), o.numDepSub > 0 ? i.writeBits(9, o.chanLoc) : i.writeBits(1, 0);
  return O("dec3", [...r]);
}, Iy = (t, e) => O(t, [
  Array(6).fill(0),
  // Reserved
  L(1)
  // Data reference index
], [
  a0[e.track.source._codec](e)
]), Ry = (t) => O("vttC", [
  ...Qe.encode(t.info.config.description)
]), Oy = (t) => X("stts", 0, 0, [
  b(t.timeToSampleTable.length),
  // Number of entries
  t.timeToSampleTable.map((e) => [
    b(e.sampleCount),
    // Sample count
    b(e.sampleDelta)
    // Sample duration
  ])
]), Py = (t) => {
  if (t.samples.every((s) => s.type === "key"))
    return null;
  const e = [...t.samples.entries()].filter(([, s]) => s.type === "key");
  return X("stss", 0, 0, [
    b(e.length),
    // Number of entries
    e.map(([s]) => b(s + 1))
    // Sync sample table
  ]);
}, Fy = (t) => X("stsc", 0, 0, [
  b(t.compactlyCodedChunkTable.length),
  // Number of entries
  t.compactlyCodedChunkTable.map((e) => [
    b(e.firstChunk),
    // First chunk
    b(e.samplesPerChunk),
    // Samples per chunk
    b(1)
    // Sample description index
  ])
]), Ly = (t) => {
  if (t.type === "audio" && t.info.requiresPcmTransformation) {
    const { sampleSize: e } = Rs(t.track.source._codec);
    return X("stsz", 0, 0, [
      b(e * t.info.numberOfChannels),
      // Sample size
      b(t.samples.reduce((s, n) => s + ie(n.duration, t.timescale), 0))
    ]);
  }
  return X("stsz", 0, 0, [
    b(0),
    // Sample size (0 means non-constant size)
    b(t.samples.length),
    // Number of entries
    t.samples.map((e) => b(e.size))
    // Sample size table
  ]);
}, Uy = (t) => t.finalizedChunks.length > 0 && vs(t.finalizedChunks).offset >= 2 ** 32 ? X("co64", 0, 0, [
  b(t.finalizedChunks.length),
  // Number of entries
  t.finalizedChunks.map((e) => nt(e.offset))
  // Chunk offset table
]) : X("stco", 0, 0, [
  b(t.finalizedChunks.length),
  // Number of entries
  t.finalizedChunks.map((e) => b(e.offset))
  // Chunk offset table
]), Dy = (t) => X("ctts", 1, 0, [
  b(t.compositionTimeOffsetTable.length),
  // Number of entries
  t.compositionTimeOffsetTable.map((e) => [
    b(e.sampleCount),
    // Sample count
    dt(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), Ny = (t) => {
  let e = 1 / 0, s = -1 / 0, n = 1 / 0, r = -1 / 0;
  T(t.compositionTimeOffsetTable.length > 0), T(t.samples.length > 0);
  for (let o = 0; o < t.compositionTimeOffsetTable.length; o++) {
    const a = t.compositionTimeOffsetTable[o];
    e = Math.min(e, a.sampleCompositionTimeOffset), s = Math.max(s, a.sampleCompositionTimeOffset);
  }
  for (let o = 0; o < t.samples.length; o++) {
    const a = t.samples[o];
    n = Math.min(n, ie(a.timestamp, t.timescale)), r = Math.max(r, ie(a.timestamp + a.duration, t.timescale));
  }
  const i = Math.max(-e, 0);
  return r >= 2 ** 31 ? null : X("cslg", 0, 0, [
    dt(i),
    // Composition to DTS shift
    dt(e),
    // Least decode to display delta
    dt(s),
    // Greatest decode to display delta
    dt(n),
    // Composition start time
    dt(r)
    // Composition end time
  ]);
}, $y = (t) => O("mvex", void 0, t.map(Vy)), Vy = (t) => X("trex", 0, 0, [
  b(t.track.id),
  // Track ID
  b(1),
  // Default sample description index
  b(0),
  // Default sample duration
  b(0),
  // Default sample size
  b(0)
  // Default sample flags
]), Ra = (t, e) => O("moof", void 0, [
  Hy(t),
  ...e.map(zy)
]), Hy = (t) => X("mfhd", 0, 0, [
  b(t)
  // Sequence number
]), Zl = (t) => {
  let e = 0, s = 0;
  const n = 0, r = 0, i = t.type === "delta";
  return s |= +i, i ? e |= 1 : e |= 2, e << 24 | s << 16 | n << 8 | r;
}, zy = (t) => O("traf", void 0, [
  jy(t),
  qy(t),
  Wy(t)
]), jy = (t) => {
  T(t.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const s = t.currentChunk.samples[1] ?? t.currentChunk.samples[0], n = {
    duration: s.timescaleUnitsToNextSample,
    size: s.size,
    flags: Zl(s)
  };
  return X("tfhd", 0, e, [
    b(t.track.id),
    // Track ID
    b(n.duration),
    // Default sample duration
    b(n.size),
    // Default sample size
    b(n.flags)
    // Default sample flags
  ]);
}, qy = (t) => (T(t.currentChunk), X("tfdt", 1, 0, [
  nt(ie(t.currentChunk.startTimestamp, t.timescale))
  // Base Media Decode Time
])), Wy = (t) => {
  T(t.currentChunk);
  const e = t.currentChunk.samples.map((m) => m.timescaleUnitsToNextSample), s = t.currentChunk.samples.map((m) => m.size), n = t.currentChunk.samples.map(Zl), r = t.currentChunk.samples.map((m) => ie(m.timestamp - m.decodeTimestamp, t.timescale)), i = new Set(e), o = new Set(s), a = new Set(n), l = new Set(r), c = a.size === 2 && n[0] !== n[1], d = i.size > 1, u = o.size > 1, h = !c && a.size > 1, f = l.size > 1 || [...l].some((m) => m !== 0);
  let g = 0;
  return g |= 1, g |= 4 * +c, g |= 256 * +d, g |= 512 * +u, g |= 1024 * +h, g |= 2048 * +f, X("trun", 1, g, [
    b(t.currentChunk.samples.length),
    // Sample count
    b(t.currentChunk.offset - t.currentChunk.moofOffset || 0),
    // Data offset
    c ? b(n[0]) : [],
    t.currentChunk.samples.map((m, p) => [
      d ? b(e[p]) : [],
      // Sample duration
      u ? b(s[p]) : [],
      // Sample size
      h ? b(n[p]) : [],
      // Sample flags
      // Sample composition time offsets
      f ? dt(r[p]) : []
    ])
  ]);
}, Gy = (t) => O("mfra", void 0, [
  ...t.map(Zy),
  Ky()
]), Zy = (t, e) => X("tfra", 1, 0, [
  b(t.track.id),
  // Track ID
  b(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  b(t.finalizedChunks.length),
  // Number of entries
  t.finalizedChunks.map((n) => [
    nt(ie(n.samples[0].timestamp, t.timescale)),
    // Time (in presentation time)
    nt(n.moofOffset),
    // moof offset
    b(e + 1),
    // traf number
    b(1),
    // trun number
    b(1)
    // Sample number
  ])
]), Ky = () => X("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  b(0)
  // Size
]), Xy = () => O("vtte"), Yy = (t, e, s, n, r) => O("vttc", void 0, [
  r !== null ? O("vsid", [dt(r)]) : null,
  s !== null ? O("iden", [...Qe.encode(s)]) : null,
  e !== null ? O("ctim", [...Qe.encode(Xg(e))]) : null,
  n !== null ? O("sttg", [...Qe.encode(n)]) : null,
  O("payl", [...Qe.encode(t)])
]), Qy = (t) => O("vtta", [...Qe.encode(t)]), Jy = (t) => {
  const e = [], s = t.format._options.metadataFormat ?? "auto", n = t.output._metadataTags;
  if (s === "mdir" || s === "auto" && !t.isQuickTime) {
    const r = t0(n);
    r && e.push(r);
  } else if (s === "mdta") {
    const r = s0(n);
    r && e.push(r);
  } else (s === "udta" || s === "auto" && t.isQuickTime) && e0(e, t.output._metadataTags);
  return e.length === 0 ? null : O("udta", void 0, e);
}, e0 = (t, e) => {
  for (const { key: s, value: n } of Dl(e))
    switch (s) {
      case "title":
        t.push(Ge("©nam", n));
        break;
      case "description":
        t.push(Ge("©des", n));
        break;
      case "artist":
        t.push(Ge("©ART", n));
        break;
      case "album":
        t.push(Ge("©alb", n));
        break;
      case "albumArtist":
        t.push(Ge("albr", n));
        break;
      case "genre":
        t.push(Ge("©gen", n));
        break;
      case "date":
        t.push(Ge("©day", n.toISOString().slice(0, 10)));
        break;
      case "comment":
        t.push(Ge("©cmt", n));
        break;
      case "lyrics":
        t.push(Ge("©lyr", n));
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
        Ul(s);
    }
  if (e.raw)
    for (const s in e.raw) {
      const n = e.raw[s];
      n == null || s.length !== 4 || t.some((r) => r.type === s) || (typeof n == "string" ? t.push(Ge(s, n)) : n instanceof Uint8Array && t.push(O(s, Array.from(n))));
    }
}, Ge = (t, e) => {
  const s = Qe.encode(e);
  return O(t, [
    L(s.length),
    L(Yl("und")),
    Array.from(s)
  ]);
}, Oa = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, Kl = (t, e) => {
  const s = [];
  for (const { key: n, value: r } of Dl(t))
    switch (n) {
      case "title":
        s.push({ key: e ? "title" : "©nam", value: De(r) });
        break;
      case "description":
        s.push({ key: e ? "description" : "©des", value: De(r) });
        break;
      case "artist":
        s.push({ key: e ? "artist" : "©ART", value: De(r) });
        break;
      case "album":
        s.push({ key: e ? "album" : "©alb", value: De(r) });
        break;
      case "albumArtist":
        s.push({ key: e ? "album_artist" : "aART", value: De(r) });
        break;
      case "comment":
        s.push({ key: e ? "comment" : "©cmt", value: De(r) });
        break;
      case "genre":
        s.push({ key: e ? "genre" : "©gen", value: De(r) });
        break;
      case "lyrics":
        s.push({ key: e ? "lyrics" : "©lyr", value: De(r) });
        break;
      case "date":
        s.push({
          key: e ? "date" : "©day",
          value: De(r.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const i of r)
          i.kind === "coverFront" && s.push({ key: "covr", value: O("data", [
            b(Oa[i.mimeType] ?? 0),
            // Type indicator
            b(0),
            // Locale indicator
            Array.from(i.data)
            // Kinda slow, hopefully temp
          ]) });
        break;
      case "trackNumber":
        if (e) {
          const i = t.tracksTotal !== void 0 ? `${r}/${t.tracksTotal}` : r.toString();
          s.push({ key: "track", value: De(i) });
        } else
          s.push({ key: "trkn", value: O("data", [
            b(0),
            // 8 bytes empty
            b(0),
            L(0),
            // Empty
            L(r),
            L(t.tracksTotal ?? 0),
            L(0)
            // Empty
          ]) });
        break;
      case "discNumber":
        e || s.push({ key: "disc", value: O("data", [
          b(0),
          // 8 bytes empty
          b(0),
          L(0),
          // Empty
          L(r),
          L(t.discsTotal ?? 0),
          L(0)
          // Empty
        ]) });
        break;
      case "tracksTotal":
      case "discsTotal":
        break;
      case "raw":
        break;
      default:
        Ul(n);
    }
  if (t.raw)
    for (const n in t.raw) {
      const r = t.raw[n];
      r == null || !e && n.length !== 4 || s.some((i) => i.key === n) || (typeof r == "string" ? s.push({ key: n, value: De(r) }) : r instanceof Uint8Array ? s.push({ key: n, value: O("data", [
        b(0),
        // Type indicator
        b(0),
        // Locale indicator
        Array.from(r)
      ]) }) : r instanceof Nl && s.push({ key: n, value: O("data", [
        b(Oa[r.mimeType] ?? 0),
        // Type indicator
        b(0),
        // Locale indicator
        Array.from(r.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return s;
}, t0 = (t) => {
  const e = Kl(t, !1);
  return e.length === 0 ? null : X("meta", 0, 0, void 0, [
    go(!1, "mdir", "", "appl"),
    // mdir handler
    O("ilst", void 0, e.map((s) => O(s.key, void 0, [s.value])))
    // Item list without keys box
  ]);
}, s0 = (t) => {
  const e = Kl(t, !0);
  return e.length === 0 ? null : O("meta", void 0, [
    go(!1, "mdta", ""),
    // mdta handler
    X("keys", 0, 0, [
      b(e.length)
    ], e.map((s) => O("mdta", [
      ...Qe.encode(s.key)
    ]))),
    O("ilst", void 0, e.map((s, n) => {
      const r = String.fromCharCode(...b(n + 1));
      return O(r, void 0, [s.value]);
    }))
  ]);
}, De = (t) => O("data", [
  b(1),
  // Type indicator (UTF-8)
  b(0),
  // Locale indicator
  ...Qe.encode(t)
]), n0 = (t, e) => {
  switch (t) {
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
}, r0 = {
  avc: Sy,
  hevc: _y,
  vp8: Ia,
  vp9: Ia,
  av1: xy,
  prores: null
}, Xl = (t, e) => {
  switch (t) {
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
    switch (t) {
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
    switch (t) {
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
}, i0 = (t, e) => {
  switch (t) {
    case "aac":
      return Nr;
    case "mp3":
      return Nr;
    case "opus":
      return Cy;
    case "vorbis":
      return Nr;
    case "flac":
      return Ay;
    case "ac3":
      return My;
    case "eac3":
      return By;
  }
  if (e)
    switch (t) {
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
    switch (t) {
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
}, o0 = {
  webvtt: "wvtt"
}, a0 = {
  webvtt: Ry
}, Yl = (t) => {
  T(t.length === 3);
  let e = 0;
  for (let s = 0; s < 3; s++)
    e <<= 5, e += t.charCodeAt(s) - 96;
  return e;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class Ci {
  constructor(e, s) {
    if (this.finalized = !1, this.started = !1, this.pos = 0, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1, e._writerAcquired)
      throw new Error("Can't have multiple Writers for the same Target.");
    this.target = e, e._setMonotonicity(s), e._writerAcquired = !0;
  }
  start() {
    T(!this.started), this.target._start(), this.started = !0;
  }
  /** Writes the given data to the target, at the current position. */
  write(e) {
    T(this.started && !this.finalized), this.maybeTrackWrites(e), this.target._write(e, this.pos), this.pos += e.byteLength;
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
    return T(this.started && !this.finalized), this.target._flush();
  }
  /** Called after muxing has finished. */
  async finalize() {
    T(this.started && !this.finalized), await this.target._finalize(), this.finalized = !0;
  }
  maybeTrackWrites(e) {
    if (!this.trackedWrites)
      return;
    let s = this.getPos();
    if (s < this.trackedStart) {
      if (s + e.byteLength <= this.trackedStart)
        return;
      e = e.subarray(this.trackedStart - s), s = 0;
    }
    const n = s + e.byteLength - this.trackedStart;
    let r = this.trackedWrites.byteLength;
    for (; r < n; )
      r *= 2;
    if (r !== this.trackedWrites.byteLength) {
      const i = new Uint8Array(r);
      i.set(this.trackedWrites, 0), this.trackedWrites = i;
    }
    this.trackedWrites.set(e, s - this.trackedStart), this.trackedEnd = Math.max(this.trackedEnd, s + e.byteLength);
  }
  startTrackingWrites() {
    this.trackedWrites = new Uint8Array(2 ** 10), this.trackedStart = this.getPos(), this.trackedEnd = this.trackedStart;
  }
  stopTrackingWrites() {
    if (!this.trackedWrites)
      throw new Error("Internal error: Can't get tracked writes since nothing was tracked.");
    const s = {
      data: this.trackedWrites.subarray(0, this.trackedEnd - this.trackedStart),
      start: this.trackedStart,
      end: this.trackedEnd
    };
    return this.trackedWrites = null, s;
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class lt extends uo {
  constructor() {
    super(...arguments), this._writerAcquired = !1, this._monotonicity = null, this.onwrite = null;
  }
  /** @internal */
  _setMonotonicity(e) {
    this._monotonicity !== !1 && (this._monotonicity = e);
  }
  /** @internal */
  _dispatchWrite(e, s) {
    this.onwrite?.(e, s), this._emit("write", { start: e, end: s });
  }
  /**
   * Returns a new {@link RangedTarget} that writes data to this target using the given offset.
   *
   * Useful for writing a file into a section of a larger file.
   */
  slice(e) {
    if (!Number.isInteger(e) || e < 0)
      throw new TypeError("offset must be a non-negative integer.");
    return new c0(this, e);
  }
}
const $r = 2 ** 16, Vr = 2 ** 32;
class Rn extends lt {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer($r, { maxByteLength: Vr });
      } catch {
        this._buffer = new ArrayBuffer($r), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer($r);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let s = this._buffer.byteLength;
    for (; s < e; )
      s *= 2;
    if (s !== this._buffer.byteLength) {
      if (s > Vr)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Vr} bytes. Please consider using another target.`);
      if (this._supportsResize)
        this._buffer.resize(s);
      else {
        const n = new ArrayBuffer(s), r = new Uint8Array(n);
        r.set(this._bytes, 0), this._buffer = n, this._bytes = r;
      }
    }
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, s) {
    this._ensureSize(s + e.byteLength), this._bytes.set(e, s), this._maxPos = Math.max(this._maxPos, s + e.byteLength), this._dispatchWrite(s, s + e.byteLength);
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
  _getSlice(e, s) {
    return this._bytes.slice(e, s);
  }
}
class c0 extends lt {
  /** @internal */
  constructor(e, s) {
    super(), this._baseTarget = e, this._offset = s;
  }
  /** @internal */
  _start() {
  }
  /** @internal */
  _write(e, s) {
    this._baseTarget._write(e, this._offset + s), this._dispatchWrite(s, s + e.byteLength);
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
class Hr {
  /** Creates a new {@link PathedTarget} from a root path and a callback. */
  constructor(e, s) {
    if (this.rootPath = e, this.getTarget = s, typeof e != "string")
      throw new TypeError("rootPath must be a string.");
    if (typeof s != "function")
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
const ze = 57600, l0 = 2082844800, d0 = (t) => {
  const e = {}, s = t.track;
  return s.metadata.name !== void 0 && (e.name = s.metadata.name), e;
}, ie = (t, e, s = !0) => {
  const n = t * e;
  return s ? Math.round(n) : n;
};
class u0 extends Kg {
  constructor(e, s) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Rn(), this.auxWriter = new Ci(this.auxTarget, !1), this.auxBoxWriter = new _n(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = tg(), this.creationTime = Math.floor(Date.now() / 1e3) + l0, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = s, this.isQuickTime = s instanceof sd, this.isCmaf = s instanceof Pa, this.minimumFragmentDuration = s._options.minimumFragmentDuration ?? (s instanceof Pa ? 1 / 0 : 1), this.auxWriter.start();
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((n) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : n instanceof Rn), this.boxWriter = new _n(this.writer), this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof Rn ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const n = await this.output._getInitTarget(), r = new Ci(n, !0);
      r.start(), this.initWriter = r, this.initBoxWriter = new _n(r);
    }
    const s = this.output._tracks.some((n) => n.isVideoTrack() && n.source._codec === "avc");
    {
      const n = this.initBoxWriter ?? this.boxWriter;
      if (T(n), this.format._options.onFtyp && n.writer.startTrackingWrites(), n.writeBox(Qg({
        isQuickTime: this.isQuickTime,
        holdsAvc: s,
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
    } else this.isFragmented || (T(this.writer), T(this.boxWriter), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = xn(!0), this.boxWriter.writeBox(this.mdat));
    await this.writer?.flush(), e();
  }
  allTracksAreKnown() {
    for (const e of this.output._tracks)
      if (!e.source._closed && !this.trackDatas.some((s) => s.track === e))
        return !1;
    return !0;
  }
  async getMimeType() {
    await this.allTracksKnown.promise;
    const e = this.trackDatas.map((s) => s.type === "video" || s.type === "audio" ? s.info.decoderConfig.codec : {
      webvtt: "wvtt"
    }[s.track.source._codec]);
    return jg({
      isQuickTime: this.isQuickTime,
      hasVideo: this.trackDatas.some((s) => s.type === "video"),
      hasAudio: this.trackDatas.some((s) => s.type === "audio"),
      codecStrings: e
    });
  }
  getVideoTrackData(e, s, n) {
    const r = this.trackDatas.find((h) => h.track === e);
    if (r)
      return r;
    vg(n), T(n), T(n.decoderConfig);
    const i = { ...n.decoderConfig };
    T(i.codedWidth !== void 0), T(i.codedHeight !== void 0);
    let o = !1;
    if (e.source._codec === "avc" && !i.description) {
      const h = Ag(s.data);
      if (!h)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      i.description = Mg(h), o = !0;
    } else if (e.source._codec === "hevc" && !i.description) {
      const h = Rg(s.data);
      if (!h)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      i.description = Ng(h), o = !0;
    }
    const a = og(1 / (e.metadata.frameRate ?? ze), 1e6).den, l = i.displayAspectWidth, c = i.displayAspectHeight, d = l === void 0 || c === void 0 ? { num: 1, den: 1 } : ag({
      num: l * i.codedHeight,
      den: c * i.codedWidth
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
  getAudioTrackData(e, s, n) {
    const r = this.trackDatas.find((l) => l.track === e);
    if (r)
      return r;
    _g(n), T(n), T(n.decoderConfig);
    const i = { ...n.decoderConfig };
    let o = !1;
    if (e.source._codec === "aac" && !i.description) {
      const l = Ca(rn.tempFromBytes(s.data));
      if (!l)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const c = $l[l.samplingFrequencyIndex], d = Vl[l.channelConfiguration];
      if (c === void 0 || d === void 0)
        throw new Error("Invalid ADTS frame header.");
      i.description = hg({
        objectType: l.objectType,
        sampleRate: c,
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
        requiresPcmTransformation: !this.isFragmented && Is.includes(e.source._codec),
        expectedNextPcmPacketTimestamp: null,
        requiresAdtsStripping: o,
        firstPacket: s
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
    return this.trackDatas.push(a), this.trackDatas.sort((l, c) => l.track.id - c.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), a;
  }
  getSubtitleTrackData(e, s) {
    const n = this.trackDatas.find((i) => i.track === e);
    if (n)
      return n;
    xg(s), T(s), T(s.config);
    const r = {
      muxer: this,
      track: e,
      type: "subtitle",
      info: {
        config: s.config
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
  async addEncodedVideoPacket(e, s, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getVideoTrackData(e, s, n);
      let o = s.data;
      if (i.info.requiresAnnexBTransformation) {
        const l = [...fo(o)].map((c) => o.subarray(c.offset, c.offset + c.length));
        if (l.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        o = Cg(l, 4);
      }
      this.validateTimestamp(i.track, s.timestamp, s.type === "key");
      const a = this.createSampleForTrack(i, o, s.timestamp, s.duration, s.type);
      await this.registerSample(i, a);
    } finally {
      r();
    }
  }
  async addEncodedAudioPacket(e, s, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getAudioTrackData(e, s, n);
      let o = s.data;
      if (i.info.requiresAdtsStripping) {
        const d = Ca(rn.tempFromBytes(o));
        if (!d)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = d.crcCheck === null ? qg : Wg;
        o = o.subarray(u);
      }
      this.validateTimestamp(i.track, s.timestamp, s.type === "key");
      let a = s.timestamp, l = s.duration;
      if (i.info.requiresPcmTransformation) {
        const u = Rs(i.info.decoderConfig.codec).sampleSize * i.info.numberOfChannels;
        if (l = o.byteLength / u / i.info.sampleRate, i.info.expectedNextPcmPacketTimestamp !== null) {
          const h = a - i.info.expectedNextPcmPacketTimestamp;
          if (h < 0.01)
            a = i.info.expectedNextPcmPacketTimestamp;
          else {
            const f = await this.padWithSilence(i, i.info.expectedNextPcmPacketTimestamp, h);
            a = i.info.expectedNextPcmPacketTimestamp + f;
          }
        }
        i.info.expectedNextPcmPacketTimestamp = a + l;
      }
      const c = this.createSampleForTrack(i, o, a, l, s.type);
      await this.registerSample(i, c);
    } finally {
      r();
    }
  }
  async padWithSilence(e, s, n) {
    const r = ie(n, e.timescale);
    if (n = r / e.timescale, r > 0) {
      const { sampleSize: i, silentValue: o } = Rs(e.info.decoderConfig.codec), a = r * e.info.numberOfChannels, l = new Uint8Array(i * a).fill(o), c = this.createSampleForTrack(e, new Uint8Array(l.buffer), s, n, "key");
      await this.registerSample(e, c);
    }
    return n;
  }
  async addSubtitleCue(e, s, n) {
    const r = await this.mutex.acquire();
    try {
      const i = this.getSubtitleTrackData(e, n);
      this.validateTimestamp(i.track, s.timestamp, !0), e.source._codec === "webvtt" && (i.cueQueue.push(s), await this.processWebVTTCues(i, s.timestamp));
    } finally {
      r();
    }
  }
  async processWebVTTCues(e, s) {
    for (; e.cueQueue.length > 0; ) {
      const n = /* @__PURE__ */ new Set([]);
      for (const c of e.cueQueue)
        T(c.timestamp <= s), T(e.lastCueEndTimestamp <= c.timestamp + c.duration), n.add(Math.max(c.timestamp, e.lastCueEndTimestamp)), n.add(c.timestamp + c.duration);
      const r = [...n].sort((c, d) => c - d), i = r[0], o = r[1] ?? i;
      if (s < o)
        break;
      if (e.lastCueEndTimestamp < i) {
        this.auxWriter.seek(0);
        const c = Xy();
        this.auxBoxWriter.writeBox(c);
        const d = this.auxTarget._getSlice(0, this.auxWriter.getPos()), u = this.createSampleForTrack(e, d, e.lastCueEndTimestamp, i - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, u), e.lastCueEndTimestamp = i;
      }
      this.auxWriter.seek(0);
      for (let c = 0; c < e.cueQueue.length; c++) {
        const d = e.cueQueue[c];
        if (d.timestamp >= o)
          break;
        Aa.lastIndex = 0;
        const u = Aa.test(d.text), h = d.timestamp + d.duration;
        let f = e.cueToSourceId.get(d);
        if (f === void 0 && o < h && (f = e.nextSourceId++, e.cueToSourceId.set(d, f)), d.notes) {
          const m = Qy(d.notes);
          this.auxBoxWriter.writeBox(m);
        }
        const g = Yy(d.text, u ? i : null, d.identifier ?? null, d.settings ?? null, f ?? null);
        this.auxBoxWriter.writeBox(g), h === o && e.cueQueue.splice(c--, 1);
      }
      const a = this.auxTarget._getSlice(0, this.auxWriter.getPos()), l = this.createSampleForTrack(e, a, i, o - i, "key");
      await this.registerSample(e, l), e.lastCueEndTimestamp = o;
    }
  }
  createSampleForTrack(e, s, n, r, i) {
    return {
      timestamp: n,
      decodeTimestamp: n,
      // This may be refined later
      duration: r,
      data: s,
      size: s.byteLength,
      type: i,
      timescaleUnitsToNextSample: ie(r, e.timescale)
      // Will be refined
    };
  }
  processTimestamps(e, s) {
    if (e.timestampProcessingQueue.length === 0)
      return;
    if (e.type === "audio" && e.info.requiresPcmTransformation) {
      this.isFragmented || (e.startTimestampOffset ??= e.timestampProcessingQueue[0].timestamp);
      let r = 0;
      for (let i = 0; i < e.timestampProcessingQueue.length; i++) {
        const o = e.timestampProcessingQueue[i], a = ie(o.duration, e.timescale);
        r += a;
      }
      if (e.timeToSampleTable.length === 0)
        e.timeToSampleTable.push({
          sampleCount: r,
          sampleDelta: 1
        });
      else {
        const i = vs(e.timeToSampleTable);
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
      const o = ie(i.timestamp - i.decodeTimestamp, e.timescale), a = ie(i.duration, e.timescale);
      if (e.lastTimescaleUnits !== null) {
        T(e.lastSample);
        const l = ie(i.decodeTimestamp, e.timescale, !1), c = Math.round(l - e.lastTimescaleUnits);
        if (T(c >= 0), e.lastTimescaleUnits += c, e.lastSample.timescaleUnitsToNextSample = c, !this.isFragmented) {
          let d = vs(e.timeToSampleTable);
          if (T(d), d.sampleCount === 1) {
            d.sampleDelta = c;
            const h = e.timeToSampleTable[e.timeToSampleTable.length - 2];
            h && h.sampleDelta === c && (h.sampleCount++, e.timeToSampleTable.pop(), d = h);
          } else d.sampleDelta !== c && (d.sampleCount--, e.timeToSampleTable.push(d = {
            sampleCount: 1,
            sampleDelta: c
          }));
          d.sampleDelta === a ? d.sampleCount++ : e.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: a
          });
          const u = vs(e.compositionTimeOffsetTable);
          T(u), u.sampleCompositionTimeOffset === o ? u.sampleCount++ : e.compositionTimeOffsetTable.push({
            sampleCount: 1,
            sampleCompositionTimeOffset: o
          });
        }
      } else
        e.lastTimescaleUnits = ie(i.decodeTimestamp, e.timescale, !1), this.isFragmented || (e.timeToSampleTable.push({
          sampleCount: 1,
          sampleDelta: a
        }), e.compositionTimeOffsetTable.push({
          sampleCount: 1,
          sampleCompositionTimeOffset: o
        }));
      e.lastSample = i;
    }
    if (e.timestampProcessingQueue.length = 0, T(e.lastSample), T(e.lastTimescaleUnits !== null), s !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      T(s.type === "key");
      const r = ie(s.timestamp, e.timescale, !1), i = Math.round(r - e.lastTimescaleUnits);
      e.lastSample.timescaleUnitsToNextSample = i;
    }
  }
  async registerSample(e, s) {
    s.type === "key" && this.processTimestamps(e, s), e.timestampProcessingQueue.push(s), this.isFragmented ? (e.sampleQueue.push(s), await this.interleaveSamples()) : this.fastStart === "reserve" ? await this.registerSampleFastStartReserve(e, s) : await this.addSampleToTrack(e, s);
  }
  async addSampleToTrack(e, s) {
    if (!this.isFragmented && (e.samples.push(s), this.fastStart === "reserve")) {
      const r = e.track.metadata.maximumPacketCount;
      if (T(r !== void 0), e.samples.length > r)
        throw new Error(`Track #${e.track.id} has already reached the maximum packet count (${r}). Either add less packets or increase the maximum packet count.`);
    }
    let n = !1;
    if (!e.currentChunk)
      n = !0;
    else {
      e.currentChunk.startTimestamp = Math.min(e.currentChunk.startTimestamp, s.timestamp);
      const r = s.timestamp - e.currentChunk.startTimestamp;
      if (this.isFragmented) {
        const i = this.trackDatas.every((o) => {
          if (e === o)
            return s.type === "key";
          const a = o.sampleQueue[0];
          return a ? a.type === "key" : o.closed;
        });
        r >= this.minimumFragmentDuration && i && s.timestamp > this.maxWrittenTimestamp && (n = !0, await this.finalizeFragment());
      } else
        n = r >= 0.5;
    }
    n && (e.currentChunk && await this.finalizeCurrentChunk(e), e.currentChunk = {
      startTimestamp: s.timestamp,
      samples: [],
      offset: null,
      moofOffset: null
    }), T(e.currentChunk), e.currentChunk.samples.push(s), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, s.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, s.timestamp + s.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, s.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (T(!this.isFragmented), T(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let s = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (s = e.currentChunk.samples.reduce((n, r) => n + ie(r.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || vs(e.compactlyCodedChunkTable).samplesPerChunk !== s) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: s
    }), this.fastStart === "in-memory") {
      e.currentChunk.offset = 0;
      return;
    }
    e.currentChunk.offset = this.writer.getPos();
    for (const n of e.currentChunk.samples)
      T(n.data), this.writer.write(n.data), n.data = null;
    await this.writer.flush();
  }
  async interleaveSamples(e = !1) {
    if (T(this.isFragmented), !(!e && !this.allTracksAreKnown()))
      e: for (; ; ) {
        let s = null, n = 1 / 0;
        for (const i of this.trackDatas) {
          if (!e && i.sampleQueue.length === 0 && !i.closed)
            break e;
          i.sampleQueue.length > 0 && i.sampleQueue[0].timestamp < n && (s = i, n = i.sampleQueue[0].timestamp);
        }
        if (!s)
          break;
        const r = s.sampleQueue.shift();
        await this.addSampleToTrack(s, r);
      }
  }
  async finalizeFragment(e = !this.isCmaf) {
    T(this.isFragmented);
    const s = this.nextFragmentNumber++;
    if (s === 1) {
      const f = this.initBoxWriter ?? this.boxWriter;
      T(f), this.format._options.onMoov && f.writer.startTrackingWrites(), this.ensureOneEnabledTrack();
      const g = Vs(this);
      if (f.writeBox(g), this.format._options.onMoov) {
        const { data: m, start: p } = f.writer.stopTrackingWrites();
        this.format._options.onMoov(m, p);
      }
      if (this.isCmaf) {
        T(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new _n(this.writer);
        const m = this.boxWriter.measureBox(Ma()), p = this.boxWriter.measureBox(Ba(this, 0));
        this.segmentHeaderSize = m + p, this.writer.seek(this.segmentHeaderSize);
      }
    }
    T(this.writer), T(this.boxWriter);
    const n = this.trackDatas.filter((f) => f.currentChunk), r = Ra(s, n), i = this.writer.getPos(), o = i + this.boxWriter.measureBox(r);
    let a = o + Lr, l = 1 / 0;
    for (const f of n) {
      f.currentChunk.offset = a, f.currentChunk.moofOffset = i;
      for (const g of f.currentChunk.samples)
        a += g.size;
      l = Math.min(l, f.currentChunk.startTimestamp);
    }
    const c = a - o, d = c >= 2 ** 32;
    if (d)
      for (const f of n)
        f.currentChunk.offset += Ta - Lr;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const u = Ra(s, n);
    if (this.boxWriter.writeBox(u), this.format._options.onMoof) {
      const { data: f, start: g } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(f, g, l);
    }
    T(this.writer.getPos() === o), this.format._options.onMdat && this.writer.startTrackingWrites();
    const h = xn(d);
    h.size = c, this.boxWriter.writeBox(h), this.writer.seek(o + (d ? Ta : Lr));
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
  async registerSampleFastStartReserve(e, s) {
    if (T(this.writer), T(this.boxWriter), this.allTracksAreKnown()) {
      if (!this.mdat) {
        this.ensureOneEnabledTrack();
        const n = Vs(this), i = this.boxWriter.measureBox(n) + this.computeSampleTableSizeUpperBound() + 4096;
        T(this.ftypSize !== null), this.writer.seek(this.ftypSize + i), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = xn(!0), this.boxWriter.writeBox(this.mdat);
        for (const o of this.trackDatas) {
          for (const a of o.sampleQueue)
            await this.addSampleToTrack(o, a);
          o.sampleQueue.length = 0;
        }
      }
      await this.addSampleToTrack(e, s);
    } else
      e.sampleQueue.push(s);
  }
  computeSampleTableSizeUpperBound() {
    T(this.fastStart === "reserve");
    let e = 0;
    for (const s of this.trackDatas) {
      const n = s.track.metadata.maximumPacketCount;
      T(n !== void 0), e += 8 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * Math.ceil(2 / 3 * n), e += 12 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * n;
    }
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async onTrackClose(e) {
    const s = await this.mutex.acquire(), n = this.trackDatas.find((r) => r.track === e);
    n && (n.closed = !0, n.type === "subtitle" && e.source._codec === "webvtt" && await this.processWebVTTCues(n, 1 / 0), this.processTimestamps(n)), this.allTracksAreKnown() && this.allTracksKnown.resolve(), this.isFragmented && await this.interleaveSamples(), s();
  }
  ensureOneEnabledTrack() {
    for (const e of ["video", "audio", "subtitle"]) {
      const s = this.trackDatas.filter((r) => r.type === e);
      if (s.length === 0)
        continue;
      if (!s.some((r) => r.track.metadata.disposition?.default !== !1)) {
        const r = s[0];
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
    for (const s of this.trackDatas)
      s.closed = !0, s.type === "subtitle" && s.track.source._codec === "webvtt" && await this.processWebVTTCues(s, 1 / 0), this.processTimestamps(s);
    if (this.isFragmented)
      await this.interleaveSamples(!0), await this.finalizeFragment(!1);
    else
      for (const s of this.trackDatas) {
        await this.finalizeCurrentChunk(s), T(s.startTimestampOffset !== null);
        for (let n = 0; n < s.samples.length; n++) {
          const r = s.samples[n];
          r.timestamp -= s.startTimestampOffset, r.decodeTimestamp -= s.startTimestampOffset;
        }
      }
    if (T(this.writer), T(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = xn(!1);
      let s;
      for (let r = 0; r < 2; r++) {
        const i = Vs(this), o = this.boxWriter.measureBox(i);
        s = this.boxWriter.measureBox(this.mdat);
        let a = this.writer.getPos() + o + s;
        for (const l of this.finalizedChunks) {
          l.offset = a;
          for (const { data: c } of l.samples)
            T(c), a += c.byteLength, s += c.byteLength;
        }
        if (a < 2 ** 32)
          break;
        s >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const n = Vs(this);
      if (this.boxWriter.writeBox(n), this.format._options.onMoov) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(r, i);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = s, this.boxWriter.writeBox(this.mdat);
      for (const r of this.finalizedChunks)
        for (const i of r.samples)
          T(i.data), this.writer.write(i.data), i.data = null;
      if (this.format._options.onMdat) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(r, i);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const s = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(Ma()), this.boxWriter.writeBox(Ba(this, s));
      } else {
        const s = this.writer.getPos(), n = Gy(this.trackDatas);
        this.boxWriter.writeBox(n);
        const r = this.writer.getPos() - s;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(r);
      }
    else {
      T(this.mdat);
      const s = this.boxWriter.offsets.get(this.mdat);
      T(s !== void 0);
      const n = this.writer.getPos() - s;
      if (this.mdat.size = n, this.mdat.largeSize = n >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: i, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(i, o);
      }
      const r = Vs(this);
      if (this.fastStart === "reserve") {
        T(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(r);
        const i = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(Jg(i));
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
class yo {
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
class Ql extends yo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Bs.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${Bs.join(", ")}.`);
    this._codec = e;
  }
}
const h0 = (t, e) => {
  if (t.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class f0 extends Ql {
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
  add(e, s) {
    if (!(e instanceof Pt))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (s !== void 0 && (!s || typeof s != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), h0(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, s);
  }
}
class Jl extends yo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !tr.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${tr.join(", ")}.`);
    this._codec = e;
  }
}
class p0 extends Jl {
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
  add(e, s) {
    if (!(e instanceof Pt))
      throw new TypeError("packet must be an EncodedPacket.");
    if (e.isMetadataOnly)
      throw new TypeError("Metadata-only packets cannot be added.");
    if (s !== void 0 && (!s || typeof s != "object"))
      throw new TypeError("meta, when provided, must be an object.");
    return this._ensureValidAdd(), this._connectedTrack.output._muxer.addEncodedAudioPacket(this._connectedTrack, e, s);
  }
}
class m0 extends yo {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !nn.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${nn.join(", ")}.`);
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
class ed {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => Bs.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => tr.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => nn.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class wo extends ed {
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
    return new u0(e, this);
  }
}
class td extends wo {
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
      ...Bs,
      ...ho,
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
      ...nn
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new sd().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class Pa extends wo {
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
      ...Bs,
      ...ho,
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
      ...nn
    ];
  }
}
class sd extends wo {
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
      ...Bs,
      ...tr
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new td().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const g0 = ["video", "audio", "subtitle"];
class hn {
  /** @internal */
  constructor(e, s, n, r, i) {
    this.id = e, this.output = s, this.type = n, this.source = r, this.metadata = i;
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
    if (!(e instanceof hn))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const s = wa(this.metadata.group), n = wa(e.metadata.group);
    for (const r of s)
      if (this.type !== e.type && n.some((a) => r === a) || n.some((a) => r._pairedGroups.has(a)))
        return !0;
    return !1;
  }
}
class y0 extends hn {
  /** @internal */
  constructor(e, s, n, r) {
    super(e, s, "video", n, r);
  }
}
class w0 extends hn {
  /** @internal */
  constructor(e, s, n, r) {
    super(e, s, "audio", n, r);
  }
}
class b0 extends hn {
  /** @internal */
  constructor(e, s, n, r) {
    super(e, s, "subtitle", n, r);
  }
}
class on {
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
    if (!(e instanceof on))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const zr = (t) => {
  if (!t || typeof t != "object")
    throw new TypeError("metadata must be an object.");
  if (t.languageCode !== void 0 && !ig(t.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (t.name !== void 0 && typeof t.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (t.disposition !== void 0 && ug(t.disposition), t.maximumPacketCount !== void 0 && (!Number.isInteger(t.maximumPacketCount) || t.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (t.group !== void 0 && !(t.group instanceof on) && (!Array.isArray(t.group) || t.group.some((e) => !(e instanceof on))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class v0 extends uo {
  /**
   * The target to which the root file will be written. Throws when using {@link PathedTarget} with an async callback;
   * prefer the `'target'` event for those cases.
   */
  get target() {
    const e = "Output.target cannot be used when using PathedTarget with an async callback. Use the 'target' event instead.";
    if (this._rootTargetPromise)
      throw new TypeError(e);
    const s = this._getRootTarget();
    if (s instanceof Promise)
      throw new TypeError(e);
    return s;
  }
  /**
   * Creates a new instance of {@link Output} which can then be used to create a new media file according to the
   * specified {@link OutputOptions}.
   */
  constructor(e) {
    if (super(), this.state = "pending", this.defaultTrackGroup = new on(), this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new Ll(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof ed))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof lt || e.target instanceof Hr))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof lt && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof lt) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof lt && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    T(this._target instanceof Hr);
    const s = this._target.getTarget(e), n = (r) => {
      if (!(r instanceof lt))
        throw new TypeError("getTarget must return a Target.");
      return r;
    };
    return s instanceof Promise ? s.then(n) : n(s);
  }
  /** @internal */
  async _getTarget(e) {
    T(this._target instanceof Hr);
    const s = await this._getTargetValidated(e);
    return this._emit("target", { target: s, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await s._close() : this._rememberTarget(s), s;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (T(this._initTarget !== null), this._initTarget instanceof lt)
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
    }, s = this._getTargetValidated(e), n = (r) => (this.state === "canceled" ? r._close() : this._rememberTarget(r), this._emit("target", { target: r, request: e, isRoot: !0 }), this._rootTarget = r, r);
    return s instanceof Promise ? this._rootTargetPromise = s.then(n) : n(s);
  }
  /** @internal */
  _getRootWriter(e) {
    return this._rootWriterPromise ??= (async () => {
      const s = await this._getRootTarget(), n = new Ci(s, typeof e == "boolean" ? e : e(s));
      return n.start(), n;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, s = {}) {
    if (!(e instanceof Ql))
      throw new TypeError("source must be a VideoSource.");
    if (zr(s), s.rotation !== void 0 && ![0, 90, 180, 270].includes(s.rotation))
      throw new TypeError(`Invalid video rotation: ${s.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && s.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (s.frameRate !== void 0 && (!Number.isFinite(s.frameRate) || s.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${s.frameRate}. Must be a positive number.`);
    const n = { ...s };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new y0(this._tracks.length + 1, this, e, n));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, s = {}) {
    if (!(e instanceof Jl))
      throw new TypeError("source must be an AudioSource.");
    zr(s);
    const n = { ...s };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new w0(this._tracks.length + 1, this, e, n));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, s = {}) {
    if (!(e instanceof m0))
      throw new TypeError("source must be a SubtitleSource.");
    zr(s);
    const n = { ...s };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new b0(this._tracks.length + 1, this, e, n));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (dg(e), this.state !== "pending")
      throw new Error("Cannot set metadata tags after output has been started or canceled.");
    this._metadataTags = e;
  }
  /** @internal */
  _addTrack(e) {
    if (this.state !== "pending")
      throw new Error("Cannot add track after output has been started or canceled.");
    if (e.source._connectedTrack)
      throw new Error("Source is already used for a track.");
    const s = this.format.getSupportedTrackCounts(), n = this._tracks.reduce((o, a) => o + (a.type === e.type ? 1 : 0), 0), r = s[e.type].max;
    if (n === r)
      throw new Error(r === 0 ? `${this.format._name} does not support ${e.type} tracks.` : `${this.format._name} does not support more than ${r} ${e.type} track${r === 1 ? "" : "s"}.`);
    const i = s.total.max;
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
    for (const n of g0) {
      const r = this._tracks.reduce((o, a) => o + (a.type === n ? 1 : 0), 0), i = e[n].min;
      if (r < i)
        throw new Error(i === e[n].max ? `${this.format._name} requires exactly ${i} ${n} track${i === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${i} ${n} track${i === 1 ? "" : "s"}.`);
    }
    const s = e.total.min;
    if (this._tracks.length < s)
      throw new Error(s === e.total.max ? `${this.format._name} requires exactly ${s} track${s === 1 ? "" : "s"}.` : `${this.format._name} requires at least ${s} track${s === 1 ? "" : "s"}.`);
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
        const s = this._tracks.map((n) => n.source._flushOrWaitForOngoingClose(!0));
        await Promise.all(s), await Promise.all([...this._unfinalizedTargets].map((n) => n._close())), this._unfinalizedTargets.clear();
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
        const s = this._tracks.map((n) => n.source._flushOrWaitForOngoingClose(!1));
        if (await Promise.all(s), await this._muxer.finalize(), this._rootWriterPromise) {
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
const Fa = 7, Ai = 1.5, La = 3, S0 = 2, _0 = 0.05;
class nd {
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
  observe(e, s = 1) {
    if (this.lastAtMs !== null) {
      const n = Math.max(0, e - this.lastAtMs) / Math.max(1, s);
      if (this.gaps += 1, this.gaps <= Fa)
        this.warmup.push(n), this.ewmaGapMs = x0(this.warmup);
      else if (this.ewmaGapMs !== null && k0(n, this.ewmaGapMs)) {
        const r = Math.max(1 / this.gaps, _0);
        this.ewmaGapMs += r * (n - this.ewmaGapMs);
      }
      this.recent.push(n), this.recent.length > La && this.recent.shift();
    }
    this.lastAtMs = e;
  }
  /** Forget the baseline — a new epoch is a new stream. */
  reset() {
    this.lastAtMs = null, this.gaps = 0, this.warmup = [], this.ewmaGapMs = null, this.recent = [];
  }
  snapshot(e) {
    const s = this.lastAtMs === null ? 0 : Math.max(0, e - this.lastAtMs), n = this.ewmaGapMs ?? 0;
    let r = "ok";
    return this.lastAtMs !== null && s > S0 * Math.max(n, this.chunkMs) ? r = "stalled" : this.established() && this.recent.length >= La && this.recent.every((i) => i > Ai * n) && (r = "slow"), {
      state: r,
      lastGapMs: this.recent.length > 0 ? this.recent[this.recent.length - 1] : 0,
      ewmaGapMs: n,
      sinceLastMs: s
    };
  }
  established() {
    return this.gaps >= Fa;
  }
}
function x0(t) {
  const e = [...t].sort((n, r) => n - r), s = e.length >> 1;
  return e.length % 2 === 1 ? e[s] : (e[s - 1] + e[s]) / 2;
}
function k0(t, e) {
  return t >= e / Ai && t <= e * Ai;
}
const E0 = `
const FRAMES_PER_POST = ${dp};

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
async function T0(t, e, s) {
  const n = new Blob([E0], { type: "application/javascript" }), r = URL.createObjectURL(n);
  try {
    await t.audioWorklet.addModule(r);
  } finally {
    URL.revokeObjectURL(r);
  }
  const i = new AudioWorkletNode(t, "pcm-tap");
  i.port.onmessage = (a) => {
    s(a.data);
  };
  const o = t.createGain();
  return o.gain.value = 0, e.connect(i), i.connect(o), o.connect(t.destination), {
    node: i,
    stop: () => {
      i.port.onmessage = null, e.disconnect(i), i.disconnect(), o.disconnect();
    }
  };
}
const jr = J("media.timer");
function C0() {
  return typeof Worker == "function" && typeof Blob == "function" && typeof URL < "u" && typeof URL.createObjectURL == "function";
}
function rd(t, e) {
  const s = Math.max(1, Math.round(e));
  let n = !1, r = "main", i = null, o = null, a = null, l = !1;
  const c = () => {
    n || t();
  }, d = () => {
    r = "main", i = setInterval(c, s);
  }, u = () => {
    o && (o.onmessage = null, o.onerror = null, o.terminate(), o = null), a && (URL.revokeObjectURL(a), a = null);
  };
  if (C0())
    try {
      const h = `setInterval(() => postMessage(0), ${s});`;
      a = URL.createObjectURL(new Blob([h], { type: "application/javascript" })), o = new Worker(a), o.onmessage = () => {
        l || (l = !0, jr.info("worker timer running", { period: s })), c();
      }, o.onerror = (f) => {
        jr.warn("worker timer failed, falling back to the main-thread interval", {
          err: f.message,
          period: s,
          mode: "main"
        }), u(), n || d();
      }, r = "worker";
    } catch (h) {
      jr.warn("worker timer unavailable, using the main-thread interval", {
        err: h,
        period: s,
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
const Ua = J("media.encoder"), Da = re(5), A0 = 5, M0 = [
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
function B0(t, e) {
  const n = M0.indexOf(t);
  if (n === -1)
    throw new Error(`No AAC frequency index for sample rate ${t}`);
  return new Uint8Array([
    16 | n >> 1,
    (n & 1) << 7 | e << 3
  ]);
}
const I0 = /* @__PURE__ */ new Set(["ftyp", "styp", "moov", "moof", "mdat", "sidx"]);
function R0(t) {
  const e = new DataView(t.buffer, t.byteOffset, t.byteLength);
  let s = 0;
  for (; s + 8 <= t.byteLength; ) {
    let n = e.getUint32(s);
    const r = String.fromCharCode(
      t[s + 4],
      t[s + 5],
      t[s + 6],
      t[s + 7]
    );
    if (n === 1 ? n = Number(e.getBigUint64(s + 8)) : n === 0 && (n = t.byteLength - s), n < 8 || s + n > t.byteLength) break;
    if (!I0.has(r))
      return t.subarray(0, s);
    s += n;
  }
  return t;
}
class O0 {
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
      fps: cp,
      videoBitrate: Sl,
      audioBitrate: _l,
      ...e
    }, this.cadence = new nd(this.opts.chunkMs);
  }
  /** Counters plus the cadence as of now — `stalled` is a reading of the clock. */
  get stats() {
    return { ...this.counters, cadence: this.cadence.snapshot(Date.now()) };
  }
  async start() {
    const { canvas: e, audioContext: s, audioSource: n, codecs: r } = this.opts;
    if (e.width % 2 !== 0 || e.height % 2 !== 0)
      throw new Error(`Canvas dimensions must be even, got ${e.width}x${e.height}`);
    this.videoEncoder = new VideoEncoder({
      output: (a, l) => this.onVideoOutput(a, l),
      error: (a) => this.fail(a)
    }), this.videoEncoder.configure({
      codec: r.videoCodec,
      width: e.width,
      height: e.height,
      bitrate: this.opts.videoBitrate,
      framerate: this.opts.fps,
      latencyMode: "realtime",
      avc: { format: "avc" }
    }), this.audioTap = await T0(
      s,
      n,
      (a) => this.onPcm(a)
    ), this.baseAudioTime = s.currentTime, this.nextBoundaryUs = 0;
    const i = Math.round(1e6 / this.opts.fps), o = () => {
      if (this.stopped || this.failed || !this.videoEncoder) return;
      const a = Math.round((s.currentTime - this.baseAudioTime) * 1e6);
      if (a <= this.lastVideoTsUs) return;
      if (this.videoEncoder.encodeQueueSize > A0) {
        this.counters.framesDropped += 1;
        return;
      }
      const l = a >= this.nextBoundaryUs;
      l && (this.nextBoundaryUs = a + this.opts.chunkMs * 1e3);
      const c = new VideoFrame(e, { timestamp: a, duration: i });
      this.lastVideoTsUs = a, this.counters.framesCaptured += 1;
      try {
        this.videoEncoder.encode(c, { keyFrame: l });
      } finally {
        c.close();
      }
    };
    this.captureTimer = rd(o, 1e3 / this.opts.fps), Ua.info("capture timer started", { timer: this.captureTimer.mode, fps: this.opts.fps }), o();
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
    const s = this.opts.audioContext.sampleRate, n = Math.round(this.audioSamplesSent / s * 1e6);
    this.audioSamplesSent += e.numberOfFrames;
    const r = new AudioData({
      format: "f32-planar",
      sampleRate: s,
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
  onAudioOutput(e, s) {
    s?.decoderConfig && (this.audioDecoderConfig = s.decoderConfig), this.audioQueue.push(e), this.lastAudioEndTsUs = e.timestamp + (e.duration ?? 0), this.drainPendingGroups();
  }
  // ── Video path + chunk assembly ───────────────────────────────────────────
  onVideoOutput(e, s) {
    if (s?.decoderConfig && (this.videoDecoderConfig = s.decoderConfig), e.type === "key" && this.currentGroup && this.currentGroup.video.length > 0 && (this.currentGroup.endTsUs = e.timestamp, this.pendingGroups.push(this.currentGroup), this.currentGroup = null), !this.currentGroup) {
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
      const e = this.pendingGroups[0], s = e.endTsUs;
      if (s === null || !(this.audioFlushed || this.audioEncoder === null || this.lastAudioEndTsUs >= s)) return;
      this.pendingGroups.shift();
      const r = [];
      for (; this.audioQueue.length > 0 && this.audioQueue[0].timestamp < s; )
        r.push(this.audioQueue.shift());
      if (r.length === 0 && this.lastAudioPacket === null && this.audioEncoder !== null) {
        Da.allow() && Ua.warn("dropping leading chunk: audio has not started yet", {
          drops: Da.count()
        });
        continue;
      }
      const i = this.seq++;
      this.muxSerial = this.muxSerial.then(() => this.muxGroup(i, e, r)).catch((o) => this.fail(o));
    }
  }
  async muxGroup(e, s, n) {
    if (this.failed) return;
    const r = s.endTsUs, i = new v0({
      format: new td({ fastStart: "fragmented", minimumFragmentDuration: 3600 }),
      target: new Rn()
    }), o = new f0("avc");
    i.addVideoTrack(o);
    const a = n.length === 0 ? this.lastAudioPacket : null;
    let l = null;
    if ((n.length > 0 || a) && (l = new p0(this.opts.codecs.muxAudioCodec), i.addAudioTrack(l)), await i.start(), !this.videoDecoderConfig)
      throw new Error("Video decoder config missing before first chunk");
    for (let u = 0; u < s.video.length; u++)
      await o.add(
        Pt.fromEncodedChunk(s.video[u]),
        u === 0 ? { decoderConfig: this.videoDecoderConfig } : void 0
      );
    if (l) {
      let u = this.audioDecoderConfig ?? {
        codec: this.opts.codecs.audioCodec,
        sampleRate: this.opts.audioContext.sampleRate,
        numberOfChannels: this.audioChannels
      };
      if (this.opts.codecs.muxAudioCodec === "aac" && (u = {
        ...u,
        description: B0(
          this.opts.audioContext.sampleRate,
          this.audioChannels
        )
      }), a) {
        for (let h = s.startTsUs, f = !0; h < r; h += a.durUs)
          await l.add(
            new Pt(a.data, "key", h / 1e6, a.durUs / 1e6),
            f ? { decoderConfig: u } : void 0
          ), f = !1;
        this.counters.audioPaddedChunks += 1;
      } else {
        for (let m = 0; m < n.length; m++)
          await l.add(
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
    const c = i.target.buffer;
    if (!c)
      throw new Error(`Muxer produced no output for chunk ${e}`);
    const d = {
      seq: e,
      tsUs: s.startTsUs,
      durUs: r - s.startTsUs,
      payload: R0(new Uint8Array(c))
    };
    this.counters.chunksEmitted += 1, this.counters.lastChunkBytes = d.payload.byteLength, this.cadence.observe(Date.now()), this.opts.onChunk(d);
  }
}
const P0 = {}, Na = J("ice");
function id(t) {
  const e = P0 ?? {};
  return {
    VITE_TURN_ISSUER_URL: e.VITE_TURN_ISSUER_URL ?? "",
    VITE_TURN_URL: e.VITE_TURN_URL ?? "",
    VITE_TURN_USER: e.VITE_TURN_USER ?? "",
    VITE_TURN_PASS: e.VITE_TURN_PASS ?? "",
    VITE_DISABLE_STUN: e.VITE_DISABLE_STUN ?? "",
    VITE_DISABLE_TURN: e.VITE_DISABLE_TURN ?? ""
  };
}
const F0 = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" }
], L0 = 5e3, U0 = 10 * 6e4, D0 = 6e4;
let ks = null, Hs = null, $a = 0;
function N0(t, e) {
  if (!t || typeof t != "object") return null;
  const { iceServers: s, ttl: n } = t;
  if (!Array.isArray(s) || typeof n != "number" || n <= 0) return null;
  const r = s.filter(
    (i) => !!i && typeof i == "object" && typeof i.username == "string" && typeof i.credential == "string" && [i.urls].flat().some((o) => typeof o == "string" && /^turns?:/.test(o))
  );
  return r.length === 0 ? null : { servers: r, expiresAt: e + n * 1e3 };
}
function $0(t) {
  return t.VITE_DISABLE_TURN !== "1" && !t.VITE_TURN_URL && !!t.VITE_TURN_ISSUER_URL;
}
function Va(t) {
  const e = id();
  if (!$0(e)) return Promise.resolve();
  const s = Date.now();
  return ks && s < ks.expiresAt - U0 ? Promise.resolve() : Hs || (s - $a < D0 ? Promise.resolve() : (Hs = (async () => {
    try {
      const n = await fetch(e.VITE_TURN_ISSUER_URL, {
        signal: AbortSignal.timeout(L0),
        cache: "no-store"
      });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const r = N0(await n.json(), Date.now());
      if (!r) throw new Error("bad response shape");
      ks = r, Na.info("turn credentials issued", {
        servers: r.servers.length,
        expiresInS: Math.round((r.expiresAt - Date.now()) / 1e3)
      });
    } catch (n) {
      $a = Date.now(), Na.warn("turn issuer failed, using STUN only", {
        url: e.VITE_TURN_ISSUER_URL,
        error: n instanceof Error ? n.message : String(n)
      });
    } finally {
      Hs = null;
    }
  })(), Hs));
}
const V0 = "spotlight.iceRelayOnly";
function H0() {
  try {
    return localStorage.getItem(V0) === "1";
  } catch {
    return !1;
  }
}
function z0(t) {
  const {
    VITE_TURN_ISSUER_URL: e,
    VITE_TURN_URL: s,
    VITE_TURN_USER: n,
    VITE_TURN_PASS: r,
    VITE_DISABLE_STUN: i,
    VITE_DISABLE_TURN: o
  } = id(), a = i === "1" ? [] : [...F0], l = [s, n, r].filter(Boolean).length;
  if (l > 0 && l < 3)
    throw new Error(
      "Incomplete TURN config: set VITE_TURN_URL, VITE_TURN_USER, and VITE_TURN_PASS together."
    );
  return o === "1" || (s && n && r ? a.push({
    urls: s,
    username: n,
    credential: r
  }) : e && ks && Date.now() < ks.expiresAt ? (a.push(...ks.servers), Va()) : e && Va()), a;
}
const j0 = /* @__PURE__ */ Uint32Array.from([
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
class q0 extends jc {
  constructor(e) {
    super(64, e, 8, !1);
  }
  get() {
    const { A: e, B: s, C: n, D: r, E: i, F: o, G: a, H: l } = this;
    return [e, s, n, r, i, o, a, l];
  }
  // prettier-ignore
  set(e, s, n, r, i, o, a, l) {
    this.A = e | 0, this.B = s | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, s) {
    for (let u = 0; u < 16; u++, s += 4)
      _t[u] = e.getUint32(s, !1);
    for (let u = 16; u < 64; u++) {
      const h = _t[u - 15], f = _t[u - 2], g = qe(h, 7) ^ qe(h, 18) ^ h >>> 3, m = qe(f, 17) ^ qe(f, 19) ^ f >>> 10;
      _t[u] = m + _t[u - 7] + g + _t[u - 16] | 0;
    }
    let { A: n, B: r, C: i, D: o, E: a, F: l, G: c, H: d } = this;
    for (let u = 0; u < 64; u++) {
      const h = qe(a, 6) ^ qe(a, 11) ^ qe(a, 25), f = d + h + zu(a, l, c) + j0[u] + _t[u] | 0, m = (qe(n, 2) ^ qe(n, 13) ^ qe(n, 22)) + ju(n, r, i) | 0;
      d = c, c = l, l = a, a = o + f | 0, o = i, i = r, r = n, n = f + m | 0;
    }
    n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, c = c + this.G | 0, d = d + this.H | 0, this.set(n, r, i, o, a, l, c, d);
  }
  roundClean() {
    tt(_t);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), tt(this.buffer);
  }
}
class W0 extends q0 {
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
const od = qu([
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
].map((t) => BigInt(t))), G0 = od[0], Z0 = od[1], xt = /* @__PURE__ */ new Uint32Array(80), kt = /* @__PURE__ */ new Uint32Array(80);
class K0 extends jc {
  constructor(e) {
    super(128, e, 16, !1);
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: s, Bh: n, Bl: r, Ch: i, Cl: o, Dh: a, Dl: l, Eh: c, El: d, Fh: u, Fl: h, Gh: f, Gl: g, Hh: m, Hl: p } = this;
    return [e, s, n, r, i, o, a, l, c, d, u, h, f, g, m, p];
  }
  // prettier-ignore
  set(e, s, n, r, i, o, a, l, c, d, u, h, f, g, m, p) {
    this.Ah = e | 0, this.Al = s | 0, this.Bh = n | 0, this.Bl = r | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = c | 0, this.El = d | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = f | 0, this.Gl = g | 0, this.Hh = m | 0, this.Hl = p | 0;
  }
  process(e, s) {
    for (let w = 0; w < 16; w++, s += 4)
      xt[w] = e.getUint32(s), kt[w] = e.getUint32(s += 4);
    for (let w = 16; w < 80; w++) {
      const S = xt[w - 15] | 0, P = kt[w - 15] | 0, j = At(S, P, 1) ^ At(S, P, 8) ^ Lo(S, P, 7), D = Mt(S, P, 1) ^ Mt(S, P, 8) ^ Uo(S, P, 7), q = xt[w - 2] | 0, N = kt[w - 2] | 0, ne = At(q, N, 19) ^ js(q, N, 61) ^ Lo(q, N, 6), Y = Mt(q, N, 19) ^ qs(q, N, 61) ^ Uo(q, N, 6), k = Zu(D, Y, kt[w - 7], kt[w - 16]), I = Ku(k, j, ne, xt[w - 7], xt[w - 16]);
      xt[w] = I | 0, kt[w] = k | 0;
    }
    let { Ah: n, Al: r, Bh: i, Bl: o, Ch: a, Cl: l, Dh: c, Dl: d, Eh: u, El: h, Fh: f, Fl: g, Gh: m, Gl: p, Hh: v, Hl: y } = this;
    for (let w = 0; w < 80; w++) {
      const S = At(u, h, 14) ^ At(u, h, 18) ^ js(u, h, 41), P = Mt(u, h, 14) ^ Mt(u, h, 18) ^ qs(u, h, 41), j = u & f ^ ~u & m, D = h & g ^ ~h & p, q = Xu(y, P, D, Z0[w], kt[w]), N = Yu(q, v, S, j, G0[w], xt[w]), ne = q | 0, Y = At(n, r, 28) ^ js(n, r, 34) ^ js(n, r, 39), k = Mt(n, r, 28) ^ qs(n, r, 34) ^ qs(n, r, 39), I = n & i ^ n & a ^ i & a, M = r & o ^ r & l ^ o & l;
      v = m | 0, y = p | 0, m = f | 0, p = g | 0, f = u | 0, g = h | 0, { h: u, l: h } = $e(c | 0, d | 0, N | 0, ne | 0), c = a | 0, d = l | 0, a = i | 0, l = o | 0, i = n | 0, o = r | 0;
      const F = Gi(ne, k, M);
      n = Zi(F, N, Y, I), r = F | 0;
    }
    ({ h: n, l: r } = $e(this.Ah | 0, this.Al | 0, n | 0, r | 0)), { h: i, l: o } = $e(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l } = $e(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: c, l: d } = $e(this.Dh | 0, this.Dl | 0, c | 0, d | 0), { h: u, l: h } = $e(this.Eh | 0, this.El | 0, u | 0, h | 0), { h: f, l: g } = $e(this.Fh | 0, this.Fl | 0, f | 0, g | 0), { h: m, l: p } = $e(this.Gh | 0, this.Gl | 0, m | 0, p | 0), { h: v, l: y } = $e(this.Hh | 0, this.Hl | 0, v | 0, y | 0), this.set(n, r, i, o, a, l, c, d, u, h, f, g, m, p, v, y);
  }
  roundClean() {
    tt(xt, kt);
  }
  destroy() {
    this.destroyed = !0, tt(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class X0 extends K0 {
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
const Y0 = /* @__PURE__ */ Wi(
  () => new W0(),
  /* @__PURE__ */ zc(1)
), Q0 = /* @__PURE__ */ Wi(
  () => new X0(),
  /* @__PURE__ */ zc(3)
);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _e = (t, e, s) => Ce(t, e, s), ad = mt, cd = He, Ha = (...t) => $u(...t), J0 = (t) => Ie(t), ew = Nc, ld = (t) => Vu(t), sr = /* @__PURE__ */ BigInt(0), Mi = /* @__PURE__ */ BigInt(1);
function nr(t, e = "") {
  if (typeof t != "boolean") {
    const s = e && `"${e}" `;
    throw new TypeError(s + "expected boolean, got type=" + typeof t);
  }
  return t;
}
function tw(t) {
  if (typeof t == "bigint") {
    if (!On(t))
      throw new RangeError("positive bigint expected, got " + t);
  } else
    ad(t);
  return t;
}
function Bi(t, e = "") {
  if (typeof t != "number") {
    const s = e && `"${e}" `;
    throw new TypeError(s + "expected number, got type=" + typeof t);
  }
  if (!Number.isSafeInteger(t)) {
    const s = e && `"${e}" `;
    throw new RangeError(s + "expected safe integer, got " + t);
  }
}
function dd(t) {
  if (typeof t != "string")
    throw new TypeError("hex string expected, got " + typeof t);
  return t === "" ? sr : BigInt("0x" + t);
}
function sw(t) {
  return dd(He(t));
}
function ns(t) {
  return dd(He(an(Ce(t)).reverse()));
}
function ud(t, e) {
  if (mt(e), e === 0)
    throw new RangeError("zero length");
  t = tw(t);
  const s = t.toString(16);
  if (s.length > e * 2)
    throw new RangeError("number too large");
  return Ie(s.padStart(e * 2, "0"));
}
function hd(t, e) {
  return ud(t, e).reverse();
}
function nw(t, e) {
  if (t = _e(t), e = _e(e), t.length !== e.length)
    return !1;
  let s = 0;
  for (let n = 0; n < t.length; n++)
    s |= t[n] ^ e[n];
  return s === 0;
}
function an(t) {
  return Uint8Array.from(_e(t));
}
const On = (t) => typeof t == "bigint" && sr <= t;
function rw(t, e, s) {
  return On(t) && On(e) && On(s) && e <= t && t < s;
}
function rr(t, e, s, n) {
  if (!rw(e, s, n))
    throw new RangeError("expected valid " + t + ": " + s + " <= n < " + n + ", got " + e);
}
function iw(t) {
  if (t < sr)
    throw new Error("expected non-negative bigint, got " + t);
  let e;
  for (e = 0; t > sr; t >>= Mi, e += 1)
    ;
  return e;
}
const ow = (t) => (Mi << BigInt(t)) - Mi;
function wr(t, e = {}, s = {}) {
  if (Object.prototype.toString.call(t) !== "[object Object]")
    throw new TypeError("expected valid options object");
  function n(i, o, a) {
    if (!a && o !== "function" && !Object.hasOwn(t, i))
      throw new TypeError(`param "${i}" is invalid: expected own property`);
    const l = t[i];
    if (a && l === void 0)
      return;
    const c = typeof l;
    if (c !== o || l === null)
      throw new TypeError(`param "${i}" is invalid: expected ${o}, got ${c}`);
  }
  const r = (i, o) => Object.entries(i).forEach(([a, l]) => n(a, l, o));
  r(e, !1), r(s, !0);
}
const za = () => {
  throw new Error("not implemented");
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Te = /* @__PURE__ */ BigInt(0), ke = /* @__PURE__ */ BigInt(1), Gt = /* @__PURE__ */ BigInt(2), fd = /* @__PURE__ */ BigInt(3), pd = /* @__PURE__ */ BigInt(4), md = /* @__PURE__ */ BigInt(5), aw = /* @__PURE__ */ BigInt(7), gd = /* @__PURE__ */ BigInt(8), cw = /* @__PURE__ */ BigInt(9), yd = /* @__PURE__ */ BigInt(16);
function fe(t, e) {
  if (e <= Te)
    throw new Error("mod: expected positive modulus, got " + e);
  const s = t % e;
  return s >= Te ? s : e + s;
}
function Ne(t, e, s) {
  if (e < Te)
    throw new Error("pow2: expected non-negative exponent, got " + e);
  let n = t;
  for (; e-- > Te; )
    n *= n, n %= s;
  return n;
}
function ja(t, e) {
  if (t === Te)
    throw new Error("invert: expected non-zero number");
  if (e <= Te)
    throw new Error("invert: expected positive modulus, got " + e);
  let s = fe(t, e), n = e, r = Te, i = ke;
  for (; s !== Te; ) {
    const a = n / s, l = n - s * a, c = r - i * a;
    n = s, s = l, r = i, i = c;
  }
  if (n !== ke)
    throw new Error("invert: does not exist");
  return fe(r, e);
}
function bo(t, e, s) {
  const n = t;
  if (!n.eql(n.sqr(e), s))
    throw new Error("Cannot find square root");
}
function wd(t, e) {
  const s = t, n = (s.ORDER + ke) / pd, r = s.pow(e, n);
  return bo(s, r, e), r;
}
function lw(t, e) {
  const s = t, n = (s.ORDER - md) / gd, r = s.mul(e, Gt), i = s.pow(r, n), o = s.mul(e, i), a = s.mul(s.mul(o, Gt), i), l = s.mul(o, s.sub(a, s.ONE));
  return bo(s, l, e), l;
}
function dw(t) {
  const e = vo(t), s = bd(t), n = s(e, e.neg(e.ONE)), r = s(e, n), i = s(e, e.neg(n)), o = (t + aw) / yd;
  return ((a, l) => {
    const c = a;
    let d = c.pow(l, o), u = c.mul(d, n);
    const h = c.mul(d, r), f = c.mul(d, i), g = c.eql(c.sqr(u), l), m = c.eql(c.sqr(h), l);
    d = c.cmov(d, u, g), u = c.cmov(f, h, m);
    const p = c.eql(c.sqr(u), l), v = c.cmov(d, u, p);
    return bo(c, v, l), v;
  });
}
function bd(t) {
  if (t < fd)
    throw new Error("sqrt is not defined for small field");
  let e = t - ke, s = 0;
  for (; e % Gt === Te; )
    e /= Gt, s++;
  let n = Gt;
  const r = vo(t);
  for (; qa(r, n) === 1; )
    if (n++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (s === 1)
    return wd;
  let i = r.pow(n, e);
  const o = (e + ke) / Gt;
  return function(l, c) {
    const d = l;
    if (d.is0(c))
      return c;
    if (qa(d, c) !== 1)
      throw new Error("Cannot find square root");
    let u = s, h = d.mul(d.ONE, i), f = d.pow(c, e), g = d.pow(c, o);
    for (; !d.eql(f, d.ONE); ) {
      if (d.is0(f))
        return d.ZERO;
      let m = 1, p = d.sqr(f);
      for (; !d.eql(p, d.ONE); )
        if (m++, p = d.sqr(p), m === u)
          throw new Error("Cannot find square root");
      const v = ke << BigInt(u - m - 1), y = d.pow(h, v);
      u = m, h = d.sqr(y), f = d.mul(f, h), g = d.mul(g, y);
    }
    return g;
  };
}
function uw(t) {
  return t % pd === fd ? wd : t % gd === md ? lw : t % yd === cw ? dw(t) : bd(t);
}
const zt = (t, e) => (fe(t, e) & ke) === ke, hw = [
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
function fw(t) {
  const e = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, s = hw.reduce((n, r) => (n[r] = "function", n), e);
  if (wr(t, s), Bi(t.BYTES, "BYTES"), Bi(t.BITS, "BITS"), t.BYTES < 1 || t.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (t.ORDER <= ke)
    throw new Error("invalid field: expected ORDER > 1, got " + t.ORDER);
  return t;
}
function pw(t, e, s) {
  const n = t;
  if (s < Te)
    throw new Error("invalid exponent, negatives unsupported");
  if (s === Te)
    return n.ONE;
  if (s === ke)
    return e;
  let r = n.ONE, i = e;
  for (; s > Te; )
    s & ke && (r = n.mul(r, i)), i = n.sqr(i), s >>= ke;
  return r;
}
function vd(t, e, s = !1) {
  const n = t, r = new Array(e.length).fill(s ? n.ZERO : void 0), i = e.reduce((a, l, c) => n.is0(l) ? a : (r[c] = a, n.mul(a, l)), n.ONE), o = n.inv(i);
  return e.reduceRight((a, l, c) => n.is0(l) ? a : (r[c] = n.mul(a, r[c]), n.mul(a, l)), o), r;
}
function qa(t, e) {
  const s = t, n = (s.ORDER - ke) / Gt, r = s.pow(e, n), i = s.eql(r, s.ONE), o = s.eql(r, s.ZERO), a = s.eql(r, s.neg(s.ONE));
  if (!i && !o && !a)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function mw(t, e) {
  if (e !== void 0 && ad(e), t <= Te)
    throw new Error("invalid n length: expected positive n, got " + t);
  if (e !== void 0 && e < 1)
    throw new Error("invalid n length: expected positive bit length, got " + e);
  const s = iw(t);
  if (e !== void 0 && e < s)
    throw new Error(`invalid n length: expected bit length (${s}) >= n.length (${e})`);
  const n = e !== void 0 ? e : s, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
const Wa = /* @__PURE__ */ new WeakMap();
class Sd {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = Te;
  ONE = ke;
  _lengths;
  _mod;
  constructor(e, s = {}) {
    if (e <= ke)
      throw new Error("invalid field: expected ORDER > 1, got " + e);
    let n;
    this.isLE = !1, s != null && typeof s == "object" && (typeof s.BITS == "number" && (n = s.BITS), typeof s.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: s.sqrt, enumerable: !0 }), typeof s.isLE == "boolean" && (this.isLE = s.isLE), s.allowedLengths && (this._lengths = Object.freeze(s.allowedLengths.slice())), typeof s.modFromBytes == "boolean" && (this._mod = s.modFromBytes));
    const { nBitLength: r, nByteLength: i } = mw(e, n);
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
  eql(e, s) {
    return e === s;
  }
  sqr(e) {
    return fe(e * e, this.ORDER);
  }
  add(e, s) {
    return fe(e + s, this.ORDER);
  }
  sub(e, s) {
    return fe(e - s, this.ORDER);
  }
  mul(e, s) {
    return fe(e * s, this.ORDER);
  }
  pow(e, s) {
    return pw(this, e, s);
  }
  div(e, s) {
    return fe(e * ja(s, this.ORDER), this.ORDER);
  }
  // Same as above, but doesn't normalize
  sqrN(e) {
    return e * e;
  }
  addN(e, s) {
    return e + s;
  }
  subN(e, s) {
    return e - s;
  }
  mulN(e, s) {
    return e * s;
  }
  inv(e) {
    return ja(e, this.ORDER);
  }
  sqrt(e) {
    let s = Wa.get(this);
    return s || Wa.set(this, s = uw(this.ORDER)), s(this, e);
  }
  toBytes(e) {
    return this.isLE ? hd(e, this.BYTES) : ud(e, this.BYTES);
  }
  fromBytes(e, s = !1) {
    _e(e);
    const { _lengths: n, BYTES: r, isLE: i, ORDER: o, _mod: a } = this;
    if (n) {
      if (e.length < 1 || !n.includes(e.length) || e.length > r)
        throw new Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
      const c = new Uint8Array(r);
      c.set(e, i ? 0 : c.length - e.length), e = c;
    }
    if (e.length !== r)
      throw new Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
    let l = i ? ns(e) : sw(e);
    if (a && (l = fe(l, o)), !s && !this.isValid(l))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return l;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(e) {
    return vd(this, e);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(e, s, n) {
    return nr(n, "condition"), n ? s : e;
  }
}
Object.freeze(Sd.prototype);
function vo(t, e = {}) {
  return new Sd(t, e);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ir = /* @__PURE__ */ BigInt(0), Ii = /* @__PURE__ */ BigInt(1);
function Ga(t, e) {
  const s = e.negate();
  return t ? s : e;
}
function qr(t, e) {
  const s = vd(t.Fp, e.map((n) => n.Z));
  return e.map((n, r) => t.fromAffine(n.toAffine(s[r])));
}
function _d(t, e) {
  if (!Number.isSafeInteger(t) || t <= 0 || t > e)
    throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function Wr(t, e) {
  _d(t, e);
  const s = Math.ceil(e / t) + 1, n = 2 ** (t - 1), r = 2 ** t, i = ow(t), o = BigInt(t);
  return { windows: s, windowSize: n, mask: i, maxNumber: r, shiftBy: o };
}
function Za(t, e, s) {
  const { windowSize: n, mask: r, maxNumber: i, shiftBy: o } = s;
  let a = Number(t & r), l = t >> o;
  a > n && (a -= i, l += Ii);
  const c = e * n, d = c + Math.abs(a) - 1, u = a === 0, h = a < 0, f = e % 2 !== 0;
  return { nextN: l, offset: d, isZero: u, isNeg: h, isNegF: f, offsetF: c };
}
const Gr = /* @__PURE__ */ new WeakMap(), xd = /* @__PURE__ */ new WeakMap();
function Zr(t) {
  return xd.get(t) || 1;
}
function Ka(t) {
  if (t !== ir)
    throw new Error("invalid wNAF");
}
class gw {
  BASE;
  ZERO;
  Fn;
  bits;
  // Parametrized with a given Point class (not individual point)
  constructor(e, s) {
    this.BASE = e.BASE, this.ZERO = e.ZERO, this.Fn = e.Fn, this.bits = s;
  }
  // non-const time multiplication ladder
  _unsafeLadder(e, s, n = this.ZERO) {
    let r = e;
    for (; s > ir; )
      s & Ii && (n = n.add(r)), r = r.double(), s >>= Ii;
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
  precomputeWindow(e, s) {
    const { windows: n, windowSize: r } = Wr(s, this.bits), i = [];
    let o = e, a = o;
    for (let l = 0; l < n; l++) {
      a = o, i.push(a);
      for (let c = 1; c < r; c++)
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
  wNAF(e, s, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let r = this.ZERO, i = this.BASE;
    const o = Wr(e, this.bits);
    for (let a = 0; a < o.windows; a++) {
      const { nextN: l, offset: c, isZero: d, isNeg: u, isNegF: h, offsetF: f } = Za(n, a, o);
      n = l, d ? i = i.add(Ga(h, s[f])) : r = r.add(Ga(u, s[c]));
    }
    return Ka(n), { p: r, f: i };
  }
  /**
   * Implements unsafe EC multiplication using precomputed tables
   * and w-ary non-adjacent form.
   * @param acc - accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(e, s, n, r = this.ZERO) {
    const i = Wr(e, this.bits);
    for (let o = 0; o < i.windows && n !== ir; o++) {
      const { nextN: a, offset: l, isZero: c, isNeg: d } = Za(n, o, i);
      if (n = a, !c) {
        const u = s[l];
        r = r.add(d ? u.negate() : u);
      }
    }
    return Ka(n), r;
  }
  getPrecomputes(e, s, n) {
    let r = Gr.get(s);
    return r || (r = this.precomputeWindow(s, e), e !== 1 && (typeof n == "function" && (r = n(r)), Gr.set(s, r))), r;
  }
  cached(e, s, n) {
    const r = Zr(e);
    return this.wNAF(r, this.getPrecomputes(r, e, n), s);
  }
  unsafe(e, s, n, r) {
    const i = Zr(e);
    return i === 1 ? this._unsafeLadder(e, s, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), s, r);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(e, s) {
    _d(s, this.bits), xd.set(e, s), Gr.delete(e);
  }
  hasCache(e) {
    return Zr(e) !== 1;
  }
}
function Xa(t, e, s) {
  if (e) {
    if (e.ORDER !== t)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return fw(e), e;
  } else
    return vo(t, { isLE: s });
}
function yw(t, e, s = {}, n) {
  if (n === void 0 && (n = t === "edwards"), !e || typeof e != "object")
    throw new Error(`expected valid ${t} CURVE object`);
  for (const l of ["p", "n", "h"]) {
    const c = e[l];
    if (!(typeof c == "bigint" && c > ir))
      throw new Error(`CURVE.${l} must be positive bigint`);
  }
  const r = Xa(e.p, s.Fp, n), i = Xa(e.n, s.Fn, n), a = ["Gx", "Gy", "a", "d"];
  for (const l of a)
    if (!r.isValid(e[l]))
      throw new Error(`CURVE.${l} must be valid field element of CURVE.Fp`);
  return e = Object.freeze(Object.assign({}, e)), { CURVE: e, Fp: r, Fn: i };
}
function kd(t, e) {
  return function(n) {
    const r = t(n);
    return { secretKey: r, publicKey: e(r) };
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Et = /* @__PURE__ */ BigInt(0), ve = /* @__PURE__ */ BigInt(1), Kr = /* @__PURE__ */ BigInt(2), ww = /* @__PURE__ */ BigInt(8);
function bw(t, e, s, n) {
  const r = t.sqr(s), i = t.sqr(n), o = t.add(t.mul(e.a, r), i), a = t.add(t.ONE, t.mul(e.d, t.mul(r, i)));
  return t.eql(o, a);
}
function vw(t, e = {}) {
  const s = e, n = yw("edwards", t, s, s.FpFnLE), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: a } = o;
  wr(s, {}, { uvRatio: "function" });
  const l = Kr << BigInt(i.BYTES * 8) - ve, c = (m) => r.create(m), d = s.uvRatio === void 0 ? (m, p) => {
    try {
      return { isValid: !0, value: r.sqrt(r.div(m, p)) };
    } catch {
      return { isValid: !1, value: Et };
    }
  } : s.uvRatio;
  if (!bw(r, o, o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  function u(m, p, v = !1) {
    const y = v ? ve : Et;
    return rr("coordinate " + m, p, y, l), p;
  }
  function h(m) {
    if (!(m instanceof f))
      throw new Error("EdwardsPoint expected");
  }
  class f {
    // base / generator point
    static BASE = new f(o.Gx, o.Gy, ve, c(o.Gx * o.Gy));
    // zero / infinity / identity point
    static ZERO = new f(Et, ve, ve, Et);
    // 0, 1, 1, 0
    // math field
    static Fp = r;
    // scalar field
    static Fn = i;
    X;
    Y;
    Z;
    T;
    constructor(p, v, y, w) {
      this.X = u("x", p), this.Y = u("y", v), this.Z = u("z", y, !0), this.T = u("t", w), Object.freeze(this);
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
      const { x: v, y } = p || {};
      return u("x", v), u("y", y), new f(v, y, ve, c(v * y));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(p, v = !1) {
      const y = r.BYTES, { a: w, d: S } = o;
      p = an(_e(p, y, "point")), nr(v, "zip215");
      const P = an(p), j = p[y - 1];
      P[y - 1] = j & -129;
      const D = ns(P), q = v ? l : r.ORDER;
      rr("point.y", D, Et, q);
      const N = c(D * D), ne = c(N - ve), Y = c(S * N - w);
      let { isValid: k, value: I } = d(ne, Y);
      if (!k)
        throw new Error("bad point: invalid y coordinate");
      const M = (I & ve) === ve, F = (j & 128) !== 0;
      if (!v && I === Et && F)
        throw new Error("bad point: x=0 and x_0=1");
      return F !== M && (I = c(-I)), f.fromAffine({ x: I, y: D });
    }
    static fromHex(p, v = !1) {
      return f.fromBytes(J0(p), v);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(p = 8, v = !0) {
      return g.createCache(this, p), v || this.multiply(Kr), this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this, { a: v, d: y } = o;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X: w, Y: S, Z: P, T: j } = p, D = c(w * w), q = c(S * S), N = c(P * P), ne = c(N * N), Y = c(D * v), k = c(N * c(Y + q)), I = c(ne + c(y * c(D * q)));
      if (k !== I)
        throw new Error("bad point: equation left != right (1)");
      const M = c(w * S), F = c(P * j);
      if (M !== F)
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(p) {
      h(p);
      const { X: v, Y: y, Z: w } = this, { X: S, Y: P, Z: j } = p, D = c(v * j), q = c(S * w), N = c(y * j), ne = c(P * w);
      return D === q && N === ne;
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
      const { a: p } = o, { X: v, Y: y, Z: w } = this, S = c(v * v), P = c(y * y), j = c(Kr * c(w * w)), D = c(p * S), q = v + y, N = c(c(q * q) - S - P), ne = D + P, Y = ne - j, k = D - P, I = c(N * Y), M = c(ne * k), F = c(N * k), $ = c(Y * ne);
      return new f(I, M, $, F);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(p) {
      h(p);
      const { a: v, d: y } = o, { X: w, Y: S, Z: P, T: j } = this, { X: D, Y: q, Z: N, T: ne } = p, Y = c(w * D), k = c(S * q), I = c(j * y * ne), M = c(P * N), F = c((w + S) * (D + q) - Y - k), $ = M - I, Z = M + I, U = c(k - v * Y), te = c(F * $), pe = c(Z * U), Me = c(F * U), Be = c($ * Z);
      return new f(te, pe, Be, Me);
    }
    subtract(p) {
      return h(p), this.add(p.negate());
    }
    // Constant-time multiplication.
    multiply(p) {
      if (!i.isValidNot0(p))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p: v, f: y } = g.cached(this, p, (w) => qr(f, w));
      return qr(f, [v, y])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(p) {
      if (!i.isValid(p))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      return p === Et ? f.ZERO : this.is0() || p === ve ? this : g.unsafe(this, p, (v) => qr(f, v));
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
      const v = this;
      let y = p;
      const { X: w, Y: S, Z: P } = v, j = v.is0();
      y == null && (y = j ? ww : r.inv(P));
      const D = c(w * y), q = c(S * y), N = r.mul(P, y);
      if (j)
        return { x: Et, y: ve };
      if (N !== ve)
        throw new Error("invZ was invalid");
      return { x: D, y: q };
    }
    clearCofactor() {
      return a === ve ? this : this.multiplyUnsafe(a);
    }
    toBytes() {
      const { x: p, y: v } = this.toAffine(), y = r.toBytes(v);
      return y[y.length - 1] |= p & ve ? 128 : 0, y;
    }
    toHex() {
      return cd(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const g = new gw(f, i.BITS);
  return i.BITS >= 8 && f.BASE.precompute(8), Object.freeze(f.prototype), Object.freeze(f), f;
}
class Sw {
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
    za();
  }
  static fromHex(e) {
    za();
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
    return cd(this.toBytes());
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
  precompute(e, s) {
    return this.ep.precompute(e, s), this;
  }
}
function _w(t, e, s = {}) {
  if (typeof e != "function")
    throw new Error('"hash" function param is required');
  const n = e, r = s;
  wr(r, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    zip215: "boolean",
    mapToCurve: "function"
  });
  const { prehash: i } = r, { BASE: o, Fp: a, Fn: l } = t, c = n.outputLen, d = 2 * a.BYTES;
  if (c !== void 0 && (Bi(c, "hash.outputLen"), c !== d))
    throw new Error(`hash.outputLen must be ${d}, got ${c}`);
  const u = r.randomBytes === void 0 ? ld : r.randomBytes, h = r.adjustScalarBytes === void 0 ? (k) => k : r.adjustScalarBytes, f = r.domain === void 0 ? (k, I, M) => {
    if (nr(M, "phflag"), I.length || M)
      throw new Error("Contexts/pre-hash are not supported");
    return k;
  } : r.domain;
  function g(k) {
    return l.create(ns(k));
  }
  function m(k) {
    const I = D.secretKey;
    _e(k, D.secretKey, "secretKey");
    const M = _e(n(k), 2 * I, "hashedSecretKey"), F = h(M.slice(0, I)), $ = M.slice(I, 2 * I), Z = g(F);
    return { head: F, prefix: $, scalar: Z };
  }
  function p(k) {
    const { head: I, prefix: M, scalar: F } = m(k), $ = o.multiply(F), Z = $.toBytes();
    return { head: I, prefix: M, scalar: F, point: $, pointBytes: Z };
  }
  function v(k) {
    return p(k).pointBytes;
  }
  function y(k = Uint8Array.of(), ...I) {
    const M = Ha(...I);
    return g(n(f(M, _e(k, void 0, "context"), !!i)));
  }
  function w(k, I, M = {}) {
    k = _e(k, void 0, "message"), i && (k = i(k));
    const { prefix: F, scalar: $, pointBytes: Z } = p(I), U = y(M.context, F, k), te = o.multiply(U).toBytes(), pe = y(M.context, te, Z, k), Me = l.create(U + pe * $);
    if (!l.isValid(Me))
      throw new Error("sign failed: invalid s");
    const Be = Ha(te, l.toBytes(Me));
    return _e(Be, D.signature, "result");
  }
  const S = {
    zip215: r.zip215
  };
  function P(k, I, M, F = S) {
    const { context: $ } = F, Z = F.zip215 === void 0 ? !!S.zip215 : F.zip215, U = D.signature;
    k = _e(k, U, "signature"), I = _e(I, void 0, "message"), M = _e(M, D.publicKey, "publicKey"), Z !== void 0 && nr(Z, "zip215"), i && (I = i(I));
    const te = U / 2, pe = k.subarray(0, te), Me = ns(k.subarray(te, U));
    let Be, fn, os;
    try {
      Be = t.fromBytes(M, Z), fn = t.fromBytes(pe, Z), os = o.multiplyUnsafe(Me);
    } catch {
      return !1;
    }
    if (!Z && Be.isSmallOrder())
      return !1;
    const pn = y($, pe, M, I);
    return fn.add(Be.multiplyUnsafe(pn)).subtract(os).clearCofactor().is0();
  }
  const j = a.BYTES, D = {
    secretKey: j,
    publicKey: j,
    signature: 2 * j,
    seed: j
  };
  function q(k) {
    return k = k === void 0 ? u(D.seed) : k, _e(k, D.seed, "seed");
  }
  function N(k) {
    return ew(k) && k.length === D.secretKey;
  }
  function ne(k, I) {
    try {
      return !!t.fromBytes(k, I === void 0 ? S.zip215 : I);
    } catch {
      return !1;
    }
  }
  const Y = {
    getExtendedPublicKey: p,
    randomSecretKey: q,
    isValidSecretKey: N,
    isValidPublicKey: ne,
    /**
     * Converts ed public key to x public key. Uses formula:
     * - ed25519:
     *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
     *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
     * - ed448:
     *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
     *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
     */
    toMontgomery(k) {
      const { y: I } = t.fromBytes(k), M = D.publicKey, F = M === 32;
      if (!F && M !== 57)
        throw new Error("only defined for 25519 and 448");
      const $ = F ? a.div(ve + I, ve - I) : a.div(I - ve, I + ve);
      return a.toBytes($);
    },
    toMontgomerySecret(k) {
      const I = D.secretKey;
      _e(k, I);
      const M = n(k.subarray(0, I));
      return h(M).subarray(0, I);
    }
  };
  return Object.freeze(D), Object.freeze(Y), Object.freeze({
    keygen: kd(q, v),
    getPublicKey: v,
    sign: w,
    verify: P,
    utils: Y,
    Point: t,
    lengths: D
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const zs = BigInt(0), ds = BigInt(1), kn = BigInt(2);
function xw(t) {
  return wr(t, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function"
  }), Object.freeze({ ...t });
}
function kw(t) {
  const e = xw(t), { P: s, type: n, adjustScalarBytes: r, powPminus2: i, randomBytes: o } = e, a = n === "x25519";
  if (!a && n !== "x448")
    throw new Error("invalid type");
  const l = o === void 0 ? ld : o, c = a ? 255 : 448, d = a ? 32 : 56, u = BigInt(a ? 9 : 5), h = BigInt(a ? 121665 : 39081), f = a ? kn ** BigInt(254) : kn ** BigInt(447), g = a ? BigInt(8) * kn ** BigInt(251) - ds : BigInt(4) * kn ** BigInt(445) - ds, m = f + g + ds, p = (M) => fe(M, s), v = y(u);
  function y(M) {
    return hd(p(M), d);
  }
  function w(M) {
    const F = an(_e(M, d, "uCoordinate"));
    return a && (F[31] &= 127), p(ns(F));
  }
  function S(M) {
    return ns(r(an(_e(M, d, "scalar"))));
  }
  function P(M, F) {
    const $ = ne(w(F), S(M));
    if ($ === zs)
      throw new Error("invalid private or public key received");
    return y($);
  }
  function j(M) {
    return P(M, v);
  }
  const D = j, q = P;
  function N(M, F, $) {
    const Z = p(M * (F - $));
    return F = p(F - Z), $ = p($ + Z), { x_2: F, x_3: $ };
  }
  function ne(M, F) {
    rr("u", M, zs, s), rr("scalar", F, f, m);
    const $ = F, Z = M;
    let U = ds, te = zs, pe = M, Me = ds, Be = zs;
    for (let os = BigInt(c - 1); os >= zs; os--) {
      const pn = $ >> os & ds;
      Be ^= pn, { x_2: U, x_3: pe } = N(Be, U, pe), { x_2: te, x_3: Me } = N(Be, te, Me), Be = pn;
      const mn = U + te, gn = p(mn * mn), vr = U - te, Eo = p(vr * vr), To = gn - Eo, Yd = pe + Me, Qd = pe - Me, Co = p(Qd * mn), Ao = p(Yd * vr), Mo = Co + Ao, Bo = Co - Ao;
      pe = p(Mo * Mo), Me = p(Z * p(Bo * Bo)), U = p(gn * Eo), te = p(To * (gn + p(h * To)));
    }
    ({ x_2: U, x_3: pe } = N(Be, U, pe)), { x_2: te, x_3: Me } = N(Be, te, Me);
    const fn = i(te);
    return p(U * fn);
  }
  const Y = {
    secretKey: d,
    publicKey: d,
    seed: d
  }, k = (M) => (M = M === void 0 ? l(d) : M, _e(M, Y.seed, "seed"), M), I = { randomSecretKey: k };
  return Object.freeze(Y), Object.freeze(I), Object.freeze({
    keygen: kd(k, D),
    getSharedSecret: q,
    getPublicKey: D,
    scalarMult: P,
    scalarMultBase: j,
    utils: I,
    GuBytes: v.slice(),
    lengths: Y
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ew = /* @__PURE__ */ BigInt(0), Qs = /* @__PURE__ */ BigInt(1), Ya = /* @__PURE__ */ BigInt(2), Tw = /* @__PURE__ */ BigInt(3), Cw = /* @__PURE__ */ BigInt(5), Aw = /* @__PURE__ */ BigInt(8), Os = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), Ed = {
  p: Os,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: Aw,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
};
function Td(t) {
  const e = BigInt(10), s = BigInt(20), n = BigInt(40), r = BigInt(80), i = Os, a = t * t % i * t % i, l = Ne(a, Ya, i) * a % i, c = Ne(l, Qs, i) * t % i, d = Ne(c, Cw, i) * c % i, u = Ne(d, e, i) * d % i, h = Ne(u, s, i) * u % i, f = Ne(h, n, i) * h % i, g = Ne(f, r, i) * f % i, m = Ne(g, r, i) * f % i, p = Ne(m, e, i) * d % i;
  return { pow_p_5_8: Ne(p, Ya, i) * t % i, b2: a };
}
function Cd(t) {
  return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
const Ri = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function Ad(t, e) {
  const s = Os, n = fe(e * e * e, s), r = fe(n * n * e, s), i = Td(t * r).pow_p_5_8;
  let o = fe(t * n * i, s);
  const a = fe(e * o * o, s), l = o, c = fe(o * Ri, s), d = a === t, u = a === fe(-t, s), h = a === fe(-t * Ri, s);
  return d && (o = l), (u || h) && (o = c), zt(o, s) && (o = fe(-o, s)), { isValid: d || u, value: o };
}
const Zt = /* @__PURE__ */ vw(Ed, { uvRatio: Ad }), jt = Zt.Fp, Mw = Zt.Fn;
function Bw(t) {
  return _w(Zt, Q0, Object.assign({ adjustScalarBytes: Cd, zip215: !0 }, t));
}
const Us = /* @__PURE__ */ Bw({}), So = /* @__PURE__ */ (() => {
  const t = Os;
  return kw({
    P: t,
    type: "x25519",
    powPminus2: (e) => {
      const { pow_p_5_8: s, b2: n } = Td(e);
      return fe(Ne(s, Tw, t) * n, t);
    },
    adjustScalarBytes: Cd
  });
})(), Qa = Ri, Iw = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), Ja = (t) => Ad(Qs, t), Rw = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), Ow = (t) => jt.create(ns(t) & Rw);
class Pe extends Sw {
  // Do NOT change syntax: the following gymnastics is done,
  // because typescript strips comments, which makes bundlers disable tree-shaking.
  // prettier-ignore
  static BASE = new Pe(Zt.BASE);
  // prettier-ignore
  static ZERO = new Pe(Zt.ZERO);
  // prettier-ignore
  static Fp = jt;
  // prettier-ignore
  static Fn = Mw;
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
    const { a: s, d: n } = Ed, r = Os, i = (S) => jt.create(S), o = Ow(e);
    if (!nw(jt.toBytes(o), e) || zt(o, r))
      throw new Error("invalid ristretto255 encoding 1");
    const a = i(o * o), l = i(Qs + s * a), c = i(Qs - s * a), d = i(l * l), u = i(c * c), h = i(s * n * d - u), { isValid: f, value: g } = Ja(i(h * u)), m = i(g * c), p = i(g * m * h);
    let v = i((o + o) * m);
    zt(v, r) && (v = i(-v));
    const y = i(l * p), w = i(v * y);
    if (!f || zt(w, r) || y === Ew)
      throw new Error("invalid ristretto255 encoding 2");
    return new Pe(new Zt(v, y, Qs, w));
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
    let { X: e, Y: s, Z: n, T: r } = this.ep;
    const i = Os, o = (p) => jt.create(p), a = o(o(n + s) * o(n - s)), l = o(e * s), c = o(l * l), { value: d } = Ja(o(a * c)), u = o(d * a), h = o(d * l), f = o(u * h * r);
    let g;
    if (zt(r * f, i)) {
      let p = o(s * Qa), v = o(e * Qa);
      e = p, s = v, g = o(u * Iw);
    } else
      g = h;
    zt(e * f, i) && (s = o(-s));
    let m = o((n - s) * g);
    return zt(m, i) && (m = o(-m)), jt.toBytes(m);
  }
  /**
   * Compares two Ristretto points.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
   */
  equals(e) {
    this.assertSame(e);
    const { X: s, Y: n } = this.ep, { X: r, Y: i } = e.ep, o = (c) => jt.create(c), a = o(s * i) === o(n * r), l = o(n * i) === o(s * r);
    return a || l;
  }
  is0() {
    return this.equals(Pe.ZERO);
  }
}
Object.freeze(Pe.BASE);
Object.freeze(Pe.ZERO);
Object.freeze(Pe.prototype);
Object.freeze(Pe);
class ec {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = !1;
  finished = !1;
  destroyed = !1;
  constructor(e, s) {
    if (ji(e), Ce(s, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const n = this.blockLen, r = new Uint8Array(n);
    r.set(s.length > n ? e.create().update(s).digest() : s);
    for (let i = 0; i < r.length; i++)
      r[i] ^= 54;
    this.iHash.update(r), this.oHash = e.create();
    for (let i = 0; i < r.length; i++)
      r[i] ^= 106;
    this.oHash.update(r), tt(r);
  }
  update(e) {
    return Ts(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ts(this), qi(e, this), this.finished = !0;
    const s = e.subarray(0, this.outputLen);
    this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash: s, iHash: n, finished: r, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = r, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = s._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Md = /* @__PURE__ */ (() => {
  const t = ((e, s, n) => new ec(e, s).update(n).digest());
  return t.create = (e, s) => new ec(e, s), t;
})();
function Pw(t, e, s) {
  return ji(t), s === void 0 && (s = new Uint8Array(t.outputLen)), Md(t, s, e);
}
const Xr = /* @__PURE__ */ Uint8Array.of(0), tc = /* @__PURE__ */ Uint8Array.of();
function Fw(t, e, s, n = 32) {
  ji(t), mt(n, "length"), Ce(e, void 0, "prk");
  const r = t.outputLen;
  if (e.length < r)
    throw new Error('"prk" must be at least HashLen octets');
  if (n > 255 * r)
    throw new Error("Length must be <= 255*HashLen");
  const i = Math.ceil(n / r);
  s === void 0 ? s = tc : Ce(s, void 0, "info");
  const o = new Uint8Array(i * r), a = Md.create(t, e), l = a._cloneInto(), c = new Uint8Array(a.outputLen);
  for (let d = 0; d < i; d++)
    Xr[0] = d + 1, l.update(d === 0 ? tc : c).update(s).update(Xr).digestInto(c), o.set(c, r * d), a._cloneInto(l);
  return a.destroy(), l.destroy(), tt(c, Xr), o.slice(0, n);
}
const Lw = (t, e, s, n, r) => Fw(t, Pw(t, e, s), n, r), Bd = J("swarm.seal"), En = new TextEncoder().encode("spotlight:sdp-seal:v1"), Yr = 5e4;
function Uw() {
  const { secretKey: t, publicKey: e } = So.keygen();
  return { secretKey: t, publicKey: e, publicKeyHex: He(e) };
}
function Id(t, e, s) {
  const n = new Uint8Array(En.length + e.length + s.length);
  return n.set(En, 0), n.set(e, En.length), n.set(s, En.length + e.length), Lw(Y0, t, void 0, n, 32);
}
function Rd(t, e) {
  const s = So.getSharedSecret(t, e);
  if (s.every((n) => n === 0)) throw new Error("low-order X25519 public key");
  return s;
}
async function Od(t, e) {
  return crypto.subtle.importKey("raw", t, "AES-GCM", !1, [e]);
}
async function Oi(t, e) {
  const s = new TextEncoder().encode(e);
  if (s.length === 0 || s.length > Yr)
    throw Bd.error("sdp seal failed: size out of range", {
      bytes: s.length,
      max: Yr,
      to: Se(t)
    }), new Error(`sdp size ${s.length} outside (0, ${Yr}]`);
  const n = Ie(t), r = So.keygen(), i = Id(
    Rd(r.secretKey, n),
    r.publicKey,
    n
  ), o = await Od(i, "encrypt"), a = crypto.getRandomValues(new Uint8Array(12)), l = await crypto.subtle.encrypt({ name: "AES-GCM", iv: a }, o, s);
  return {
    epk: He(r.publicKey),
    iv: He(a),
    ct: He(new Uint8Array(l))
  };
}
async function Pi(t, e) {
  try {
    const s = Ie(e.epk), n = Id(
      Rd(t.secretKey, s),
      s,
      t.publicKey
    ), r = await Od(n, "decrypt"), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Ie(e.iv) },
      r,
      Ie(e.ct)
    );
    return new TextDecoder().decode(i);
  } catch (s) {
    throw Bd.warn("sealed sdp did not open", {
      epk: Se(e.epk),
      self: Se(t.publicKeyHex),
      ctBytes: e.ct.length / 2,
      err: s
    }), s;
  }
}
function Fi() {
  return { host: 0, srflx: 0, prflx: 0, relay: 0, other: 0, udp: 0, tcp: 0, total: 0 };
}
function Li(t, e, s) {
  switch (t.total += 1, e) {
    case "host":
    case "srflx":
    case "prflx":
    case "relay":
      t[e] += 1;
      break;
    default:
      t.other += 1;
  }
  const n = s?.toLowerCase();
  n === "udp" ? t.udp += 1 : n === "tcp" && (t.tcp += 1);
}
function Ui(t) {
  const e = Fi();
  if (!t) return e;
  const s = /^a=candidate:\S+ \d+ (\S+) \d+ \S+ \d+ typ (\S+)/gm;
  let n;
  for (; (n = s.exec(t)) !== null; )
    Li(e, n[2], n[1]);
  return e;
}
function cn(t) {
  return {
    total: t.total,
    host: t.host,
    srflx: t.srflx,
    relay: t.relay,
    prflx: t.prflx,
    udp: t.udp,
    tcp: t.tcp
  };
}
function Dw(t) {
  const e = [];
  for (const n of t) {
    const r = Array.isArray(n.urls) ? n.urls : [n.urls];
    for (const i of r) typeof i == "string" && e.push(i);
  }
  const s = (n) => e.filter((r) => r.startsWith(`${n}:`)).length;
  return { stun: s("stun"), turn: s("turn"), turns: s("turns"), urls: e };
}
function Nw(t) {
  const e = t;
  return {
    type: t.type ?? $w(t.candidate, "typ"),
    protocol: t.protocol ?? null,
    address: t.address ?? null,
    port: t.port ?? null,
    relatedAddress: t.relatedAddress ?? null,
    url: e.url ?? null
  };
}
function $w(t, e) {
  const s = t.split(" "), n = s.indexOf(e);
  return n >= 0 && n + 1 < s.length ? s[n + 1] : null;
}
function Vw(t) {
  const e = t;
  return {
    url: e.url ?? null,
    errorCode: e.errorCode ?? null,
    errorText: e.errorText ?? null,
    address: e.address ?? null,
    port: e.port ?? null
  };
}
function Hw(t, e) {
  if (t === null && e === null) return null;
  if (t === "relay" || e === "relay") return "turn";
  const s = (n) => n === "srflx" || n === "prflx";
  return s(t) || s(e) ? "stun" : "direct";
}
function zw(t) {
  const e = /* @__PURE__ */ new Map();
  t.forEach((i) => e.set(i.id, i));
  const s = Fi(), n = Fi(), r = [];
  for (const i of e.values()) {
    const o = typeof i.candidateType == "string" ? i.candidateType : void 0, a = typeof i.protocol == "string" ? i.protocol : void 0;
    if (i.type === "local-candidate") Li(s, o, a);
    else if (i.type === "remote-candidate") Li(n, o, a);
    else if (i.type === "candidate-pair") {
      const l = typeof i.localCandidateId == "string" ? e.get(i.localCandidateId) : void 0, c = typeof i.remoteCandidateId == "string" ? e.get(i.remoteCandidateId) : void 0;
      r.push({
        state: typeof i.state == "string" ? i.state : "unknown",
        local: sc(l),
        remote: sc(c),
        nominated: i.nominated === !0,
        requestsSent: typeof i.requestsSent == "number" ? i.requestsSent : 0,
        responsesReceived: typeof i.responsesReceived == "number" ? i.responsesReceived : 0
      });
    }
  }
  return { local: cn(s), remote: cn(n), pairs: r };
}
function sc(t) {
  if (!t) return "?";
  const e = typeof t.candidateType == "string" ? t.candidateType : "?", s = typeof t.protocol == "string" ? t.protocol : "?";
  return `${e}/${s}`;
}
const ce = J("swarm.peer"), nc = new TextEncoder(), jw = 3, qw = Tl / 4;
class Di {
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
  invalidCap = re(jw);
  /** Result of the last `linkStats()` call that found a selected pair. */
  lastLink = null;
  openedAtMs = null;
  /** Payload bytes moved on both channels, for the `peer closed` record. */
  bytesIn = 0;
  bytesOut = 0;
  constructor(e, s) {
    this.addr = e, this.gatherTimeoutMs = s?.gatherTimeoutMs ?? jp, this.connectTimeoutMs = s?.connectTimeoutMs ?? qp;
    const n = s?.iceServers ?? z0(), r = H0() ? "relay" : "all";
    this.pc = new RTCPeerConnection({ iceServers: n, iceTransportPolicy: r }), ce.debug("peer created", {
      peer: _(e),
      policy: r,
      ice: Dw(n)
    }), this.pc.onicecandidate = (o) => {
      o.candidate ? ce.debug("local candidate", {
        peer: _(this.addr),
        ...Nw(o.candidate)
      }) : ce.debug("local candidates complete", {
        peer: _(this.addr),
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.pc.onicecandidateerror = (o) => {
      ce.warn("ice candidate error", { peer: _(this.addr), ...Vw(o) });
    }, this.pc.onicegatheringstatechange = () => {
      ce.debug("ice gathering state", {
        peer: _(this.addr),
        state: this.pc.iceGatheringState,
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.ctrl = this.pc.createDataChannel("ctrl", { negotiated: !0, id: 0, ordered: !0 }), this.bulk = this.pc.createDataChannel("bulk", { negotiated: !0, id: 1, ordered: !1 }), this.bulk.binaryType = "arraybuffer", this.bulk.bufferedAmountLowThreshold = qw, this.ctrl.onmessage = (o) => {
      if (typeof o.data != "string") {
        this.reportInvalid("binary-on-ctrl"), this.handlers?.onInvalidCtrl?.("binary-on-ctrl");
        return;
      }
      this.bytesIn += nc.encode(o.data).byteLength;
      const a = Sm(o.data);
      a.kind === "ok" ? this.handlers?.onCtrl(a.msg) : a.kind === "invalid" && (this.reportInvalid(a.error), this.handlers?.onInvalidCtrl?.(a.error));
    }, this.bulk.onmessage = (o) => {
      const a = o.data;
      if (!(a instanceof ArrayBuffer)) {
        this.reportInvalid("non-binary-on-bulk"), this.handlers?.onInvalidSlice?.("non-binary-on-bulk");
        return;
      }
      this.bytesIn += a.byteLength;
      const l = km(new Uint8Array(a));
      l.kind === "ok" ? this.handlers?.onSlice(l.frame) : (this.reportInvalid(l.error), this.handlers?.onInvalidSlice?.(l.error));
    }, this.bulk.onbufferedamountlow = () => this.handlers?.onBulkDrain?.();
    const i = () => {
      if (!(this.openFired || this.closed) && this.ctrl.readyState === "open" && this.bulk.readyState === "open") {
        this.openFired = !0, this.openedAtMs = Date.now(), ce.info("channels open", {
          peer: _(this.addr),
          elapsedMs: Date.now() - this.createdAtMs
        }), this.clearConnectTimer(), this.linkStats().then((o) => {
          ce.info("selected ice pair", { peer: _(this.addr), ...o });
        });
        for (const o of this.openWaiters.splice(0)) o.resolve();
        this.handlers?.onOpen?.();
      }
    };
    this.ctrl.onopen = i, this.bulk.onopen = i, this.pc.onconnectionstatechange = () => {
      const o = this.pc.connectionState;
      if (ce.info("connection state", { peer: _(this.addr), state: o }), o === "failed" || o === "closed") {
        this.closeReasonValue ??= o === "failed" ? "ice-failed" : "local", this.close();
        return;
      }
      o === "disconnected" ? this.armDisconnectTimer() : this.clearDisconnectTimer();
    }, this.pc.oniceconnectionstatechange = () => {
      const o = this.pc.iceConnectionState;
      ce.debug("ice state", { peer: _(this.addr), state: o }), (o === "failed" || o === "disconnected") && this.dumpIceStats(`ice ${o}`);
    };
  }
  /** One line per bad-frame reason on this link, then a count only. */
  reportInvalid(e) {
    this.invalidCap.allow(e) && ce.warn("bad frame dropped", {
      peer: _(this.addr),
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
    await this.pc.setLocalDescription(e), await rc(this.pc, this.gatherTimeoutMs);
    const s = this.pc.localDescription ?? e;
    return this.logLocalSdp("offer", s), s;
  }
  /** Answerer side: consume the offer, return a fully-gathered answer. */
  async acceptOffer(e) {
    if (this.closed) throw new Error(`peer ${this.addr} closed`);
    this.armConnectTimer(), this.logRemoteSdp("offer", e), await this.pc.setRemoteDescription(e);
    const s = await this.pc.createAnswer();
    await this.pc.setLocalDescription(s), await rc(this.pc, this.gatherTimeoutMs);
    const n = this.pc.localDescription ?? s;
    return this.logLocalSdp("answer", n), n;
  }
  /** Offerer side, step 2: consume the remote answer; ICE begins. */
  async acceptAnswer(e) {
    this.logRemoteSdp("answer", e), await this.pc.setRemoteDescription(e);
  }
  /** Candidate mix we are about to send. Zero srflx → STUN never answered
   *  inside the gather cap. Zero relay → expected unless VITE_TURN_* is set;
   *  with a relay configured, TURN never allocated. */
  logLocalSdp(e, s) {
    const n = Ui(s.sdp), r = {
      peer: _(this.addr),
      kind: e,
      sdpBytes: s.sdp?.length ?? 0,
      gatherState: this.pc.iceGatheringState,
      ...cn(n)
    };
    n.total === 0 ? ce.warn("local sdp has no ice candidates", r) : n.srflx === 0 && n.relay === 0 ? ce.warn("local sdp has host candidates only", r) : ce.info("local sdp candidates", r);
  }
  /** Candidate mix the remote sent us — the other half of the picture. */
  logRemoteSdp(e, s) {
    const n = Ui(s.sdp), r = {
      peer: _(this.addr),
      kind: e,
      sdpBytes: s.sdp?.length ?? 0,
      ...cn(n)
    };
    n.total === 0 ? ce.warn("remote sdp has no ice candidates", r) : n.srflx === 0 && n.relay === 0 ? ce.warn("remote sdp has host candidates only", r) : ce.info("remote sdp candidates", r);
  }
  /** Candidate pairs and their check states at the moment a link dies. */
  async dumpIceStats(e) {
    if (this.closed) return;
    let s;
    try {
      s = await this.pc.getStats();
    } catch (r) {
      ce.debug("ice stats unavailable", { peer: _(this.addr), reason: e, err: r });
      return;
    }
    const n = zw(s);
    ce.warn("ice pairs", {
      peer: _(this.addr),
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
    return this.openFired ? Promise.resolve() : this.closed ? Promise.reject(new Error(`peer ${this.addr} closed`)) : new Promise((e, s) => {
      this.openWaiters.push({ resolve: e, reject: s });
    });
  }
  // ── Sending ──────────────────────────────────────────────────────────────
  sendCtrl(e) {
    if (this.ctrl.readyState !== "open") return !1;
    try {
      const s = vm(e);
      return this.ctrl.send(s), this.bytesOut += nc.encode(s).byteLength, !0;
    } catch {
      return !1;
    }
  }
  sendSlice(e) {
    if (this.bulk.readyState !== "open") return !1;
    try {
      const s = xm(e);
      return this.bulk.send(s.buffer), this.sentBulkBytes += s.byteLength, this.bytesOut += s.byteLength, !0;
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
    let s;
    try {
      s = await this.pc.getStats();
    } catch {
      return e;
    }
    const n = /* @__PURE__ */ new Map();
    s.forEach((u) => n.set(u.id, u));
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
    const i = typeof r.localCandidateId == "string" ? n.get(r.localCandidateId) : void 0, o = typeof r.remoteCandidateId == "string" ? n.get(r.remoteCandidateId) : void 0, a = (u) => typeof u == "string" ? u : null, l = a(i?.candidateType), c = a(o?.candidateType), d = {
      path: Hw(l, c),
      candidateType: l,
      remoteCandidateType: c,
      relayProtocol: a(i?.relayProtocol),
      relayUrl: a(i?.url),
      rttMs: typeof r.currentRoundTripTime == "number" ? Math.round(r.currentRoundTripTime * 1e3) : null
    };
    return this.lastLink = d, d;
  }
  close() {
    if (!this.closed) {
      this.closed = !0, this.closeReasonValue ??= "local", ce.info("peer closed", {
        peer: _(this.addr),
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
        peer: _(this.addr),
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
        peer: _(this.addr),
        state: this.pc.connectionState,
        graceMs: ha
      }), this.closeReasonValue ??= "disconnected", this.close());
    }, ha));
  }
  clearDisconnectTimer() {
    this.disconnectTimer && (clearTimeout(this.disconnectTimer), this.disconnectTimer = null);
  }
}
function rc(t, e) {
  if (t.iceGatheringState === "complete") return Promise.resolve();
  const s = Date.now();
  return new Promise((n) => {
    const r = () => {
      t.removeEventListener("icegatheringstatechange", i), clearTimeout(o);
      const a = t.iceGatheringState, l = {
        elapsedMs: Date.now() - s,
        state: a,
        timeoutMs: e,
        ...cn(Ui(t.localDescription?.sdp))
      };
      a === "complete" ? ce.debug("ice gathering done", l) : ce.warn("ice gathering cut by timeout", l), n();
    }, i = () => {
      t.iceGatheringState === "complete" && r();
    };
    t.addEventListener("icegatheringstatechange", i);
    const o = setTimeout(r, e);
  });
}
const be = J("swarm.join"), Ww = new TextEncoder();
function Qr(t) {
  return t === void 0 ? 0 : Ww.encode(t).length;
}
class Gw {
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
        be.debug("join dropped: from self", { from: _(e.from) });
        return;
      }
      if (e.timestamp < Date.now() - this.staleMs) {
        be.warn("join dropped: stale", {
          ageMs: Date.now() - e.timestamp,
          staleMs: this.staleMs
        });
        return;
      }
      const s = Pm(e, Rm);
      if (!s) {
        be.debug("join dropped: bad payload", { from: _(e.from) });
        return;
      }
      if (s.responder !== this.opts.selfAddr) {
        be.debug("join dropped: responder mismatch", {
          joinResponder: _(s.responder),
          self: _(this.opts.selfAddr)
        });
        return;
      }
      const n = this.lastJoinTs.get(s.viewerAddress);
      if (n !== void 0 && e.timestamp <= n) {
        be.warn("join dropped: replay", {
          viewer: _(s.viewerAddress),
          envTs: e.timestamp,
          lastTs: n
        });
        return;
      }
      const r = this.pending.get(s.viewerAddress);
      r && (be.warn("join supersedes an answer still in flight", {
        viewer: _(s.viewerAddress),
        envTs: e.timestamp,
        lastTs: n
      }), this.superseded.add(r), r.close(), this.pending.delete(s.viewerAddress), this.board.delete(s.viewerAddress)), this.lastJoinTs.set(s.viewerAddress, e.timestamp), be.info("join accepted", {
        viewer: _(s.viewerAddress),
        name: s.viewerName
      }), this.answer(s);
    }));
  }
  stop() {
    this.unsubscribe?.(), this.unsubscribe = null;
  }
  testFailAnsweredJoins(e) {
    this.testFailAnsweredJoinsOn = e, be.warn("test hook set answered-join failure", { on: e });
  }
  async answer(e) {
    const n = (this.opts.createPeer ?? ((l, c) => new Di(l, c)))(e.viewerAddress, this.opts.peerOpts);
    this.pending.set(e.viewerAddress, n);
    const r = Date.now(), i = _(e.viewerAddress);
    let o = "open-offer", a = null;
    try {
      const l = await Pi(this.opts.boxKey, e.sealedSdp);
      be.debug("offer opened", { viewer: i, sdpBytes: Qr(l) }), o = "accept-offer";
      const c = await n.acceptOffer({ type: "offer", sdp: l });
      this.throwIfSuperseded(n), be.debug("offer accepted", { viewer: i, sdpBytes: Qr(c.sdp) }), o = "submit-welcome";
      const d = await Oi(e.boxPub, c.sdp ?? "");
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
      }, this.board.set(e.viewerAddress, a), be.info("answer on the board", { to: i, sdpBytes: Qr(c.sdp) });
      const u = Date.now();
      await this.publishBoard(), be.debug("board with the answer submitted", { to: i, latencyMs: Date.now() - u }), this.testFailAnsweredJoinsOn && (be.warn("test hook closed the answered join link", { viewer: i }), n.close()), o = "wait-open", await n.waitOpen(), be.info("viewer channels open", { viewer: i, totalMs: Date.now() - r }), this.opts.onPeer(n, e.viewerAddress, e.viewerName);
    } catch (l) {
      this.superseded.has(n) ? be.info("join answer abandoned: a newer join took over", { viewer: i, stage: o }) : o === "open-offer" ? be.error("join answer failed: offer did not open", { viewer: i, err: l }) : be.error("join answer failed", { viewer: i, stage: o, err: l }), n.close();
    } finally {
      this.pending.get(e.viewerAddress) === n && this.pending.delete(e.viewerAddress), a && this.board.get(e.viewerAddress) === a && this.board.delete(e.viewerAddress);
    }
  }
  /** Resolves when a board submit that starts after this call has landed.
   *  At most one submit is in flight, so a board minted earlier can never
   *  land after a newer one. */
  publishBoard() {
    if (!this.nextRound) {
      let s, n;
      const r = new Promise((i, o) => {
        s = i, n = o;
      });
      this.nextRound = { done: r, resolve: s, reject: n };
    }
    const { done: e } = this.nextRound;
    return this.boardBusy || this.flushBoard(), e;
  }
  async flushBoard() {
    for (this.boardBusy = !0; this.nextRound; ) {
      const e = this.nextRound;
      this.nextRound = null;
      const s = this.boardAnswers(Date.now());
      be.info("submitting welcome board", { answers: s.length });
      try {
        await this.opts.transport.submit({
          type: "welcome-board",
          from: this.opts.selfAddr,
          timestamp: Date.now(),
          payload: { answers: s }
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
      e - r.at > Cl * 1e3 && this.board.delete(n);
    const s = [...this.board.entries()].sort((n, r) => n[1].at - r[1].at);
    for (const [n] of s.splice(0, Math.max(0, s.length - Al)))
      this.board.delete(n);
    return s.map(([, n]) => n.answer);
  }
  throwIfSuperseded(e) {
    if (this.superseded.has(e)) throw new Error("superseded by a newer join");
  }
}
const Zw = J("swarm.seal"), Kw = 5, ic = re(Kw);
function Rt(t, e, s) {
  const n = `${t}:${e}`;
  return ic.allow(n) && Zw.warn(`${t} verification failed: ${e}`, { ...s, seen: ic.count(n) }), !1;
}
function Xw() {
  const { secretKey: t, publicKey: e } = Us.keygen();
  return { secretKey: t, publicKey: e, publicKeyHex: He(e) };
}
function Pd(t) {
  return He(fr(t, { dkLen: 32 }));
}
function _o(t) {
  const e = new Uint8Array(64), s = new DataView(e.buffer);
  return s.setBigUint64(0, BigInt(t.epoch), !0), s.setUint32(8, t.seq, !0), s.setBigUint64(12, BigInt(t.tsUs), !0), s.setBigUint64(20, BigInt(t.durUs), !0), s.setUint32(28, t.size, !0), e.set(Ie(t.hash), 32), e;
}
function Yw(t, e, s) {
  const n = {
    epoch: s,
    seq: e.seq,
    tsUs: e.tsUs,
    durUs: e.durUs,
    size: e.payload.length,
    hash: Pd(e.payload)
  }, r = He(Us.sign(_o(n), t.secretKey));
  return { ...n, sig: r };
}
function Qw(t, e) {
  try {
    return Us.verify(Ie(e.sig), _o(e), Ie(t)) || Rt("chunk meta", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Rt("chunk meta", "malformed key or signature", { seq: e.seq });
  }
}
function Jw(t, e, s) {
  try {
    return s.length !== e.size ? Rt("chunk", "wrong size", { seq: e.seq, got: s.length, want: e.size }) : Pd(s) !== e.hash ? Rt("chunk", "hash mismatch", { seq: e.seq, bytes: s.length }) : Us.verify(Ie(e.sig), _o(e), Ie(t)) || Rt("chunk", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Rt("chunk", "malformed key or signature", { seq: e.seq });
  }
}
function Fd(t) {
  const e = new Uint8Array(12), s = new DataView(e.buffer);
  return e.set([69, 78, 68, 33], 0), s.setBigUint64(4, BigInt(t), !0), e;
}
function eb(t, e) {
  return He(Us.sign(Fd(e), t.secretKey));
}
function tb(t, e, s) {
  try {
    return Us.verify(Ie(s), Fd(e), Ie(t)) || Rt("stream end", "bad signature", { epoch: e });
  } catch {
    return Rt("stream end", "malformed key or signature", { epoch: e });
  }
}
const Tn = J("swarm.chunk"), oc = 5, sb = 25;
class nb {
  chunks = /* @__PURE__ */ new Map();
  capacity;
  currentEpoch = null;
  /** Highest seq ever stored this epoch, -1 when empty. */
  maxSeq = -1;
  rejectCap = re(oc);
  missCap = re(oc);
  storedSinceRollup = 0;
  evictedSinceRollup = 0;
  constructor(e = vi) {
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
    for (const s of this.chunks.keys()) s < e && (e = s);
    return e;
  }
  get size() {
    return this.chunks.size;
  }
  /** Wipe everything and re-key to a new stream session (host re-go-live). */
  reset(e) {
    Tn.info("store reset", { epoch: e, from: this.currentEpoch, dropped: this.chunks.size }), this.chunks.clear(), this.currentEpoch = e, this.maxSeq = -1, this.rejectCap.reset(), this.missCap.reset(), this.storedSinceRollup = 0, this.evictedSinceRollup = 0;
  }
  /** One line per reject reason while it is new, then a count only. */
  rejected(e, s) {
    return this.rejectCap.allow(e) && Tn.debug(`chunk rejected: ${e}`, { seq: s, epoch: this.currentEpoch, size: this.chunks.size }), !1;
  }
  /**
   * Insert a verified chunk. Returns true if newly stored; false when it's a
   * duplicate, from the wrong epoch, or already evicted-out-of-window (older
   * than edge - capacity).
   */
  insert(e) {
    const { meta: s } = e;
    if (this.currentEpoch === null && (this.currentEpoch = s.epoch), s.epoch !== this.currentEpoch) return this.rejected("wrong epoch", s.seq);
    if (this.chunks.has(s.seq)) return this.rejected("duplicate", s.seq);
    if (this.maxSeq >= 0 && s.seq <= this.maxSeq - this.capacity)
      return this.rejected("out of window", s.seq);
    this.chunks.set(s.seq, e), s.seq > this.maxSeq && (this.maxSeq = s.seq);
    const n = this.maxSeq - this.capacity;
    for (const r of this.chunks.keys())
      r <= n && (this.chunks.delete(r), this.evictedSinceRollup++);
    return this.storedSinceRollup++, this.storedSinceRollup >= sb && (Tn.debug("chunks stored", {
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
    const s = this.chunks.get(e);
    return !s && this.missCap.allow() && Tn.debug("chunk requested but missing", {
      seq: e,
      lowestSeq: this.lowestSeq,
      edgeSeq: this.maxSeq,
      misses: this.missCap.count()
    }), s ?? null;
  }
  seqs() {
    return [...this.chunks.keys()].sort((e, s) => e - s);
  }
  /** HAVE window for hello/summary messages. */
  summary() {
    const e = this.lowestSeq;
    return e < 0 ? { base: 0, bitmapHex: "" } : _m(e, this.chunks.keys(), this.capacity);
  }
}
const rb = 2;
class ib {
  votes = /* @__PURE__ */ new Map();
  /** `addr`'s hello named `epoch`. A newer vote replaces its older one; an
   *  older one is ignored. */
  record(e, s, n) {
    const r = this.votes.get(e);
    r && r.epoch > s || this.votes.set(e, { epoch: s, isHost: n });
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
    const s = /* @__PURE__ */ new Map();
    let n = null;
    for (const [i, o] of this.votes) {
      if (o.epoch <= e) continue;
      if (o.isHost) {
        (!n || o.epoch > n.epoch) && (n = { epoch: o.epoch, voters: [i], viaHost: !0 });
        continue;
      }
      const a = s.get(o.epoch) ?? [];
      a.push(i), s.set(o.epoch, a);
    }
    if (n) return n;
    let r = null;
    for (const [i, o] of s)
      o.length < rb || (!r || i > r.epoch) && (r = { epoch: i, voters: o, viaHost: !1 });
    return r;
  }
}
const or = J("swarm.gossip"), ob = 50, Ld = 3;
class ab {
  /** Map preserves insertion order → oldest entry is first (LRU eviction). */
  seen = /* @__PURE__ */ new Map();
  capacity;
  ttlMs;
  duplicatesSinceRollup = 0;
  evictCap = re(1);
  constructor(e) {
    this.capacity = e?.capacity ?? Np, this.ttlMs = e?.ttlMs ?? $p;
  }
  /**
   * True exactly once per id within the TTL: the caller should process and
   * re-forward the message. False → duplicate, drop silently.
   */
  firstSight(e, s) {
    const n = this.seen.get(e), r = n !== void 0 && s - n < this.ttlMs;
    if (this.seen.delete(e), this.seen.set(e, s), this.seen.size > this.capacity) {
      const i = this.seen.keys().next().value;
      i !== void 0 && this.seen.delete(i), this.evictCap.allow() && or.debug("dedup table at capacity", { capacity: this.capacity });
    }
    return r && (this.duplicatesSinceRollup++, this.duplicatesSinceRollup >= ob && (or.debug("flood duplicates dropped", {
      dropped: this.duplicatesSinceRollup,
      tracked: this.seen.size
    }), this.duplicatesSinceRollup = 0)), !r;
  }
  get size() {
    return this.seen.size;
  }
}
class cb {
  peers = /* @__PURE__ */ new Map();
  ttlMs;
  expiryCap = re(Ld);
  constructor(e) {
    this.ttlMs = e?.ttlMs ?? Up;
  }
  touch(e, s, n, r) {
    this.peers.set(e, { addr: e, name: s, ts: n, lastSeenMs: r });
  }
  remove(e) {
    this.peers.delete(e);
  }
  /** Peers seen within the TTL. Prunes expired entries as a side effect. */
  live(e) {
    const s = [];
    for (const [n, r] of this.peers)
      e - r.lastSeenMs >= this.ttlMs ? (this.peers.delete(n), this.expiryCap.allow() && or.debug("presence expired", {
        peer: _(n),
        quietMs: e - r.lastSeenMs,
        expired: this.expiryCap.count()
      })) : s.push(r);
    return s;
  }
  liveCount(e) {
    return this.live(e).length;
  }
}
class lb {
  constructor(e, s, n = 1e3) {
    this.senderCap = e, this.aggregateCap = s, this.windowMs = n;
  }
  perSender = /* @__PURE__ */ new Map();
  aggregate = [];
  capReported = re(Ld);
  /** True if the message is within budget (and counts it), false → drop. */
  allow(e, s) {
    const n = s - this.windowMs;
    if (this.aggregate = this.aggregate.filter((i) => i > n), this.aggregate.length >= this.aggregateCap)
      return this.report("aggregate", e, this.aggregateCap), !1;
    const r = (this.perSender.get(e) ?? []).filter((i) => i > n);
    return r.length >= this.senderCap ? (this.perSender.set(e, r), this.report("sender", e, this.senderCap), !1) : (r.push(s), this.perSender.set(e, r), this.aggregate.push(s), !0);
  }
  report(e, s, n) {
    const r = `${e}:${s}`;
    this.capReported.allow(r) && or.warn("flood dropped: over the rate cap", {
      scope: e,
      sender: _(s),
      cap: n,
      windowMs: this.windowMs
    });
  }
}
const me = J("swarm.book"), db = 3, ub = 0.3, hb = 0.5, fb = 0.2, pb = 1e6, mb = 0.2;
function us(t, e) {
  return t + ub * (e - t);
}
class ac {
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
  poolFullCap = re(db);
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
  constructor(e, s) {
    this.selfAddr = e, this.minDegree = s?.minDegree ?? hp, this.targetDegree = s?.targetDegree ?? fp, this.maxDegree = s?.maxDegree ?? pp, this.strikeLimit = s?.badChunkStrikes ?? Dp, this.candidatePoolCap = s?.candidatePoolCap ?? 64, this.hostAddr = s?.hostAddr ?? null;
  }
  // ── Neighbor set ───────────────────────────────────────────────────────────
  addNeighbor(e, s, n, r) {
    const i = this.neighbors.get(e);
    if (i) return i;
    const o = {
      addr: e,
      name: s,
      connectedAtMs: n,
      isHostLink: r?.isHostLink ?? !1,
      responder: r?.responder ?? !1,
      boxPub: null,
      fulfillEwma: hb,
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
    return this.candidateSeenAt.delete(e), me.info("neighbor added", {
      peer: _(e),
      degree: this.neighbors.size,
      isHostLink: o.isHostLink,
      responder: o.responder,
      promoted: a
    }), this.noteRelayOnly(), o;
  }
  removeNeighbor(e) {
    this.neighbors.delete(e) && (me.info("neighbor removed", { peer: _(e), degree: this.neighbors.size }), this.neighbors.size === 0 && this.clearDialFailures("mesh-dial failures dropped: no links left"), this.noteRelayOnly());
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
    const s = this.neighbors.get(e);
    s && (s.fulfillEwma = us(s.fulfillEwma, 1), s.denyEwma = us(s.denyEwma, 0));
  }
  /** A want to this peer timed out (no first slice / never completed). */
  recordTimeout(e) {
    const s = this.neighbors.get(e);
    s && (s.fulfillEwma = us(s.fulfillEwma, 0));
  }
  /** The peer denied a want. Cheap and honest — penalized far less than a timeout. */
  recordDeny(e) {
    const s = this.neighbors.get(e);
    s && (s.denyEwma = us(s.denyEwma, 1));
  }
  /** A completed chunk delivery: `bytes` over `elapsedMs`. */
  recordDelivery(e, s, n) {
    const r = this.neighbors.get(e);
    !r || n <= 0 || (r.throughputBpsEwma = us(r.throughputBpsEwma, s * 8 * 1e3 / n));
  }
  /** A want to this peer produced its first slice `chunks` chunk-spacings
   *  after it was sent. */
  recordFirstSlice(e, s) {
    const n = this.neighbors.get(e);
    !n || !Number.isFinite(s) || s < 0 || (n.firstSliceChunksEwma = us(n.firstSliceChunksEwma, s));
  }
  /**
   * Composite score in ~[0, 1.2]: fulfillment dominates, denies subtract
   * a little (a denying peer is still healthy), measured throughput adds up
   * to THROUGHPUT_WEIGHT, and first-slice latency subtracts up to
   * FIRST_SLICE_WEIGHT.
   */
  score(e) {
    const s = this.neighbors.get(e);
    if (!s) return 0;
    const n = Math.min(1, s.throughputBpsEwma / pb);
    return s.fulfillEwma - 0.25 * s.denyEwma + fb * n - mb * Math.min(1, s.firstSliceChunksEwma);
  }
  /** Neighbors best-first — request order for the scheduler. */
  rankedByScore() {
    return this.list().sort((e, s) => this.score(s.addr) - this.score(e.addr));
  }
  // ── Strikes (plan §4) ──────────────────────────────────────────────────────
  /** Count a failed chunk verification. True → disconnect the sender now. */
  recordBadChunk(e) {
    const s = this.neighbors.get(e);
    if (!s) return !1;
    s.badChunkStrikes++;
    const n = s.badChunkStrikes >= this.strikeLimit;
    return me.warn("bad chunk strike", {
      peer: _(e),
      strikes: s.badChunkStrikes,
      limit: this.strikeLimit,
      disconnect: n
    }), n;
  }
  // ── Liveness via summaries (plan §6.4) ─────────────────────────────────────
  recordSummary(e, s, n, r) {
    const i = this.neighbors.get(e);
    i && (i.lastSummaryAtMs = s, this.recordDegreeReport(e, n, r));
  }
  /** One degree report (hello or summary). An absent degree (an older build's
   *  hello) leaves the count alone; an absent relayOnly reads as false. */
  recordDegreeReport(e, s, n) {
    const r = this.neighbors.get(e);
    r && (s !== void 0 && (r.remoteDegree = s, r.lowDegreeReports = s <= 1 ? r.lowDegreeReports + 1 : 0), r.relayOnly = n ?? !1);
  }
  // ── Host-only neighbors (host side) ────────────────────────────────────────
  /** Reaches only us: it said so, or reported degree ≤ 1 in
   *  HOST_ONLY_CONFIRM_REPORTS reports in a row. */
  hostOnly(e) {
    return e.relayOnly || e.lowDegreeReports >= Kp;
  }
  /** The host-only neighbors that hold the `slots` seats: advertised
   *  relayOnly first, then longest uptime. */
  hostOnlyCarried(e) {
    if (e <= 0) return /* @__PURE__ */ new Set();
    const s = this.list().filter((n) => this.hostOnly(n)).sort((n, r) => Number(r.relayOnly) - Number(n.relayOnly) || n.connectedAtMs - r.connectedAtMs);
    return new Set(s.slice(0, e).map((n) => n.addr));
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
  recordDialFailure(e, s, n) {
    if (this.banCandidate(e, s), !!this.hasHostLink) {
      if (this.failedTargets.add(e), this.failedTargets.size >= xi) {
        const r = this.dialsPaused(s);
        this.dialPausedUntilMs = s + n, r || me.warn("mesh dials paused: links to other viewers fail to open", {
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
    const s = this.neighbors.get(e);
    !s || this.isHost(s) || (this.clearDialFailures("mesh dials resumed: a link to another viewer opened"), this.noteRelayOnly());
  }
  clearDialFailures(e) {
    this.failedTargets.size === 0 && this.dialPausedUntilMs === 0 || (me.info(e, { streakWas: this.failedTargets.size }), this.failedTargets.clear(), this.dialPausedUntilMs = 0);
  }
  /** Only the host is reachable: MESH_DIAL_FAIL_STREAK failed dials and our
   *  one link is the host. Streak-based, so a probe window cannot flap it. */
  get relayOnly() {
    if (this.failedTargets.size < xi || this.neighbors.size !== 1) return !1;
    const [e] = this.neighbors.values();
    return this.isHost(e);
  }
  noteRelayOnly() {
    const e = this.relayOnly;
    e !== this.relayOnlyLogged && (this.relayOnlyLogged = e, e ? me.warn("relay-only: only the host is reachable", { streak: this.failedTargets.size }) : me.info("relay-only cleared", {
      streak: this.failedTargets.size,
      degree: this.neighbors.size
    }));
  }
  /** Neighbors silent for longer than `cutoffMs` (two missed summaries plus
   *  slack) → presumed dead. A link with no summary yet is judged from
   *  connect time. */
  deadPeers(e, s = El) {
    return this.list().filter((n) => e - n.lastSummaryAtMs > s).map((n) => n.addr);
  }
  // ── PEX candidate pool ─────────────────────────────────────────────────────
  addCandidates(e, s = Date.now()) {
    let n = 0, r = 0, i = 0, o = !1;
    for (const a of e)
      if (!(a.addr === this.selfAddr || this.neighbors.has(a.addr))) {
        if (this.isBanned(a.addr, s)) {
          r++;
          continue;
        }
        if (this.candidates.size >= this.candidatePoolCap && !this.candidates.has(a.addr) && (o || (o = !0, this.expireCandidates(s)), this.candidates.size >= this.candidatePoolCap)) {
          i++;
          continue;
        }
        this.candidates.has(a.addr) || n++, this.candidates.set(a.addr, a), this.candidateSeenAt.set(a.addr, s);
      }
    (n > 0 || r > 0) && me.debug("candidates added", {
      added: n,
      banned: r,
      offered: e.length,
      pool: this.candidates.size
    }), i > 0 && this.poolFullCap.allow() && me.warn("candidate pool full", { turnedAway: i, cap: this.candidatePoolCap });
  }
  /** Drop pooled candidates nobody has re-offered within CANDIDATE_TTL_MS. */
  expireCandidates(e) {
    let s = 0;
    for (const [n, r] of this.candidateSeenAt)
      e - r > $s && (this.candidates.delete(n), this.candidateSeenAt.delete(n), s++);
    return s > 0 && me.debug("stale candidates dropped", { expired: s, ttlMs: $s, pool: this.candidates.size }), s;
  }
  isBanned(e, s) {
    const n = this.bannedUntil.get(e);
    return n === void 0 ? !1 : s < n ? !0 : (this.bannedUntil.delete(e), !1);
  }
  /** Refuse `addr` from the pool for REPLACE_BAN_MS: it was pruned for its
   *  score, or pruned us for ours. Links it opens to us are not blocked. */
  banCandidate(e, s) {
    this.candidates.delete(e), this.candidateSeenAt.delete(e), this.bannedUntil.set(e, s + Rr), me.debug("candidate banned", { peer: _(e), banMs: Rr });
  }
  get candidateCount() {
    return this.candidates.size;
  }
  /** TEST HOOK (issue-#7 orphan repro): empty the candidate pool. */
  clearCandidates() {
    me.warn("candidate pool cleared", { dropped: this.candidates.size }), this.candidates.clear(), this.candidateSeenAt.clear();
  }
  /**
   * How many new links to dial and to whom (below target → top up), bounded
   * by the outbound dials already in flight against `maxDialsInFlight`. Returned
   * candidates are consumed from the pool; report failures via addCandidates
   * re-learning them from future PEX.
   */
  dialTargets(e = Date.now(), s = 0) {
    if (this.hasHostLink && this.dialsPaused(e)) return [];
    const n = this.targetDegree - this.neighbors.size;
    if (n <= 0) return [];
    const r = this.maxDialsInFlight, i = r - s, o = Math.min(n, i);
    if (i < n && this.candidates.size > 0 && this.dialCapLog.allow() && me.debug("dial targets capped", {
      wanted: n,
      room: Math.max(0, i),
      inFlight: s,
      cap: r,
      starved: this.isStarved
    }), o <= 0) return [];
    const a = [];
    let l = 0;
    for (const [c, d] of this.candidates) {
      if (a.length >= o) break;
      this.candidates.delete(c);
      const u = this.candidateSeenAt.get(c) ?? e;
      if (this.candidateSeenAt.delete(c), e - u > $s) {
        l++;
        continue;
      }
      a.push(d);
    }
    return l > 0 && me.debug("stale candidates dropped", { expired: l, ttlMs: $s }), a.length > 0 && me.debug("dial targets picked", {
      picked: a.length,
      wanted: o,
      degree: this.neighbors.size,
      pool: this.candidates.size,
      inFlight: s,
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
    return this.isStarved ? Gp : Wp;
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
    const s = this.neighbors.size - this.maxDegree;
    if (s <= 0) return [];
    const n = this.rankedByScore().reverse().filter((r) => !r.isHostLink && e - r.connectedAtMs >= Jn).slice(0, s).map((r) => r.addr);
    return n.length > 0 && me.info("pruning over max degree", {
      prune: n.length,
      excess: s,
      degree: this.neighbors.size,
      maxDegree: this.maxDegree
    }), n;
  }
  /** Hold replacements for REPLACE_COOLDOWN_MS (after an epoch reset, wants
   *  to neighbors still on the old epoch time out — not their fault). */
  holdReplacements(e) {
    this.replaceHoldUntilMs = Math.max(this.replaceHoldUntilMs, e + ca);
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
    let s = null, n = 1 / 0;
    for (const c of this.neighbors.values()) {
      if (c.isHostLink || c.addr === this.hostAddr || e - c.connectedAtMs < Jn) continue;
      const d = this.score(c.addr);
      d >= mp && c.denyEwma < aa || d < n && (s = c, n = d);
    }
    if (!s) return null;
    const r = (c) => (this.keptCap.allow(c) && me.debug("weak neighbor kept", {
      peer: _(s.addr),
      score: n,
      deny: s.denyEwma,
      gate: c,
      kept: this.keptCap.count(c)
    }), null);
    if (this.neighbors.size - 1 < this.minDegree) return r("min-degree");
    if (e < this.replaceHoldUntilMs) return r("cooldown");
    let i = null, o = -1 / 0;
    for (const c of this.neighbors.values()) {
      if (c === s) continue;
      const d = this.score(c.addr);
      d > o && (i = c, o = d);
    }
    if (!i || o < gp)
      return this.keptCap.allow("no-reference") && me.warn("slow neighbors kept: no healthy reference", {
        worst: _(s.addr),
        worstScore: n,
        bestScore: i ? o : null,
        degree: this.neighbors.size,
        kept: this.keptCap.count("no-reference")
      }), null;
    let a = null;
    for (const [c, d] of this.candidates) {
      const u = this.candidateSeenAt.get(c) ?? e;
      if (e - u > $s) {
        this.candidates.delete(c), this.candidateSeenAt.delete(c);
        continue;
      }
      if (d.boxPub) {
        a = d;
        break;
      }
    }
    if (!a) return r("no-candidate");
    this.candidates.delete(a.addr), this.candidateSeenAt.delete(a.addr), this.replaceHoldUntilMs = e + ca, this.bannedUntil.set(s.addr, e + Rr);
    const l = s.denyEwma >= aa ? "deny" : "score";
    return me.warn("replacing weak neighbor", {
      peer: _(s.addr),
      reason: l,
      score: n,
      fulfill: s.fulfillEwma,
      deny: s.denyEwma,
      throughputBps: Math.round(s.throughputBpsEwma),
      ageMs: e - s.connectedAtMs,
      reference: _(i.addr),
      referenceScore: o,
      candidate: _(a.addr),
      degree: this.neighbors.size,
      pool: this.candidates.size
    }), {
      victim: s,
      candidate: a,
      reason: l,
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
  pexSample(e = no, s) {
    const n = [];
    for (const r of this.neighbors.values()) {
      if (n.length >= e) return n;
      r.addr !== s && !r.relayOnly && n.push({ addr: r.addr, name: r.name, boxPub: r.boxPub ?? void 0 });
    }
    return n;
  }
  /** Longest-uptime responders for the heartbeat responder list (§6.2a).
   *  A relay-only neighbor's answer could only ever open to us. */
  responderSample(e) {
    return this.list().filter((s) => s.responder && !s.relayOnly).sort((s, n) => s.connectedAtMs - n.connectedAtMs).slice(0, e);
  }
  /**
   * §6.2 host bootstrap prune: which temporary joiners to re-home when the
   * host holds more than `maxNeighbors` links. Only neighbors that reported
   * ≥ `minRemoteDegree` links (host + 2 non-host) are candidates — everyone
   * else keeps their host link (they would be islands). Best-established
   * (highest reported degree, then longest uptime) go first: they are the
   * least dependent on the bootstrap link.
   */
  hostPruneTargets(e, s) {
    const n = this.neighbors.size - e;
    if (n <= 0) return [];
    const r = this.list().filter((i) => i.remoteDegree !== null && i.remoteDegree >= s).sort(
      (i, o) => (o.remoteDegree ?? 0) - (i.remoteDegree ?? 0) || i.connectedAtMs - o.connectedAtMs
    ).slice(0, n).map((i) => i.addr);
    return r.length > 0 && me.info("re-homing bootstrap joiners", {
      prune: r.length,
      excess: n,
      degree: this.neighbors.size,
      maxNeighbors: e
    }), r;
  }
}
const hs = J("swarm.sched"), gb = 10;
class yb {
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
  logCap = re(gb);
  totals = {
    wantTimeouts: 0,
    progressTimeouts: 0,
    dupPulls: 0,
    deadlineSkips: 0
  };
  constructor(e) {
    this.chunkMs = e?.chunkMs ?? Xt, this.wantTimeoutChunks = e?.wantTimeoutChunks ?? vp, this.progressTimeoutChunks = e?.progressTimeoutChunks ?? kp, this.perPeerBudget = e?.maxInflightPerPeer ?? Rp, this.totalBudget = e?.maxInflightTotal ?? Op, this.duplicateWindowChunks = e?.duplicateWindowChunks ?? Sp, this.skipGraceChunks = e?.skipGraceChunks ?? _p;
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
  setPlayhead(e, s) {
    this.playheadInitialized = !0, this.playhead = e, this.playheadDueAtMs = s;
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
  advancePlayhead(e, s, n, r) {
    if (!this.playheadInitialized)
      return this.setPlayhead(e, s), [];
    const i = this.playhead;
    if (e <= i)
      return this.playheadDueAtMs !== null && this.playheadDueAtMs <= r && s !== null || (this.playheadDueAtMs = s), [];
    const o = [];
    for (let a = i; a < e; a++)
      !n(a) && !this.skipped.has(a) && o.push(a);
    return this.setPlayhead(e, s), o;
  }
  /** Feed an observed chunk duration (ms) into the pacing estimate. */
  observeChunkDur(e) {
    !Number.isFinite(e) || e <= 0 || (this.chunkDurEwmaMs = this.chunkDurEwmaMs === null ? e : 0.8 * this.chunkDurEwmaMs + 0.2 * e);
  }
  /** A slice of `seq` arrived from `peer`: re-arms its progress timeout.
   *  True when it is the first slice of that pull (the caller scores the
   *  want → first-slice latency); false for later slices and for slices of
   *  a pull already cancelled. */
  onSlice(e, s, n) {
    const r = this.inflight.get(e)?.find((i) => i.peer === s);
    return !r || (r.lastSliceAtMs = n, r.gotFirstSlice) ? !1 : (r.gotFirstSlice = !0, !0);
  }
  /** Chunk verified + stored. Clears all pulls for the seq (a concurrent
   *  duplicate pull is abandoned — its late slices get ignored). */
  onComplete(e) {
    this.inflight.delete(e), this.attempted.delete(e);
  }
  /** Peer denied the want — retry elsewhere immediately (next plan()). */
  onDeny(e, s) {
    const n = this.inflight.get(e)?.filter((r) => r.peer !== s) ?? [];
    n.length === 0 ? this.inflight.delete(e) : this.inflight.set(e, n), this.markAttempted(e, s);
  }
  /** Neighbor died: forget its pulls so they re-plan instantly (plan §6.4). */
  onPeerLost(e) {
    for (const [s, n] of this.inflight) {
      const r = n.filter((i) => i.peer !== e);
      r.length === 0 ? this.inflight.delete(s) : this.inflight.set(s, r);
    }
  }
  /** Host re-go-live: new epoch, new seq space. */
  reset() {
    hs.info("scheduler reset", { playhead: this.playhead, edge: this.edge }), this.logCap.reset(), this.playhead = 0, this.playheadDueAtMs = null, this.playheadInitialized = !1, this.chunkDurEwmaMs = null, this.edge = -1, this.inflight.clear(), this.attempted.clear(), this.skipped.clear();
  }
  markAttempted(e, s) {
    let n = this.attempted.get(e);
    n || this.attempted.set(e, n = /* @__PURE__ */ new Set()), n.add(s);
  }
  /** Chunk spacing D every timing rule is measured in: the observed EWMA
   *  once chunks have flowed, the configured chunkMs before that. */
  spacingMs() {
    return this.chunkDurEwmaMs ?? this.chunkMs;
  }
  /** Absolute deadline for a seq: when the playhead will reach it. With no
   *  player clock, deadlines are hypothetical — one chunk of slack each. */
  deadlineAt(e, s) {
    const n = this.spacingMs();
    return (this.playheadDueAtMs ?? s + n) + (e - this.playhead) * n;
  }
  /** ms until `seq` is due, for log lines. */
  remainingMs(e, s) {
    return Math.round(this.deadlineAt(e, s) - s);
  }
  inflightTotal() {
    let e = 0;
    for (const s of this.inflight.values()) e += s.length;
    return e;
  }
  inflightForPeer(e) {
    let s = 0;
    for (const n of this.inflight.values())
      for (const r of n) r.peer === e && s++;
    return s;
  }
  // ── Planning ───────────────────────────────────────────────────────────────
  /**
   * One planning pass: expire stale pulls, skip a dry playhead's missing run,
   * then fill budgets deadline-first. Call on every scheduling tick and after
   * any have/deny/complete event.
   */
  plan(e, s, n) {
    const r = [], i = [...s].sort((a, l) => l.score - a.score), o = this.spacingMs();
    for (const [a, l] of this.inflight) {
      const c = [];
      for (const d of l) {
        const u = e - d.sentAtMs, h = e - (d.lastSliceAtMs ?? d.sentAtMs);
        let f = null;
        if (!d.gotFirstSlice && u >= this.wantTimeoutChunks * o ? (f = "first-slice", this.totals.wantTimeouts++) : d.gotFirstSlice && h >= this.progressTimeoutChunks * o && (f = "progress", this.totals.progressTimeouts++), f === null) {
          c.push(d);
          continue;
        }
        this.markAttempted(a, d.peer), r.push({ type: "cancel", seq: a, peer: d.peer, reason: f }), this.logCap.allow(f) && hs.warn("pull timed out — re-requesting", {
          seq: a,
          peer: _(d.peer),
          reason: f,
          idleMs: Math.round(h),
          sinceWantMs: Math.round(u),
          remainingMs: this.remainingMs(a, e),
          timedOut: f === "first-slice" ? this.totals.wantTimeouts : this.totals.progressTimeouts
        });
      }
      c.length === 0 ? this.inflight.delete(a) : this.inflight.set(a, c);
    }
    if (this.edge < 0) return r;
    this.skipDryRun(e, n, o, r);
    for (let a = this.playhead; a <= this.edge; a++) {
      if (n(a) || this.skipped.has(a)) continue;
      const l = this.deadlineAt(a, e), c = this.inflight.get(a) ?? [], d = c.length === 0, u = c.length === 1 && this.playheadDueAtMs !== null && l - e < this.duplicateWindowChunks * o;
      if (!d && !u || this.inflightTotal() >= this.totalBudget) continue;
      const h = new Set(c.map((p) => p.peer)), f = this.pickPeer(a, i, h);
      if (!f) {
        d && this.attempted.delete(a);
        continue;
      }
      const g = c[0];
      c.push({ peer: f, sentAtMs: e, gotFirstSlice: !1, lastSliceAtMs: null }), this.inflight.set(a, c);
      const m = Math.max(0, Math.round(l - e));
      u ? (r.push({ type: "want", seq: a, peer: f, deadlineMs: m, duplicate: !0 }), this.totals.dupPulls++, this.logCap.allow("duplicate") && hs.warn("duplicate pull", {
        seq: a,
        peer: _(f),
        firstPeer: _(g.peer),
        remainingMs: Math.round(l - e),
        sinceWantMs: Math.round(e - g.sentAtMs),
        duplicates: this.totals.dupPulls
      })) : r.push({ type: "want", seq: a, peer: f, deadlineMs: m });
    }
    return r.length > 0 && this.logPlan(r), r;
  }
  /** Step 2 of plan(): skip [playhead, nextHeld) once the player has been dry
   *  for the grace and a later chunk is held to hop to. */
  skipDryRun(e, s, n, r) {
    const i = this.playheadDueAtMs, o = this.playhead;
    if (i === null || o > this.edge || s(o) || this.skipped.has(o) || e < i + this.skipGraceChunks * n) return;
    let a = -1;
    for (let c = o + 1; c <= this.edge; c++)
      if (s(c)) {
        a = c;
        break;
      }
    if (a === -1) return;
    const l = [];
    for (let c = o; c < a; c++)
      if (!this.skipped.has(c)) {
        this.skipped.add(c);
        for (const d of this.inflight.get(c) ?? [])
          r.push({ type: "cancel", seq: c, peer: d.peer, reason: "deadline" }), l.push(_(d.peer));
        this.inflight.delete(c), this.attempted.delete(c), r.push({ type: "skip", seq: c }), this.totals.deadlineSkips++;
      }
    this.logCap.allow("skip") && hs.warn("deadline missed — skipping chunk", {
      seq: o,
      run: [o, a],
      hopTo: a,
      playhead: o,
      edge: this.edge,
      peers: l,
      lateMs: Math.round(e - i),
      remainingMs: Math.round(i - e),
      skipped: this.totals.deadlineSkips
    });
  }
  /** One tick summary instead of a line per action. */
  logPlan(e) {
    if (!hs.on("debug")) return;
    let s = 0, n = 0, r = 0;
    for (const i of e)
      i.type === "want" ? s++ : i.type === "cancel" ? n++ : r++;
    hs.debug("plan", {
      wants: s,
      cancels: n,
      skips: r,
      inflight: this.inflightTotal(),
      playhead: this.playhead,
      edge: this.edge
    });
  }
  /** Best-scored neighbor that has the seq, wasn't tried, and has budget. */
  pickPeer(e, s, n) {
    const r = this.attempted.get(e);
    for (const i of s)
      if (!(n.has(i.addr) || r?.has(i.addr)) && i.has(e) && !(this.inflightForPeer(i.addr) >= this.perPeerBudget))
        return i.addr;
    return null;
  }
  // ── Introspection (stats / tests) ──────────────────────────────────────────
  inflightSnapshot() {
    return [...this.inflight.entries()].map(([e, s]) => ({ seq: e, peers: s.map((n) => n.peer) })).sort((e, s) => e.seq - s.seq);
  }
  get skippedSeqs() {
    return [...this.skipped].sort((e, s) => e - s);
  }
}
const wb = 0.9;
function bb(t, e) {
  let s = 0, n = 0, r = 0, i = 0, o = 0;
  for (const c of t) {
    if (c.samples < e.windowSamples) continue;
    o = Math.max(o, c.max);
    const d = c.last.sent - c.first.sent, u = c.last.buffered - c.first.buffered;
    d === 0 && u === 0 || (s++, r += Math.max(0, d - u), c.min >= e.backlogBytes && (n++, i += c.min));
  }
  const a = n >= Math.max(2, Math.ceil(s / 2)), l = e.windowMs > 0 ? r * 8 * 1e3 / e.windowMs : 0;
  return {
    samples: e.windowSamples,
    active: s,
    backedUp: n,
    majority: a,
    drainedBytes: r,
    settledBytes: i,
    measuredBps: l,
    maxBuffered: o
  };
}
const cc = (t, e, s) => Math.min(s, Math.max(e, t));
function vb(t, e, s) {
  const { floorBps: n, ceilingBps: r } = s, i = [];
  let o = cc(t.budgetBps, n, r);
  const a = t.settledPrev !== null && e.settledBytes < wb * t.settledPrev, l = t.starvedRun > 0;
  if (e.majority) {
    if (e.samples >= xl && !a) {
      const u = cc(Math.min(o, Mp * e.measuredBps), n, r);
      u < o && (o = u, l && u <= n || i.push("cut"));
    }
  } else e.samples >= 1 && o < r && (o = Math.min(r, Bp * o), o >= r && i.push("restored"));
  let { starvedRun: c, starved: d } = t;
  return e.majority ? (c = o <= n ? c + 1 : 0, !d && c >= Ip && (d = !0, i.push("starved"))) : (c = 0, d && (d = !1, i.push("recovered"))), {
    state: { budgetBps: o, settledPrev: e.settledBytes, starvedRun: c, starved: d },
    events: i
  };
}
const ot = J("swarm.serve"), Sb = 5, _b = 6e4, xb = 0.2, kb = 10, lc = pt, Jr = () => Object.fromEntries(Bl.options.map((t) => [t, 0]));
class ar {
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
  denyCap = re(Sb);
  dangerCap = re(kb);
  ceilingCap = re(1);
  queuedSinceRollup = 0;
  servedSinceRollup = 0;
  bytesSinceRollup = 0;
  hostOnlySinceRollup = 0;
  deniedSinceRollup = Jr();
  rollupStartMs = null;
  deniedTotal = Jr();
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
    this.ceilingBps = e?.uploadBudgetBps ?? bp, this.budgetBps = this.ceilingBps, this.budgetState = { budgetBps: this.budgetBps, settledPrev: null, starvedRun: 0, starved: !1 }, this.maxQueueDepth = e?.maxQueueDepth ?? 32, this.fanoutCap = e?.fanoutCap === void 0 ? null : e.fanoutCap, this.chunkMs = e?.chunkMs ?? Xt, this.tokens = this.budgetBps / 8;
  }
  static host(e) {
    return new ar({ ...e, fanoutCap: yp });
  }
  /** The observed chunk spacing (the node's Scheduler.spacingMs, each tick):
   *  the danger zone and the expiry grace are measured in it. */
  setChunkMs(e) {
    Number.isFinite(e) && e > 0 && (this.chunkMs = e);
  }
  refill(e) {
    if (this.lastRefillMs !== null && e > this.lastRefillMs) {
      const s = this.budgetBps / 8;
      this.tokens = Math.min(s, this.tokens + (e - this.lastRefillMs) / 1e3 * s);
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
  request(e, s, n, r, i) {
    if (this.refill(r), i?.hasChunk === !1) return this.deny("missing", e, s);
    if (this.queue.length >= this.maxQueueDepth) return this.deny("busy", e, s);
    if (this.tokens < lc) return this.deny("budget", e, s);
    const o = this.fanoutCap !== null && (this.servedCount.get(s) ?? 0) >= this.fanoutCap, a = i?.hostOnly === "carried" && !this.carriedServed.get(s)?.has(e);
    if (o && i?.hostOnly === "refused") return this.deny("fanout", e, s, "host-full");
    if (o && !a) {
      if (!(n < Cp * this.chunkMs && i?.othersHave === !1) || this.dangerUsed.has(s))
        return this.deny("fanout", e, s);
      this.dangerUsed.add(s), this.dangerServes++, this.dangerCap.allow() && ot.info("fanout cap overridden: requester in its danger zone", {
        peer: _(e),
        seq: s,
        deadlineMs: n,
        dangerServes: this.dangerServes
      });
    }
    this.queue = this.queue.filter((c) => !(c.peer === e && c.seq === s));
    const l = { peer: e, seq: s, deadlineAtMs: r + n, enqueuedAtMs: r };
    return a && (l.carried = !0, l.overCap = o), this.queue.push(l), this.queuedSinceRollup++, { kind: "queued" };
  }
  countDeny(e) {
    this.deniedTotal[e]++, this.deniedSinceRollup[e]++;
  }
  /** One line per deny reason while it is new, then a count only. */
  deny(e, s, n, r) {
    return this.countDeny(e), this.denyCap.allow(e) && ot.debug(`want denied: ${e}`, {
      peer: _(s),
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
  hold(e, s) {
    return s - e.enqueuedAtMs >= Ep * this.chunkMs ? (this.countDeny("busy"), "deny") : (this.queue.push(e), "held");
  }
  /** Requester lost interest (re-pulled elsewhere, disconnected). */
  cancel(e, s) {
    this.queue = this.queue.filter((n) => n.peer !== e || s !== void 0 && n.seq !== s);
  }
  /**
   * Pop the next request to serve, or null when idle / out of budget:
   * carried first, then deadline, then least-recently-served requester.
   * Requests more than SERVE_EXPIRY_GRACE_CHUNKS past their deadline are
   * dropped — the requester has skipped that chunk by then.
   */
  next(e) {
    if (this.refill(e), this.tokens < lc) return null;
    const s = Tp * this.chunkMs;
    if (this.queue = this.queue.filter((r) => r.deadlineAtMs + s > e), this.queue.length === 0) return null;
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
  onServed(e, s, n) {
    if (this.refill(n), this.tokens -= s, e.carried) {
      const r = this.carriedServed.get(e.seq) ?? /* @__PURE__ */ new Set();
      r.add(e.peer), this.carriedServed.set(e.seq, r);
    } else
      this.servedCount.set(e.seq, (this.servedCount.get(e.seq) ?? 0) + 1);
    e.overCap && (this.hostOnlyServedTotal++, this.hostOnlySinceRollup++), this.lastServedAt.set(e.peer, n), this.servedSinceRollup++, this.bytesSinceRollup += s;
  }
  // ── Measured budget ──────────────────────────────────────────────────────
  /** Feed one chunk (seeded or verified) into the stream-rate EWMAs. */
  observeChunk(e, s) {
    if (!Number.isFinite(e) || e <= 0 || !Number.isFinite(s) || s <= 0) return;
    const n = xb;
    this.chunkBytesEwma = this.chunkBytesEwma === null ? e : (1 - n) * this.chunkBytesEwma + n * e, this.chunkMsEwma = this.chunkMsEwma === null ? s : (1 - n) * this.chunkMsEwma + n * s;
  }
  /** Chunk duration from the stream EWMAs: paces the stream rate and the
   *  budget window. Kept apart from `chunkMs` (the scheduler's spacing, which
   *  the danger zone, expiry grace and hold limit use): that one restarts on
   *  an epoch reset, and these EWMAs carry over it. */
  get streamChunkMs() {
    return this.chunkMsEwma ?? Xt;
  }
  get chunkBytes() {
    return this.chunkBytesEwma ?? (Sl + _l) * Xt / 8e3;
  }
  get streamBps() {
    return this.chunkBytes * 8 * 1e3 / this.streamChunkMs;
  }
  get floorBps() {
    return Math.min(this.ceilingBps, Or * this.streamBps);
  }
  get windowMs() {
    return Math.max(this.streamChunkMs, xl * _i);
  }
  /**
   * One tick's sample of every open link's bulk queue. Accumulates the
   * window; at its edge, sizes the budget from what the queues drained.
   * Also drives the time-based roll-up line.
   */
  observeLinks(e, s) {
    this.windowStartMs === null && (this.windowStartMs = s, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map()), this.windowSamples++;
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
    s - this.windowStartMs >= this.windowMs && (this.closeWindow(s - this.windowStartMs, s), this.windowStartMs = null), this.rollup(s);
  }
  closeWindow(e, s) {
    const n = bb(this.linkWindows.values(), {
      windowSamples: this.windowSamples,
      backlogBytes: Ap * this.chunkBytes,
      windowMs: e
    });
    this.linkWindows = /* @__PURE__ */ new Map(), this.measuredBps = n.measuredBps, this.backedUpLinks = n.backedUp, this.maxBufferedBytes = n.maxBuffered;
    const r = this.streamBps, i = this.floorBps;
    this.ceilingBps < Or * r && this.ceilingCap.allow() && ot.warn("upload ceiling below one full-rate copy", {
      ceilingBps: this.ceilingBps,
      floorBps: Math.round(Or * r),
      streamBps: Math.round(r)
    });
    const o = this.budgetBps, { state: a, events: l } = vb(this.budgetState, n, {
      floorBps: i,
      ceilingBps: this.ceilingBps
    });
    this.budgetState = a, a.budgetBps !== o && (this.refill(s), this.budgetBps = a.budgetBps, this.tokens = Math.min(this.tokens, this.budgetBps / 8));
    for (const c of l)
      switch (c) {
        case "cut":
          this.cuts++, this.limitedSinceMs ??= s, ot.info("upload budget cut", {
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
            limitedMs: this.limitedSinceMs === null ? null : s - this.limitedSinceMs
          }), this.limitedSinceMs = null;
          break;
        case "starved":
          this.starvedSinceMs = s, ot.warn("upload starved", {
            budgetBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            streamBps: Math.round(r),
            backedUp: n.backedUp
          });
          break;
        case "recovered":
          ot.info("upload recovered", {
            starvedMs: this.starvedSinceMs === null ? null : s - this.starvedSinceMs
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
    const s = e - this.rollupStartMs;
    if (s < _b) return null;
    const n = Object.values(this.deniedSinceRollup).reduce((o, a) => o + a, 0), i = this.queuedSinceRollup + this.servedSinceRollup + n === 0 ? null : {
      periodMs: s,
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
    this.queuedSinceRollup = 0, this.servedSinceRollup = 0, this.bytesSinceRollup = 0, this.hostOnlySinceRollup = 0, this.deniedSinceRollup = Jr();
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
const z = J("swarm.node"), Eb = 6e4, dc = 5;
class Tb {
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
  lagChunksValue = up;
  callbacks;
  now;
  /** Fed by noteEdge: one observation per edge advance. */
  edgeCadence;
  book;
  store;
  scheduler;
  serve;
  dedup = new ab();
  presence = new cb();
  reactionLimiter = new lb(
    Hp,
    zp
  );
  assembler = new Tm();
  /** The last CHAT_BACKLOG_LINES chat lines of this epoch, for new neighbors. */
  chatLog = [];
  /** Which epoch the neighbors' hellos say is current (assessment gap 13). */
  epochVotes = new ib();
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
  dialCap = re(dc);
  sigCap = re(20);
  expiryCap = re(dc);
  /** Held-serve denies repeat while a requester's link stays congested. */
  heldCap = re(10);
  /** Host-only peers already logged as carried (one line each). */
  carriedLogged = /* @__PURE__ */ new Set();
  /** A refused host-only viewer re-wants every chunk. */
  refusedCap = re(5);
  constructor(e) {
    if (this.selfAddr = e.selfAddr, this.selfName = e.selfName, this.role = e.role, this.epoch = e.epoch, this.streamPubKeyHex = e.streamPubKeyHex, this.boxKey = e.boxKey, this.streamKey = e.streamKey ?? null, this.chunkMs = e.chunkMs ?? Xt, this.isResponder = e.responder ?? !1, this.callbacks = e.callbacks ?? {}, this.now = e.now ?? (() => Date.now()), e.role === "host" && !e.streamKey)
      throw new Error("host SwarmNode needs the stream signing key");
    this.book = e.role === "host" ? new ac(e.selfAddr, { minDegree: 0, targetDegree: 0, maxDegree: la }) : new ac(e.selfAddr, { hostAddr: e.hostAddr }), this.store = new nb(vi), this.store.reset(this.epoch), this.scheduler = new yb({
      chunkMs: this.chunkMs,
      wantTimeoutChunks: e.wantTimeoutChunks
    }), this.edgeCadence = new nd(this.chunkMs);
    const s = e.fanoutCap !== void 0 ? e.fanoutCap : e.role === "host" ? void 0 : null;
    this.serve = s === void 0 ? ar.host({ uploadBudgetBps: e.uploadBudgetBps, chunkMs: this.chunkMs }) : new ar({
      uploadBudgetBps: e.uploadBudgetBps,
      fanoutCap: s,
      chunkMs: this.chunkMs
    });
  }
  // ── Lifecycle ──────────────────────────────────────────────────────────────
  start() {
    if (this.running) return;
    this.running = !0, z.info("node started", {
      self: _(this.selfAddr),
      role: this.role,
      epoch: this.epoch,
      tickMs: _i
    });
    const e = this.now();
    this.lastSummaryAt = e, this.lastPresenceAt = e, this.lastPexAt = e, this.lastLinkSummaryAt = e, this.tickTimer = setInterval(() => this.tick(), _i);
  }
  /** Tear down. `silent` skips the bye (spike uses it to simulate a crash). */
  stop(e) {
    z.info("node stopped", {
      role: this.role,
      neighbors: this.peers.size,
      silent: e?.silent ?? !1,
      ...this.counters
    }), this.tickTimer && (clearInterval(this.tickTimer), this.tickTimer = null), this.running = !1;
    for (const s of this.peers.values())
      e?.silent || s.sendCtrl({ v: ge, t: "bye" }), s.close();
    for (const s of this.dials.values()) s.peer.close();
    this.peers.clear(), this.dials.clear(), this.attachOpts.clear(), this.neighborHaves.clear();
  }
  /** Host re-go-live / heartbeat announced a new epoch: new seq space. */
  resetEpoch(e, s) {
    z.info("epoch reset", {
      from: this.epoch,
      to: e,
      rekeyed: s !== void 0,
      pendingVerify: this.pendingVerify.size
    }), this.epoch = e, s && (this.streamPubKeyHex = s), this.store.reset(e), this.scheduler.reset(), this.edgeCadence.reset(), this.serve.reset(), this.assembler.clear(), this.metas.clear(), this.pendingVerify.clear(), this.wantSentAt.clear(), this.heldCap.reset(), this.chatLog = [];
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
  considerEpoch(e, s, n) {
    this.epochVotes.record(e, s, n);
    const r = this.epochVotes.decide(this.epoch);
    if (r) {
      if (r.viaHost) {
        this.resetEpoch(r.epoch), this.callbacks.onEpochReset?.(r.epoch);
        return;
      }
      r.epoch <= this.suspectedEpoch || (this.suspectedEpoch = r.epoch, z.info("neighbors agree on a newer epoch — asking for the heartbeat", {
        from: this.epoch,
        to: r.epoch,
        voters: r.voters.map(_)
      }), this.callbacks.onEpochSuspected?.(r.epoch));
    }
  }
  // ── Peers in/out ───────────────────────────────────────────────────────────
  /**
   * Adopt a SwarmPeer (from joinSignaling or a mesh dial): wires handlers and,
   * once both channels are open, adds it to the neighbor set + says hello.
   */
  attachPeer(e, s) {
    z.debug("peer attached", {
      peer: _(e.addr),
      isHostLink: s?.isHostLink ?? !1,
      responder: s?.responder ?? !1,
      alreadyOpen: e.isOpen
    }), this.attachOpts.set(e.addr, s ?? {}), e.setHandlers({
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
    const s = this.peers.get(e.addr);
    s && s !== e && (this.epochVotes.forget(e.addr), s.close()), this.peers.set(e.addr, e), this.dials.delete(e.addr);
    const n = this.attachOpts.get(e.addr) ?? {};
    this.book.addNeighbor(e.addr, e.addr, this.now(), {
      isHostLink: n.isHostLink,
      responder: n.responder
    }), this.book.recordMeshLinkOpened(e.addr), this.neighborHaves.has(e.addr) || this.neighborHaves.set(e.addr, /* @__PURE__ */ new Set());
    const r = this.store.summary();
    e.sendCtrl({
      v: ge,
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
    }), z.debug("hello sent", {
      peer: _(e.addr),
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
  removePeer(e, s) {
    const n = this.peers.get(e);
    n && (z.info("link dropped", {
      peer: _(e),
      notice: s?.t ?? null,
      reason: s?.t === "prune" ? s.reason : null,
      degree: this.peers.size - 1
    }), s && n.sendCtrl(s), this.peers.delete(e), this.attachOpts.delete(e), this.neighborHaves.delete(e), this.epochVotes.forget(e), this.book.removeNeighbor(e), this.scheduler.onPeerLost(e), this.serve.cancel(e), this.carriedLogged.delete(e), n.close(), this.role === "viewer" && this.peers.size === 1 && (z.info("summary sent early: degree dropped", { degree: this.peers.size }), this.sendSummary(this.now())), this.callbacks.onPeersChanged?.());
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
      return this.testDropSeedsLeft--, z.warn("test hook dropped a seeded chunk", { seq: e.seq }), null;
    let s = e;
    if (this.testPoisonSeedsLeft > 0) {
      this.testPoisonSeedsLeft--;
      const r = e.payload.slice();
      for (let i = 4; i < Math.min(8, r.length); i++) r[i] ^= 255;
      s = { ...e, payload: r }, z.warn("test hook poisoned a seeded chunk", { seq: e.seq });
    }
    const n = Yw(this.streamKey, s, this.epoch);
    return this.store.insert({ meta: n, payload: s.payload }), this.serve.observeChunk(s.payload.length, n.durUs / 1e3), this.metas.set(n.seq, n), this.noteEdge(n.seq, this.now()), this.scheduler.observeChunkDur(n.durUs / 1e3), this.broadcastHave(n.seq), this.callbacks.onChunk?.(n, s.payload, "self"), n;
  }
  // ── Gossip out ─────────────────────────────────────────────────────────────
  /** Fields every flooded message carries (plan §5): dedup id = from:ts:nonce. */
  floodFields() {
    return {
      v: ge,
      from: this.selfAddr,
      ts: this.now(),
      nonce: Math.random().toString(36).slice(2, 10)
    };
  }
  /** Send a flooded message we authored (chat/reaction/poll/presence/end). */
  flood(e) {
    z.debug("flood tx", { type: e.t, neighbors: this.peers.size }), this.dedup.firstSight(vt(e), this.now()), e.t === "chat" && this.logChat(e), this.forwardFlood(e, null);
  }
  logChat(e) {
    const s = vt(e);
    this.chatLog.some((n) => vt(n) === s) || (this.chatLog.push(e), this.chatLog.length > Vp && this.chatLog.shift());
  }
  forwardFlood(e, s) {
    for (const [n, r] of this.peers)
      n !== s && r.sendCtrl(e);
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
  noteEdge(e, s) {
    const n = this.scheduler.edgeSeq;
    this.scheduler.updateEdge(e);
    const r = this.scheduler.edgeSeq;
    r > n && this.edgeCadence.observe(s, r - n);
  }
  // ── Ctrl dispatch ──────────────────────────────────────────────────────────
  handleCtrl(e, s) {
    const n = this.now();
    switch (s.t) {
      case "hello": {
        const r = this.book.get(e.addr);
        r && (r.name = s.name, r.responder = s.responder ?? !1, r.boxPub = s.boxPub ?? r.boxPub), this.book.recordDegreeReport(e.addr, s.degree, s.relayOnly), r && this.role === "viewer" && this.considerEpoch(e.addr, s.epoch, r.isHostLink), this.neighborHaves.set(e.addr, ma(s.have)), this.noteEdge(s.edgeSeq, n);
        break;
      }
      case "have": {
        this.neighborHaves.get(e.addr)?.add(s.seq), this.noteEdge(Math.max(s.seq, s.edgeSeq), n);
        break;
      }
      case "summary": {
        this.neighborHaves.set(
          e.addr,
          ma({ base: s.base, bitmapHex: s.bitmapHex })
        ), this.book.recordSummary(e.addr, n, s.degree, s.relayOnly), this.noteEdge(s.edgeSeq, n);
        break;
      }
      case "want":
        this.handleWant(e, s.seq, s.deadlineMs);
        break;
      case "deny": {
        this.scheduler.onDeny(s.seq, e.addr), this.book.recordDeny(e.addr), this.wantSentAt.delete(`${s.seq}:${e.addr}`), s.detail === "host-full" && (this.lastHostFullDenyAt = n, this.counters.hostFullDenies++);
        break;
      }
      case "meta":
        this.handleMeta(e, s.meta);
        break;
      case "pex": {
        this.book.addCandidates(
          s.peers.filter((r) => r.addr !== this.selfAddr),
          this.now()
        );
        break;
      }
      case "sig":
        this.handleSig(e, s);
        break;
      case "end": {
        if (!this.dedup.firstSight(vt(s), n)) break;
        if (z.info("stream end received", { from: _(s.from), epoch: s.epoch }), !tb(this.streamPubKeyHex, s.epoch, s.sig)) {
          this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
          break;
        }
        this.forwardFlood(s, e.addr), this.callbacks.onEnd?.(s.epoch);
        break;
      }
      case "presence": {
        if (!this.dedup.firstSight(vt(s), n)) break;
        z.debug("flood rx", { type: s.t, from: _(s.from), via: _(e.addr) }), this.presence.touch(s.from, s.name, s.ts, n), this.forwardFlood(s, e.addr), this.callbacks.onFlood?.(s);
        break;
      }
      case "reaction": {
        if (!this.dedup.firstSight(vt(s), n) || !this.reactionLimiter.allow(s.from, n)) break;
        z.debug("flood rx", { type: s.t, from: _(s.from), via: _(e.addr) }), this.forwardFlood(s, e.addr), this.callbacks.onFlood?.(s);
        break;
      }
      case "chat":
      case "poll-open":
      case "poll-vote":
      case "poll-tally":
      case "poll-close": {
        if (!this.dedup.firstSight(vt(s), n)) break;
        z.debug("flood rx", { type: s.t, from: _(s.from), via: _(e.addr) }), s.t === "chat" && this.logChat(s), this.forwardFlood(s, e.addr), this.callbacks.onFlood?.(s);
        break;
      }
      case "chat-backlog": {
        if (s.epoch !== this.epoch || !this.dedup.firstSight(vt(s), n)) break;
        const { epoch: r, ...i } = s, o = { ...i, t: "chat" };
        this.logChat(o), this.callbacks.onFlood?.(o);
        break;
      }
      case "bye": {
        this.presence.remove(e.addr), this.removePeer(e.addr);
        break;
      }
      case "prune": {
        z.info("pruned by neighbor", {
          peer: _(e.addr),
          reason: s.reason,
          degree: this.peers.size - 1
        }), s.reason === "scoring" && this.book.banCandidate(e.addr, n), this.removePeer(e.addr);
        break;
      }
    }
  }
  // ── Serving (plan §7.2) ────────────────────────────────────────────────────
  handleWant(e, s, n) {
    const r = this.now(), i = this.store.has(s);
    let o = !1;
    for (const [c, d] of this.neighborHaves)
      if (c !== e.addr && d.has(s)) {
        o = !0;
        break;
      }
    const a = this.hostOnlyStatus(e.addr), l = this.serve.request(e.addr, s, n, r, {
      hasChunk: i,
      othersHave: o,
      hostOnly: a
    });
    if (l.kind === "deny") {
      e.sendCtrl({ v: ge, t: "deny", seq: s, reason: l.reason, detail: l.detail }), l.detail === "host-full" && this.refusedCap.allow() && z.warn("host-only slots full: requester refused", {
        peer: _(e.addr),
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
    return this.testHostOnlySlotsOverride ?? Math.min(Zp, Math.max(0, this.serve.upload.copies - 1));
  }
  hostOnlyNeighborCount() {
    return this.book.list().filter((e) => this.book.hostOnly(e)).length;
  }
  /** Host only: a requester that reaches nobody but us holds a seat
   *  ('carried') or is past the seats ('refused'); anyone else, undefined. */
  hostOnlyStatus(e) {
    if (this.role !== "host") return;
    const s = this.book.get(e);
    if (!s || !this.book.hostOnly(s)) return;
    const n = this.hostOnlySlots();
    return this.book.hostOnlyCarried(n).has(e) ? (this.carriedLogged.has(e) || (this.carriedLogged.add(e), z.info("host-only neighbor carried past the fanout cap", {
      peer: _(e),
      source: s.relayOnly ? "advertised" : "degree",
      remoteDegree: s.remoteDegree,
      slots: n
    })), "carried") : "refused";
  }
  /** Drain the serve queue while bulk channels have headroom (plan §5). */
  pumpServe() {
    const e = this.now(), s = [];
    for (; ; ) {
      const n = this.serve.next(e);
      if (!n) break;
      const r = this.peers.get(n.peer);
      if (r?.isOpen) {
        if (r.bulkBufferedAmount > Tl) {
          s.push(n);
          continue;
        }
        this.serveChunk(r, n, e);
      }
    }
    for (const n of s) {
      if (this.serve.hold(n, e) === "held") continue;
      const r = this.peers.get(n.peer);
      r?.sendCtrl({ v: ge, t: "deny", seq: n.seq, reason: "busy" }), this.counters.heldDenies++, this.heldCap.allow() && z.warn("serve held too long — denying", {
        peer: _(n.peer),
        seq: n.seq,
        heldMs: Math.round(e - n.enqueuedAtMs),
        bufferedAmount: r?.bulkBufferedAmount ?? 0,
        heldDenies: this.counters.heldDenies
      });
    }
  }
  serveChunk(e, s, n) {
    const r = this.store.get(s.seq);
    if (!r) {
      e.sendCtrl({ v: ge, t: "deny", seq: s.seq, reason: "missing" });
      return;
    }
    let i = r.payload;
    const o = this.testCorruptServes.get(s.peer);
    o && (i = i.slice(), i[0] ^= 255, o <= 1 ? this.testCorruptServes.delete(s.peer) : this.testCorruptServes.set(s.peer, o - 1), this.testCorruptedServeCount += 1, z.warn("test hook corrupted a served chunk", {
      seq: s.seq,
      peer: _(s.peer)
    })), e.sendCtrl({ v: ge, t: "meta", meta: r.meta });
    const a = Em(this.epoch, s.seq, i), l = this.testDelayServes.get(s.peer);
    if (l && a.length > 1)
      l.left <= 1 ? this.testDelayServes.delete(s.peer) : l.left--, this.testDelayedServeCount += 1, z.warn("test hook delayed a served chunk", {
        seq: s.seq,
        peer: _(s.peer),
        delayMs: l.delayMs
      }), e.sendSlice(a[0]), setTimeout(() => {
        if (e.isOpen)
          for (const c of a.slice(1)) e.sendSlice(c);
      }, l.delayMs);
    else
      for (const c of a) e.sendSlice(c);
    this.serve.onServed(s, r.payload.length, n), this.counters.chunksServed++, this.counters.upBytes += r.payload.length;
  }
  // ── Receiving chunks (plan §4, §7.1) ───────────────────────────────────────
  handleMeta(e, s) {
    if (s.epoch !== this.epoch) return;
    if (!this.metas.has(s.seq)) {
      if (!Qw(this.streamPubKeyHex, s)) {
        z.warn("chunk meta rejected", { from: _(e.addr), seq: s.seq }), this.counters.badChunks++, this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
        return;
      }
      this.metas.set(s.seq, s);
    }
    this.noteEdge(s.seq, this.now());
    const n = this.pendingVerify.get(s.seq);
    n && (this.pendingVerify.delete(s.seq), this.finalizeChunk(s.seq, n.payload, n.from));
  }
  handleSlice(e, s) {
    if (s.epochLow !== Bn(this.epoch) || this.store.has(s.seq)) return;
    const n = this.assembler.add(s);
    switch (n.kind) {
      case "invalid":
        this.counters.invalidSlices++;
        break;
      case "progress": {
        const r = this.now();
        if (this.scheduler.onSlice(s.seq, e.addr, r)) {
          const i = this.wantSentAt.get(`${s.seq}:${e.addr}`);
          i !== void 0 && this.book.recordFirstSlice(e.addr, (r - i) / this.scheduler.spacingMs());
        }
        break;
      }
      case "done":
        this.finalizeChunk(s.seq, n.payload, e.addr);
        break;
    }
  }
  finalizeChunk(e, s, n) {
    const r = this.metas.get(e);
    if (!r) {
      this.pendingVerify.set(e, { payload: s, from: n, atMs: this.now() });
      return;
    }
    if (!Jw(this.streamPubKeyHex, r, s)) {
      z.warn("chunk rejected: verification failed", {
        from: _(n),
        seq: e,
        bytes: s.length
      }), this.counters.badChunks++, this.scheduler.onDeny(e, n), this.book.recordBadChunk(n) && this.removePeer(n);
      return;
    }
    if (!this.store.insert({ meta: r, payload: s })) return;
    const i = this.book.get(n);
    i && this.book.isHost(i) && (this.lastHostChunkAt = this.now()), this.scheduler.onComplete(e), this.scheduler.observeChunkDur(r.durUs / 1e3), this.serve.observeChunk(s.length, r.durUs / 1e3), this.book.recordFulfilled(n);
    const o = `${e}:${n}`, a = this.wantSentAt.get(o);
    a !== void 0 && (this.book.recordDelivery(n, s.length, this.now() - a), this.wantSentAt.delete(o)), this.counters.chunksReceived++, this.counters.downBytes += s.length, this.receivedFrom.set(n, (this.receivedFrom.get(n) ?? 0) + 1), this.broadcastHave(e), this.callbacks.onChunk?.(r, s, n);
  }
  broadcastHave(e) {
    const s = { v: ge, t: "have", seq: e, edgeSeq: this.store.edgeSeq };
    for (const n of this.peers.values()) n.sendCtrl(s);
  }
  // ── Relayed SDP (plan §6.3) ────────────────────────────────────────────────
  handleSig(e, s) {
    if (s.path.includes(this.selfAddr)) return;
    if (s.target === this.selfAddr) {
      s.kind === "offer" ? this.answerMeshOffer(s, e.addr) : this.completeMeshDial(s);
      return;
    }
    if (s.path.length > Si) {
      this.sigCap.allow("hop-cap") && z.debug("sig dropped: hop cap reached", {
        target: _(s.target),
        hops: s.path.length,
        cap: Si
      });
      return;
    }
    const n = { ...s, path: [...s.path, this.selfAddr] };
    let r = 0;
    const i = this.peers.get(s.target);
    if (i) {
      i.sendCtrl(n), this.counters.sigForwarded++, this.logSigForward(s, 1);
      return;
    }
    for (const [o, a] of this.peers)
      o === e.addr || s.path.includes(o) || (a.sendCtrl(n), this.counters.sigForwarded++, r++);
    this.logSigForward(s, r);
  }
  /** The relay line repeats on a busy mesh — cap it, then count only. */
  logSigForward(e, s) {
    s === 0 || !this.sigCap.allow() || z.debug("sig relayed", {
      kind: e.kind,
      from: _(e.from),
      target: _(e.target),
      hops: e.path.length,
      fanout: s,
      relayed: this.sigCap.count()
    });
  }
  /** Route a sig we authored: straight to the target if it's (about to be) a
   *  neighbor's job to deliver; prefer the link the counterpart used. */
  routeSig(e, s) {
    if (!(s && this.peers.get(s)?.sendCtrl(e)))
      for (const n of this.peers.values()) n.sendCtrl(e);
  }
  /** Dial a PEX/seed candidate over the mesh — no Statement Store involved. */
  async meshDial(e) {
    const s = e.addr;
    if (s === this.selfAddr || this.peers.has(s) || this.dials.has(s)) return;
    if (!e.boxPub) {
      this.dialCap.allow("no-box-key") && z.warn("mesh dial skipped: candidate has no box key", {
        target: _(s),
        skipped: this.dialCap.count("no-box-key")
      });
      return;
    }
    z.debug("mesh dial started", { target: _(s), degree: this.peers.size });
    const n = new Di(s, { gatherTimeoutMs: da });
    this.dials.set(s, { peer: n, atMs: this.now(), outbound: !0 }), this.attachPeer(n);
    try {
      const r = await n.createOffer();
      this.routeSig({
        v: ge,
        t: "sig",
        target: s,
        from: this.selfAddr,
        kind: "offer",
        sealed: await Oi(e.boxPub, r.sdp ?? ""),
        boxPub: this.boxKey.publicKeyHex,
        path: [this.selfAddr]
      });
    } catch (r) {
      z.warn("mesh dial failed", { target: _(s), err: r }), this.dials.delete(s), n.close();
    }
  }
  async answerMeshOffer(e, s) {
    if (this.testRefuseMeshDialsOn) return;
    if (this.peers.has(e.from)) {
      this.dialCap.allow("offer-from-neighbor") && z.info("mesh offer ignored: still linked to the sender", {
        from: _(e.from),
        ignored: this.dialCap.count("offer-from-neighbor")
      });
      return;
    }
    let n;
    try {
      n = await Pi(this.boxKey, e.sealed);
    } catch {
      z.warn("mesh offer dropped: the sealed sdp did not open", {
        from: _(e.from),
        via: _(s)
      });
      return;
    }
    const r = this.dials.get(e.from);
    if (r) {
      if (z.debug("mesh dial glare", {
        from: _(e.from),
        ourOfferWins: this.selfAddr < e.from
      }), this.selfAddr < e.from) return;
      r.peer.close(), this.dials.delete(e.from);
    }
    const i = new Di(e.from, { gatherTimeoutMs: da });
    this.dials.set(e.from, { peer: i, atMs: this.now(), outbound: !1 }), this.attachPeer(i);
    try {
      const o = await i.acceptOffer({ type: "offer", sdp: n });
      this.routeSig(
        {
          v: ge,
          t: "sig",
          target: e.from,
          from: this.selfAddr,
          kind: "answer",
          sealed: await Oi(e.boxPub, o.sdp ?? ""),
          boxPub: this.boxKey.publicKeyHex,
          path: [this.selfAddr]
        },
        s
      );
    } catch (o) {
      z.warn("mesh answer failed", { to: _(e.from), err: o }), this.dials.delete(e.from), i.close();
    }
  }
  async completeMeshDial(e) {
    const s = this.dials.get(e.from);
    if (s)
      try {
        const n = await Pi(this.boxKey, e.sealed);
        await s.peer.acceptAnswer({ type: "answer", sdp: n }), s.peer.waitOpen().catch(() => {
          this.running && this.onMeshDialFailed(e.from, s.peer.closeReason);
        }), this.testRefuseMeshDialsOn && (z.warn("test hook refused a mesh dial", { target: _(e.from) }), s.peer.close());
      } catch (n) {
        z.warn("mesh dial completion failed", { from: _(e.from), err: n }), this.dials.delete(e.from), s.peer.close();
      }
  }
  onMeshDialFailed(e, s) {
    this.book.recordDialFailure(e, this.now(), Xp * this.scheduler.spacingMs()), z.warn("mesh dial failed after the answer arrived", {
      target: _(e),
      closeReason: s,
      streak: this.book.dialFailStreak,
      limit: xi
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
        const a = (d) => this.store.has(d), l = this.callbacks.getPlayhead?.() ?? null;
        let c;
        if (l === null)
          c = this.scheduler.advancePlayhead(
            Math.max(0, o - this.lagChunks),
            null,
            a,
            e
          );
        else {
          const d = o - (l.started ? this.lagChunks + xp : this.lagChunks);
          c = this.scheduler.advancePlayhead(
            Math.max(l.seq, d),
            l.remainingMs === null ? null : e + l.remainingMs,
            a,
            e
          );
        }
        for (const d of c)
          this.counters.skips++, this.assembler.drop(Bn(this.epoch), d), this.pendingVerify.delete(d), this.callbacks.onSkip?.(d);
      }
    }
    if (this.role === "viewer") {
      const o = this.book.list().map((l) => ({
        addr: l.addr,
        score: this.book.score(l.addr),
        has: (c) => this.neighborHaves.get(l.addr)?.has(c) ?? !1
      })), a = this.scheduler.plan(e, o, (l) => this.store.has(l));
      for (const l of a)
        switch (l.type) {
          case "want": {
            this.peers.get(l.peer)?.sendCtrl({
              v: ge,
              t: "want",
              seq: l.seq,
              deadlineMs: Math.min(6e5, Math.max(0, l.deadlineMs))
            }) ? this.wantSentAt.set(`${l.seq}:${l.peer}`, e) : this.scheduler.onDeny(l.seq, l.peer);
            break;
          }
          case "cancel":
            this.book.recordTimeout(l.peer), this.wantSentAt.delete(`${l.seq}:${l.peer}`);
            break;
          case "skip":
            this.counters.skips++, this.assembler.drop(Bn(this.epoch), l.seq), this.pendingVerify.delete(l.seq), this.callbacks.onSkip?.(l.seq);
            break;
        }
    }
    this.serve.setChunkMs(this.scheduler.spacingMs()), this.pumpServe(), e - this.lastSummaryAt >= kl && this.sendSummary(e);
    for (const o of this.book.deadPeers(e))
      z.warn("neighbor missed its summaries — dropping", {
        peer: _(o),
        silentMs: e - (this.book.get(o)?.lastSummaryAtMs ?? e),
        limitMs: El
      }), this.removePeer(o);
    if (e - this.lastPresenceAt >= Lp && (this.lastPresenceAt = e, this.flood({ ...this.floodFields(), t: "presence", name: this.selfName })), e - this.lastPexAt >= Ml) {
      this.lastPexAt = e;
      for (const [o, a] of this.peers)
        a.sendCtrl({
          v: ge,
          t: "pex",
          peers: this.book.pexSample(no, o)
        });
    }
    e - this.lastLinkSummaryAt >= Eb && !this.linkSummaryRunning && (this.lastLinkSummaryAt = e, this.logLinkSummary());
    let s = 0;
    for (const o of this.dials.values()) o.outbound && s++;
    const n = this.book.dialTargets(e, s), r = this.book.maxDialsInFlight - s - n.length;
    for (const o of n)
      this.meshDial(o);
    if (this.role === "host")
      for (const o of this.book.hostPruneTargets(
        la,
        wp
      ))
        this.removePeer(o, { v: ge, t: "prune", reason: "bootstrap-rotation" });
    else {
      const o = this.book.pruneTargets(e);
      for (const a of o)
        this.removePeer(a, { v: ge, t: "prune", reason: "over-degree" });
      if (o.length === 0 && r >= 1) {
        const a = this.book.replaceTarget(e);
        a && (this.removePeer(a.victim.addr, { v: ge, t: "prune", reason: "scoring" }), this.meshDial(a.candidate));
      }
      this.book.isStarved && this.belowMinSinceMs === null ? (this.belowMinSinceMs = e, z.warn("degree below min", {
        degree: this.book.size,
        minDegree: this.book.minDegree,
        pool: this.book.candidateCount,
        dialsInFlight: s
      })) : !this.book.isStarved && this.belowMinSinceMs !== null && (z.info("degree restored", {
        degree: this.book.size,
        belowMs: e - this.belowMinSinceMs
      }), this.belowMinSinceMs = null);
    }
    for (const [o, a] of this.dials)
      e - a.atMs > fa && (this.dialCap.allow("timeout") && z.warn("mesh dial timed out", {
        target: _(o),
        timeoutMs: fa,
        timedOut: this.dialCap.count("timeout")
      }), this.dials.delete(o), a.peer.close());
    for (const [o, a] of this.pendingVerify)
      e - a.atMs > 3 * this.chunkMs && (this.expiryCap.allow("pending-verify") && z.warn("chunk dropped: its meta never arrived", {
        seq: o,
        from: _(a.from),
        expired: this.expiryCap.count("pending-verify")
      }), this.pendingVerify.delete(o), this.book.recordTimeout(a.from));
    const i = this.store.edgeSeq - 2 * vi;
    if (i > 0) {
      for (const o of this.metas.keys()) o < i && this.metas.delete(o);
      for (const o of this.wantSentAt.keys())
        Number(o.slice(0, o.indexOf(":"))) < i && this.wantSentAt.delete(o);
    }
  }
  /** Our HAVE window, edge, degree and relayOnly to every neighbor. */
  sendSummary(e) {
    this.lastSummaryAt = e;
    const s = this.store.summary(), n = {
      v: ge,
      t: "summary",
      base: s.base,
      bitmapHex: s.bitmapHex,
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
  testCorruptServesTo(e, s) {
    s > 0 ? this.testCorruptServes.set(e, Math.floor(s)) : this.testCorruptServes.delete(e);
  }
  /** Send only the first slice of the next `count` chunks served to `addr`
   *  at once and the rest `delayMs` later; count 0 disarms. */
  testDelayServesTo(e, s, n) {
    s > 0 ? this.testDelayServes.set(e, { left: Math.floor(s), delayMs: Math.max(0, n) }) : this.testDelayServes.delete(e);
  }
  /** Malform the next `count` seeded chunks BEFORE signing (issue #5 repro):
   *  validly signed, unplayable — the swarm distributes them happily. */
  testPoisonSeeds(e) {
    this.testPoisonSeedsLeft += Math.max(0, Math.floor(e));
  }
  /** Overwrite one neighbor's fulfil EWMA so the replacement policy can be
   *  driven deterministically. Age and the pool are untouched. */
  testScorePeer(e, s) {
    const n = this.book.get(e);
    n && (n.fulfillEwma = s, z.warn("test hook set a neighbor score", { peer: _(e), fulfill: s }));
  }
  /** Report `bytes` as `addr`'s bulk backlog to the upload sampler; null
   *  clears it. A backed-up queue, without throttling a link. */
  testBacklog(e, s) {
    s === null ? this.testBacklogs.delete(e) : this.testBacklogs.set(e, Math.max(0, Math.floor(s)));
  }
  /** The fake backlog grows a byte per sample: a real backed-up queue moves
   *  every tick, and a constant one reads as a frozen link (not active)
   *  in any window the host served that link nothing. */
  sampleTestBacklog(e) {
    const s = this.testBacklogs.get(e);
    return s !== void 0 && this.testBacklogs.set(e, s + 1), s;
  }
  /** On: drop every link but the host's, close pending dials, and from now
   *  on close each answered outbound dial before it opens (so the real
   *  failure count runs) and ignore inbound offers. Off: dial normally. */
  testRefuseMeshDials(e) {
    if (this.testRefuseMeshDialsOn = e, z.warn("test hook set mesh-dial refusal", { on: e }), !!e) {
      for (const s of [...this.peers.keys()]) {
        const n = this.book.get(s);
        (!n || !this.book.isHost(n)) && this.removePeer(s);
      }
      for (const s of [...this.dials.values()]) s.peer.close();
    }
  }
  /** Host seats for host-only viewers; null restores the policy. */
  testHostOnlySlots(e) {
    this.testHostOnlySlotsOverride = e === null ? null : Math.max(0, Math.floor(e)), z.warn("test hook overrode host-only slots", { slots: this.testHostOnlySlotsOverride });
  }
  /** Sever every neighbor (no bye) and empty the candidate pool — the
   *  issue-#7 absorbing state (`neighbors=0, candidates=0`), reached
   *  deterministically instead of racing PEX against a neighbor kill. */
  testOrphan() {
    for (const e of [...this.peers.keys()]) this.removePeer(e);
    this.book.clearCandidates(), z.warn("test hook orphaned the node: neighbors severed, candidate pool cleared");
  }
  // ── Introspection ──────────────────────────────────────────────────────────
  /** Everyone the presence gossip currently knows, by SS58 and self-name.
   *  The room store keeps them for the session; the tip feed reverse-maps a
   *  tipper's H160 onto them (lib/identity/tipperName). */
  presencePeers() {
    const e = this.presence.live(this.now()).map((s) => ({ address: s.addr, name: s.name }));
    return [{ address: this.selfAddr, name: this.selfName }, ...e];
  }
  stats() {
    const e = this.now();
    let s = -1 / 0;
    for (const n of this.peers.keys()) {
      const r = this.book.get(n);
      r && r.lastSummaryAtMs > s && (s = r.lastSummaryAtMs);
    }
    return {
      neighbors: this.peers.size,
      candidates: this.book.candidateCount,
      edgeSeq: this.scheduler.edgeSeq,
      edgeCadence: this.edgeCadence.snapshot(e),
      neighborHeardMs: s === -1 / 0 ? null : Math.max(0, e - s),
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
        const e = await Promise.all([...this.peers.values()].map((r) => r.linkStats())), s = { direct: 0, stun: 0, turn: 0, unknown: 0 }, n = { direct: [], stun: [], turn: [] };
        for (const { path: r, rttMs: i } of e) {
          if (!r) {
            s.unknown++;
            continue;
          }
          s[r]++, i !== null && n[r].push(i);
        }
        z.info("links", {
          total: e.length,
          ...s,
          rttMs: { direct: ei(n.direct), stun: ei(n.stun), turn: ei(n.turn) }
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
        const s = this.peers.get(e.addr), n = s ? await s.linkStats() : { path: null, rttMs: null };
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
          connectionState: s?.connectionState ?? null,
          bulkBufferedAmount: s?.bulkBufferedAmount ?? 0,
          path: n.path,
          rttMs: n.rttMs
        };
      })
    );
  }
}
function ei(t) {
  if (t.length === 0) return null;
  const e = [...t].sort((n, r) => n - r), s = e.length >> 1;
  return e.length % 2 ? e[s] : Math.round((e[s - 1] + e[s]) / 2);
}
const Tt = J("swarm.host");
class Cb {
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
    this.epoch = e.epoch, this.codecs = e.codecs, this.chunkMs = e.chunkMs ?? Xt, this.audioContext = e.audioContext, this.key = Xw(), this.boxKey = Uw(), Tt.info("host created", {
      self: _(e.selfAddr),
      epoch: e.epoch,
      streamPubKey: Se(this.key.publicKeyHex),
      boxPub: Se(this.boxKey.publicKeyHex),
      codecs: e.codecs.mimeType
    });
    const s = e.callbacks ?? {};
    this.node = new Tb({
      selfAddr: e.selfAddr,
      selfName: e.selfName,
      role: "host",
      epoch: e.epoch,
      streamPubKeyHex: this.key.publicKeyHex,
      boxKey: this.boxKey,
      streamKey: this.key,
      chunkMs: this.chunkMs,
      callbacks: {
        onFlood: s.onFlood,
        onPeersChanged: s.onPeersChanged
      }
    }), this.responder = new Gw({
      selfAddr: e.selfAddr,
      boxKey: this.boxKey,
      transport: e.transport,
      getEpoch: () => this.node.epoch,
      getEdgeSeq: () => this.node.store.edgeSeq,
      getSeeds: () => this.node.seedSample(ua),
      onPeer: (n) => this.node.attachPeer(n)
    }), this.pipeline = new O0({
      canvas: e.canvas,
      audioContext: e.audioContext,
      audioSource: e.audioSource,
      codecs: e.codecs,
      chunkMs: this.chunkMs,
      onChunk: (n) => {
        this.node.seedChunk(n);
      },
      onError: (n) => s.onEncoderError?.(n)
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
    const e = this.node.book.responderSample(ua).filter((n) => n.boxPub !== null), s = {
      [this.node.selfAddr]: this.boxKey.publicKeyHex
    };
    for (const n of e) s[n.addr] = n.boxPub;
    return e.length !== this.lastResponderCount && (Tt.info("responder list changed", {
      responders: e.length,
      was: this.lastResponderCount < 0 ? null : this.lastResponderCount,
      neighbors: this.node.book.size
    }), this.lastResponderCount = e.length), Tt.debug("heartbeat mesh", {
      epoch: this.epoch,
      edgeSeq: this.node.store.edgeSeq,
      responders: e.length,
      boxPubs: Object.keys(s).length
    }), {
      streamPubKey: this.key.publicKeyHex,
      epoch: this.epoch,
      chunkMs: this.chunkMs,
      codecs: this.codecs.mimeType,
      edgeSeq: this.node.store.edgeSeq,
      responders: e.length > 0 ? e.map((n) => n.addr) : void 0,
      boxPubs: s
    };
  }
  // ── Gossip authority (plan §8) ────────────────────────────────────────────
  /** `ts` must equal the fallback statement's timestamp: consumers dedup
   *  chat by `${from}-${ts}`, so the flood and the statement replay of the
   *  same message must produce the same id. */
  sendChat(e, s, n) {
    if (s.length === 0) return;
    const r = this.node.floodFields();
    n !== void 0 && (r.ts = n), this.node.flood({ ...r, t: "chat", senderName: e, text: s });
  }
  sendReaction(e) {
    this.node.flood({ ...this.node.floodFields(), t: "reaction", emoji: e });
  }
  pollOpen(e) {
    this.node.flood({ ...this.node.floodFields(), t: "poll-open", ...e });
  }
  pollTally(e, s, n) {
    this.node.flood({ ...this.node.floodFields(), t: "poll-tally", pollId: e, tallies: s, totalVotes: n });
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
        sig: eb(this.key, this.epoch)
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
class Ab {
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
    this.ctx = new AudioContext({ sampleRate: lp }), this.destination = this.ctx.createMediaStreamDestination(), this.masterBus = this.ctx.createGain(), this.masterBus.connect(this.destination), e.mic && this.setMicSource(e.mic), e.system && this.setSystemSource(e.system);
    const [s] = this.destination.stream.getAudioTracks();
    if (!s)
      throw new Error("AudioMixer: no output track generated — check that AudioContext is permitted");
    return s;
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
        const s = new MediaStream([e]);
        this.micNode = this.ctx.createMediaStreamSource(s), this.micNode.connect(this.masterBus);
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
        const s = new MediaStream([e]);
        this.systemNode = this.ctx.createMediaStreamSource(s), this.systemNode.connect(this.masterBus);
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
  async playClip(e, s = 0.6) {
    if (!this.ctx || !this.masterBus) return;
    if (this.ctx.state === "suspended")
      try {
        await this.ctx.resume();
      } catch {
      }
    const n = this.ctx.createBufferSource();
    n.buffer = e;
    const r = this.ctx.createGain();
    r.gain.value = s;
    const i = this.ctx.createGain();
    i.gain.value = s, n.connect(r).connect(this.masterBus), n.connect(i).connect(this.ctx.destination), await new Promise((o) => {
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
const uc = /* @__PURE__ */ new Map();
function Ct(t) {
  const e = uc.get(t);
  if (e !== void 0) return e;
  if (typeof document > "u") return "";
  const s = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
  return s && uc.set(t, s), s;
}
const Mb = () => ({
  isHidden: () => document.visibilityState === "hidden",
  raf: (t) => requestAnimationFrame(t),
  caf: (t) => cancelAnimationFrame(t),
  startInterval: rd
});
class Bb {
  constructor(e, s, n = {}) {
    this.paint = e, this.periodMs = s, this.deps = { ...Mb(), ...n };
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
const ti = J("media.compositor"), Ib = re(3);
class Rb {
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
    this.width = e.width ?? 1280, this.height = e.height ?? 720, this.fps = e.fps ?? 30, this.pipScale = e.pipScale ?? 0.2, this.pipPadding = e.pipPadding ?? 24, this.pipRadius = e.pipRadius ?? 12, this.paintClock = new Bb(() => this.paint(), 1e3 / this.fps), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height;
    const s = this.canvas.getContext("2d", { alpha: !1 });
    if (!s) throw new Error("CanvasCompositor: unable to acquire 2d context");
    this.ctx = s, this.screenVideo = hc(), this.cameraVideo = hc();
  }
  /**
   * Start compositing with whichever sources are available. Either parameter
   * may be null — sources can be added later via `setScreenSource` /
   * `setCameraSource`. Scene defaults to the richest combination the inputs
   * support (camera+screen → 'both'; camera only → 'camera'; etc.).
   */
  async start(e, s) {
    if (this.running) throw new Error("CanvasCompositor: already running");
    return this.running = !0, document.addEventListener("visibilitychange", this.onVisibilityChange), this.screenVideo.srcObject = e, this.cameraVideo.srcObject = s, !e && s ? this.scene = "camera" : e && !s ? this.scene = "screen" : this.scene = "both", await Promise.allSettled([
      e ? Cn(this.screenVideo) : Promise.resolve(),
      s ? Cn(this.cameraVideo) : Promise.resolve()
    ]), this.paint(), this.output = this.canvas.captureStream(this.fps), this.paintClock.start(), ti.info("painting started", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    }), this.output;
  }
  /** Replace the camera source. Pass null to clear. */
  setCameraSource(e) {
    this.cameraVideo.srcObject = e, e && Cn(this.cameraVideo);
  }
  /** Replace the screen-share source. Pass null to clear. */
  setScreenSource(e) {
    this.screenVideo.srcObject = e, e && Cn(this.screenVideo);
  }
  hasScreenSource() {
    return !!this.screenVideo.srcObject;
  }
  /** Change which scene is painted. Crossfades over ~200ms. Falls back to
   *  camera if a required source is missing (e.g. host switches to 'both'
   *  but hasn't started screen share). */
  setScene(e, s) {
    s && "brbSubtitle" in s && (this.brb = { ...this.brb, subtitle: s.brbSubtitle }), e !== this.scene && (this.fadeFromScene = this.scene, this.fadeStart = performance.now(), this.scene = e);
  }
  setBrbSubtitle(e) {
    this.brb = { subtitle: e };
  }
  getScene() {
    return this.scene;
  }
  /** Add/replace an overlay by id. Painted each frame after the main scene. */
  addOverlay(e) {
    this.removeOverlay(e.id), this.overlays.push(e), this.overlays.sort((s, n) => (s.zIndex ?? 0) - (n.zIndex ?? 0));
  }
  removeOverlay(e) {
    this.overlays = this.overlays.filter((s) => s.id !== e);
  }
  hasOverlay(e) {
    return this.overlays.some((s) => s.id === e);
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
    this.paintClock.onVisibilityChange() && ti.info("visibility changed", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    });
  };
  paint() {
    const { ctx: e, width: s, height: n } = this;
    e.fillStyle = Ct("--bg-surface-main"), e.fillRect(0, 0, s, n);
    const r = this.effectiveScene(this.scene);
    if (this.fadeFromScene != null) {
      const i = performance.now() - this.fadeStart, o = Math.min(1, i / this.fadeMs), a = Pb(o);
      if (o < 1) {
        const l = this.effectiveScene(this.fadeFromScene);
        e.save(), e.globalAlpha = 1 - a, this.paintScene(l), e.restore(), e.save(), e.globalAlpha = a, this.paintScene(r), e.restore();
      } else
        this.fadeFromScene = null, this.paintScene(r);
    } else
      this.paintScene(r);
    for (const i of this.overlays)
      try {
        i.draw({ ctx: e, width: s, height: n });
      } catch (o) {
        Ib.allow(i.id) && ti.warn("overlay draw threw", { overlay: i.id, err: o });
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
    this.cameraVideo.readyState < 2 || fc(this.ctx, this.cameraVideo, 0, 0, this.width, this.height);
  }
  paintScreenFull() {
    this.screenVideo.readyState < 2 || Ob(this.ctx, this.screenVideo, 0, 0, this.width, this.height);
  }
  paintCameraPip() {
    const { ctx: e, width: s, height: n } = this;
    if (this.cameraVideo.readyState < 2) return;
    const r = Math.round(s * this.pipScale), i = Math.round(r * 9 / 16), o = s - r - this.pipPadding, a = n - i - this.pipPadding;
    e.save(), e.shadowColor = "rgba(0, 0, 0, 0.55)", e.shadowBlur = 18, e.shadowOffsetY = 4, si(e, o, a, r, i, this.pipRadius), e.fillStyle = Ct("--bg-surface-main"), e.fill(), e.restore(), e.save(), si(e, o, a, r, i, this.pipRadius), e.clip(), fc(e, this.cameraVideo, o, a, r, i), e.restore(), e.save(), e.strokeStyle = "rgba(255, 255, 255, 0.08)", e.lineWidth = 1, si(e, o + 0.5, a + 0.5, r - 1, i - 1, this.pipRadius), e.stroke(), e.restore();
  }
  paintBrb() {
    const { ctx: e, width: s, height: n } = this;
    e.fillStyle = Ct("--bg-surface-main"), e.fillRect(0, 0, s, n), e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = Ct("--fg-primary");
    const r = Math.round(n * 0.12);
    e.font = `600 ${r}px ${Ct("--scale-font-family-accent")}, sans-serif`, e.fillText("Be right back", s / 2, n * 0.42);
    const i = this.brb.subtitle?.trim() || "Back in a moment.";
    e.fillStyle = Ct("--fg-secondary");
    const o = Math.round(n * 0.035);
    e.font = `${o}px ${Ct("--scale-font-family-sans")}, sans-serif`, e.fillText(i, s / 2, n * 0.58);
    const a = performance.now(), l = Math.round(n * 8e-3), c = Math.round(n * 0.03), d = s / 2 - c, u = n * 0.68;
    for (let h = 0; h < 3; h++) {
      const f = (a / 400 + h * 0.33) % 1, g = 0.35 + 0.65 * Math.sin(f * Math.PI);
      e.globalAlpha = g, e.fillStyle = Ct("--fg-secondary"), e.beginPath(), e.arc(d + h * c, u, l, 0, Math.PI * 2), e.fill();
    }
    e.globalAlpha = 1;
  }
}
function hc() {
  const t = document.createElement("video");
  return t.autoplay = !0, t.playsInline = !0, t.muted = !0, t;
}
async function Cn(t) {
  if (t.readyState >= 2) {
    try {
      await t.play();
    } catch {
    }
    return;
  }
  await new Promise((e) => {
    const s = () => {
      t.removeEventListener("loadeddata", s), e();
    };
    t.addEventListener("loadeddata", s);
  });
  try {
    await t.play();
  } catch {
  }
}
function Ob(t, e, s, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const l = Math.min(r / o, i / a), c = o * l, d = a * l, u = s + (r - c) / 2, h = n + (i - d) / 2;
  t.drawImage(e, u, h, c, d);
}
function fc(t, e, s, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const l = Math.max(r / o, i / a), c = o * l, d = a * l, u = s + (r - c) / 2, h = n + (i - d) / 2;
  t.drawImage(e, u, h, c, d);
}
function Pb(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function si(t, e, s, n, r, i) {
  const o = Math.min(i, n / 2, r / 2);
  t.beginPath(), t.moveTo(e + o, s), t.lineTo(e + n - o, s), t.quadraticCurveTo(e + n, s, e + n, s + o), t.lineTo(e + n, s + r - o), t.quadraticCurveTo(e + n, s + r, e + n - o, s + r), t.lineTo(e + o, s + r), t.quadraticCurveTo(e, s + r, e, s + r - o), t.lineTo(e, s + o), t.quadraticCurveTo(e, s, e + o, s), t.closePath();
}
function Fb() {
  if (typeof window > "u") return !1;
  if (window.__HOST_WEBVIEW_MARK__) return !0;
  try {
    return window !== window.top;
  } catch {
    return !0;
  }
}
const Lb = J("media.permission");
async function Ub(t, e) {
  if (!Fb())
    return { camera: !0, microphone: !0 };
  const s = [];
  t && s.push("camera"), e && s.push("microphone");
  const n = await hl(...s), r = {
    camera: t ? n.camera === "granted" : !0,
    microphone: e ? n.microphone === "granted" : !0
  };
  return Lb.info("device permissions resolved", { ...r, wantVideo: t, wantAudio: e }), r;
}
const Db = Ub, Kt = J("media.capture");
class Es extends Error {
  camera;
  microphone;
  constructor(e, s) {
    const n = [];
    e || n.push("camera"), s || n.push("microphone"), super(`Host denied access to: ${n.join(", ")}`), this.name = "HostMediaPermissionError", this.camera = e, this.microphone = s;
  }
}
async function Ni(t = !0, e = !0) {
  const s = await Db(t, e);
  Kt.info("host permissions resolved", {
    camera: s.camera,
    microphone: s.microphone,
    wantVideo: t,
    wantAudio: e
  });
  const n = t && !s.camera, r = e && !s.microphone;
  if (n || r)
    throw new Es(s.camera, s.microphone);
  try {
    const i = await navigator.mediaDevices.getUserMedia({
      video: t ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : !1,
      audio: e ? { echoCancellation: !0, noiseSuppression: !0, autoGainControl: !0 } : !1
    });
    return Nb(), i;
  } catch (i) {
    const o = i;
    if (Kt.error("getUserMedia failed", { name: o.name, message: o.message, err: i }), t && e && o.name === "NotAllowedError") {
      let a = !1, l = !1;
      try {
        const u = await navigator.mediaDevices.getUserMedia({ video: !0 });
        a = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Kt.error("camera-only probe failed", { err: u });
      }
      try {
        const u = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        l = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Kt.error("microphone-only probe failed", { err: u });
      }
      const c = [];
      a || c.push("camera"), l || c.push("microphone");
      const d = await pc(c, t, e);
      if (d) return d;
      throw new Es(a, l);
    }
    if (o.name === "NotAllowedError") {
      const a = await pc(
        t ? ["camera"] : e ? ["microphone"] : [],
        t,
        e
      );
      if (a) return a;
    }
    throw i;
  }
}
const $i = "spotlight.media.staleGrantRetry";
async function pc(t, e, s) {
  if (t.length === 0) return null;
  try {
    if (sessionStorage.getItem($i) === "1")
      return Kt.warn("already re-asked for a stale device grant this session — not looping", { blocked: t }), null;
    sessionStorage.setItem($i, "1");
  } catch {
    return null;
  }
  Kt.warn("the OS refused a device we had remembered as granted — re-asking once", { blocked: t }), pf(...t);
  try {
    return await Ni(e, s);
  } catch (n) {
    return Kt.warn("the device was still refused after re-asking", { blocked: t, err: n }), null;
  }
}
function Nb() {
  try {
    sessionStorage.removeItem($i);
  } catch {
  }
}
function fs(t) {
  t && t.getTracks().forEach((e) => e.stop());
}
function $b(t, e) {
  if (t.match(/^[a-z]+:\/\//i))
    return t;
  if (t.match(/^\/\//))
    return window.location.protocol + t;
  if (t.match(/^[a-z]+:/i))
    return t;
  const s = document.implementation.createHTMLDocument(), n = s.createElement("base"), r = s.createElement("a");
  return s.head.appendChild(n), s.body.appendChild(r), e && (n.href = e), r.href = t, r.href;
}
const Vb = /* @__PURE__ */ (() => {
  let t = 0;
  const e = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => (t += 1, `u${e()}${t}`);
})();
function Ft(t) {
  const e = [];
  for (let s = 0, n = t.length; s < n; s++)
    e.push(t[s]);
  return e;
}
let ps = null;
function Ud(t = {}) {
  return ps || (t.includeStyleProperties ? (ps = t.includeStyleProperties, ps) : (ps = Ft(window.getComputedStyle(document.documentElement)), ps));
}
function cr(t, e) {
  const n = (t.ownerDocument.defaultView || window).getComputedStyle(t).getPropertyValue(e);
  return n ? parseFloat(n.replace("px", "")) : 0;
}
function Hb(t) {
  const e = cr(t, "border-left-width"), s = cr(t, "border-right-width");
  return t.clientWidth + e + s;
}
function zb(t) {
  const e = cr(t, "border-top-width"), s = cr(t, "border-bottom-width");
  return t.clientHeight + e + s;
}
function Dd(t, e = {}) {
  const s = e.width || Hb(t), n = e.height || zb(t);
  return { width: s, height: n };
}
function jb() {
  let t, e;
  try {
    e = process;
  } catch {
  }
  const s = e && e.env ? e.env.devicePixelRatio : null;
  return s && (t = parseInt(s, 10), Number.isNaN(t) && (t = 1)), t || window.devicePixelRatio || 1;
}
const Oe = 16384;
function qb(t) {
  (t.width > Oe || t.height > Oe) && (t.width > Oe && t.height > Oe ? t.width > t.height ? (t.height *= Oe / t.width, t.width = Oe) : (t.width *= Oe / t.height, t.height = Oe) : t.width > Oe ? (t.height *= Oe / t.width, t.width = Oe) : (t.width *= Oe / t.height, t.height = Oe));
}
function lr(t) {
  return new Promise((e, s) => {
    const n = new Image();
    n.onload = () => {
      n.decode().then(() => {
        requestAnimationFrame(() => e(n));
      });
    }, n.onerror = s, n.crossOrigin = "anonymous", n.decoding = "async", n.src = t;
  });
}
async function Wb(t) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Gb(t, e, s) {
  const n = "http://www.w3.org/2000/svg", r = document.createElementNS(n, "svg"), i = document.createElementNS(n, "foreignObject");
  return r.setAttribute("width", `${e}`), r.setAttribute("height", `${s}`), r.setAttribute("viewBox", `0 0 ${e} ${s}`), i.setAttribute("width", "100%"), i.setAttribute("height", "100%"), i.setAttribute("x", "0"), i.setAttribute("y", "0"), i.setAttribute("externalResourcesRequired", "true"), r.appendChild(i), i.appendChild(t), Wb(r);
}
const Re = (t, e) => {
  if (t instanceof e)
    return !0;
  const s = Object.getPrototypeOf(t);
  return s === null ? !1 : s.constructor.name === e.name || Re(s, e);
};
function Zb(t) {
  const e = t.getPropertyValue("content");
  return `${t.cssText} content: '${e.replace(/'|"/g, "")}';`;
}
function Kb(t, e) {
  return Ud(e).map((s) => {
    const n = t.getPropertyValue(s), r = t.getPropertyPriority(s);
    return `${s}: ${n}${r ? " !important" : ""};`;
  }).join(" ");
}
function Xb(t, e, s, n) {
  const r = `.${t}:${e}`, i = s.cssText ? Zb(s) : Kb(s, n);
  return document.createTextNode(`${r}{${i}}`);
}
function mc(t, e, s, n) {
  const r = window.getComputedStyle(t, s), i = r.getPropertyValue("content");
  if (i === "" || i === "none")
    return;
  const o = Vb();
  try {
    e.className = `${e.className} ${o}`;
  } catch {
    return;
  }
  const a = document.createElement("style");
  a.appendChild(Xb(o, s, r, n)), e.appendChild(a);
}
function Yb(t, e, s) {
  mc(t, e, ":before", s), mc(t, e, ":after", s);
}
const gc = "application/font-woff", yc = "image/jpeg", Qb = {
  woff: gc,
  woff2: gc,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: yc,
  jpeg: yc,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function Jb(t) {
  const e = /\.([^./]*?)$/g.exec(t);
  return e ? e[1] : "";
}
function xo(t) {
  const e = Jb(t).toLowerCase();
  return Qb[e] || "";
}
function ev(t) {
  return t.split(/,/)[1];
}
function Vi(t) {
  return t.search(/^(data:)/) !== -1;
}
function tv(t, e) {
  return `data:${e};base64,${t}`;
}
async function Nd(t, e, s) {
  const n = await fetch(t, e);
  if (n.status === 404)
    throw new Error(`Resource "${n.url}" not found`);
  const r = await n.blob();
  return new Promise((i, o) => {
    const a = new FileReader();
    a.onerror = o, a.onloadend = () => {
      try {
        i(s({ res: n, result: a.result }));
      } catch (l) {
        o(l);
      }
    }, a.readAsDataURL(r);
  });
}
const ni = {};
function sv(t, e, s) {
  let n = t.replace(/\?.*/, "");
  return s && (n = t), /ttf|otf|eot|woff2?/i.test(n) && (n = n.replace(/.*\//, "")), e ? `[${e}]${n}` : n;
}
async function ko(t, e, s) {
  const n = sv(t, e, s.includeQueryParams);
  if (ni[n] != null)
    return ni[n];
  s.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
  let r;
  try {
    const i = await Nd(t, s.fetchRequestInit, ({ res: o, result: a }) => (e || (e = o.headers.get("Content-Type") || ""), ev(a)));
    r = tv(i, e);
  } catch (i) {
    r = s.imagePlaceholder || "";
    let o = `Failed to fetch resource: ${t}`;
    i && (o = typeof i == "string" ? i : i.message), o && console.warn(o);
  }
  return ni[n] = r, r;
}
async function nv(t) {
  const e = t.toDataURL();
  return e === "data:," ? t.cloneNode(!1) : lr(e);
}
async function rv(t, e) {
  if (t.currentSrc) {
    const i = document.createElement("canvas"), o = i.getContext("2d");
    i.width = t.clientWidth, i.height = t.clientHeight, o?.drawImage(t, 0, 0, i.width, i.height);
    const a = i.toDataURL();
    return lr(a);
  }
  const s = t.poster, n = xo(s), r = await ko(s, n, e);
  return lr(r);
}
async function iv(t, e) {
  var s;
  try {
    if (!((s = t?.contentDocument) === null || s === void 0) && s.body)
      return await br(t.contentDocument.body, e, !0);
  } catch {
  }
  return t.cloneNode(!1);
}
async function ov(t, e) {
  return Re(t, HTMLCanvasElement) ? nv(t) : Re(t, HTMLVideoElement) ? rv(t, e) : Re(t, HTMLIFrameElement) ? iv(t, e) : t.cloneNode($d(t));
}
const av = (t) => t.tagName != null && t.tagName.toUpperCase() === "SLOT", $d = (t) => t.tagName != null && t.tagName.toUpperCase() === "SVG";
async function cv(t, e, s) {
  var n, r;
  if ($d(e))
    return e;
  let i = [];
  return av(t) && t.assignedNodes ? i = Ft(t.assignedNodes()) : Re(t, HTMLIFrameElement) && (!((n = t.contentDocument) === null || n === void 0) && n.body) ? i = Ft(t.contentDocument.body.childNodes) : i = Ft(((r = t.shadowRoot) !== null && r !== void 0 ? r : t).childNodes), i.length === 0 || Re(t, HTMLVideoElement) || await i.reduce((o, a) => o.then(() => br(a, s)).then((l) => {
    l && e.appendChild(l);
  }), Promise.resolve()), e;
}
function lv(t, e, s) {
  const n = e.style;
  if (!n)
    return;
  const r = window.getComputedStyle(t);
  r.cssText ? (n.cssText = r.cssText, n.transformOrigin = r.transformOrigin) : Ud(s).forEach((i) => {
    let o = r.getPropertyValue(i);
    i === "font-size" && o.endsWith("px") && (o = `${Math.floor(parseFloat(o.substring(0, o.length - 2))) - 0.1}px`), Re(t, HTMLIFrameElement) && i === "display" && o === "inline" && (o = "block"), i === "d" && e.getAttribute("d") && (o = `path(${e.getAttribute("d")})`), n.setProperty(i, o, r.getPropertyPriority(i));
  });
}
function dv(t, e) {
  Re(t, HTMLTextAreaElement) && (e.innerHTML = t.value), Re(t, HTMLInputElement) && e.setAttribute("value", t.value);
}
function uv(t, e) {
  if (Re(t, HTMLSelectElement)) {
    const n = Array.from(e.children).find((r) => t.value === r.getAttribute("value"));
    n && n.setAttribute("selected", "");
  }
}
function hv(t, e, s) {
  return Re(e, Element) && (lv(t, e, s), Yb(t, e, s), dv(t, e), uv(t, e)), e;
}
async function fv(t, e) {
  const s = t.querySelectorAll ? t.querySelectorAll("use") : [];
  if (s.length === 0)
    return t;
  const n = {};
  for (let i = 0; i < s.length; i++) {
    const a = s[i].getAttribute("xlink:href");
    if (a) {
      const l = t.querySelector(a), c = document.querySelector(a);
      !l && c && !n[a] && (n[a] = await br(c, e, !0));
    }
  }
  const r = Object.values(n);
  if (r.length) {
    const i = "http://www.w3.org/1999/xhtml", o = document.createElementNS(i, "svg");
    o.setAttribute("xmlns", i), o.style.position = "absolute", o.style.width = "0", o.style.height = "0", o.style.overflow = "hidden", o.style.display = "none";
    const a = document.createElementNS(i, "defs");
    o.appendChild(a);
    for (let l = 0; l < r.length; l++)
      a.appendChild(r[l]);
    t.appendChild(o);
  }
  return t;
}
async function br(t, e, s) {
  return !s && e.filter && !e.filter(t) ? null : Promise.resolve(t).then((n) => ov(n, e)).then((n) => cv(t, n, e)).then((n) => hv(t, n, e)).then((n) => fv(n, e));
}
const Vd = /url\((['"]?)([^'"]+?)\1\)/g, pv = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, mv = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function gv(t) {
  const e = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`, "g");
}
function yv(t) {
  const e = [];
  return t.replace(Vd, (s, n, r) => (e.push(r), s)), e.filter((s) => !Vi(s));
}
async function wv(t, e, s, n, r) {
  try {
    const i = s ? $b(e, s) : e, o = xo(e);
    let a;
    return r || (a = await ko(i, o, n)), t.replace(gv(e), `$1${a}$3`);
  } catch {
  }
  return t;
}
function bv(t, { preferredFontFormat: e }) {
  return e ? t.replace(mv, (s) => {
    for (; ; ) {
      const [n, , r] = pv.exec(s) || [];
      if (!r)
        return "";
      if (r === e)
        return `src: ${n};`;
    }
  }) : t;
}
function Hd(t) {
  return t.search(Vd) !== -1;
}
async function zd(t, e, s) {
  if (!Hd(t))
    return t;
  const n = bv(t, s);
  return yv(n).reduce((i, o) => i.then((a) => wv(a, o, e, s)), Promise.resolve(n));
}
async function ms(t, e, s) {
  var n;
  const r = (n = e.style) === null || n === void 0 ? void 0 : n.getPropertyValue(t);
  if (r) {
    const i = await zd(r, null, s);
    return e.style.setProperty(t, i, e.style.getPropertyPriority(t)), !0;
  }
  return !1;
}
async function vv(t, e) {
  await ms("background", t, e) || await ms("background-image", t, e), await ms("mask", t, e) || await ms("-webkit-mask", t, e) || await ms("mask-image", t, e) || await ms("-webkit-mask-image", t, e);
}
async function Sv(t, e) {
  const s = Re(t, HTMLImageElement);
  if (!(s && !Vi(t.src)) && !(Re(t, SVGImageElement) && !Vi(t.href.baseVal)))
    return;
  const n = s ? t.src : t.href.baseVal, r = await ko(n, xo(n), e);
  await new Promise((i, o) => {
    t.onload = i, t.onerror = e.onImageErrorHandler ? (...l) => {
      try {
        i(e.onImageErrorHandler(...l));
      } catch (c) {
        o(c);
      }
    } : o;
    const a = t;
    a.decode && (a.decode = i), a.loading === "lazy" && (a.loading = "eager"), s ? (t.srcset = "", t.src = r) : t.href.baseVal = r;
  });
}
async function _v(t, e) {
  const n = Ft(t.childNodes).map((r) => jd(r, e));
  await Promise.all(n).then(() => t);
}
async function jd(t, e) {
  Re(t, Element) && (await vv(t, e), await Sv(t, e), await _v(t, e));
}
function xv(t, e) {
  const { style: s } = t;
  e.backgroundColor && (s.backgroundColor = e.backgroundColor), e.width && (s.width = `${e.width}px`), e.height && (s.height = `${e.height}px`);
  const n = e.style;
  return n != null && Object.keys(n).forEach((r) => {
    s[r] = n[r];
  }), t;
}
const wc = {};
async function bc(t) {
  let e = wc[t];
  if (e != null)
    return e;
  const n = await (await fetch(t)).text();
  return e = { url: t, cssText: n }, wc[t] = e, e;
}
async function vc(t, e) {
  let s = t.cssText;
  const n = /url\(["']?([^"')]+)["']?\)/g, i = (s.match(/url\([^)]+\)/g) || []).map(async (o) => {
    let a = o.replace(n, "$1");
    return a.startsWith("https://") || (a = new URL(a, t.url).href), Nd(a, e.fetchRequestInit, ({ result: l }) => (s = s.replace(o, `url(${l})`), [o, l]));
  });
  return Promise.all(i).then(() => s);
}
function Sc(t) {
  if (t == null)
    return [];
  const e = [], s = /(\/\*[\s\S]*?\*\/)/gi;
  let n = t.replace(s, "");
  const r = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  for (; ; ) {
    const l = r.exec(n);
    if (l === null)
      break;
    e.push(l[0]);
  }
  n = n.replace(r, "");
  const i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, o = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", a = new RegExp(o, "gi");
  for (; ; ) {
    let l = i.exec(n);
    if (l === null) {
      if (l = a.exec(n), l === null)
        break;
      i.lastIndex = a.lastIndex;
    } else
      a.lastIndex = i.lastIndex;
    e.push(l[0]);
  }
  return e;
}
async function kv(t, e) {
  const s = [], n = [];
  return t.forEach((r) => {
    if ("cssRules" in r)
      try {
        Ft(r.cssRules || []).forEach((i, o) => {
          if (i.type === CSSRule.IMPORT_RULE) {
            let a = o + 1;
            const l = i.href, c = bc(l).then((d) => vc(d, e)).then((d) => Sc(d).forEach((u) => {
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
            n.push(c);
          }
        });
      } catch (i) {
        const o = t.find((a) => a.href == null) || document.styleSheets[0];
        r.href != null && n.push(bc(r.href).then((a) => vc(a, e)).then((a) => Sc(a).forEach((l) => {
          o.insertRule(l, o.cssRules.length);
        })).catch((a) => {
          console.error("Error loading remote stylesheet", a);
        })), console.error("Error inlining remote css file", i);
      }
  }), Promise.all(n).then(() => (t.forEach((r) => {
    if ("cssRules" in r)
      try {
        Ft(r.cssRules || []).forEach((i) => {
          s.push(i);
        });
      } catch (i) {
        console.error(`Error while reading CSS rules from ${r.href}`, i);
      }
  }), s));
}
function Ev(t) {
  return t.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Hd(e.style.getPropertyValue("src")));
}
async function Tv(t, e) {
  if (t.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const s = Ft(t.ownerDocument.styleSheets), n = await kv(s, e);
  return Ev(n);
}
function qd(t) {
  return t.trim().replace(/["']/g, "");
}
function Cv(t) {
  const e = /* @__PURE__ */ new Set();
  function s(n) {
    (n.style.fontFamily || getComputedStyle(n).fontFamily).split(",").forEach((i) => {
      e.add(qd(i));
    }), Array.from(n.children).forEach((i) => {
      i instanceof HTMLElement && s(i);
    });
  }
  return s(t), e;
}
async function Wd(t, e) {
  const s = await Tv(t, e), n = Cv(t);
  return (await Promise.all(s.filter((i) => n.has(qd(i.style.fontFamily))).map((i) => {
    const o = i.parentStyleSheet ? i.parentStyleSheet.href : null;
    return zd(i.cssText, o, e);
  }))).join(`
`);
}
async function Av(t, e) {
  const s = e.fontEmbedCSS != null ? e.fontEmbedCSS : e.skipFonts ? null : await Wd(t, e);
  if (s) {
    const n = document.createElement("style"), r = document.createTextNode(s);
    n.appendChild(r), t.firstChild ? t.insertBefore(n, t.firstChild) : t.appendChild(n);
  }
}
async function Mv(t, e = {}) {
  const { width: s, height: n } = Dd(t, e), r = await br(t, e, !0);
  return await Av(r, e), await jd(r, e), xv(r, e), await Gb(r, s, n);
}
async function Bv(t, e = {}) {
  const { width: s, height: n } = Dd(t, e), r = await Mv(t, e), i = await lr(r), o = document.createElement("canvas"), a = o.getContext("2d"), l = e.pixelRatio || jb(), c = e.canvasWidth || s, d = e.canvasHeight || n;
  return o.width = c * l, o.height = d * l, e.skipAutoScale || qb(o), o.style.width = `${c}`, o.style.height = `${d}`, e.backgroundColor && (a.fillStyle = e.backgroundColor, a.fillRect(0, 0, o.width, o.height)), a.drawImage(i, 0, 0, o.width, o.height), o;
}
async function Iv(t, e = {}) {
  return Wd(t, e);
}
const _c = J("sdk.capture"), Rv = 250, Ov = 2e3;
function Pv(t, e = 1280, s = 720) {
  const n = document.createElement("canvas");
  n.width = e, n.height = s;
  const r = n.getContext("2d"), i = getComputedStyle(document.body).backgroundColor || "#000";
  let o = !0, a = !1, l = 0, c = !1, d = null, u;
  const h = new Promise((w, S) => {
    u = (P) => P === void 0 ? w() : S(xc(P));
  });
  h.catch(() => {
  });
  const f = Iv(t).catch(() => ""), g = () => {
    r.fillStyle = i, r.fillRect(0, 0, e, s);
  }, m = async () => {
    a = !0, o = !1, l = Date.now();
    try {
      const w = await Bv(t, {
        backgroundColor: i,
        pixelRatio: 1,
        fontEmbedCSS: await f,
        // The clone keeps the element's own margin (e.g. from a parent's
        // space-y-*) but not the room for it, which cuts off the bottom.
        style: { margin: "0" }
      });
      if (c) return;
      if (w.width === 0 || w.height === 0) throw new Error("the element has no size");
      const S = Math.min(e / w.width, s / w.height), P = w.width * S, j = w.height * S;
      g(), r.drawImage(w, (e - P) / 2, (s - j) / 2, P, j), d === null && u(), d = !1;
    } catch (w) {
      if (c) return;
      d === null ? (_c.error("first element snapshot failed", { err: w }), u(w)) : d || (_c.warn("element snapshot failed", { err: w }), y.onError?.(xc(w))), d = !0;
    } finally {
      a = !1;
    }
  }, p = new MutationObserver(() => {
    o = !0;
  });
  p.observe(t, { subtree: !0, childList: !0, attributes: !0, characterData: !0 });
  const v = setInterval(() => {
    a || c || (o || Date.now() - l >= Ov) && m();
  }, Rv), y = {
    canvas: n,
    ready: h,
    onError: null,
    stop: () => {
      c = !0, clearInterval(v), p.disconnect(), u();
    }
  };
  return g(), m(), y;
}
function xc(t) {
  const e = t instanceof Error ? t.message : t instanceof Event ? "an image did not load" : String(t);
  return new Error(
    `The game picture could not be captured (${e}). Images from another origin need CORS headers.`
  );
}
const Fv = J("sdk.media"), ri = 30;
class Js {
  compositor = new Rb();
  mixer = new Ab();
  appVideo;
  ownsAppVideo;
  capture;
  previews = [];
  /** Devices this frame has held. The host remembers those grants, so turning
   *  one back on asks nothing; any other may make dot.li reload the frame. */
  held = { camera: !1, microphone: !1 };
  /** Called when a captured element stops painting. */
  onCaptureError = null;
  camera = null;
  mic = null;
  micOn = !1;
  isReleased = !1;
  constructor(e, s, n) {
    this.appVideo = e, this.ownsAppVideo = s, this.capture = n, n && (n.onError = (r) => this.onCaptureError?.(r));
  }
  /** Starts painting and mixing the app's media. Camera and mic start off. */
  static async start(e) {
    const { video: s } = e;
    let n;
    if (s instanceof MediaStream)
      n = new Js(s, !1, null);
    else if (s instanceof HTMLCanvasElement)
      n = new Js(s.captureStream(e.fps ?? ri), !0, null);
    else {
      const r = Pv(s);
      n = new Js(r.canvas.captureStream(e.fps ?? ri), !0, r);
    }
    try {
      await n.capture?.ready, await n.compositor.start(n.appVideo, null);
      const r = e.audio instanceof MediaStream ? e.audio.getAudioTracks()[0] ?? null : e.audio ?? null;
      if (n.mixer.start({ system: r }), !n.mixer.getContext() || !n.mixer.getOutputNode()) throw new Error("The audio graph did not start.");
      return n;
    } catch (r) {
      throw n.release(), r;
    }
  }
  /** The composite as viewers will see it, for a preview `<video>`. */
  previewStream() {
    const e = this.compositor.getCanvas().captureStream(ri);
    return this.previews.push(e), e;
  }
  get released() {
    return this.isReleased;
  }
  /** Would turning `device` on ask the host (and maybe reload the frame)? */
  asksHost(e) {
    return !this.held[e];
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
  async startDevices(e, s) {
    if (!e && !s) return { camera: !1, microphone: !1 };
    try {
      return this.adopt(await Ni(e, s)), { camera: !1, microphone: !1 };
    } catch (n) {
      if (!(n instanceof Es)) throw n;
      Fv.warn("a device was refused — starting the other alone", { camera: n.camera, microphone: n.microphone });
      const r = e && n.camera, i = s && n.microphone;
      return (r || i) && this.adopt(await Ni(r, i)), { camera: e && !n.camera, microphone: s && !n.microphone };
    }
  }
  /** Camera tile on or off. Off stops the camera, so its light goes out. */
  async setCamera(e) {
    if (!(e === this.cameraOn || this.isReleased)) {
      if (e) {
        if ((await this.startDevices(!0, !1)).camera) throw new Es(!1, !0);
        return;
      }
      this.compositor.setScene("screen"), this.compositor.setCameraSource(null), fs(this.camera), this.camera = null;
    }
  }
  /** Microphone on or off. Off mutes the track, so turning it back on asks nothing. */
  async setMicrophone(e) {
    if (!this.isReleased) {
      if (e && !this.mic) {
        if ((await this.startDevices(!1, !0)).microphone) throw new Es(!0, !1);
        return;
      }
      for (const s of this.mic?.getAudioTracks() ?? []) s.enabled = e;
      this.micOn = e && this.mic !== null;
    }
  }
  release() {
    if (!this.isReleased) {
      this.isReleased = !0, this.compositor.stop(), this.mixer.stop(), fs(this.camera), fs(this.mic), this.ownsAppVideo && fs(this.appVideo), this.capture?.stop();
      for (const e of this.previews) fs(e);
    }
  }
  adopt(e) {
    if (this.isReleased) {
      fs(e);
      return;
    }
    const [s] = e.getVideoTracks(), [n] = e.getAudioTracks();
    s && (this.held.camera = !0, this.camera = new MediaStream([s]), this.compositor.setCameraSource(this.camera), this.compositor.setScene("both")), n && (this.held.microphone = !0, this.mic = new MediaStream([n]), this.mixer.setMicSource(n), this.micOn = !0);
  }
}
const Ss = J("sdk.broadcast"), Lv = 3e4, Uv = 2e3, Dv = 1e4, Nv = 1e4, $v = 6e4, Vv = "spotlight-mesh";
function nS() {
  return Qc(Yc());
}
async function Gd(t) {
  const e = bf(await wf());
  if (!e)
    throw new Error("This browser cannot host a stream: WebCodecs H.264 with Opus or AAC is required.");
  const s = await Js.start(t);
  let n;
  try {
    n = await s.startDevices(t.camera ?? !1, t.microphone ?? !1);
  } catch (i) {
    throw s.release(), i;
  }
  let r = null;
  return {
    stream: s.previewStream(),
    refused: n,
    get camera() {
      return s.cameraOn;
    },
    get microphone() {
      return s.microphoneOn;
    },
    asksHost: (i) => s.asksHost(i),
    setCamera: (i) => s.setCamera(i),
    setMicrophone: (i) => s.setMicrophone(i),
    goLive: (i) => s.released ? Promise.reject(new Error("The preview was closed. Open it again to go live.")) : (r ??= Hv(s, e, i).catch((o) => {
      throw r = null, o;
    }), r),
    cancel: () => {
      if (!r) {
        s.release();
        return;
      }
      r.then(
        (i) => i.end(),
        () => s.release()
      );
    }
  };
}
async function rS(t) {
  const e = await Gd(t);
  try {
    return await e.goLive(t);
  } catch (s) {
    throw e.cancel(), s;
  }
}
async function Hv(t, e, s) {
  const n = el(window.location), r = await jv(n), i = (s.hostName || n).slice(0, 64), o = await ff("statements", "statement-submit");
  for (const m of ["statements", "statement-submit"]) {
    const p = o[m];
    if (p && p !== "granted") throw new Error(mf[p]);
  }
  const a = Zv(), l = new Gm({ claimSlotWhenFull: !0 });
  let c = null, d = null;
  const u = (m) => {
    c || (c = m, d && (a.emit("error", { message: m.message, fatal: !0 }), d()));
  };
  if (l.onFatalError = u, l.onSubmitError = (m) => a.emit("error", { message: m.message, fatal: !1 }), await l.connect(), !l.isConnected)
    throw l.destroy(), c ?? new Error("The host has no Statement Store, so the stream cannot be announced.");
  l.setProductAccount({ dotNsIdentifier: n, derivationIndex: 0 });
  const h = Date.now();
  Xm();
  let f = null, g = null;
  try {
    const m = t.mixer.getContext(), p = t.mixer.getOutputNode();
    if (!m || !p) throw new Error("The audio graph did not start.");
    const v = Dm(r), y = new Cb({
      selfAddr: r,
      selfName: i,
      epoch: h,
      transport: Jm(l, v),
      codecs: e,
      canvas: t.compositor.getCanvas(),
      audioContext: m,
      audioSource: p,
      callbacks: {
        onFlood: (U) => qv(U, a),
        onPeersChanged: () => {
          queueMicrotask(() => {
            const U = y.node.neighborAddrs.length;
            U < w && g?.reopen("neighbor dropped", { degree: U }), w = U;
          });
        },
        onEncoderError: (U) => {
          Ss.error("encoder pipeline failed", { err: U }), u(U);
        }
      }
    });
    let w = 0;
    if (await y.start(), f = y, c) throw c;
    const S = Gv(l, v, () => y.joinsInFlight);
    g = S;
    const P = await Sf(r), j = Um(), D = Nm(), q = /* @__PURE__ */ new Set(), N = async (U) => {
      let te;
      try {
        te = l.submit(
          j,
          {
            type: "heartbeat",
            from: r,
            timestamp: Date.now(),
            payload: {
              roomHash: P,
              hostAddress: r,
              hostName: i,
              title: s.title.slice(0, 200),
              viewerCount: y.node.stats().presenceCount,
              startedAt: h,
              mesh: y.mesh(),
              ...U ? { ended: !0 } : {}
            }
          },
          { channel: D }
        ), U || q.add(te), await te;
      } catch (pe) {
        if (Gh(pe)) return;
        Ss.error("heartbeat failed", { err: pe });
      } finally {
        te && q.delete(te);
      }
    };
    N(!1);
    const ne = setInterval(() => void N(!1), Lv), Y = setInterval(() => {
      a.emit("viewers", y.node.stats().presenceCount);
    }, Uv);
    let k = document.visibilityState === "hidden";
    const I = () => {
      if (document.visibilityState === "hidden") {
        k = !0;
        return;
      }
      N(!1), k && (k = !1, l.refreshAllSubscriptions());
    }, M = () => {
      N(!1), l.refreshAllSubscriptions();
    }, F = (U) => {
      U.persisted || Z();
    };
    document.addEventListener("visibilitychange", I), window.addEventListener("online", M), window.addEventListener("pagehide", F);
    let $ = null;
    const Z = () => ($ ??= (async () => {
      clearInterval(ne), clearInterval(Y), S.stop(), document.removeEventListener("visibilitychange", I), window.removeEventListener("online", M), window.removeEventListener("pagehide", F);
      try {
        await y.end();
      } catch (U) {
        Ss.warn("swarm end failed — teardown continues", { err: U });
      }
      await Promise.allSettled([...q]), await N(!0), t.release(), l.destroy(), a.emit("ended", void 0), a.clear();
    })(), $);
    if (d = Z, c)
      throw await Z(), c;
    return t.onCaptureError = (U) => a.emit("error", { message: U.message, fatal: !1 }), {
      roomHash: P,
      roomUrl: Wv(P, s.spotlightOrigin),
      hostAddress: r,
      on: a.on,
      sendChat: (U) => y.sendChat(i, U.slice(0, 500), Date.now()),
      get camera() {
        return t.cameraOn;
      },
      get microphone() {
        return t.microphoneOn;
      },
      asksHost: (U) => t.asksHost(U),
      setCamera: (U) => t.setCamera(U),
      setMicrophone: (U) => t.setMicrophone(U),
      end: Z
    };
  } catch (m) {
    throw Ss.error("go live failed", { err: m }), g?.stop(), f && await f.end().catch(() => {
    }), l.destroy(), m;
  }
}
const zv = Gc();
async function jv(t) {
  const e = await Lt(ou(), Cs.read, "getAccountsProvider");
  if (!e) throw new Error("Not inside a Polkadot host, so there is no account to stream from.");
  const s = await Lt(
    Promise.resolve(e.getProductAccount(t, 0)),
    Cs.hostDialog,
    "getProductAccount"
  );
  if (s.isErr()) {
    const r = dh(s.error) ?? au(s.error);
    throw new Error(`The host refused a product account for ${t}: ${r}`);
  }
  const { publicKey: n } = s.value;
  return zv.dec(n);
}
function qv(t, e) {
  t.t === "chat" ? e.emit("chat", { from: t.from, senderName: t.senderName, text: t.text, timestamp: t.ts }) : t.t === "reaction" && e.emit("reaction", { from: t.from, emoji: t.emoji });
}
function Wv(t, e) {
  if (e) return `${e.replace(/\/+$/, "")}/#/room/${t}`;
  const { hostname: s, protocol: n } = window.location;
  if (n !== "https:" && n !== "http:" || /^[\d.]+$/.test(s) || s.includes(":") || s.endsWith(`.${Ki}`)) return null;
  const r = s.split(".");
  if (r.length < 3) return null;
  const i = r.slice(-2).join(".");
  return `${window.location.protocol}//${Vv}.${i}/#/room/${t}`;
}
function Gv(t, e, s) {
  let n = 0, r = null;
  const i = (a, l) => {
    const c = Date.now();
    if (s() > 0 || c - n < Nv) {
      r ??= { reason: a, sinceMs: c };
      return;
    }
    r = null, n = c;
    const d = t.reopenTopic(e);
    Ss.info(`signal route reopen (${d ? "done" : "no live route"}): ${a}`, l);
  }, o = setInterval(() => {
    const a = t.silentMsFor(e);
    if (a !== null) {
      if (r) {
        const l = Date.now() - r.sinceMs;
        a < l ? r = null : i(`${r.reason}, deferred`, { waitedMs: l });
        return;
      }
      a >= $v && i("topic quiet", { silentMs: a });
    }
  }, Dv);
  return { reopen: i, stop: () => clearInterval(o) };
}
function Zv() {
  const t = /* @__PURE__ */ new Map();
  return {
    on(e, s) {
      let n = t.get(e);
      return n || t.set(e, n = /* @__PURE__ */ new Set()), n.add(s), () => n.delete(s);
    },
    emit(e, s) {
      for (const n of t.get(e) ?? [])
        try {
          n(s);
        } catch (r) {
          Ss.warn("event handler threw", { event: e, err: r });
        }
    },
    clear: () => t.clear()
  };
}
const Zd = `
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
`, Kv = {
  camera: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  cameraOff: '<path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><path d="m2 2 20 20"/>',
  microphone: '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
  microphoneOff: '<path d="m2 2 20 20"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><path d="M12 19v3"/>',
  link: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  log: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>'
};
function An(t) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Kv[t]}</svg>`;
}
function Kd(t) {
  const e = document.createElement("div");
  e.setAttribute(t, "");
  for (const s of ["keydown", "keyup", "keypress"]) e.addEventListener(s, (n) => n.stopPropagation());
  return { host: e, root: e.attachShadow({ mode: "open" }) };
}
const kc = 6e3, Xv = `${Zd}
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
.bar.failed .live .dot { animation: none; }
.bar.failed [data-device], .bar.failed [data-action="link"] { display: none; }
`;
function Yv(t, e = {}) {
  const { host: s, root: n } = Kd("data-spotlight-controls");
  n.innerHTML = `
    <style>${Xv}</style>
    <div class="surface bar ${e.container ? "" : "floating"}" role="toolbar" aria-label="Spotlight stream">
      <span class="live" aria-live="polite"><span class="dot"></span><span class="count">LIVE</span></span>
      <button class="toggle" data-device="camera"></button>
      <button class="toggle" data-device="microphone"></button>
      ${t.roomUrl ? `<button data-action="link" aria-label="Copy viewer link" title="Copy viewer link">${An("link")}</button>` : ""}
      <button data-action="log" aria-label="Copy stream log" title="Copy stream log">${An("log")}</button>
      <button data-action="end">End</button>
      <p class="notice" role="status"></p>
    </div>`;
  const r = (y) => n.querySelector(y), i = r(".bar"), o = r(".count"), a = r(".notice"), l = r('[data-action="end"]'), c = {
    camera: r('[data-device="camera"]'),
    microphone: r('[data-device="microphone"]')
  };
  let d, u = !1;
  const h = (y, w = !1) => {
    u || (clearTimeout(d), a.textContent = y, a.classList.toggle("error", w), d = setTimeout(() => a.textContent = "", kc));
  }, f = { camera: 0, microphone: 0 }, g = async (y, w, S) => {
    try {
      await navigator.clipboard.writeText(y), h(w);
    } catch {
      h(S);
    }
  }, m = () => {
    const y = t.camera, w = t.microphone;
    c.camera.setAttribute("aria-pressed", String(y)), c.camera.setAttribute("aria-label", y ? "Turn camera off" : "Turn camera on"), c.camera.innerHTML = An(y ? "camera" : "cameraOff"), c.microphone.setAttribute("aria-pressed", String(w)), c.microphone.setAttribute("aria-label", w ? "Mute microphone" : "Unmute microphone"), c.microphone.innerHTML = An(w ? "microphone" : "microphoneOff");
  };
  for (const y of ["camera", "microphone"])
    c[y].addEventListener("click", async () => {
      const w = c[y];
      if ((y === "camera" ? !t.camera : !t.microphone) && t.asksHost(y) && Date.now() - f[y] > kc) {
        f[y] = Date.now(), h(`Polkadot may reload the app to allow the ${y}, which ends the stream. Click again to ask anyway.`, !0);
        return;
      }
      f[y] = 0, w.disabled = !0;
      try {
        y === "camera" ? await t.setCamera(!t.camera) : await t.setMicrophone(!t.microphone);
      } catch {
        h(`Polkadot did not allow the ${y}.`, !0);
      } finally {
        w.disabled = !1, m();
      }
    });
  n.querySelector('[data-action="link"]')?.addEventListener("click", () => {
    g(t.roomUrl, "Viewer link copied.", t.roomUrl);
  }), r('[data-action="log"]').addEventListener("click", () => {
    g(Qc(Yc()), "Stream log copied.", "Could not copy the stream log.");
  }), l.addEventListener("click", () => {
    if (u) {
      v();
      return;
    }
    l.disabled = !0, l.textContent = "Ending…", t.end();
  });
  const p = [
    t.on("viewers", (y) => o.textContent = `LIVE · ${y} ${y === 1 ? "viewer" : "viewers"}`),
    t.on("error", ({ message: y, fatal: w }) => {
      if (!w) {
        h(y, !0);
        return;
      }
      h(`Stream failed: ${y}`, !0), clearTimeout(d), u = !0, i.classList.add("failed"), o.textContent = "Stream ended", l.disabled = !1, l.textContent = "Close";
    }),
    t.on("ended", () => {
      u || v();
    })
  ], v = () => {
    clearTimeout(d);
    for (const y of p) y();
    s.remove();
  };
  return m(), (e.container ?? document.body).appendChild(s), v;
}
const dr = J("sdk.launch"), ur = "spotlight-broadcast.launchIntent", Qv = 2 * 6e4, Pn = "spotlight-broadcast.launchReopens", Jv = 2;
function Xd() {
  try {
    const t = Number(localStorage.getItem(ur));
    return Number.isFinite(t) && t > 0 && Date.now() - t < Qv;
  } catch {
    return !1;
  }
}
function gs(t) {
  try {
    if (!t) {
      localStorage.removeItem(ur);
      return;
    }
    const e = Number(localStorage.getItem(Pn)) || 0;
    if (e >= Jv) {
      dr.warn("the frame reloaded on every device grant — not reopening again", { reopens: e });
      return;
    }
    localStorage.setItem(ur, String(Date.now()));
  } catch {
  }
}
function Ec(t) {
  try {
    t ? (localStorage.setItem(Pn, String((Number(localStorage.getItem(Pn)) || 0) + 1)), localStorage.removeItem(ur)) : localStorage.removeItem(Pn);
  } catch {
  }
}
const eS = `${Zd}
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
function tS(t) {
  return t.signal?.aborted ? Promise.resolve(null) : (Ec(Xd()), new Promise((e) => {
    const { host: s, root: n } = Kd("data-spotlight-launch");
    n.innerHTML = `
      <style>${eS}</style>
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
    const r = (S) => n.querySelector(S), i = r("video"), o = r(".overlay"), a = r("#title"), l = r(".error"), c = r('[data-action="live"]'), d = {
      camera: r('[data-device="camera"]'),
      microphone: r('[data-device="microphone"]')
    };
    a.value = (t.title ?? "").slice(0, 200);
    let u = null, h = !1, f = !1;
    const g = (S) => {
      if (!f) {
        f = !0, gs(!1), S || u?.cancel();
        for (const P of u?.stream.getTracks() ?? []) P.stop();
        i.srcObject = null, document.removeEventListener("keydown", m, !0), t.signal?.removeEventListener("abort", v), s.remove(), S && t.controls !== !1 && Yv(S, typeof t.controls == "object" ? t.controls : {}), e(S);
      }
    }, m = (S) => {
      S.key === "Escape" && !h && g(null);
    };
    document.addEventListener("keydown", m, !0);
    let p = !1;
    const v = () => {
      p = !0, h || g(null);
    };
    t.signal?.addEventListener("abort", v);
    const y = () => {
      for (const S of ["camera", "microphone"]) {
        const P = u?.[S] ?? !1, j = d[S];
        j.disabled = !u || h, j.setAttribute("aria-pressed", String(P)), j.textContent = S === "camera" ? P ? "Camera on" : "Camera off" : P ? "Mic on" : "Mic off";
      }
      c.disabled = !u || h || a.value.trim() === "", c.textContent = h ? "Going live…" : "Go live";
    }, w = (S) => {
      l.textContent = S instanceof Es ? `Polkadot did not allow the ${S.camera ? "microphone" : "camera"}. You can go live without it.` : S instanceof Error ? S.message : String(S);
    };
    for (const S of ["camera", "microphone"])
      d[S].addEventListener("click", async () => {
        if (!u) return;
        l.textContent = "", h = !0, y();
        const j = (S === "camera" ? !u.camera : !u.microphone) && u.asksHost(S);
        j && gs(!0);
        try {
          S === "camera" ? await u.setCamera(!u.camera) : await u.setMicrophone(!u.microphone);
        } catch (D) {
          w(D);
        } finally {
          j && gs(!1), h = !1, y(), p && g(null);
        }
      });
    a.addEventListener("input", y), a.addEventListener("keydown", (S) => {
      S.key === "Enter" && !c.disabled && c.click();
    }), r('[data-action="cancel"]').addEventListener("click", () => {
      h || g(null);
    }), c.addEventListener("click", async () => {
      if (!(!u || h)) {
        l.textContent = "", h = !0, y();
        try {
          const S = await u.goLive({
            title: a.value.trim(),
            hostName: t.hostName,
            spotlightOrigin: t.spotlightOrigin
          });
          if (p) {
            S.end(), g(null);
            return;
          }
          g(S);
        } catch (S) {
          dr.error("go live from the launch screen failed", { err: S }), w(S), h = !1, y(), p && g(null);
        }
      }
    }), document.body.appendChild(s), a.focus(), gs(!0), Gd({ ...t, camera: !0, microphone: !0 }).then(
      (S) => {
        if (gs(!1), Ec(!1), f) {
          S.cancel();
          return;
        }
        if (u = S, i.srcObject = S.stream, i.play().catch(() => {
        }), o.remove(), S.refused.camera || S.refused.microphone) {
          const P = [S.refused.camera && "camera", S.refused.microphone && "microphone"].filter(Boolean);
          l.textContent = `Polkadot did not allow the ${P.join(" or ")}. You can go live without it, or turn it on to ask again.`;
        }
        y();
      },
      (S) => {
        gs(!1), dr.error("launch screen preview failed", { err: S }), o.textContent = "The preview could not start.", w(S);
      }
    );
  }));
}
function iS(t, e) {
  const s = () => typeof e == "function" ? e() : e, n = new AbortController(), r = async () => {
    if (t.disabled || n.signal.aborted) return;
    t.disabled = !0;
    let o = null;
    try {
      const a = s();
      if (o = await tS({ ...a, signal: n.signal }), !o) return;
      o.on("ended", () => {
        n.signal.aborted || (t.disabled = !1);
      }), a.onLive?.(o);
    } catch (a) {
      dr.error("could not open the launch screen", { err: a });
    } finally {
      o || (t.disabled = !1);
    }
  }, i = () => void r();
  return t.addEventListener("click", i), Xd() && (document.body ? r() : document.addEventListener("DOMContentLoaded", () => void r(), { once: !0 })), () => {
    n.abort(), t.removeEventListener("click", i);
  };
}
export {
  ur as LAUNCH_INTENT_KEY,
  iS as attachLaunchScreen,
  Pv as captureElement,
  nS as getBroadcastLog,
  Xd as launchIntentPending,
  Yv as mountControlBar,
  tS as openLaunchScreen,
  Gd as prepareBroadcast,
  rS as startBroadcast
};
