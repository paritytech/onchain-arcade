// Vendored from paritytech/spotlight-mesh@d9dea1a (`bun run build:sdk`). Do not edit; rebuild and copy.
import { requestResourceAllocation as fl, HostResponseDecodeError as pl, getHostLocalStorage as ml, isInsideContainer as gl, getStatementStore as tc, requestPermission as yl, requestDevicePermission as wl, toHex as ln, fromHex as bl, getAccountsProvider as vl, formatHostError as Sl } from "@parity/product-sdk/host";
var _l = Object.defineProperty, xl = (s, e, t) => e in s ? _l(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, mo = (s, e, t) => (xl(s, typeof e != "symbol" ? e + "" : e, t), t), cr = {
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
function kl(s) {
  const e = s.length % 2, t = (s[1] === "x" ? 2 : 0) + e, n = (s.length - t) / 2 + e, r = new Uint8Array(n);
  e && (r[0] = 0 | cr[s[2]]);
  for (let i = 0; i < n; ) {
    const o = t + i * 2, a = cr[s[o]], d = cr[s[o + 1]];
    r[e + i++] = a << 4 | d;
  }
  return r;
}
var go = class extends Uint8Array {
  constructor(s) {
    super(s), mo(this, "i", 0), mo(this, "v"), this.v = new DataView(s);
  }
}, Cs = (s) => (e) => s(e instanceof go ? e : new go(e instanceof Uint8Array ? e.buffer : typeof e == "string" ? kl(e).buffer : e)), Ci = (s) => {
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
}, st = (s, e) => {
  const t = [s, e];
  return t.enc = s, t.dec = e, t;
}, Tl = (s, e) => (t) => s(e(t)), El = (s, e) => (t) => e(s(t)), sc = ([s, e], t, n) => st(Tl(s, t), El(e, n));
function Cl(s, e) {
  return Cs((t) => {
    const n = t.v[e](t.i, !0);
    return t.i += s, n;
  });
}
function Al(s, e) {
  return (t) => {
    const n = new Uint8Array(s);
    return new DataView(n.buffer)[e](0, t, !0), n;
  };
}
function Nt(s, e, t) {
  return st(Al(s, t), Cl(s, e));
}
var Gs = Nt(1, "getUint8", "setUint8"), Cn = Nt(2, "getUint16", "setUint16"), An = Nt(4, "getUint32", "setUint32"), nc = Nt(8, "getBigUint64", "setBigUint64");
Nt(1, "getInt8", "setInt8");
Nt(2, "getInt16", "setInt16");
Nt(4, "getInt32", "setInt32");
Nt(8, "getBigInt64", "setBigInt64");
var rc = (s) => {
  const e = new Uint8Array(16), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), e;
}, ic = (s) => Cs((e) => {
  const { v: t, i: n } = e, r = t.getBigUint64(n, !0), i = t[s](n + 8, !0);
  return e.i += 16, i << 64n | r;
});
st(rc, ic("getBigUint64"));
st(rc, ic("getBigInt64"));
var oc = (s) => {
  const e = new Uint8Array(32), t = new DataView(e.buffer);
  return t.setBigInt64(0, s, !0), t.setBigInt64(8, s >> 64n, !0), t.setBigInt64(16, s >> 128n, !0), t.setBigInt64(24, s >> 192n, !0), e;
}, ac = (s) => Cs((e) => {
  let t = e.v.getBigUint64(e.i, !0);
  return e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 64n, e.i += 8, t |= e.v.getBigUint64(e.i, !0) << 128n, e.i += 8, t |= e.v[s](e.i, !0) << 192n, e.i += 8, t;
});
st(oc, ac("getBigUint64"));
st(oc, ac("getBigInt64"));
sc(Gs, (s) => s ? 1 : 0, Boolean);
var Bl = [Gs[1], Cn[1], An[1]], Ml = Cs((s) => {
  const e = s[s.i], t = e & 3;
  if (t < 3)
    return Bl[t](s) >>> 2;
  const n = (e >>> 2) + 4;
  s.i++;
  let r = 0n;
  const i = n / 8 | 0;
  let o = 0n;
  for (let d = 0; d < i; d++)
    r = nc[1](s) << o | r, o += 64n;
  let a = n % 8;
  return a > 3 && (r = BigInt(An[1](s)) << o | r, o += 32n, a -= 4), a > 1 && (r = BigInt(Cn[1](s)) << o | r, o += 16n, a -= 2), a && (r = BigInt(Gs[1](s)) << o | r), r;
}), Il = 1n << 56n, Ol = 1 << 24, Rl = 256, Pl = 4294967295n, Fl = 64, Ll = 16384, Ul = 1 << 30, Nl = (s) => {
  if (s < 0)
    throw new Error(`Wrong compact input (${s})`);
  const e = Number(s) << 2;
  if (s < Fl)
    return Gs[0](e);
  if (s < Ll)
    return Cn[0](e | 1);
  if (s < Ul)
    return An[0](e | 2);
  let t = [new Uint8Array(1)], n = BigInt(s);
  for (; n >= Il; )
    t.push(nc[0](n)), n >>= 64n;
  n >= Ol && (t.push(An[0](Number(n & Pl))), n >>= 32n);
  let r = Number(n);
  r >= Rl && (t.push(Cn[0](r)), r >>= 16), r && t.push(Gs[0](r));
  const i = Ci(t);
  return i[0] = i.length - 5 << 2 | 3, i;
}, er = st(Nl, Ml), Dl = new TextEncoder(), Vl = (s) => {
  const e = Dl.encode(s);
  return Ci([er.enc(e.length), e]);
}, $l = new TextDecoder(), zl = Cs((s) => {
  let e = er.dec(s);
  const t = new DataView(s.buffer, s.i, e);
  return s.i += e, $l.decode(t);
});
st(Vl, zl);
var Hl = () => {
}, jl = new Uint8Array(0);
st(() => jl, Hl);
var cc = (s) => s === void 0 ? (e) => Ci([er.enc(e.length), e]) : (e) => e.length === s ? e : e.slice(0, s), dc = (s) => Cs((e) => {
  const t = s === void 0 ? er.dec(e) : s !== 1 / 0 ? s : e.byteLength - e.i, n = new Uint8Array(e.buffer.slice(e.i, e.i + t));
  return e.i += t, n;
}), Ai = (s) => st(cc(s), dc(s));
Ai.enc = cc;
Ai.dec = dc;
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ql(s) {
  return s instanceof Uint8Array || ArrayBuffer.isView(s) && s.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in s && s.BYTES_PER_ELEMENT === 1;
}
function lc(s, e) {
  return Array.isArray(e) ? e.length === 0 ? !0 : s ? e.every((t) => typeof t == "string") : e.every((t) => Number.isSafeInteger(t)) : !1;
}
function jr(s, e) {
  if (typeof e != "string")
    throw new TypeError(`${s}: string expected`);
  return !0;
}
function uc(s) {
  if (typeof s != "number")
    throw new TypeError(`number expected, got ${typeof s}`);
  if (!Number.isSafeInteger(s))
    throw new RangeError(`invalid integer: ${s}`);
}
function qr(s) {
  if (!Array.isArray(s))
    throw new TypeError("array expected");
}
function hc(s, e) {
  if (!lc(!0, e))
    throw new TypeError(`${s}: array of strings expected`);
}
function Wl(s, e) {
  if (!lc(!1, e))
    throw new TypeError(`${s}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function Gl(...s) {
  const e = (i) => i, t = (i, o) => (a) => i(o(a)), n = s.map((i) => i.encode).reduceRight(t, e), r = s.map((i) => i.decode).reduce(t, e);
  return { encode: n, decode: r };
}
// @__NO_SIDE_EFFECTS__
function Zl(s) {
  const e = typeof s == "string" ? s.split("") : s, t = e.length;
  hc("alphabet", e);
  const n = new Map(e.map((r, i) => [r, i]));
  return {
    encode: (r) => (qr(r), r.map((i) => {
      if (!Number.isSafeInteger(i) || i < 0 || i >= t)
        throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${s}`);
      return e[i];
    })),
    decode: (r) => (qr(r), r.map((i) => {
      jr("alphabet.decode", i);
      const o = n.get(i);
      if (o === void 0)
        throw new Error(`Unknown letter: "${i}". Allowed: ${s}`);
      return o;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function Kl(s = "") {
  return jr("join", s), {
    encode: (e) => (hc("join.decode", e), e.join(s)),
    decode: (e) => (jr("join.decode", e), e.split(s))
  };
}
function yo(s, e, t) {
  if (e < 2)
    throw new RangeError(`convertRadix: invalid from=${e}, base cannot be less than 2`);
  if (t < 2)
    throw new RangeError(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (qr(s), !s.length)
    return [];
  let n = 0;
  const r = [], i = Array.from(s, (a) => {
    if (uc(a), a < 0 || a >= e)
      throw new Error(`invalid integer: ${a}`);
    return a;
  }), o = i.length;
  for (; ; ) {
    let a = 0, d = !0;
    for (let c = n; c < o; c++) {
      const l = i[c], u = e * a, h = u + l;
      if (!Number.isSafeInteger(h) || u / e !== a || h - l !== u)
        throw new Error("convertRadix: carry overflow");
      const f = h / t;
      a = h % t;
      const m = Math.floor(f);
      if (i[c] = m, !Number.isSafeInteger(m) || m * t + a !== h)
        throw new Error("convertRadix: carry overflow");
      if (d)
        m ? d = !1 : n = c;
      else continue;
    }
    if (r.push(a), d)
      break;
  }
  for (let a = 0; a < s.length - 1 && s[a] === 0; a++)
    r.push(0);
  return r.reverse();
}
// @__NO_SIDE_EFFECTS__
function Yl(s) {
  uc(s);
  const e = 2 ** 8;
  return {
    encode: (t) => {
      if (!ql(t))
        throw new TypeError("radix.encode input should be Uint8Array");
      return yo(Array.from(t), e, s);
    },
    decode: (t) => (Wl("radix.decode", t), Uint8Array.from(yo(t, s, e)))
  };
}
const Xl = /* @__NO_SIDE_EFFECTS__ */ (s) => /* @__PURE__ */ Gl(/* @__PURE__ */ Yl(58), /* @__PURE__ */ Zl(s), /* @__PURE__ */ Kl("")), fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Xl("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
function pc(s) {
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
function Ce(s, e, t = "") {
  const n = pc(s), r = s?.length, i = e !== void 0;
  if (!n || i && r !== e) {
    const o = t && `"${t}" `, a = i ? ` of length ${e}` : "", d = n ? `length=${r}` : `type=${typeof s}`, c = o + "expected Uint8Array" + a + ", got " + d;
    throw n ? new RangeError(c) : new TypeError(c);
  }
  return s;
}
function Bi(s) {
  if (typeof s != "function" || typeof s.create != "function")
    throw new TypeError("Hash must wrapped by utils.createHasher");
  if (ft(s.outputLen), ft(s.blockLen), s.outputLen < 1)
    throw new Error('"outputLen" must be >= 1');
  if (s.blockLen < 1)
    throw new Error('"blockLen" must be >= 1');
}
function bs(s, e = !0) {
  if (s.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && s.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mi(s, e) {
  Ce(s, void 0, "digestInto() output");
  const t = e.outputLen;
  if (s.length < t)
    throw new RangeError('"digestInto() output" expected to be of length >=' + t);
}
function Bn(s) {
  return new Uint32Array(s.buffer, s.byteOffset, Math.floor(s.byteLength / 4));
}
function Je(...s) {
  for (let e = 0; e < s.length; e++)
    s[e].fill(0);
}
function dr(s) {
  return new DataView(s.buffer, s.byteOffset, s.byteLength);
}
function He(s, e) {
  return s << 32 - e | s >>> e;
}
const mc = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function gc(s) {
  return s << 24 & 4278190080 | s << 8 & 16711680 | s >>> 8 & 65280 | s >>> 24 & 255;
}
const it = mc ? (s) => s : (s) => gc(s) >>> 0;
function Ql(s) {
  for (let e = 0; e < s.length; e++)
    s[e] = gc(s[e]);
  return s;
}
const rs = mc ? (s) => s : Ql, yc = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Jl = /* @__PURE__ */ Array.from({ length: 256 }, (s, e) => e.toString(16).padStart(2, "0"));
function Ve(s) {
  if (Ce(s), yc)
    return s.toHex();
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += Jl[s[t]];
  return e;
}
const nt = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function wo(s) {
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
  if (yc)
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
    const o = wo(s.charCodeAt(i)), a = wo(s.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const d = s[i] + s[i + 1];
      throw new RangeError('hex string expected, got non-hex character "' + d + '" at index ' + i);
    }
    n[r] = o * 16 + a;
  }
  return n;
}
function eu(...s) {
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
function Ii(s, e = {}) {
  const t = (r, i) => s(i).update(r).digest(), n = s(void 0);
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.canXOF = n.canXOF, t.create = (r) => s(r), Object.assign(t, e), Object.freeze(t);
}
function tu(s = 32) {
  ft(s, "bytesLength");
  const e = typeof globalThis == "object" ? globalThis.crypto : null;
  if (typeof e?.getRandomValues != "function")
    throw new Error("crypto.getRandomValues must be defined");
  if (s > 65536)
    throw new RangeError(`"bytesLength" expected <= 65536, got ${s}`);
  return e.getRandomValues(new Uint8Array(s));
}
const wc = (s) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, s])
}), su = /* @__PURE__ */ Uint8Array.from([
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
function nu(s, e, t) {
  return s & e ^ ~s & t;
}
function ru(s, e, t) {
  return s & e ^ s & t ^ e & t;
}
class bc {
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
    this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = r, this.buffer = new Uint8Array(e), this.view = dr(this.buffer);
  }
  update(e) {
    bs(this), Ce(e);
    const { view: t, buffer: n, blockLen: r } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(r - this.pos, i - o);
      if (a === r) {
        const d = dr(e);
        for (; r <= i - o; o += r)
          this.process(d, o);
        continue;
      }
      n.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === r && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs(this), Mi(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: r, isLE: i } = this;
    let { pos: o } = this;
    t[o++] = 128, Je(this.buffer.subarray(o)), this.padOffset > r - o && (this.process(n, 0), o = 0);
    for (let u = o; u < r; u++)
      t[u] = 0;
    n.setBigUint64(r - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const a = dr(e), d = this.outputLen;
    if (d % 4)
      throw new Error("_sha2: outputLen must be aligned to 32bit");
    const c = d / 4, l = this.get();
    if (c > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let u = 0; u < c; u++)
      a.setUint32(4 * u, l[u], i);
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
const mt = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Te = /* @__PURE__ */ Uint32Array.from([
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
]), un = /* @__PURE__ */ BigInt(2 ** 32 - 1), bo = /* @__PURE__ */ BigInt(32);
function vc(s, e = !1) {
  return e ? { h: Number(s & un), l: Number(s >> bo & un) } : { h: Number(s >> bo & un) | 0, l: Number(s & un) | 0 };
}
function iu(s, e = !1) {
  const t = s.length;
  let n = new Uint32Array(t), r = new Uint32Array(t);
  for (let i = 0; i < t; i++) {
    const { h: o, l: a } = vc(s[i], e);
    [n[i], r[i]] = [o, a];
  }
  return [n, r];
}
const vo = (s, e, t) => s >>> t, So = (s, e, t) => s << 32 - t | e >>> t, Et = (s, e, t) => s >>> t | e << 32 - t, Ct = (s, e, t) => s << 32 - t | e >>> t, Ns = (s, e, t) => s << 64 - t | e >>> t - 32, Ds = (s, e, t) => s >>> t - 32 | e << 64 - t, ou = (s, e) => e, au = (s, e) => s;
function Ne(s, e, t, n) {
  const r = (e >>> 0) + (n >>> 0);
  return { h: s + t + (r / 2 ** 32 | 0) | 0, l: r | 0 };
}
const Oi = (s, e, t) => (s >>> 0) + (e >>> 0) + (t >>> 0), Ri = (s, e, t, n) => e + t + n + (s / 2 ** 32 | 0) | 0, cu = (s, e, t, n) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0), du = (s, e, t, n, r) => e + t + n + r + (s / 2 ** 32 | 0) | 0, lu = (s, e, t, n, r) => (s >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), uu = (s, e, t, n, r, i) => e + t + n + r + i + (s / 2 ** 32 | 0) | 0, ye = /* @__PURE__ */ Uint32Array.from([
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
]), E = /* @__PURE__ */ new Uint32Array(32);
function gt(s, e, t, n, r, i) {
  const o = r[i], a = r[i + 1];
  let d = E[2 * s], c = E[2 * s + 1], l = E[2 * e], u = E[2 * e + 1], h = E[2 * t], f = E[2 * t + 1], m = E[2 * n], y = E[2 * n + 1], p = Oi(d, l, o);
  c = Ri(p, c, u, a), d = p | 0, { Dh: y, Dl: m } = { Dh: y ^ c, Dl: m ^ d }, { Dh: y, Dl: m } = { Dh: ou(y, m), Dl: au(y) }, { h: f, l: h } = Ne(f, h, y, m), { Bh: u, Bl: l } = { Bh: u ^ f, Bl: l ^ h }, { Bh: u, Bl: l } = { Bh: Et(u, l, 24), Bl: Ct(u, l, 24) }, E[2 * s] = d, E[2 * s + 1] = c, E[2 * e] = l, E[2 * e + 1] = u, E[2 * t] = h, E[2 * t + 1] = f, E[2 * n] = m, E[2 * n + 1] = y;
}
function yt(s, e, t, n, r, i) {
  const o = r[i], a = r[i + 1];
  let d = E[2 * s], c = E[2 * s + 1], l = E[2 * e], u = E[2 * e + 1], h = E[2 * t], f = E[2 * t + 1], m = E[2 * n], y = E[2 * n + 1], p = Oi(d, l, o);
  c = Ri(p, c, u, a), d = p | 0, { Dh: y, Dl: m } = { Dh: y ^ c, Dl: m ^ d }, { Dh: y, Dl: m } = { Dh: Et(y, m, 16), Dl: Ct(y, m, 16) }, { h: f, l: h } = Ne(f, h, y, m), { Bh: u, Bl: l } = { Bh: u ^ f, Bl: l ^ h }, { Bh: u, Bl: l } = { Bh: Ns(u, l, 63), Bl: Ds(u, l, 63) }, E[2 * s] = d, E[2 * s + 1] = c, E[2 * e] = l, E[2 * e + 1] = u, E[2 * t] = h, E[2 * t + 1] = f, E[2 * n] = m, E[2 * n + 1] = y;
}
function hu(s, e = {}, t, n, r) {
  if (ft(t), s <= 0 || s > t)
    throw new Error("outputLen bigger than keyLen");
  const { key: i, salt: o, personalization: a } = e;
  if (i !== void 0 && (i.length < 1 || i.length > t))
    throw new Error('"key" expected to be undefined or of length=1..' + t);
  o !== void 0 && Ce(o, n, "salt"), a !== void 0 && Ce(a, r, "personalization");
}
class fu {
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
    ft(e), ft(t), this.blockLen = e, this.outputLen = t, this.buffer = new Uint8Array(e), this.buffer32 = Bn(this.buffer);
  }
  update(e) {
    bs(this), Ce(e);
    const { blockLen: t, buffer: n, buffer32: r } = this, i = e.length, o = e.byteOffset, a = e.buffer;
    for (let d = 0; d < i; ) {
      this.pos === t && (rs(r), this.compress(r, 0, !1), rs(r), this.pos = 0);
      const c = Math.min(t - this.pos, i - d), l = o + d;
      if (c === t && !(l % 4) && d + c < i) {
        const u = new Uint32Array(a, l, Math.floor((i - d) / 4));
        rs(u);
        for (let h = 0; d + t < i; h += r.length, d += t)
          this.length += t, this.compress(u, h, !1);
        rs(u);
        continue;
      }
      n.set(e.subarray(d, d + c), this.pos), this.pos += c, this.length += c, d += c;
    }
    return this;
  }
  digestInto(e) {
    bs(this), Mi(e, this);
    const { pos: t, buffer32: n } = this;
    if (this.finished = !0, Je(this.buffer.subarray(t)), rs(n), this.compress(n, 0, !0), rs(n), e.byteOffset & 3)
      throw new RangeError('"digestInto() output" expected 4-byte aligned byteOffset, got ' + e.byteOffset);
    const r = this.get(), i = Bn(e), o = Math.floor(this.outputLen / 4);
    for (let l = 0; l < o; l++)
      i[l] = it(r[l]);
    const a = this.outputLen % 4;
    if (!a)
      return;
    const d = o * 4, c = r[o];
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
    const { buffer: t, length: n, finished: r, destroyed: i, outputLen: o, pos: a } = this;
    return e ||= new this.constructor({ dkLen: o }), e.set(...this.get()), e.buffer.set(t), e.destroyed = i, e.finished = r, e.length = n, e.pos = a, e.outputLen = o, e;
  }
  clone() {
    return this._cloneInto();
  }
}
class pu extends fu {
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
    super(128, t), hu(t, e, 64, 16, 16);
    let { key: n, personalization: r, salt: i } = e, o = 0;
    if (n !== void 0 && (Ce(n, void 0, "key"), o = n.length), this.v0l ^= this.outputLen | o << 8 | 65536 | 1 << 24, i !== void 0) {
      Ce(i, void 0, "salt");
      const a = Bn(i);
      this.v4l ^= it(a[0]), this.v4h ^= it(a[1]), this.v5l ^= it(a[2]), this.v5h ^= it(a[3]);
    }
    if (r !== void 0) {
      Ce(r, void 0, "personalization");
      const a = Bn(r);
      this.v6l ^= it(a[0]), this.v6h ^= it(a[1]), this.v7l ^= it(a[2]), this.v7h ^= it(a[3]);
    }
    if (n !== void 0) {
      const a = new Uint8Array(this.blockLen);
      a.set(n), this.update(a);
    }
  }
  // prettier-ignore
  get() {
    let { v0l: e, v0h: t, v1l: n, v1h: r, v2l: i, v2h: o, v3l: a, v3h: d, v4l: c, v4h: l, v5l: u, v5h: h, v6l: f, v6h: m, v7l: y, v7h: p } = this;
    return [e, t, n, r, i, o, a, d, c, l, u, h, f, m, y, p];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, d, c, l, u, h, f, m, y, p) {
    this.v0l = e | 0, this.v0h = t | 0, this.v1l = n | 0, this.v1h = r | 0, this.v2l = i | 0, this.v2h = o | 0, this.v3l = a | 0, this.v3h = d | 0, this.v4l = c | 0, this.v4h = l | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = f | 0, this.v6h = m | 0, this.v7l = y | 0, this.v7h = p | 0;
  }
  compress(e, t, n) {
    this.get().forEach((d, c) => E[c] = d), E.set(ye, 16);
    let { h: r, l: i } = vc(BigInt(this.length));
    E[24] = ye[8] ^ i, E[25] = ye[9] ^ r, n && (E[28] = ~E[28], E[29] = ~E[29]);
    let o = 0;
    const a = su;
    for (let d = 0; d < 12; d++)
      gt(0, 4, 8, 12, e, t + 2 * a[o++]), yt(0, 4, 8, 12, e, t + 2 * a[o++]), gt(1, 5, 9, 13, e, t + 2 * a[o++]), yt(1, 5, 9, 13, e, t + 2 * a[o++]), gt(2, 6, 10, 14, e, t + 2 * a[o++]), yt(2, 6, 10, 14, e, t + 2 * a[o++]), gt(3, 7, 11, 15, e, t + 2 * a[o++]), yt(3, 7, 11, 15, e, t + 2 * a[o++]), gt(0, 5, 10, 15, e, t + 2 * a[o++]), yt(0, 5, 10, 15, e, t + 2 * a[o++]), gt(1, 6, 11, 12, e, t + 2 * a[o++]), yt(1, 6, 11, 12, e, t + 2 * a[o++]), gt(2, 7, 8, 13, e, t + 2 * a[o++]), yt(2, 7, 8, 13, e, t + 2 * a[o++]), gt(3, 4, 9, 14, e, t + 2 * a[o++]), yt(3, 4, 9, 14, e, t + 2 * a[o++]);
    this.v0l ^= E[0] ^ E[16], this.v0h ^= E[1] ^ E[17], this.v1l ^= E[2] ^ E[18], this.v1h ^= E[3] ^ E[19], this.v2l ^= E[4] ^ E[20], this.v2h ^= E[5] ^ E[21], this.v3l ^= E[6] ^ E[22], this.v3h ^= E[7] ^ E[23], this.v4l ^= E[8] ^ E[24], this.v4h ^= E[9] ^ E[25], this.v5l ^= E[10] ^ E[26], this.v5h ^= E[11] ^ E[27], this.v6l ^= E[12] ^ E[28], this.v6h ^= E[13] ^ E[29], this.v7l ^= E[14] ^ E[30], this.v7h ^= E[15] ^ E[31], Je(E);
  }
  destroy() {
    this.destroyed = !0, Je(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const tr = /* @__PURE__ */ Ii((s) => new pu(s)), Sc = new TextEncoder().encode("SS58PRE"), Wr = 2, mu = (s) => {
  try {
    const e = fc.decode(s), t = e.subarray(0, e[0] & 64 ? 2 : 1), n = e.subarray(
      t.length,
      e.length - Wr
    ), r = e.subarray(t.length + n.length), i = tr(
      Uint8Array.of(...Sc, ...t, ...n),
      {
        dkLen: 64
      }
    ).subarray(0, Wr);
    return r[0] === i[0] && r[1] === i[1] ? {
      isValid: !0,
      ss58Format: gu(t),
      publicKey: n.slice()
    } : { isValid: !1 };
  } catch {
    return { isValid: !1 };
  }
}, gu = (s) => {
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  return e.byteLength === 1 ? e.getUint8(0) : e.getUint16(0);
}, yu = (s) => {
  let e = 0n;
  const t = new DataView(s.buffer), n = Math.floor(s.length / 8);
  for (let r = 0; r < n; r++)
    e = e << 64n | t.getBigUint64(r * 8);
  for (let r = n * 8; r < s.length; r++)
    e = e << 8n | BigInt(t.getUint8(r));
  return e;
}, wu = (s) => {
  let e = /* @__PURE__ */ new Map(), t = 0, n = 0;
  const r = () => {
    t === n ? (e.clear(), t = n = 0) : (n = t, setTimeout(r, 0));
  };
  return (i) => {
    ++t === 1 && r();
    const o = yu(i);
    return e.has(o) || e.set(o, s(i)), e.get(o);
  };
}, bu = (s) => {
  const e = s < 64 ? Uint8Array.of(s) : Uint8Array.of(
    (s & 252) >> 2 | 64,
    s >> 8 | (s & 3) << 6
  );
  return wu((t) => {
    const n = tr(
      Uint8Array.of(...Sc, ...e, ...t),
      {
        dkLen: 64
      }
    ).subarray(0, Wr);
    return fc.encode(
      Uint8Array.of(...e, ...t, ...n)
    );
  });
};
function vu(s, e) {
  return (t) => {
    const n = mu(t);
    if (!n.isValid) throw new Error("Invalid checksum");
    const { publicKey: r } = n;
    if (r.length !== s)
      throw new Error("Invalid public key length");
    return r;
  };
}
const _c = (s = 42, e = 32) => sc(
  Ai(e),
  vu(e),
  bu(s)
), Su = { dkLen: 32 }, _u = (s) => tr(s, Su);
function xu(s) {
  return s === "Domain" || /^V\d+$/.test(s);
}
function ku(s) {
  let e = s;
  for (let t = 0; t < 4; t++) {
    if (typeof e != "object" || e === null || !("tag" in e)) return null;
    const n = e, r = String(n.tag);
    if (!xu(r)) {
      const i = n.value?.reason;
      return i ? `${r}: ${i}` : r;
    }
    if (n.value === void 0) return r;
    e = n.value;
  }
  return null;
}
const Tu = Date.now(), _o = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", xo = 5;
function Eu() {
  const s = new Uint8Array(xo);
  if (typeof crypto < "u" && typeof crypto.getRandomValues == "function")
    crypto.getRandomValues(s);
  else
    for (let t = 0; t < xo; t += 1) s[t] = Math.floor(Math.random() * 256);
  let e = "";
  for (const t of s) e += _o[t % _o.length];
  return e;
}
const xc = Eu(), Cu = "spotlight-broadcast-sdk · d9dea1a · 2026-10-26", Au = 4, lr = 2e3, ko = 8, Bu = "[circular]", Mu = "[deep]";
function ur(s) {
  return s.length <= lr ? s : `${s.slice(0, lr)}…(${s.length - lr} more)`;
}
function Iu(s) {
  const e = s.subarray(0, ko);
  let t = "";
  for (const n of e) t += n.toString(16).padStart(2, "0");
  return `0x${t}${s.length > ko ? "…" : ""}`;
}
function Ou(s) {
  return `[fn ${s.name || "(anonymous)"}]`;
}
function ls(s, e, t) {
  if (e > Au) return Mu;
  if (s === null) return null;
  switch (typeof s) {
    case "string":
      return ur(s);
    case "number":
      return Number.isFinite(s) ? s : String(s);
    case "boolean":
      return s;
    case "undefined":
      return;
    case "bigint":
      return `${s.toString()}n`;
    case "function":
      return Ou(s);
    case "symbol":
      return s.toString();
  }
  const n = s;
  if (t.has(n)) return Bu;
  if (n instanceof Error)
    return {
      name: n.name,
      message: ur(n.message),
      stack: typeof n.stack == "string" ? ur(n.stack) : void 0
    };
  if (n instanceof Uint8Array) return Iu(n);
  if (n instanceof Date) return n.toISOString();
  t.add(n);
  try {
    if (Array.isArray(n))
      return n.map((i) => ls(i, e + 1, t));
    if (n instanceof Map) {
      const i = {};
      for (const [o, a] of n)
        i[typeof o == "string" ? o : String(ls(o, e + 1, t))] = ls(
          a,
          e + 1,
          t
        );
      return i;
    }
    if (n instanceof Set)
      return [...n].map((i) => ls(i, e + 1, t));
    const r = {};
    for (const [i, o] of Object.entries(n))
      r[i] = ls(o, e + 1, t);
    return r;
  } finally {
    t.delete(n);
  }
}
function Ru(s, e = 0) {
  try {
    return ls(s, e, /* @__PURE__ */ new Set());
  } catch {
    return "[unserializable]";
  }
}
function Pu(s) {
  if (s === void 0) return;
  const e = Ru(s);
  return typeof e != "object" || e === null ? { value: e } : e;
}
const To = 5e3, Mn = { debug: 0, info: 1, warn: 2, error: 3 };
let Vs = [], Fu = 0, kc = "debug";
const Tc = /* @__PURE__ */ new Set();
let zs = null, ms = null;
function hr() {
  zs !== null && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(zs), zs = null, ms !== null && (clearTimeout(ms), ms = null);
  for (const s of Tc)
    try {
      s();
    } catch {
    }
}
function Lu() {
  Tc.size !== 0 && (zs !== null || ms !== null || (typeof requestAnimationFrame == "function" ? (zs = requestAnimationFrame(hr), ms = setTimeout(hr, 100)) : ms = setTimeout(hr, 0)));
}
function hn(s, e, t, n) {
  if (Mn[s] < Mn[kc]) return;
  const r = { seq: ++Fu, sid: xc, ts: Date.now(), level: s, ns: e, msg: String(t) }, i = Pu(n);
  i !== void 0 && (r.data = i), Vs.length >= To && Vs.splice(0, Vs.length - To + 1), Vs.push(r), Lu();
}
function Uu(s) {
  return Mn[s] >= Mn[kc];
}
function Nu() {
  return Vs.slice();
}
function J(s) {
  return {
    ns: s,
    debug(e, t) {
      hn("debug", s, e, t);
    },
    info(e, t) {
      hn("info", s, e, t);
    },
    warn(e, t) {
      hn("warn", s, e, t);
    },
    error(e, t) {
      hn("error", s, e, t);
    },
    on(e) {
      return Uu(e);
    }
  };
}
const Eo = 8, Du = 8;
function v(s) {
  return s == null ? String(s) : s.length > Eo ? `${s.slice(0, Eo)}…` : s;
}
function ve(s) {
  const e = s.startsWith("0x") ? s.slice(2) : s, t = e.slice(0, Du * 2);
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
const Vu = 18, fn = 120, $u = 13;
function zu(s) {
  return s.toUpperCase().padEnd(5);
}
function Hu(s) {
  if (typeof s == "string") return s;
  if (typeof s == "number" || typeof s == "boolean" || s === null)
    return String(s);
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return "[unserializable]";
  }
}
function ju(s) {
  const e = [];
  for (const [r, i] of Object.entries(s))
    e.push(`${r}=${Hu(i)}`);
  if (e.length === 0) return [];
  const t = [];
  let n = "";
  for (const r of e)
    for (n !== "" && n.length + 1 + r.length > fn && (t.push(n), n = ""), n = n === "" ? `    ${r}` : `${n} ${r}`; n.length > fn; )
      t.push(n.slice(0, fn)), n = `    ${n.slice(fn)}`;
  return n !== "" && t.push(n), t;
}
function qu(s) {
  const t = `${new Date(s.ts).toISOString()}  ${zu(s.level)}  ${s.sid}  ${s.ns.padEnd(Vu)}${s.msg}`;
  return !s.data || Object.keys(s.data).length === 0 ? [t] : [t, ...ju(s.data)];
}
function Wu() {
  return typeof location > "u" ? "(unknown)" : location.href;
}
function Gu() {
  return typeof navigator > "u" ? "(unknown)" : navigator.userAgent;
}
function Zu(s, e = {}) {
  const t = e.page ?? Wu(), n = e.userAgent ?? Gu(), r = e.sessionStartMs ?? Tu, i = e.build ?? Cu, o = (c) => `${c} `.padEnd(Math.max($u, c.length + 1), " "), a = [
    "# spotlight debug log",
    `# ${o("build")}${i}`,
    `# ${o("session start")}${new Date(r).toISOString()}`,
    `# ${o("page")}${t}`,
    `# ${o("user agent")}${n}`,
    `# ${o("entries")}${s.length}`,
    `# ${o("session id")}${e.sessionId ?? xc} (this page load)`
  ];
  for (const c of e.earlier ?? [])
    a.push(
      `# ${o("earlier")}${c.sid}  start ${new Date(c.startMs).toISOString()}  entries ${c.entries}  build ${c.build}  page ${c.page}`
    );
  const d = [];
  for (const c of s) d.push(...qu(c));
  return `${[...a, ...d].join(`
`)}
`;
}
const Ku = J("triangle"), Ec = {
  // paseo-next-v2 Asset Hub — the network the dotns deploy targets
  // (.github/workflows/deploy-dotns.yml passes `--env paseo-next-v2`).
  // Verified against wss://paseo-asset-hub-next-rpc.polkadot.io on 2026-09-07,
  // after the chain was re-genesised AGAIN (third hash in a month:
  // 0xbf0488db… → 0x23e730eb… → this one). Each wipe also destroys the
  // deployed tip contract at CONTRACT_ADDRESS.
  // Testnets get re-genesised: if the host answers "chain not supported",
  // re-read the hash with chainSpec_v1_genesisHash before you debug anything else.
  "paseo-asset-hub-next": "0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a"
}, Co = Ec["paseo-asset-hub-next"], Yu = {
  [Ec["paseo-asset-hub-next"]]: "paseo"
};
function Xu() {
  const s = Yu[Co.toLowerCase()];
  return s || (Ku.error(
    "no DotNS TLD known for this genesis — the host will refuse the product account with DomainNotValid, and there will be no wallet, no statements and no tips. Set VITE_DOTNS_SUFFIX to this network's TLD, or add the genesis to DOTNS_SUFFIX_BY_GENESIS in src/lib/triangle/constants.ts.",
    { genesis: ve(Co), fallback: "paseo" }
  ), "paseo");
}
const Pi = Xu(), Qu = J("wallet");
function Cc(s, e = Pi) {
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
const Ju = typeof window > "u" ? "" : Cc(window.location);
typeof window < "u" && Qu.info("product identifier derived", {
  identifier: Ju,
  origin: `${window.location.protocol}//${window.location.host}`,
  suffix: `.${Pi}`
});
class Ac extends Error {
  constructor(e, t) {
    super(`${e} timed out after ${t}ms`), this.label = e, this.elapsedMs = t, this.name = "DeadlineError";
  }
  kind = "DeadlineError";
}
function Bc(s) {
  return s instanceof Ac;
}
const vs = {
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
  const n = Date.now(), r = typeof s == "function" ? s() : s;
  let i;
  const o = new Promise((a, d) => {
    i = setTimeout(() => d(new Ac(t, Date.now() - n)), e);
  });
  try {
    return await Promise.race([r, o]);
  } finally {
    i && clearTimeout(i);
  }
}
const pn = J("statement.alloc");
async function eh(s, e, t) {
  try {
    const n = await Rt(
      async () => fl(s),
      e,
      `requestResourceAllocation(${t})`
    );
    if (!n.ok) {
      const o = Ao(n.error), a = th(n.error);
      return pn.warn("resource allocation failed", { label: t, detail: o, answered: a }), { status: "error", detail: o, answered: a };
    }
    const r = {}, i = [];
    return n.value.forEach((o, a) => {
      const d = s[a]?.tag;
      i.push(`${d ?? a}=${o}`), d && (r[d] = o);
    }), pn.info("allowance outcomes", { label: t, outcomes: i.join(" ") }), { status: "ok", outcomes: r };
  } catch (n) {
    if (Bc(n))
      return pn.warn("resource allocation: no answer inside the deadline", { label: t, timeoutMs: e }), { status: "timeout" };
    const r = Ao(n);
    return pn.warn("resource allocation threw", { label: t, detail: r }), { status: "error", detail: r, answered: !1 };
  }
}
function th(s) {
  return !(s instanceof pl);
}
function Ao(s) {
  if (s instanceof Error) return s.message;
  try {
    return JSON.stringify(s) ?? String(s);
  } catch {
    return String(s);
  }
}
const Fi = J("host.grants"), tn = "spotlight/host-grants/v1", sh = 864e5;
function Li(s = Date.now()) {
  return Math.floor(s / sh);
}
function nh(s, e, t = Li()) {
  return s ? e === "forever" || s.slot === t : !1;
}
let Ke = null, fr = null, pr = null;
function Ui() {
  return pr ??= ml().catch((s) => (pr = null, Fi.warn("host local storage unavailable — falling back to page storage", { err: s }), null)), pr;
}
function rh(s) {
  if (!s) return {};
  try {
    const e = JSON.parse(s);
    return e && typeof e == "object" ? e : {};
  } catch {
    return {};
  }
}
function ih() {
  try {
    return localStorage.getItem(tn);
  } catch {
    return null;
  }
}
function Mc(s) {
  try {
    localStorage.setItem(tn, s);
  } catch {
  }
}
function Ic() {
  return Ke ? Promise.resolve(Ke) : (fr ??= (async () => {
    const s = await Rt(
      (async () => {
        const e = await Ui();
        return (e ? await e.readString(tn).catch(() => null) : null) ?? ih();
      })(),
      vs.read,
      "loadGrants"
    ).catch((e) => (Fi.warn("could not read remembered grants — asking as if nothing were", { err: e }), null));
    return Ke = rh(s), Ke;
  })().finally(() => {
    fr = null;
  }), fr);
}
function Ni(s, e) {
  const t = { ...Ke ?? {}, [s]: { outcome: e, slot: Li() } };
  Ke = t;
  const n = JSON.stringify(t);
  Mc(n), (async () => await (await Ui())?.writeString(tn, n).catch((i) => {
    Fi.warn("could not persist a grant to host storage", { grant: s, err: i });
  }))();
}
function Oc(s) {
  if (!Ke || !(s in Ke)) return;
  const e = { ...Ke };
  delete e[s], Ke = e;
  const t = JSON.stringify(e);
  Mc(t), (async () => await (await Ui())?.writeString(tn, t).catch(() => {
  }))();
}
let Is = null, Rc = 0;
const oh = /* @__PURE__ */ new Set();
function Pc(s) {
  if (Is !== s && !(Is && s && Is.outcome === s.outcome && Is.message === s.message)) {
    Is = s;
    for (const e of oh)
      try {
        e();
      } catch {
      }
  }
}
function ah(s = Date.now()) {
  Rc = s, Pc(null);
}
function ch() {
  return Rc;
}
const Bo = [6e4, 12e4, 24e4, 48e4, 9e5];
class Gr extends Error {
  until;
  constructor(e, t) {
    super(
      `Signaling is paused until ${lh(e)}: the Polkadot app could not sign for Spotlight.`,
      t
    ), this.name = "SignalingPausedError", this.until = e;
  }
}
function dh(s) {
  return s instanceof Gr;
}
function lh(s) {
  return new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
let Ze = null;
const uh = /* @__PURE__ */ new Set();
function hh(s = Date.now()) {
  return Ze && s < Ze.until ? Ze.until : null;
}
function Fc(s = Date.now()) {
  if (Ze && s < Ze.until) return Ze;
  const e = (Ze?.strikes ?? 0) + 1, t = Bo[Math.min(e, Bo.length) - 1];
  return Lc({ until: s + t, strikes: e }), Ze;
}
function fh() {
  Ze && Lc(null);
}
function Lc(s) {
  Ze = s;
  for (const e of uh)
    try {
      e();
    } catch {
    }
}
const Xe = J("host.grants"), ph = {
  statements: "day-slot",
  contracts: "day-slot",
  "statement-submit": "session",
  "chain-submit": "session",
  camera: "forever",
  microphone: "forever"
}, _n = ["contracts"], mh = {
  contracts: "SmartContractAllowance"
}, gh = {
  "statement-submit": { tag: "StatementSubmit", value: void 0 },
  "chain-submit": { tag: "ChainSubmit", value: void 0 }
}, yh = {
  camera: "Camera",
  microphone: "Microphone"
}, wh = [
  { tag: "SmartContractAllowance", value: { tag: "Index", value: 0 } },
  { tag: "AutoSigning", value: void 0 }
];
function bh() {
  return {
    proof: void 0,
    decryptionKey: void 0,
    expiry: BigInt(Math.floor(Date.now() / 1e3) + 60) << 32n,
    channel: void 0,
    topics: [],
    data: "0x00"
  };
}
const In = 12e4, Zr = 6e4, Uc = {
  // The host reports a refusal, a phone with no free slot and an offline phone
  // as the same `UnableToSign`, so this line has to cover all three.
  declined: "The Polkadot app did not let Spotlight publish to the Statement Store — the approval was declined, or no slot is free — so streams cannot be announced or joined. Try again to ask once more.",
  timeout: "The approval is still waiting in the Polkadot app. Answer it, then try again.",
  unavailable: "The host could not grant Spotlight permission to publish. Try again in a moment — if it keeps failing, reopen Spotlight from Polkadot Desktop or the browser host."
}, Zt = /* @__PURE__ */ new Map(), sr = /* @__PURE__ */ new Map();
let Kr = 0, Mo = Promise.resolve(), mr = null;
function vh() {
  return mr ??= Rt(gl(), vs.read, "isInsideContainer").catch(
    (s) => (Xe.warn("could not tell whether this is a host — treating grants as unavailable", { err: s }), mr = null, "unknown")
  ), mr;
}
function Sh(...s) {
  return Nc(s, !1);
}
function Nc(s, e) {
  const t = Mo.then(
    () => Io(s, e),
    () => Io(s, e)
    // one gate's failure must not poison the chain
  );
  return Mo = t.catch(() => {
  }), t;
}
function _h(...s) {
  return Nc(s, !0);
}
async function xh(s) {
  const e = await Ic();
  for (const t of s)
    e[t] && e[t].outcome !== "granted" && Oc(t), Zt.get(t) !== "granted" && Zt.delete(t), sr.delete(t);
  Kr = 0;
}
async function Io(s, e) {
  const t = Date.now();
  e && await xh(s);
  const n = await Ic(), r = Li(), i = {}, o = [];
  for (const d of s) {
    const c = ph[d], l = Zt.get(d) ?? (c !== "session" && nh(n[d], c, r) ? n[d].outcome : void 0);
    if (l) {
      i[d] = l;
      continue;
    }
    if (Date.now() < (sr.get(d) ?? 0)) {
      i[d] = "unavailable";
      continue;
    }
    o.push(d);
  }
  if (o.length === 0) return Os(i, t);
  if (Date.now() < Kr) {
    for (const d of o) i[d] = "unavailable";
    return Os(i, t);
  }
  const a = await vh();
  if (a === "unknown") {
    Kr = Date.now() + Zr;
    for (const d of o) i[d] = "unavailable";
    return Os(i, t);
  }
  if (!a) {
    for (const d of o) i[d] = "granted";
    return Os(i, t);
  }
  Xe.info("asking the host for grants", { missing: o, slot: r }), o.includes("statements") && (i.statements = await kh()), o.some((d) => _n.includes(d)) && Object.assign(i, await Th());
  for (const d of o) {
    const c = gh[d];
    if (!c) continue;
    const l = await Oo(d, () => yl(c));
    i[d] = l, (l === "granted" || l === "declined") && Zt.set(d, l);
  }
  for (const d of o) {
    const c = yh[d];
    if (!c) continue;
    const l = await Oo(d, () => wl(c));
    i[d] = l, (l === "granted" || l === "declined") && Ni(d, l);
  }
  return Os(i, t);
}
function Os(s, e) {
  const t = s.statements;
  return !t || t !== "granted" && ch() >= e || Pc(
    t === "granted" ? null : { outcome: t, message: Uc[t] }
  ), s;
}
async function kh() {
  let s;
  try {
    s = await Rt(tc(), vs.read, "getStatementStore");
  } catch (e) {
    return Xe.warn("statement store unreachable for the allowance probe", { err: e }), It("statements"), "unavailable";
  }
  if (!s)
    return It("statements"), "unavailable";
  try {
    await Rt(
      s.createProofAuthorized(bh()),
      In,
      "createProofAuthorized (allowance probe)"
    );
  } catch (e) {
    if (Bc(e))
      return Xe.warn("no answer from the host on the allowance probe", { timeoutMs: In }), It("statements"), "timeout";
    const t = e instanceof Error ? e.message : String(e), n = /\bUnableToSign\b/.test(t) ? "declined" : "unavailable";
    return Xe.warn("allowance probe failed", { outcome: n, err: e }), Zt.set("statements", n), n === "declined" && Fc(), n;
  }
  return Ni("statements", "granted"), "granted";
}
async function Th() {
  const s = await eh(wh, In, "grants"), e = {};
  if (s.status === "timeout") {
    Xe.warn("no answer from the host on the allowance batch", {
      timeoutMs: In
    });
    for (const t of _n)
      e[t] = "timeout", It(t);
    return e;
  }
  if (s.status === "error") {
    for (const t of _n)
      e[t] = "unavailable", s.answered ? Zt.set(t, "unavailable") : It(t);
    return e;
  }
  for (const t of _n) {
    const n = Eh(s.outcomes, t);
    e[t] = n, n === "timeout" ? It(t) : Ni(t, n);
  }
  return Xe.info("allowance batch settled", {
    outcomes: Object.entries(s.outcomes).map(([t, n]) => `${t}=${n}`).join(" "),
    autoSigning: s.outcomes.AutoSigning ?? "unanswered"
  }), e;
}
function Eh(s, e) {
  const t = mh[e], n = t ? s[t] : void 0;
  return n === "Allocated" ? "granted" : n === "Rejected" ? "declined" : n === "NotAvailable" ? "unavailable" : (Xe.warn("the host named no outcome for a requested resource", { grant: e, tag: t }), "timeout");
}
async function Oo(s, e) {
  try {
    const t = await Rt(e, vs.hostDialog, `grant(${s})`);
    return t.ok ? t.value === !0 ? "granted" : "declined" : (It(s), "unavailable");
  } catch (t) {
    return Xe.warn("grant request did not settle", { grant: s, err: t }), It(s), "timeout";
  }
}
function It(s) {
  sr.set(s, Date.now() + Zr), Xe.info("grant will be retried", { grant: s, inSecs: Zr / 1e3 });
}
function Ch(...s) {
  for (const e of s)
    Oc(e), Zt.delete(e), sr.delete(e);
}
const Dc = Sh, Ah = _h, Bh = Ch, Mh = Uc, Bt = "avc1.64001f", On = "opus", Rn = "mp4a.40.2";
function Pn(s, e) {
  return `video/mp4; codecs="${s}, ${e}"`;
}
function Ih() {
  const s = globalThis;
  return s.MediaSource ?? s.ManagedMediaSource;
}
function gr(s) {
  const e = Ih();
  return !!e && e.isTypeSupported(s);
}
async function Oh(s) {
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
async function Ro(s) {
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
async function Rh() {
  const s = globalThis, [e, t, n] = await Promise.all([
    Oh(Bt),
    Ro(On),
    Ro(Rn)
  ]);
  return {
    userAgent: typeof navigator < "u" ? navigator.userAgent : "unknown",
    webCodecs: typeof VideoEncoder < "u" && typeof AudioEncoder < "u" && typeof VideoFrame < "u",
    managedMediaSource: typeof s.ManagedMediaSource < "u",
    mediaSource: typeof s.MediaSource < "u",
    videoEncoderAvc: e,
    audioEncoderOpus: t,
    audioEncoderAac: n,
    mseAvcOpus: gr(Pn(Bt, On)),
    mseAvcAac: gr(Pn(Bt, Rn)),
    mseAvcOnly: gr(`video/mp4; codecs="${Bt}"`)
  };
}
function Ph(s) {
  return !s.webCodecs || !s.videoEncoderAvc ? null : s.audioEncoderAac && s.mseAvcAac ? {
    videoCodec: Bt,
    audioCodec: Rn,
    muxAudioCodec: "aac",
    mimeType: Pn(Bt, Rn)
  } : s.audioEncoderOpus && s.mseAvcOpus ? {
    videoCodec: Bt,
    audioCodec: On,
    muxAudioCodec: "opus",
    mimeType: Pn(Bt, On)
  } : null;
}
const Fh = 8;
async function Lh(s) {
  const e = new TextEncoder().encode(`spotlight:room:v1:${s}`), t = await crypto.subtle.digest("SHA-256", e);
  return Array.from(new Uint8Array(t)).slice(0, Fh).map((r) => r.toString(16).padStart(2, "0")).join("");
}
const yr = " unchannelled", Po = J("statement.expiry"), Fo = 900;
function Uh(s = Date.now) {
  const e = /* @__PURE__ */ new Map();
  let t = 0n;
  const n = () => BigInt(Math.floor(s() / 1e3));
  return {
    next(r, i = yr) {
      const o = n() + BigInt(r) << 32n | t++ & 0xffffffffn, a = e.get(i), d = a !== void 0 && o <= a ? a + 1n : o;
      return i !== yr && e.set(i, d), d;
    },
    raiseFloor(r, i = yr) {
      if (r >> 32n > n() + BigInt(Fo))
        return Po.warn("ignoring an implausible priority floor — reading it as a misparse", {
          min: r,
          expiration: new Date(Number(r >> 32n) * 1e3).toISOString(),
          horizonSecs: Fo
        }), !1;
      const o = e.get(i);
      return o !== void 0 && r < o ? !1 : (e.set(i, r), Po.debug("priority floor adopted", { channel: i, min: r }), !0);
    }
  };
}
const Nh = /channel_?priority_?too_?low|expiry_?too_?low/i, Dh = 1n << 12n, Vh = /account_?full/i;
function $h(s) {
  return Di(s) || !Hh(s) ? null : Vc(s);
}
function zh(s) {
  if (!Di(s)) return null;
  const e = Vc(s);
  return e === null ? null : (e + Dh >> 32n) + 1n << 32n;
}
function Vc(s) {
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
function Di(s) {
  return $c(s, Vh);
}
function Hh(s) {
  return $c(s, Nh);
}
function $c(s, e) {
  const t = /* @__PURE__ */ new Set(), n = (r, i) => r == null || i > 4 || t.has(r) ? !1 : typeof r == "string" ? e.test(r) : typeof r != "object" ? !1 : (t.add(r), Object.entries(r).some(
    ([o, a]) => e.test(o) || n(a, i + 1)
  ));
  return s instanceof Error && e.test(s.message) ? !0 : n(s, 0);
}
function jh() {
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
var X;
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
})(X || (X = {}));
var Lo;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Lo || (Lo = {}));
const M = X.arrayToEnum([
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
      return M.undefined;
    case "string":
      return M.string;
    case "number":
      return Number.isNaN(s) ? M.nan : M.number;
    case "boolean":
      return M.boolean;
    case "function":
      return M.function;
    case "bigint":
      return M.bigint;
    case "symbol":
      return M.symbol;
    case "object":
      return Array.isArray(s) ? M.array : s === null ? M.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? M.promise : typeof Map < "u" && s instanceof Map ? M.map : typeof Set < "u" && s instanceof Set ? M.set : typeof Date < "u" && s instanceof Date ? M.date : M.object;
    default:
      return M.unknown;
  }
}, S = X.arrayToEnum([
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
          let a = n, d = 0;
          for (; d < o.path.length; ) {
            const c = o.path[d];
            d === o.path.length - 1 ? (a[c] = a[c] || { _errors: [] }, a[c]._errors.push(t(o))) : a[c] = a[c] || { _errors: [] }, a = a[c], d++;
          }
        }
    };
    return r(this), n;
  }
  static assert(e) {
    if (!(e instanceof pt))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, X.jsonStringifyReplacer, 2);
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
pt.create = (s) => new pt(s);
const Yr = (s, e) => {
  let t;
  switch (s.code) {
    case S.invalid_type:
      s.received === M.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case S.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, X.jsonStringifyReplacer)}`;
      break;
    case S.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${X.joinValues(s.keys, ", ")}`;
      break;
    case S.invalid_union:
      t = "Invalid input";
      break;
    case S.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${X.joinValues(s.options)}`;
      break;
    case S.invalid_enum_value:
      t = `Invalid enum value. Expected ${X.joinValues(s.options)}, received '${s.received}'`;
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
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : X.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
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
      t = e.defaultError, X.assertNever(s);
  }
  return { message: t };
};
let qh = Yr;
function Wh() {
  return qh;
}
const Gh = (s) => {
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
  const d = n.filter((c) => !!c).slice().reverse();
  for (const c of d)
    a = c(o, { data: e, defaultError: a }).message;
  return {
    ...r,
    path: i,
    message: a
  };
};
function C(s, e) {
  const t = Wh(), n = Gh({
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
      t === Yr ? void 0 : Yr
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
        return N;
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
        return N;
      i.status === "dirty" && e.dirty(), o.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof o.value < "u" || r.alwaysSet) && (n[i.value] = o.value);
    }
    return { status: e.value, value: n };
  }
}
const N = Object.freeze({
  status: "aborted"
}), $s = (s) => ({ status: "dirty", value: s }), Pe = (s) => ({ status: "valid", value: s }), Uo = (s) => s.status === "aborted", No = (s) => s.status === "dirty", Ss = (s) => s.status === "valid", Fn = (s) => typeof Promise < "u" && s instanceof Promise;
var O;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e?.message;
})(O || (O = {}));
class et {
  constructor(e, t, n, r) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Do = (s, e) => {
  if (Ss(e))
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
  const { errorMap: e, invalid_type_error: t, required_error: n, description: r } = s;
  if (e && (t || n))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: r } : { errorMap: (o, a) => {
    const { message: d } = s;
    return o.code === "invalid_enum_value" ? { message: d ?? a.defaultError } : typeof a.data > "u" ? { message: d ?? n ?? a.defaultError } : o.code !== "invalid_type" ? { message: a.defaultError } : { message: d ?? t ?? a.defaultError };
  }, description: r };
}
class Z {
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
      status: new Ae(),
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
    if (Fn(t))
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
    }, r = this._parseSync({ data: e, path: n.path, parent: n });
    return Do(n, r);
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
        return Ss(n) ? {
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
    return this._parseAsync({ data: e, path: [], parent: t }).then((n) => Ss(n) ? {
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
    }, r = this._parse({ data: e, path: n.path, parent: n }), i = await (Fn(r) ? r : Promise.resolve(r));
    return Do(n, i);
  }
  refine(e, t) {
    const n = (r) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(r) : t;
    return this._refinement((r, i) => {
      const o = e(r), a = () => i.addIssue({
        code: S.custom,
        ...n(r)
      });
      return typeof Promise < "u" && o instanceof Promise ? o.then((d) => d ? !0 : (a(), !1)) : o ? !0 : (a(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
  }
  _refinement(e) {
    return new Xt({
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
    return Qt.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return Qe.create(this);
  }
  promise() {
    return $n.create(this, this._def);
  }
  or(e) {
    return Un.create([this, e], this._def);
  }
  and(e) {
    return Nn.create(this, e, this._def);
  }
  transform(e) {
    return new Xt({
      ...H(this._def),
      schema: this,
      typeName: D.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new zn({
      ...H(this._def),
      innerType: this,
      defaultValue: t,
      typeName: D.ZodDefault
    });
  }
  brand() {
    return new qc({
      typeName: D.ZodBranded,
      type: this,
      ...H(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new Hn({
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
    return $i.create(this, e);
  }
  readonly() {
    return jn.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Zh = /^c[^\s-]{8,}$/i, Kh = /^[0-9a-z]+$/, Yh = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Xh = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Qh = /^[a-z0-9_-]{21}$/i, Jh = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, ef = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, tf = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, sf = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let wr;
const nf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, rf = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, of = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, af = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, cf = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, df = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, zc = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", lf = new RegExp(`^${zc}$`);
function Hc(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function uf(s) {
  return new RegExp(`^${Hc(s)}$`);
}
function hf(s) {
  let e = `${zc}T${Hc(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ff(s, e) {
  return !!((e === "v4" || !e) && nf.test(s) || (e === "v6" || !e) && of.test(s));
}
function pf(s, e) {
  if (!Jh.test(s))
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
function mf(s, e) {
  return !!((e === "v4" || !e) && rf.test(s) || (e === "v6" || !e) && af.test(s));
}
class dt extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== M.string) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: M.string,
        received: i.parsedType
      }), N;
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
        tf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "email",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "emoji")
        wr || (wr = new RegExp(sf, "u")), wr.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "emoji",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "uuid")
        Xh.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "uuid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "nanoid")
        Qh.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "nanoid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid")
        Zh.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "cuid",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "cuid2")
        Kh.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
          validation: "cuid2",
          code: S.invalid_string,
          message: i.message
        }), n.dirty());
      else if (i.kind === "ulid")
        Yh.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
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
      }), n.dirty()) : i.kind === "datetime" ? hf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "datetime",
        message: i.message
      }), n.dirty()) : i.kind === "date" ? lf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "date",
        message: i.message
      }), n.dirty()) : i.kind === "time" ? uf(i).test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        code: S.invalid_string,
        validation: "time",
        message: i.message
      }), n.dirty()) : i.kind === "duration" ? ef.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "duration",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "ip" ? ff(e.data, i.version) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "ip",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "jwt" ? pf(e.data, i.alg) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "jwt",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "cidr" ? mf(e.data, i.version) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "cidr",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64" ? cf.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "base64",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : i.kind === "base64url" ? df.test(e.data) || (r = this._getOrReturnCtx(e, r), C(r, {
        validation: "base64url",
        code: S.invalid_string,
        message: i.message
      }), n.dirty()) : X.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _regex(e, t, n) {
    return this.refinement((r) => e.test(r), {
      validation: t,
      code: S.invalid_string,
      ...O.errToObj(n)
    });
  }
  _addCheck(e) {
    return new dt({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...O.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...O.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...O.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...O.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...O.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...O.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...O.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...O.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...O.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...O.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...O.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...O.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...O.errToObj(e) });
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
      ...O.errToObj(e?.message)
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
      ...O.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...O.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...O.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...O.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...O.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...O.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...O.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...O.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...O.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, O.errToObj(e));
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
function gf(s, e) {
  const t = (s.toString().split(".")[1] || "").length, n = (e.toString().split(".")[1] || "").length, r = t > n ? t : n, i = Number.parseInt(s.toFixed(r).replace(".", "")), o = Number.parseInt(e.toFixed(r).replace(".", ""));
  return i % o / 10 ** r;
}
class _s extends Z {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== M.number) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: M.number,
        received: i.parsedType
      }), N;
    }
    let n;
    const r = new Ae();
    for (const i of this._def.checks)
      i.kind === "int" ? X.isInteger(e.data) || (n = this._getOrReturnCtx(e, n), C(n, {
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
      }), r.dirty()) : i.kind === "multipleOf" ? gf(e.data, i.value) !== 0 && (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), r.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (n = this._getOrReturnCtx(e, n), C(n, {
        code: S.not_finite,
        message: i.message
      }), r.dirty()) : X.assertNever(i);
    return { status: r.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, O.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, O.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, O.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, O.toString(t));
  }
  setLimit(e, t, n, r) {
    return new _s({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: O.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new _s({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: O.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: O.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: O.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: O.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: O.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: O.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: O.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: O.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: O.toString(e)
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
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && X.isInteger(e.value));
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
_s.create = (s) => new _s({
  checks: [],
  typeName: D.ZodNumber,
  coerce: s?.coerce || !1,
  ...H(s)
});
class Zs extends Z {
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
    if (this._getType(e) !== M.bigint)
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
      }), r.dirty()) : X.assertNever(i);
    return { status: r.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return C(t, {
      code: S.invalid_type,
      expected: M.bigint,
      received: t.parsedType
    }), N;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, O.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, O.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, O.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, O.toString(t));
  }
  setLimit(e, t, n, r) {
    return new Zs({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: n,
          message: O.toString(r)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Zs({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: O.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: O.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: O.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: O.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: O.toString(t)
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
Zs.create = (s) => new Zs({
  checks: [],
  typeName: D.ZodBigInt,
  coerce: s?.coerce ?? !1,
  ...H(s)
});
class Xr extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== M.boolean) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.boolean,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Xr.create = (s) => new Xr({
  typeName: D.ZodBoolean,
  coerce: s?.coerce || !1,
  ...H(s)
});
class Ln extends Z {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== M.date) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_type,
        expected: M.date,
        received: i.parsedType
      }), N;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return C(i, {
        code: S.invalid_date
      }), N;
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
      }), n.dirty()) : X.assertNever(i);
    return {
      status: n.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Ln({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: O.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: O.toString(t)
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
Ln.create = (s) => new Ln({
  checks: [],
  coerce: s?.coerce || !1,
  typeName: D.ZodDate,
  ...H(s)
});
class Vo extends Z {
  _parse(e) {
    if (this._getType(e) !== M.symbol) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.symbol,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Vo.create = (s) => new Vo({
  typeName: D.ZodSymbol,
  ...H(s)
});
class Qr extends Z {
  _parse(e) {
    if (this._getType(e) !== M.undefined) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.undefined,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Qr.create = (s) => new Qr({
  typeName: D.ZodUndefined,
  ...H(s)
});
class Jr extends Z {
  _parse(e) {
    if (this._getType(e) !== M.null) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.null,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
Jr.create = (s) => new Jr({
  typeName: D.ZodNull,
  ...H(s)
});
class $o extends Z {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return Pe(e.data);
  }
}
$o.create = (s) => new $o({
  typeName: D.ZodAny,
  ...H(s)
});
class ei extends Z {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return Pe(e.data);
  }
}
ei.create = (s) => new ei({
  typeName: D.ZodUnknown,
  ...H(s)
});
class Pt extends Z {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return C(t, {
      code: S.invalid_type,
      expected: M.never,
      received: t.parsedType
    }), N;
  }
}
Pt.create = (s) => new Pt({
  typeName: D.ZodNever,
  ...H(s)
});
class zo extends Z {
  _parse(e) {
    if (this._getType(e) !== M.undefined) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.void,
        received: n.parsedType
      }), N;
    }
    return Pe(e.data);
  }
}
zo.create = (s) => new zo({
  typeName: D.ZodVoid,
  ...H(s)
});
class Qe extends Z {
  _parse(e) {
    const { ctx: t, status: n } = this._processInputParams(e), r = this._def;
    if (t.parsedType !== M.array)
      return C(t, {
        code: S.invalid_type,
        expected: M.array,
        received: t.parsedType
      }), N;
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
      return Promise.all([...t.data].map((o, a) => r.type._parseAsync(new et(t, o, t.path, a)))).then((o) => Ae.mergeArray(n, o));
    const i = [...t.data].map((o, a) => r.type._parseSync(new et(t, o, t.path, a)));
    return Ae.mergeArray(n, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new Qe({
      ...this._def,
      minLength: { value: e, message: O.toString(t) }
    });
  }
  max(e, t) {
    return new Qe({
      ...this._def,
      maxLength: { value: e, message: O.toString(t) }
    });
  }
  length(e, t) {
    return new Qe({
      ...this._def,
      exactLength: { value: e, message: O.toString(t) }
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
function us(s) {
  if (s instanceof ge) {
    const e = {};
    for (const t in s.shape) {
      const n = s.shape[t];
      e[t] = ut.create(us(n));
    }
    return new ge({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof Qe ? new Qe({
    ...s._def,
    type: us(s.element)
  }) : s instanceof ut ? ut.create(us(s.unwrap())) : s instanceof Qt ? Qt.create(us(s.unwrap())) : s instanceof Kt ? Kt.create(s.items.map((e) => us(e))) : s;
}
class ge extends Z {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = X.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== M.object) {
      const c = this._getOrReturnCtx(e);
      return C(c, {
        code: S.invalid_type,
        expected: M.object,
        received: c.parsedType
      }), N;
    }
    const { status: n, ctx: r } = this._processInputParams(e), { shape: i, keys: o } = this._getCached(), a = [];
    if (!(this._def.catchall instanceof Pt && this._def.unknownKeys === "strip"))
      for (const c in r.data)
        o.includes(c) || a.push(c);
    const d = [];
    for (const c of o) {
      const l = i[c], u = r.data[c];
      d.push({
        key: { status: "valid", value: c },
        value: l._parse(new et(r, u, r.path, c)),
        alwaysSet: c in r.data
      });
    }
    if (this._def.catchall instanceof Pt) {
      const c = this._def.unknownKeys;
      if (c === "passthrough")
        for (const l of a)
          d.push({
            key: { status: "valid", value: l },
            value: { status: "valid", value: r.data[l] }
          });
      else if (c === "strict")
        a.length > 0 && (C(r, {
          code: S.unrecognized_keys,
          keys: a
        }), n.dirty());
      else if (c !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const c = this._def.catchall;
      for (const l of a) {
        const u = r.data[l];
        d.push({
          key: { status: "valid", value: l },
          value: c._parse(
            new et(r, u, r.path, l)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: l in r.data
        });
      }
    }
    return r.common.async ? Promise.resolve().then(async () => {
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
    }).then((c) => Ae.mergeObjectSync(n, c)) : Ae.mergeObjectSync(n, d);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return O.errToObj, new ge({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, n) => {
          const r = this._def.errorMap?.(t, n).message ?? n.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: O.errToObj(e).message ?? r
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
    return new ge({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const n of X.objectKeys(e))
      e[n] && this.shape[n] && (t[n] = this.shape[n]);
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const n of X.objectKeys(this.shape))
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
    return us(this);
  }
  partial(e) {
    const t = {};
    for (const n of X.objectKeys(this.shape)) {
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
    for (const n of X.objectKeys(this.shape))
      if (e && !e[n])
        t[n] = this.shape[n];
      else {
        let i = this.shape[n];
        for (; i instanceof ut; )
          i = i._def.innerType;
        t[n] = i;
      }
    return new ge({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return jc(X.objectKeys(this.shape));
  }
}
ge.create = (s, e) => new ge({
  shape: () => s,
  unknownKeys: "strip",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
ge.strictCreate = (s, e) => new ge({
  shape: () => s,
  unknownKeys: "strict",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
ge.lazycreate = (s, e) => new ge({
  shape: s,
  unknownKeys: "strip",
  catchall: Pt.create(),
  typeName: D.ZodObject,
  ...H(e)
});
class Un extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), n = this._def.options;
    function r(i) {
      for (const a of i)
        if (a.result.status === "valid")
          return a.result;
      for (const a of i)
        if (a.result.status === "dirty")
          return t.common.issues.push(...a.ctx.common.issues), a.result;
      const o = i.map((a) => new pt(a.ctx.common.issues));
      return C(t, {
        code: S.invalid_union,
        unionErrors: o
      }), N;
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
        l.status === "dirty" && !i && (i = { result: l, ctx: c }), c.common.issues.length && o.push(c.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const a = o.map((d) => new pt(d));
      return C(t, {
        code: S.invalid_union,
        unionErrors: a
      }), N;
    }
  }
  get options() {
    return this._def.options;
  }
}
Un.create = (s, e) => new Un({
  options: s,
  typeName: D.ZodUnion,
  ...H(e)
});
const ot = (s) => s instanceof si ? ot(s.schema) : s instanceof Xt ? ot(s.innerType()) : s instanceof Vn ? [s.value] : s instanceof Yt ? s.options : s instanceof ni ? X.objectValues(s.enum) : s instanceof zn ? ot(s._def.innerType) : s instanceof Qr ? [void 0] : s instanceof Jr ? [null] : s instanceof ut ? [void 0, ...ot(s.unwrap())] : s instanceof Qt ? [null, ...ot(s.unwrap())] : s instanceof qc || s instanceof jn ? ot(s.unwrap()) : s instanceof Hn ? ot(s._def.innerType) : [];
class Vi extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== M.object)
      return C(t, {
        code: S.invalid_type,
        expected: M.object,
        received: t.parsedType
      }), N;
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
    const r = /* @__PURE__ */ new Map();
    for (const i of t) {
      const o = ot(i.shape[e]);
      if (!o.length)
        throw new Error(`A discriminator value for key \`${e}\` could not be extracted from all schema options`);
      for (const a of o) {
        if (r.has(a))
          throw new Error(`Discriminator property ${String(e)} has duplicate value ${String(a)}`);
        r.set(a, i);
      }
    }
    return new Vi({
      typeName: D.ZodDiscriminatedUnion,
      discriminator: e,
      options: t,
      optionsMap: r,
      ...H(n)
    });
  }
}
function ti(s, e) {
  const t = At(s), n = At(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === M.object && n === M.object) {
    const r = X.objectKeys(e), i = X.objectKeys(s).filter((a) => r.indexOf(a) !== -1), o = { ...s, ...e };
    for (const a of i) {
      const d = ti(s[a], e[a]);
      if (!d.valid)
        return { valid: !1 };
      o[a] = d.data;
    }
    return { valid: !0, data: o };
  } else if (t === M.array && n === M.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const r = [];
    for (let i = 0; i < s.length; i++) {
      const o = s[i], a = e[i], d = ti(o, a);
      if (!d.valid)
        return { valid: !1 };
      r.push(d.data);
    }
    return { valid: !0, data: r };
  } else return t === M.date && n === M.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class Nn extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e), r = (i, o) => {
      if (Uo(i) || Uo(o))
        return N;
      const a = ti(i.value, o.value);
      return a.valid ? ((No(i) || No(o)) && t.dirty(), { status: t.value, value: a.data }) : (C(n, {
        code: S.invalid_intersection_types
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
Nn.create = (s, e, t) => new Nn({
  left: s,
  right: e,
  typeName: D.ZodIntersection,
  ...H(t)
});
class Kt extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== M.array)
      return C(n, {
        code: S.invalid_type,
        expected: M.array,
        received: n.parsedType
      }), N;
    if (n.data.length < this._def.items.length)
      return C(n, {
        code: S.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), N;
    !this._def.rest && n.data.length > this._def.items.length && (C(n, {
      code: S.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...n.data].map((o, a) => {
      const d = this._def.items[a] || this._def.rest;
      return d ? d._parse(new et(n, o, n.path, a)) : null;
    }).filter((o) => !!o);
    return n.common.async ? Promise.all(i).then((o) => Ae.mergeArray(t, o)) : Ae.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Kt({
      ...this._def,
      rest: e
    });
  }
}
Kt.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Kt({
    items: s,
    typeName: D.ZodTuple,
    rest: null,
    ...H(e)
  });
};
class Dn extends Z {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== M.object)
      return C(n, {
        code: S.invalid_type,
        expected: M.object,
        received: n.parsedType
      }), N;
    const r = [], i = this._def.keyType, o = this._def.valueType;
    for (const a in n.data)
      r.push({
        key: i._parse(new et(n, a, n.path, a)),
        value: o._parse(new et(n, n.data[a], n.path, a)),
        alwaysSet: a in n.data
      });
    return n.common.async ? Ae.mergeObjectAsync(t, r) : Ae.mergeObjectSync(t, r);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, n) {
    return t instanceof Z ? new Dn({
      keyType: e,
      valueType: t,
      typeName: D.ZodRecord,
      ...H(n)
    }) : new Dn({
      keyType: dt.create(),
      valueType: e,
      typeName: D.ZodRecord,
      ...H(t)
    });
  }
}
class Ho extends Z {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== M.map)
      return C(n, {
        code: S.invalid_type,
        expected: M.map,
        received: n.parsedType
      }), N;
    const r = this._def.keyType, i = this._def.valueType, o = [...n.data.entries()].map(([a, d], c) => ({
      key: r._parse(new et(n, a, n.path, [c, "key"])),
      value: i._parse(new et(n, d, n.path, [c, "value"]))
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
Ho.create = (s, e, t) => new Ho({
  valueType: e,
  keyType: s,
  typeName: D.ZodMap,
  ...H(t)
});
class Ks extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.parsedType !== M.set)
      return C(n, {
        code: S.invalid_type,
        expected: M.set,
        received: n.parsedType
      }), N;
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
    function o(d) {
      const c = /* @__PURE__ */ new Set();
      for (const l of d) {
        if (l.status === "aborted")
          return N;
        l.status === "dirty" && t.dirty(), c.add(l.value);
      }
      return { status: t.value, value: c };
    }
    const a = [...n.data.values()].map((d, c) => i._parse(new et(n, d, n.path, c)));
    return n.common.async ? Promise.all(a).then((d) => o(d)) : o(a);
  }
  min(e, t) {
    return new Ks({
      ...this._def,
      minSize: { value: e, message: O.toString(t) }
    });
  }
  max(e, t) {
    return new Ks({
      ...this._def,
      maxSize: { value: e, message: O.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ks.create = (s, e) => new Ks({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: D.ZodSet,
  ...H(e)
});
class si extends Z {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
si.create = (s, e) => new si({
  getter: s,
  typeName: D.ZodLazy,
  ...H(e)
});
class Vn extends Z {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return C(t, {
        received: t.data,
        code: S.invalid_literal,
        expected: this._def.value
      }), N;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
Vn.create = (s, e) => new Vn({
  value: s,
  typeName: D.ZodLiteral,
  ...H(e)
});
function jc(s, e) {
  return new Yt({
    values: s,
    typeName: D.ZodEnum,
    ...H(e)
  });
}
class Yt extends Z {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return C(t, {
        expected: X.joinValues(n),
        received: t.parsedType,
        code: S.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), n = this._def.values;
      return C(t, {
        received: t.data,
        code: S.invalid_enum_value,
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
    return Yt.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return Yt.create(this.options.filter((n) => !e.includes(n)), {
      ...this._def,
      ...t
    });
  }
}
Yt.create = jc;
class ni extends Z {
  _parse(e) {
    const t = X.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
    if (n.parsedType !== M.string && n.parsedType !== M.number) {
      const r = X.objectValues(t);
      return C(n, {
        expected: X.joinValues(r),
        received: n.parsedType,
        code: S.invalid_type
      }), N;
    }
    if (this._cache || (this._cache = new Set(X.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const r = X.objectValues(t);
      return C(n, {
        received: n.data,
        code: S.invalid_enum_value,
        options: r
      }), N;
    }
    return Pe(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
ni.create = (s, e) => new ni({
  values: s,
  typeName: D.ZodNativeEnum,
  ...H(e)
});
class $n extends Z {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== M.promise && t.common.async === !1)
      return C(t, {
        code: S.invalid_type,
        expected: M.promise,
        received: t.parsedType
      }), N;
    const n = t.parsedType === M.promise ? t.data : Promise.resolve(t.data);
    return Pe(n.then((r) => this._def.type.parseAsync(r, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
$n.create = (s, e) => new $n({
  type: s,
  typeName: D.ZodPromise,
  ...H(e)
});
class Xt extends Z {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === D.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
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
            return N;
          const d = await this._def.schema._parseAsync({
            data: a,
            path: n.path,
            parent: n
          });
          return d.status === "aborted" ? N : d.status === "dirty" || t.value === "dirty" ? $s(d.value) : d;
        });
      {
        if (t.value === "aborted")
          return N;
        const a = this._def.schema._parseSync({
          data: o,
          path: n.path,
          parent: n
        });
        return a.status === "aborted" ? N : a.status === "dirty" || t.value === "dirty" ? $s(a.value) : a;
      }
    }
    if (r.type === "refinement") {
      const o = (a) => {
        const d = r.refinement(a, i);
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
    if (r.type === "transform")
      if (n.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: n.data,
          path: n.path,
          parent: n
        });
        if (!Ss(o))
          return N;
        const a = r.transform(o.value, i);
        if (a instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: a };
      } else
        return this._def.schema._parseAsync({ data: n.data, path: n.path, parent: n }).then((o) => Ss(o) ? Promise.resolve(r.transform(o.value, i)).then((a) => ({
          status: t.value,
          value: a
        })) : N);
    X.assertNever(r);
  }
}
Xt.create = (s, e, t) => new Xt({
  schema: s,
  typeName: D.ZodEffects,
  effect: e,
  ...H(t)
});
Xt.createWithPreprocess = (s, e, t) => new Xt({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: D.ZodEffects,
  ...H(t)
});
class ut extends Z {
  _parse(e) {
    return this._getType(e) === M.undefined ? Pe(void 0) : this._def.innerType._parse(e);
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
class Qt extends Z {
  _parse(e) {
    return this._getType(e) === M.null ? Pe(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Qt.create = (s, e) => new Qt({
  innerType: s,
  typeName: D.ZodNullable,
  ...H(e)
});
class zn extends Z {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let n = t.data;
    return t.parsedType === M.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
      data: n,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
zn.create = (s, e) => new zn({
  innerType: s,
  typeName: D.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...H(e)
});
class Hn extends Z {
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
    return Fn(r) ? r.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new pt(n.common.issues);
        },
        input: n.data
      })
    })) : {
      status: "valid",
      value: r.status === "valid" ? r.value : this._def.catchValue({
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
Hn.create = (s, e) => new Hn({
  innerType: s,
  typeName: D.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...H(e)
});
class jo extends Z {
  _parse(e) {
    if (this._getType(e) !== M.nan) {
      const n = this._getOrReturnCtx(e);
      return C(n, {
        code: S.invalid_type,
        expected: M.nan,
        received: n.parsedType
      }), N;
    }
    return { status: "valid", value: e.data };
  }
}
jo.create = (s) => new jo({
  typeName: D.ZodNaN,
  ...H(s)
});
class qc extends Z {
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
class $i extends Z {
  _parse(e) {
    const { status: t, ctx: n } = this._processInputParams(e);
    if (n.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: n.data,
          path: n.path,
          parent: n
        });
        return i.status === "aborted" ? N : i.status === "dirty" ? (t.dirty(), $s(i.value)) : this._def.out._parseAsync({
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
      return r.status === "aborted" ? N : r.status === "dirty" ? (t.dirty(), {
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
    return new $i({
      in: e,
      out: t,
      typeName: D.ZodPipeline
    });
  }
}
class jn extends Z {
  _parse(e) {
    const t = this._def.innerType._parse(e), n = (r) => (Ss(r) && (r.value = Object.freeze(r.value)), r);
    return Fn(t) ? t.then((r) => n(r)) : n(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
jn.create = (s, e) => new jn({
  innerType: s,
  typeName: D.ZodReadonly,
  ...H(e)
});
var D;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(D || (D = {}));
const ue = dt.create, ie = _s.create, ri = Xr.create, yf = ei.create;
Pt.create;
const ts = Qe.create, Q = ge.create;
Un.create;
const wf = Vi.create;
Nn.create;
Kt.create;
const Wc = Dn.create, ce = Vn.create, As = Yt.create;
$n.create;
ut.create;
Qt.create;
const bf = 32 * 1024, vf = Math.ceil(bf / 3) * 4, Sf = ["video/mp4", "image/jpeg"], _f = { BASE_URL: "/", DEV: !1, MODE: "production", PROD: !0, SSR: !1 };
function Gc(s) {
  const t = _f?.[s];
  return t === void 0 || t === "" ? void 0 : t;
}
function Fe(s, e) {
  const t = Gc(s);
  if (t === void 0) return e;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : e;
}
function xf(s, e) {
  const t = Gc(s);
  if (t === void 0) return e;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) && n > 0 ? n : e;
}
const Gt = Fe("VITE_CHUNK_MS", 2e3), Zc = Fe("VITE_VIDEO_BITRATE", 12e5), Kc = 96e3, kf = 30, Tf = 48e3, Ef = 960, Cf = 3;
Fe("VITE_LAG_DECAY_CHUNKS", 30);
const ii = 30, ht = 16 * 1024, Af = 3, Bf = 6, Mf = 12, qn = 3e4, If = 0.3, qo = 0.9, Of = 0.7, Wo = qn, br = 2 * qn, Go = 20, Rf = Fe("VITE_HOST_FANOUT", 4), Pf = 3, Ff = Fe("VITE_UPLOAD_BUDGET", 4e6), Lf = 1, Uf = 1, Nf = 0.25, Df = 3, Vf = xf("VITE_PROGRESS_TIMEOUT_CHUNKS", 0.5), $f = 0.5, zf = 1, Hf = 1, vr = 1.25, jf = 0.25, qf = 0.9, Wf = 1.1, Yc = 4, Gf = 3, Zf = 2, Kf = 6, Xc = 4e3, Yf = 2, Xf = Fe("VITE_SUMMARY_MISS_SLACK_MS", 1500), Qc = Xc * Yf + Xf, Qf = 3e4, Jf = 9e4;
Fe("VITE_JOIN_WATCHDOG_MS", 22e3);
Fe("VITE_ORPHAN_REJOIN_MS", 3e3);
const Zo = 2e3, ep = 2, Jc = 1024 * 1024, ed = 60, td = 32, Ko = 8, tp = 4096, sp = 12e4, np = 30, rp = 5, ip = 50, oi = 2, zi = 16, op = Fe("VITE_JOIN_GATHER_MS", 3e3), ap = 3e4, Yo = Fe("VITE_ICE_DISCONNECT_GRACE_MS", 3e3), ai = 250, sd = 1e4, Rs = 3 * sd, Xo = 1e4, cp = 2, dp = 4, lp = Fe("VITE_HOST_ONLY_SLOTS", 1), up = 2, ci = 3, hp = Fe("VITE_MESH_DIAL_BACKOFF_CHUNKS", 30), Ft = J("swarm.wire"), Hi = 5, Wn = ne(Hi), Qo = ne(Hi), me = 1, gs = ue().min(1).max(64), nr = ue().max(64), Bs = ie().int().min(0).max(2 ** 32 - 1), rr = ie().int().min(0), di = ie().int().min(0), fp = ue().min(1).max(32), Lt = ue().regex(/^[0-9a-f]*$/), pp = Q({
  base: Bs,
  bitmapHex: Lt.max(256)
  // ≤128 bytes ⇒ ≤1024-chunk window
}), mp = Q({
  epoch: rr,
  seq: Bs,
  tsUs: ie().int().min(0),
  durUs: ie().int().min(0),
  size: ie().int().min(1).max(32 * 1024 * 1024),
  hash: Lt.length(64),
  sig: Lt.length(128)
}), ss = Lt.length(64), ji = Q({
  epk: ss,
  iv: Lt.length(24),
  ct: Lt.min(2).max(102400)
}), Dt = { from: gs, ts: di, nonce: fp }, _e = { v: ce(me) }, gp = Q({
  ..._e,
  t: ce("hello"),
  addr: gs,
  name: nr,
  epoch: rr,
  edgeSeq: ie().int().min(-1),
  have: pp,
  /** Opt-in flag: willing to act as a delegated join responder (§6.2a). */
  responder: ri().optional(),
  /** Sender's session box pubkey — lets neighbors seal SDP to us and lets
   *  PEX/heartbeats redistribute the key. Optional for wire compat only;
   *  peers without one are never mesh-dialed. */
  boxPub: ss.optional(),
  /** Sender's neighbor count, this link included: the host's first
   *  host-only report (summary.degree carries the next ones). */
  degree: ie().int().min(0).max(256).optional(),
  /** Sender reaches only the host (PeerBook.relayOnly). Absent = false. */
  relayOnly: ri().optional()
}), yp = Q({
  ..._e,
  t: ce("have"),
  seq: Bs,
  edgeSeq: ie().int().min(-1)
}), wp = Q({
  ..._e,
  t: ce("summary"),
  base: Bs,
  bitmapHex: Lt.max(256),
  edgeSeq: ie().int().min(-1),
  /** Sender's current neighbor count. Drives the host's §6.2 bootstrap
   *  prune: a joiner is only re-homed once it reports enough links. */
  degree: ie().int().min(0).max(256).optional(),
  /** As in hello: the sender reaches only the host. Absent = false. */
  relayOnly: ri().optional()
}), bp = Q({
  ..._e,
  t: ce("want"),
  seq: Bs,
  /** ms until the requester's playhead reaches this seq (serve priority). */
  deadlineMs: ie().int().min(0).max(6e5)
}), nd = As(["busy", "missing", "fanout", "budget"]), vp = As(["host-full"]), Sp = Q({
  ..._e,
  t: ce("deny"),
  seq: Bs,
  reason: nd,
  /** 'host-full': a fanout deny to a host-only viewer the host has no seat for. */
  detail: vp.optional().catch(void 0)
}), _p = Q({
  ..._e,
  t: ce("meta"),
  meta: mp
}), xp = Q({
  ..._e,
  t: ce("pex"),
  peers: ts(Q({ addr: gs, name: nr, boxPub: ss.optional() })).max(zi)
}), kp = Q({
  ..._e,
  t: ce("sig"),
  target: gs,
  from: gs,
  kind: As(["offer", "answer"]),
  /** SDP sealed to the target's session box key — relaying peers carry
   *  ciphertext, so they can't harvest the endpoints' IP addresses. */
  sealed: ji,
  /** Sender's session box pubkey — the answer is sealed back to this. */
  boxPub: ss,
  /** Addresses this message has traversed; forwarding stops at SIG_MAX_HOPS. */
  path: ts(gs).max(oi + 1)
}), Tp = Q({ ..._e, t: ce("presence"), ...Dt, name: nr }), rd = Q({
  ..._e,
  t: ce("chat"),
  ...Dt,
  senderName: nr,
  text: ue().min(1).max(500)
}), Ep = rd.extend({
  t: ce("chat-backlog"),
  epoch: rr
}), Cp = Q({
  ..._e,
  t: ce("reaction"),
  ...Dt,
  emoji: ue().min(1).max(16)
}), Ap = Q({
  ..._e,
  t: ce("poll-open"),
  ...Dt,
  pollId: ue().min(1).max(64),
  question: ue().min(1).max(200),
  options: ts(ue().min(1).max(100)).min(2).max(4),
  openedAt: di,
  closesAt: di.optional()
}), Bp = Q({
  ..._e,
  t: ce("poll-vote"),
  ...Dt,
  pollId: ue().min(1).max(64),
  optionIdx: ie().int().min(0).max(3)
}), Mp = Q({
  ..._e,
  t: ce("poll-tally"),
  ...Dt,
  pollId: ue().min(1).max(64),
  tallies: ts(ie().int().min(0)).max(4),
  totalVotes: ie().int().min(0)
}), Ip = Q({
  ..._e,
  t: ce("poll-close"),
  ...Dt,
  pollId: ue().min(1).max(64)
}), Op = Q({
  ..._e,
  t: ce("end"),
  ...Dt,
  epoch: rr,
  sig: Lt.length(128)
}), Rp = Q({
  ..._e,
  t: ce("prune"),
  reason: As(["bootstrap-rotation", "over-degree", "scoring"])
}), Pp = Q({ ..._e, t: ce("bye") }), id = wf("t", [
  gp,
  yp,
  wp,
  bp,
  Sp,
  _p,
  xp,
  kp,
  Tp,
  rd,
  Ep,
  Cp,
  Ap,
  Bp,
  Mp,
  Ip,
  Op,
  Rp,
  Pp
]), Fp = new Set(id.options.map((s) => s.shape.t.value));
function wt(s) {
  return `${s.from}:${s.ts}:${s.nonce}`;
}
function Lp(s) {
  return JSON.stringify(s);
}
function Up(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return Sr("not-json");
  }
  if (!e || typeof e != "object") return Sr("not-object");
  const { v: t, t: n } = e;
  if (t !== me || typeof n != "string" || !Fp.has(n)) {
    const i = `v=${String(t)} t=${String(n)}`;
    return Wn.allow(i) && Ft.debug("ctrl ignored: unknown version or type", { v: t, type: n, seen: Wn.count(i) }), { kind: "ignore" };
  }
  const r = id.safeParse(e);
  return r.success ? { kind: "ok", msg: r.data } : Sr(r.error.issues[0]?.message ?? "invalid", String(n));
}
function Sr(s, e) {
  return Wn.allow(s) && Ft.warn("ctrl message dropped: decode failed", { error: s, type: e, seen: Wn.count(s) }), { kind: "invalid", error: s };
}
function Np(s, e, t) {
  const n = new Uint8Array(Math.ceil(t / 8));
  for (const i of e) {
    const o = i - s;
    o < 0 || o >= t || (n[o >> 3] |= 128 >> (o & 7));
  }
  let r = "";
  for (const i of n) r += i.toString(16).padStart(2, "0");
  return { base: s, bitmapHex: r };
}
function Jo(s) {
  const e = /* @__PURE__ */ new Set(), { base: t, bitmapHex: n } = s;
  for (let r = 0; r * 2 < n.length; r++) {
    const i = Number.parseInt(n.slice(r * 2, r * 2 + 2), 16);
    if (i)
      for (let o = 0; o < 8; o++)
        i & 128 >> o && e.add(t + r * 8 + o);
  }
  return e;
}
const Hs = 24, od = 21328;
function xn(s) {
  return s % 4294967296;
}
function Dp(s) {
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
  const e = new Uint8Array(Hs + s.payload.length), t = new DataView(e.buffer);
  return t.setUint16(0, od, !0), t.setUint8(2, me), t.setUint8(3, 0), t.setUint32(4, s.seq, !0), t.setUint16(8, s.sliceIdx, !0), t.setUint16(10, s.sliceCount, !0), t.setUint32(12, s.payload.length, !0), t.setUint32(16, s.epochLow, !0), t.setUint32(20, 0, !0), e.set(s.payload, Hs), e;
}
function Vp(s) {
  if (s.length < Hs) return is("short-header");
  const e = new DataView(s.buffer, s.byteOffset, s.byteLength);
  if (e.getUint16(0, !0) !== od) return is("bad-magic");
  if (e.getUint8(2) !== me) return is("bad-version");
  const t = e.getUint32(4, !0), n = e.getUint16(8, !0), r = e.getUint16(10, !0), i = e.getUint32(12, !0), o = e.getUint32(16, !0);
  return r === 0 || n >= r ? is("bad-slice-index", t) : i === 0 || i > ht ? is("bad-payload-len", t) : s.length !== Hs + i ? is("length-mismatch", t) : {
    kind: "ok",
    frame: {
      epochLow: o,
      seq: t,
      sliceIdx: n,
      sliceCount: r,
      payload: s.subarray(Hs)
    }
  };
}
function is(s, e) {
  return Qo.allow(s) && Ft.warn("slice dropped: decode failed", { error: s, seq: e, seen: Qo.count(s) }), { kind: "invalid", error: s };
}
function $p(s, e, t) {
  if (t.length === 0)
    throw Ft.error("chunk slicing failed: empty payload", { seq: e, epoch: s }), new Error("empty chunk payload");
  const n = Math.ceil(t.length / ht);
  if (n > 65535)
    throw Ft.error("chunk slicing failed: too many slices", { seq: e, sliceCount: n, bytes: t.length }), new Error(`chunk needs ${n} slices > u16`);
  const r = xn(s), i = [];
  for (let o = 0; o < n; o++)
    i.push({
      epochLow: r,
      seq: e,
      sliceIdx: o,
      sliceCount: n,
      payload: t.subarray(o * ht, Math.min((o + 1) * ht, t.length))
    });
  return i;
}
class zp {
  partials = /* @__PURE__ */ new Map();
  assembleCap = ne(Hi);
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
    const r = n.received === 0;
    if (n.slices[e.sliceIdx] || (n.slices[e.sliceIdx] = e.payload, n.received++), n.received < n.sliceCount)
      return { kind: "progress", received: n.received, total: n.sliceCount, firstSlice: r };
    this.partials.delete(t);
    const i = n.slices.reduce((d, c) => d + (c?.length ?? 0), 0), o = new Uint8Array(i);
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
const li = J("statement.schema"), hs = ne(5), Hp = As([
  "heartbeat",
  "swarm-join",
  "welcome-board"
]), jp = Q({
  type: Hp,
  from: ue(),
  to: ue().optional(),
  timestamp: ie(),
  payload: Wc(yf()).optional()
}), Jt = ue().min(1).max(64), qi = ue().max(64), qp = ue().regex(/^[0-9a-f]*$/), Wp = Q({
  /** Ephemeral per-stream ed25519 public key, hex (plan §4). */
  streamPubKey: qp.length(64),
  /** Stream session id (go-live timestamp ms); resets the chunk seq space. */
  epoch: ie().int().min(0),
  chunkMs: ie().int().min(200).max(1e4),
  /** MSE codec string, e.g. `video/mp4; codecs="avc1.64001f, mp4a.40.2"`. */
  codecs: ue().min(1).max(200),
  edgeSeq: ie().int().min(-1),
  /** Delegated join responders (§6.2a), host always implicitly included. */
  responders: ts(Jt).max(8).optional(),
  /**
   * X25519 session box pubkeys by address — the host plus every listed
   * responder. A joiner seals its swarm-join SDP to its chosen responder's
   * key: statements on the signal topic are publicly subscribable, and a
   * cleartext non-trickle SDP would publish the joiner's IP next to its
   * on-chain address. The heartbeat statement is host-signed, so these keys
   * share the streamPubKey trust anchor.
   */
  boxPubs: Wc(Jt, ss).optional()
}), Gp = Q({
  mime: As(Sf),
  data: ue().min(4).max(vf).regex(/^[A-Za-z0-9+/]+={0,2}$/)
});
Q({
  roomHash: ue().min(1).max(128),
  hostAddress: Jt,
  hostName: qi,
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
  mesh: Wp.optional(),
  /** The lobby card preview. Absent = no preview. */
  clip: Gp.optional(),
  /** The host ended this stream. Absent = live. */
  ended: ce(!0).optional()
});
const Zp = Q({
  viewerAddress: Jt,
  viewerName: qi,
  /** The peer this join is addressed to; others on the topic ignore it. */
  responder: Jt,
  /** Viewer's session box pubkey — the welcome answer is sealed back to it. */
  boxPub: ss,
  sealedSdp: ji,
  sdpType: ce("offer")
}), Kp = Q({
  /** The joiner this answer is for. */
  to: Jt,
  sealedSdp: ji,
  sdpType: ce("answer"),
  /** Sample of live peers to dial for additional mesh links. `boxPub` lets
   *  the joiner seal its mesh-dial offers to them (§6.3). */
  seeds: ts(Q({ addr: Jt, name: qi, boxPub: ss.optional() })).max(8),
  edgeSeq: ie().int().min(-1),
  epoch: ie().int().min(0)
});
Q({
  answers: ts(Kp).max(td)
});
function Yp(s, e) {
  const t = e.safeParse(s.payload);
  return t.success ? t.data : (hs.allow(`payload:${s.type}`) && li.warn("dropping a message: invalid payload", {
    type: s.type,
    from: v(s.from),
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: hs.count(`payload:${s.type}`)
  }), null);
}
function Xp(s) {
  let e;
  try {
    e = JSON.parse(s);
  } catch {
    return hs.allow("envelope:json") && li.debug("dropping a statement: the data is not JSON", {
      bytes: s.length,
      seen: hs.count("envelope:json")
    }), null;
  }
  const t = jp.safeParse(e);
  return t.success ? t.data : (hs.allow("envelope:schema") && li.debug("dropping a statement: the envelope does not match the schema", {
    issues: t.error.issues.map((n) => `${n.path.join(".")}: ${n.message}`).join("; "),
    seen: hs.count("envelope:schema")
  }), null);
}
const Qp = new TextEncoder();
function sn(s) {
  return _u(Qp.encode(s));
}
function Jp() {
  return sn("spotlight:lobby:v1");
}
function em(s) {
  return sn(`spotlight:signal:v1:${s}`);
}
function tm() {
  return sn("spotlight:heartbeat-channel:v1");
}
function sm() {
  return sn("spotlight:join-channel:v1");
}
function nm() {
  return sn("spotlight:welcome-board-channel:v1");
}
function os(s) {
  let e = "";
  for (let t = 0; t < s.length; t++)
    e += s[t].toString(16).padStart(2, "0");
  return e;
}
const oe = J("statement.client"), ea = _c();
function rm(s) {
  if (!s) return null;
  try {
    switch (s.tag) {
      case "Sr25519":
      case "Ed25519":
      case "Ecdsa":
        return ea.dec(s.value.signer);
      case "OnChain":
        return ea.dec(s.value.who);
      default:
        return null;
    }
  } catch {
    return null;
  }
}
const im = new TextEncoder(), om = new TextDecoder(), am = 300, cm = {
  timeout: "The host has not confirmed permission to publish signaling, so streams cannot be announced or joined. If an approval is waiting in the Polkadot app, answer it — this clears on its own.",
  declined: "Permission to publish signaling was declined, so streams cannot be announced or joined. Start a stream or rejoin the room to be asked again.",
  unavailable: "The host did not grant Spotlight permission to publish signaling, so streams cannot be announced or joined. Retrying — if this persists, reopen Spotlight from Polkadot Desktop or the browser host."
};
class dm {
  store = null;
  productAccount = null;
  subscribers = /* @__PURE__ */ new Map();
  routes = /* @__PURE__ */ new Map();
  nextSubId = 0;
  disposed = !1;
  /** One allocator for this client's signing account — every submit draws from
   *  it, so same-second statements can't tie (see ./expiry.ts). */
  expiry = Uh();
  /** Submits in flight by type, so each submit line says what it shared the
   *  bridge with. Observability only. */
  inflight = jh();
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
      e = await tc();
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
    Dc("statement-submit").then(({ "statement-submit": e }) => {
      e && (e === "granted" || this.disposed || this.reportedGrantOutcome !== e && (this.reportedGrantOutcome = e, oe.error("statement grants not available", { outcome: e }), this.onFatalError?.(new Error(cm[e]))));
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
    const r = os(e), i = this.routes.get(r);
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
        const c = this.store.subscribe(
          { matchAll: [ln(e)] },
          (l) => {
            let u = 0, h = 0;
            for (const m of l.statements) {
              const y = um(m);
              if (!y) {
                h++;
                continue;
              }
              u++;
              for (const p of o)
                try {
                  p(y.envelope, y.signedBy);
                } catch (b) {
                  oe.error("handler threw", { topic: ve(r), err: b });
                }
            }
            const f = this.routes.get(r);
            f && (f.lastPageAt = Date.now()), oe.debug("page received", {
              topic: ve(r),
              statements: l.statements.length,
              decoded: u,
              dropped: h
            });
          }
        );
        return c.onInterrupt((l) => {
          oe.warn("upstream subscription interrupted — resubscribing", {
            topic: ve(r),
            payload: l
          });
          const u = this.routes.get(r);
          if (!u || this.disposed) return;
          const h = a();
          u.unsubscribe = h.unsubscribe, u.lastPageAt = Date.now();
        }), { unsubscribe: c.unsubscribe };
      }, d = a();
      this.routes.set(r, {
        topic: e,
        handlers: o,
        unsubscribe: d.unsubscribe,
        lastPageAt: Date.now(),
        resubscribe: () => {
          const c = this.routes.get(r);
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
    const t = this.routes.get(os(e));
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
    const t = os(e), n = this.routes.get(t);
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
        oe.warn("subscription refresh failed", { topic: ve(os(e.topic)), err: t });
      }
  }
  unsubscribe(e) {
    const t = this.subscribers.get(e);
    if (!t) return;
    this.subscribers.delete(e);
    const n = os(t.topic), r = this.routes.get(n);
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
    const i = hh();
    if (i !== null) throw new Gr(i);
    this.primeGrants();
    const o = im.encode(JSON.stringify(t)), a = n?.expirySecs ?? am, d = n?.channel ? ln(n.channel) : void 0, c = Date.now(), l = this.inflight.snapshot();
    oe.debug("submit started", {
      type: t.type,
      to: v(t.to),
      topic: ve(os(e)),
      bytes: o.length,
      expirySecs: a,
      channel: d ? ve(d) : null,
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
          topics: [ln(e)],
          data: ln(o)
        };
        let m;
        const y = Date.now();
        try {
          m = await this.store.createProofAuthorized(f);
        } catch (b) {
          const g = b instanceof Error ? b : new Error(String(b));
          if (lm(g)) {
            const k = Fc();
            throw oe.error("createProof failed with UnableToSign — submits paused", {
              type: t.type,
              attempt: h,
              strikes: k.strikes,
              pauseS: Math.round((k.until - Date.now()) / 1e3),
              err: g,
              proofMs: Date.now() - y,
              ...u.overlap()
            }), new Gr(k.until, { cause: g });
          }
          throw oe.error("createProof failed", {
            type: t.type,
            attempt: h,
            err: g,
            proofMs: Date.now() - y,
            ...u.overlap()
          }), r(g), g;
        }
        const p = Date.now() - y;
        try {
          await this.store.submit({ ...f, proof: m }), ah(), fh(), oe.debug("submit succeeded", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap()
          });
          return;
        } catch (b) {
          const g = b instanceof Error ? b : new Error(String(b)), k = h === 0 ? $h(b) : null;
          if (k !== null && this.expiry.raiseFloor(k, d)) {
            oe.warn("statement rejected below the priority floor — re-minting above it", {
              type: t.type,
              min: k,
              channel: d ? ve(d) : null
            });
            continue;
          }
          const U = h === 0 && this.claimSlotWhenFull ? zh(b) : null;
          if (U !== null && this.expiry.raiseFloor(U, d)) {
            oe.warn("statement store account is full — claiming the earliest-expiring slot", {
              type: t.type,
              min: U,
              channel: d ? ve(d) : null
            });
            continue;
          }
          throw Di(b) ? (oe.error("statement store account is full — submits rejected until slots free", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap(),
            err: g
          }), r(g), g) : (oe.error("statement submit rejected", {
            type: t.type,
            attempt: h,
            latencyMs: Date.now() - c,
            proofMs: p,
            ...u.overlap(),
            err: g
          }), r(g), g);
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
function lm(s) {
  return /\bUnableToSign\b/.test(s.message);
}
function um(s) {
  if (!s.data || s.data.length <= 2) return null;
  try {
    const e = om.decode(bl(s.data)), t = Xp(e);
    return t ? { envelope: t, signedBy: rm(s.proof) } : null;
  } catch {
    return null;
  }
}
const zt = J("swarm.transport"), Ht = /* @__PURE__ */ new Map(), ui = 600 * 1e3, _r = 1e3;
function hm() {
  Ht.clear(), js.clear();
}
function fm(s) {
  let e = 0;
  for (const [t, n] of Ht)
    s - n.seenAt >= ui && (Ht.delete(t), js.delete(t), e++);
  return e;
}
const js = /* @__PURE__ */ new Set();
function pm(s, e, t) {
  const n = Date.now(), r = Ht.get(s);
  if (r && n - r.seenAt < ui) {
    if (r.signer === e)
      return r.seenAt = n, !0;
    if (!js.has(s)) {
      js.add(s);
      const i = Math.round((ui - (n - r.seenAt)) / 1e3);
      zt.warn("sender binding mismatch — statement dropped", {
        type: t,
        from: v(s),
        boundSigner: v(r.signer),
        signedBy: v(e),
        lapsesInSec: i
      });
    }
    return !1;
  }
  if (!r && Ht.size >= _r) {
    const i = fm(n);
    if (Ht.size >= _r)
      return zt.warn("sender binding table full", {
        type: t,
        from: v(s),
        cap: _r
      }), !1;
    zt.debug("sender bindings swept", { swept: i, from: v(s) });
  }
  return Ht.set(s, { signer: e, seenAt: n }), js.delete(s), !0;
}
function mm(s, e) {
  return {
    submit(t) {
      if (t.type === "welcome-board") {
        const r = { expirySecs: ed, channel: nm() };
        return zt.debug("tx", { type: t.type, channel: r.channel }), s.submit(e, t, r);
      }
      const n = { channel: sm() };
      return zt.debug("tx", { type: t.type, channel: n.channel, to: v(t.to) }), s.submit(e, t, n);
    },
    subscribe(t) {
      let n = !0, r = null;
      return s.subscribe(e, (i, o) => {
        n && (o !== null && !pm(i.from, o, i.type) || (zt.debug("rx", {
          type: i.type,
          from: v(i.from),
          signedBy: v(o)
        }), t(i, o)));
      }).then((i) => {
        n ? r = i : s.unsubscribe(i);
      }).catch((i) => {
        zt.error("transport subscribe failed", { err: i });
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
function T(s) {
  if (!s)
    throw new Error("Assertion failed.");
}
const fs = (s) => s && s[s.length - 1], Ut = (s) => s >= 0 && s < 2 ** 32, x = (s) => {
  let e = 0;
  for (; s.readBits(1) === 0 && e < 32; )
    e++;
  if (e >= 32)
    throw new Error("Invalid exponential-Golomb code.");
  return (1 << e) - 1 + s.readBits(e);
}, lt = (s) => {
  const e = x(s);
  return (e & 1) === 0 ? -(e >> 1) : e + 1 >> 1;
}, nn = (s) => s.constructor === Uint8Array ? s : ArrayBuffer.isView(s) ? new Uint8Array(s.buffer, s.byteOffset, s.byteLength) : new Uint8Array(s), ad = (s) => s.constructor === DataView ? s : ArrayBuffer.isView(s) ? new DataView(s.buffer, s.byteOffset, s.byteLength) : new DataView(s), Ye = /* @__PURE__ */ new TextEncoder(), Wi = {
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
}, Gi = {
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
}, Zi = {
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
}, gm = (s) => !!s && !!s.primaries && !!s.transfer && !!s.matrix && s.fullRange !== void 0, cd = (s) => s instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && s instanceof SharedArrayBuffer || ArrayBuffer.isView(s);
class dd {
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
const ym = () => {
  let s, e;
  return { promise: new Promise((n, r) => {
    s = n, e = r;
  }), resolve: s, reject: e };
}, ld = (s) => {
  throw new Error(`Unexpected value: ${s}`);
}, wm = (s, e, t, n) => {
  t = t >>> 0, t = t & 16777215, s.setUint8(e, t >>> 16 & 255), s.setUint8(e + 1, t >>> 8 & 255), s.setUint8(e + 2, t & 255);
}, bm = "und", vm = /^[a-z]{3}$/, Sm = (s) => vm.test(s), ta = 1e6 * (1 + Number.EPSILON), _m = (s, e) => {
  const t = s < 0 ? -1 : 1;
  s = Math.abs(s);
  let n = 0, r = 1, i = 1, o = 0, a = s;
  for (; ; ) {
    const d = Math.floor(a), c = d * i + n, l = d * o + r;
    if (l > e)
      return {
        num: t * i,
        den: o
      };
    if (n = i, r = o, i = c, o = l, a = 1 / (a - d), !isFinite(a))
      break;
  }
  return {
    num: t * i,
    den: o
  };
}, ud = function* (s) {
  for (const e in s) {
    const t = s[e];
    t !== void 0 && (yield { key: e, value: t });
  }
}, xm = (s) => {
  T(Number.isInteger(s.num)), T(Number.isInteger(s.den)), T(s.den !== 0);
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
}, sa = (s) => Array.isArray(s) ? s : [s];
class Ki {
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
const km = (s) => s !== null && typeof s == "object" && Object.getPrototypeOf(s) === Object.prototype && Object.values(s).every((e) => typeof e == "string");
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
class he {
  constructor() {
  }
  /** The current log level. Defaults to {@link LogLevel.Info}. */
  static get level() {
    return he._level;
  }
  static set level(e) {
    if (e !== Ge.Silent && e !== Ge.Errors && e !== Ge.Warnings && e !== Ge.Info)
      throw new TypeError("Invalid log level. Use one of the values of the LogLevel enum.");
    he._level = e;
  }
  /** @internal */
  static get _emitter() {
    return he._emitterInstance ??= new Ki();
  }
  /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
  static on(e, t, n) {
    return he._emitter.on(e, t, n);
  }
  /** @internal */
  static _error(...e) {
    he._emitter._emit("error", e), he._level >= Ge.Errors && console.error(...e);
  }
  /** @internal */
  static _warn(...e) {
    he._emitter._emit("warn", e), he._level >= Ge.Warnings && console.warn(...e);
  }
  /** @internal */
  static _info(...e) {
    he._emitter._emit("info", e), he._level >= Ge.Info && console.info(...e);
  }
}
he._level = Ge.Info;
he._emitterInstance = null;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
class hd {
  /** Creates a new {@link RichImageData}. */
  constructor(e, t) {
    if (this.data = e, this.mimeType = t, !(e instanceof Uint8Array))
      throw new TypeError("data must be a Uint8Array.");
    if (typeof t != "string")
      throw new TypeError("mimeType must be a string.");
  }
}
class Tm {
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
const Em = (s) => {
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
      if (e !== null && typeof e != "string" && !(e instanceof Uint8Array) && !(e instanceof hd) && !(e instanceof Tm) && !km(e))
        throw new TypeError("Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.");
  }
}, Cm = (s) => {
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
const fd = [
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
], pd = [-1, 1, 2, 3, 4, 5, 6, 8], Am = (s) => {
  let e = fd.indexOf(s.sampleRate), t = null;
  e === -1 && (e = 15, t = s.sampleRate);
  const n = pd.indexOf(s.numberOfChannels);
  if (n === -1)
    throw new TypeError(`Unsupported number of channels: ${s.numberOfChannels}`);
  let r = 13;
  s.objectType >= 32 && (r += 6), e === 15 && (r += 24);
  const i = Math.ceil(r / 8), o = new Uint8Array(i), a = new ze(o);
  return s.objectType < 32 ? a.writeBits(5, s.objectType) : (a.writeBits(5, 31), a.writeBits(6, s.objectType - 32)), a.writeBits(4, e), e === 15 && a.writeBits(24, t), a.writeBits(4, n), o;
};
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const xs = [
  "avc",
  "hevc",
  "vp9",
  "av1",
  "vp8",
  "prores"
], ks = [
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
], Yi = [
  "aac",
  "opus",
  "mp3",
  "vorbis",
  "flac",
  "ac3",
  "eac3"
], Gn = [
  ...Yi,
  ...ks
], Ys = [
  "webvtt"
], na = [
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
], kn = [
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
], Bm = (s) => {
  const e = s.split("."), r = (1 << 7) + 1, i = Number(e[1]), o = e[2], a = Number(o.slice(0, -1)), d = (i << 5) + a, c = o.slice(-1) === "H" ? 1 : 0, u = Number(e[3]) === 8 ? 0 : 1, h = 0, f = e[4] ? Number(e[4]) : 0, m = e[5] ? Number(e[5][0]) : 1, y = e[5] ? Number(e[5][1]) : 1, p = e[5] ? Number(e[5][2]) : 0, b = (c << 7) + (u << 6) + (h << 5) + (f << 4) + (m << 3) + (y << 2) + p;
  return [r, d, b, 0];
}, Mm = /^pcm-([usf])(\d+)(be)?$/, Ts = (s) => {
  if (T(ks.includes(s)), s === "ulaw")
    return { dataType: "ulaw", sampleSize: 1, littleEndian: !0, silentValue: 255 };
  if (s === "alaw")
    return { dataType: "alaw", sampleSize: 1, littleEndian: !0, silentValue: 213 };
  const e = Mm.exec(s);
  T(e);
  let t;
  e[1] === "u" ? t = "unsigned" : e[1] === "s" ? t = "signed" : t = "float";
  const n = Number(e[2]) / 8, r = e[3] !== "be", i = s === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType: t, sampleSize: n, littleEndian: r, silentValue: i };
}, Im = ["avc1", "avc3", "hev1", "hvc1", "vp8", "vp09", "av01", ...kn], Om = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/, Rm = /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/, Pm = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/, Fm = /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/, Lm = (s) => {
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
  if (!Im.some((e) => s.decoderConfig.codec.startsWith(e)))
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
  if (s.decoderConfig.description !== void 0 && !cd(s.decoderConfig.description))
    throw new TypeError("Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.");
  if (s.decoderConfig.colorSpace !== void 0) {
    const { colorSpace: e } = s.decoderConfig;
    if (typeof e != "object")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace, when provided, must be an object.");
    const t = Object.keys(Wi);
    if (e.primaries != null && !t.includes(e.primaries))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of ${t.join(", ")}.`);
    const n = Object.keys(Gi);
    if (e.transfer != null && !n.includes(e.transfer))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of ${n.join(", ")}.`);
    const r = Object.keys(Zi);
    if (e.matrix != null && !r.includes(e.matrix))
      throw new TypeError(`Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of ${r.join(", ")}.`);
    if (e.fullRange != null && typeof e.fullRange != "boolean")
      throw new TypeError("Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.");
  }
  if (s.decoderConfig.codec.startsWith("avc1") || s.decoderConfig.codec.startsWith("avc3")) {
    if (!Om.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.");
  } else if (s.decoderConfig.codec.startsWith("hev1") || s.decoderConfig.codec.startsWith("hvc1")) {
    if (!Rm.test(s.decoderConfig.codec))
      throw new TypeError("Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.");
  } else if (s.decoderConfig.codec.startsWith("vp8")) {
    if (s.decoderConfig.codec !== "vp8")
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP8 must be "vp8".');
  } else if (s.decoderConfig.codec.startsWith("vp09")) {
    if (!Pm.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.');
  } else if (s.decoderConfig.codec.startsWith("av01")) {
    if (!Fm.test(s.decoderConfig.codec))
      throw new TypeError('Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.');
  } else if (kn.some((e) => s.decoderConfig.codec.startsWith(e)) && !kn.some((e) => s.decoderConfig.codec === e))
    throw new TypeError(`Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes four-character codes: ${kn.join(", ")}.`);
}, Um = [
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
], Nm = (s) => {
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
  if (!Um.some((e) => s.decoderConfig.codec.startsWith(e)))
    throw new TypeError("Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.");
  if (!Number.isInteger(s.decoderConfig.sampleRate) || s.decoderConfig.sampleRate <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).");
  if (!Number.isInteger(s.decoderConfig.numberOfChannels) || s.decoderConfig.numberOfChannels <= 0)
    throw new TypeError("Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).");
  if (s.decoderConfig.description !== void 0 && !cd(s.decoderConfig.description))
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
  } else if ((s.decoderConfig.codec.startsWith("pcm") || s.decoderConfig.codec.startsWith("ulaw") || s.decoderConfig.codec.startsWith("alaw")) && !ks.includes(s.decoderConfig.codec))
    throw new TypeError(`Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM codecs (${ks.join(", ")}).`);
}, Dm = (s) => {
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
const Vm = [48e3, 44100, 32e3], $m = [24e3, 22050, 16e3];
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
var qs;
(function(s) {
  s[s.NON_IDR_SLICE = 1] = "NON_IDR_SLICE", s[s.SLICE_DPA = 2] = "SLICE_DPA", s[s.SLICE_DPB = 3] = "SLICE_DPB", s[s.SLICE_DPC = 4] = "SLICE_DPC", s[s.IDR = 5] = "IDR", s[s.SEI = 6] = "SEI", s[s.SPS = 7] = "SPS", s[s.PPS = 8] = "PPS", s[s.AUD = 9] = "AUD", s[s.SPS_EXT = 13] = "SPS_EXT";
})(qs || (qs = {}));
var We;
(function(s) {
  s[s.RASL_N = 8] = "RASL_N", s[s.RASL_R = 9] = "RASL_R", s[s.BLA_W_LP = 16] = "BLA_W_LP", s[s.RSV_IRAP_VCL23 = 23] = "RSV_IRAP_VCL23", s[s.VPS_NUT = 32] = "VPS_NUT", s[s.SPS_NUT = 33] = "SPS_NUT", s[s.PPS_NUT = 34] = "PPS_NUT", s[s.AUD_NUT = 35] = "AUD_NUT", s[s.PREFIX_SEI_NUT = 39] = "PREFIX_SEI_NUT", s[s.SUFFIX_SEI_NUT = 40] = "SUFFIX_SEI_NUT";
})(We || (We = {}));
const Xi = function* (s) {
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
}, zm = (s) => s & 31, Qi = (s) => {
  const e = [], t = s.length;
  for (let n = 0; n < t; n++)
    n + 2 < t && s[n] === 0 && s[n + 1] === 0 && s[n + 2] === 3 ? (e.push(0, 0), n += 2) : e.push(s[n]);
  return new Uint8Array(e);
}, Hm = (s, e) => {
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
        wm(o, r, i.byteLength);
        break;
      case 4:
        o.setUint32(r, i.byteLength, !1);
        break;
    }
    r += e, n.set(i, r), r += i.byteLength;
  }
  return n;
}, jm = (s) => {
  try {
    const e = [], t = [], n = [];
    for (const a of Xi(s)) {
      const d = s.subarray(a.offset, a.offset + a.length), c = zm(d[0]);
      c === qs.SPS ? e.push(d) : c === qs.PPS ? t.push(d) : c === qs.SPS_EXT && n.push(d);
    }
    if (e.length === 0 || t.length === 0)
      return null;
    const r = e[0], i = Wm(r);
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
      pictureParameterSets: t,
      chromaFormat: o ? i.chromaFormatIdc : null,
      bitDepthLumaMinus8: o ? i.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: o ? i.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: o ? n : null
    };
  } catch (e) {
    return he._error("Error building AVC Decoder Configuration Record:", e), null;
  }
}, qm = (s) => {
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
    T(s.chromaFormat !== null), T(s.bitDepthLumaMinus8 !== null), T(s.bitDepthChromaMinus8 !== null), T(s.sequenceParameterSetExt !== null), e.push(252 | s.chromaFormat & 3), e.push(248 | s.bitDepthLumaMinus8 & 7), e.push(248 | s.bitDepthChromaMinus8 & 7), e.push(s.sequenceParameterSetExt.length);
    for (const t of s.sequenceParameterSetExt) {
      const n = t.byteLength;
      e.push(n >> 8), e.push(n & 255);
      for (let r = 0; r < n; r++)
        e.push(t[r]);
    }
  }
  return new Uint8Array(e);
}, md = {
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
}, Wm = (s) => {
  try {
    const e = new ze(Qi(s));
    if (e.skipBits(1), e.skipBits(2), e.readBits(5) !== 7)
      return null;
    const n = e.readAlignedByte(), r = e.readAlignedByte(), i = e.readAlignedByte();
    x(e);
    let o = 1, a = 0, d = 0, c = 0;
    if ((n === 100 || n === 110 || n === 122 || n === 244 || n === 44 || n === 83 || n === 86 || n === 118 || n === 128) && (o = x(e), o === 3 && (c = e.readBits(1)), a = x(e), d = x(e), e.skipBits(1), e.readBits(1))) {
      for (let _ = 0; _ < (o !== 3 ? 8 : 12); _++)
        if (e.readBits(1)) {
          const A = _ < 6 ? 16 : 64;
          let P = 8, B = 8;
          for (let W = 0; W < A; W++) {
            if (B !== 0) {
              const ee = lt(e);
              B = (P + ee + 256) % 256;
            }
            P = B === 0 ? P : B;
          }
        }
    }
    x(e);
    const l = x(e);
    if (l === 0)
      x(e);
    else if (l === 1) {
      e.skipBits(1), lt(e), lt(e);
      const K = x(e);
      for (let _ = 0; _ < K; _++)
        lt(e);
    }
    x(e), e.skipBits(1);
    const u = x(e), h = x(e), f = 16 * (u + 1), m = 16 * (h + 1);
    let y = f, p = m;
    const b = e.readBits(1);
    if (b || e.skipBits(1), e.skipBits(1), e.readBits(1)) {
      const K = x(e), _ = x(e), I = x(e), A = x(e);
      let P, B;
      if ((c === 0 ? o : 0) === 0)
        P = 1, B = 2 - b;
      else {
        const ee = o === 3 ? 1 : 2, de = o === 1 ? 2 : 1;
        P = ee, B = de * (2 - b);
      }
      y -= P * (K + _), p -= B * (I + A);
    }
    let k = 2, U = 2, q = 2, G = 0, L = { num: 1, den: 1 }, j = null, $ = null;
    if (e.readBits(1)) {
      if (e.readBits(1)) {
        const de = e.readBits(8);
        if (de === 255)
          L = {
            num: e.readBits(16),
            den: e.readBits(16)
          };
        else {
          const xe = md[de];
          xe && (L = xe);
        }
      }
      e.readBits(1) && e.skipBits(1), e.readBits(1) && (e.skipBits(3), G = e.readBits(1), e.readBits(1) && (k = e.readBits(8), U = e.readBits(8), q = e.readBits(8))), e.readBits(1) && (x(e), x(e)), e.readBits(1) && (e.skipBits(32), e.skipBits(32), e.skipBits(1));
      const B = e.readBits(1);
      B && ra(e);
      const W = e.readBits(1);
      W && ra(e), (B || W) && e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(1), x(e), x(e), x(e), x(e), j = x(e), $ = x(e));
    }
    if (j === null) {
      T($ === null);
      const K = r & 16;
      if ((n === 44 || n === 86 || n === 100 || n === 110 || n === 122 || n === 244) && K)
        j = 0, $ = 0;
      else {
        const _ = u + 1, I = h + 1, A = (2 - b) * I, P = na.find((W) => W.level >= i) ?? fs(na), B = Math.min(Math.floor(P.maxDpbMbs / (_ * A)), 16);
        j = B, $ = B;
      }
    }
    return T($ !== null), {
      profileIdc: n,
      constraintFlags: r,
      levelIdc: i,
      frameMbsOnlyFlag: b,
      chromaFormatIdc: o,
      bitDepthLumaMinus8: a,
      bitDepthChromaMinus8: d,
      codedWidth: f,
      codedHeight: m,
      displayWidth: y,
      displayHeight: p,
      pixelAspectRatio: L,
      colourPrimaries: k,
      matrixCoefficients: q,
      transferCharacteristics: U,
      fullRangeFlag: G,
      numReorderFrames: j,
      maxDecFrameBuffering: $
    };
  } catch (e) {
    return he._error("Error parsing AVC SPS:", e), null;
  }
}, ra = (s) => {
  const e = x(s);
  s.skipBits(4), s.skipBits(4);
  for (let t = 0; t <= e; t++)
    x(s), x(s), s.skipBits(1);
  s.skipBits(5), s.skipBits(5), s.skipBits(5), s.skipBits(5);
}, ia = (s) => s >> 1 & 63, Gm = (s) => {
  try {
    const e = new ze(Qi(s));
    e.skipBits(16), e.readBits(4);
    const t = e.readBits(3), n = e.readBits(1), { general_profile_space: r, general_tier_flag: i, general_profile_idc: o, general_profile_compatibility_flags: a, general_constraint_indicator_flags: d, general_level_idc: c } = Km(e, t);
    x(e);
    const l = x(e);
    let u = 0;
    l === 3 && (u = e.readBits(1));
    const h = x(e), f = x(e);
    let m = h, y = f;
    if (e.readBits(1)) {
      const _ = x(e), I = x(e), A = x(e), P = x(e);
      let B = 1, W = 1;
      const ee = u === 0 ? l : 0;
      ee === 1 ? (B = 2, W = 2) : ee === 2 && (B = 2, W = 1), m -= (_ + I) * B, y -= (A + P) * W;
    }
    const p = x(e), b = x(e);
    x(e);
    const k = e.readBits(1) ? 0 : t;
    let U = 0;
    for (let _ = k; _ <= t; _++)
      x(e), U = x(e), x(e);
    x(e), x(e), x(e), x(e), x(e), x(e), e.readBits(1) && e.readBits(1) && Ym(e), e.skipBits(1), e.skipBits(1), e.readBits(1) && (e.skipBits(4), e.skipBits(4), x(e), x(e), e.skipBits(1));
    const q = x(e);
    if (Xm(e, q), e.readBits(1)) {
      const _ = x(e);
      for (let I = 0; I < _; I++)
        x(e), e.skipBits(1);
    }
    e.skipBits(1), e.skipBits(1);
    let G = 2, L = 2, j = 2, $ = 0, te = 0, K = { num: 1, den: 1 };
    if (e.readBits(1)) {
      const _ = Jm(e, t);
      K = _.pixelAspectRatio, G = _.colourPrimaries, L = _.transferCharacteristics, j = _.matrixCoefficients, $ = _.fullRangeFlag, te = _.minSpatialSegmentationIdc;
    }
    return {
      displayWidth: m,
      displayHeight: y,
      pixelAspectRatio: K,
      colourPrimaries: G,
      transferCharacteristics: L,
      matrixCoefficients: j,
      fullRangeFlag: $,
      maxDecFrameBuffering: U + 1,
      spsMaxSubLayersMinus1: t,
      spsTemporalIdNestingFlag: n,
      generalProfileSpace: r,
      generalTierFlag: i,
      generalProfileIdc: o,
      generalProfileCompatibilityFlags: a,
      generalConstraintIndicatorFlags: d,
      generalLevelIdc: c,
      chromaFormatIdc: l,
      bitDepthLumaMinus8: p,
      bitDepthChromaMinus8: b,
      minSpatialSegmentationIdc: te
    };
  } catch (e) {
    return he._error("Error parsing HEVC SPS:", e), null;
  }
}, Zm = (s) => {
  try {
    const e = [], t = [], n = [], r = [];
    for (const c of Xi(s)) {
      const l = s.subarray(c.offset, c.offset + c.length), u = ia(l[0]);
      u === We.VPS_NUT ? e.push(l) : u === We.SPS_NUT ? t.push(l) : u === We.PPS_NUT ? n.push(l) : (u === We.PREFIX_SEI_NUT || u === We.SUFFIX_SEI_NUT) && r.push(l);
    }
    if (t.length === 0 || n.length === 0)
      return null;
    const i = Gm(t[0]);
    if (!i)
      return null;
    let o = 0;
    if (n.length > 0) {
      const c = n[0], l = new ze(Qi(c));
      l.skipBits(16), x(l), x(l), l.skipBits(1), l.skipBits(1), l.skipBits(3), l.skipBits(1), l.skipBits(1), x(l), x(l), lt(l), l.skipBits(1), l.skipBits(1), l.readBits(1) && x(l), lt(l), lt(l), l.skipBits(1), l.skipBits(1), l.skipBits(1), l.skipBits(1);
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
      ...r.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: ia(r[0][0]),
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
}, Km = (s, e) => {
  const t = s.readBits(2), n = s.readBits(1), r = s.readBits(5);
  let i = 0;
  for (let l = 0; l < 32; l++)
    i = i << 1 | s.readBits(1);
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
    general_profile_idc: r,
    general_profile_compatibility_flags: i,
    general_constraint_indicator_flags: o,
    general_level_idc: a
  };
}, Ym = (s) => {
  for (let e = 0; e < 4; e++)
    for (let t = 0; t < (e === 3 ? 2 : 6); t++)
      if (!s.readBits(1))
        x(s);
      else {
        const r = Math.min(64, 1 << 4 + (e << 1));
        e > 1 && lt(s);
        for (let i = 0; i < r; i++)
          lt(s);
      }
}, Xm = (s, e) => {
  const t = [];
  for (let n = 0; n < e; n++)
    t[n] = Qm(s, n, e, t);
}, Qm = (s, e, t, n) => {
  let r = 0, i = 0, o = 0;
  if (e !== 0 && (i = s.readBits(1)), i) {
    if (e === t) {
      const d = x(s);
      o = e - (d + 1);
    } else
      o = e - 1;
    s.readBits(1), x(s);
    const a = n[o] ?? 0;
    for (let d = 0; d <= a; d++)
      s.readBits(1) || s.readBits(1);
    r = n[o];
  } else {
    const a = x(s), d = x(s);
    for (let c = 0; c < a; c++)
      x(s), s.readBits(1);
    for (let c = 0; c < d; c++)
      x(s), s.readBits(1);
    r = a + d;
  }
  return r;
}, Jm = (s, e) => {
  let t = 2, n = 2, r = 2, i = 0, o = 0, a = { num: 1, den: 1 };
  if (s.readBits(1)) {
    const d = s.readBits(8);
    if (d === 255)
      a = {
        num: s.readBits(16),
        den: s.readBits(16)
      };
    else {
      const c = md[d];
      c && (a = c);
    }
  }
  return s.readBits(1) && s.readBits(1), s.readBits(1) && (s.readBits(3), i = s.readBits(1), s.readBits(1) && (t = s.readBits(8), n = s.readBits(8), r = s.readBits(8))), s.readBits(1) && (x(s), x(s)), s.readBits(1), s.readBits(1), s.readBits(1), s.readBits(1) && (x(s), x(s), x(s), x(s)), s.readBits(1) && (s.readBits(32), s.readBits(32), s.readBits(1) && x(s), s.readBits(1) && eg(s, !0, e)), s.readBits(1) && (s.readBits(1), s.readBits(1), s.readBits(1), o = x(s), x(s), x(s), x(s), x(s)), {
    pixelAspectRatio: a,
    colourPrimaries: t,
    transferCharacteristics: n,
    matrixCoefficients: r,
    fullRangeFlag: i,
    minSpatialSegmentationIdc: o
  };
}, eg = (s, e, t) => {
  let n = !1, r = !1, i = !1;
  n = s.readBits(1) === 1, r = s.readBits(1) === 1, (n || r) && (i = s.readBits(1) === 1, i && (s.readBits(8), s.readBits(5), s.readBits(1), s.readBits(5)), s.readBits(4), s.readBits(4), i && s.readBits(4), s.readBits(5), s.readBits(5), s.readBits(5));
  for (let o = 0; o <= t; o++) {
    const a = s.readBits(1) === 1;
    let d = !0;
    a || (d = s.readBits(1) === 1);
    let c = !1;
    d ? x(s) : c = s.readBits(1) === 1;
    let l = 1;
    c || (l = x(s) + 1), n && oa(s, l, i), r && oa(s, l, i);
  }
}, oa = (s, e, t) => {
  for (let n = 0; n < e; n++)
    x(s), x(s), t && (x(s), x(s)), s.readBits(1);
}, tg = (s) => {
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
var aa;
(function(s) {
  s[s.audAllowed = 0] = "audAllowed", s[s.beforeFirstVcl = 1] = "beforeFirstVcl", s[s.afterFirstVcl = 2] = "afterFirstVcl", s[s.eoBitstreamAllowed = 3] = "eoBitstreamAllowed", s[s.noMoreDataAllowed = 4] = "noMoreDataAllowed";
})(aa || (aa = {}));
const sg = (s) => {
  const e = ad(s), t = e.getUint8(9), n = e.getUint16(10, !0), r = e.getUint32(12, !0), i = e.getInt16(16, !0), o = e.getUint8(18);
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
var ca;
(function(s) {
  s[s.STREAMINFO = 0] = "STREAMINFO", s[s.VORBIS_COMMENT = 4] = "VORBIS_COMMENT", s[s.PICTURE = 6] = "PICTURE";
})(ca || (ca = {}));
const ng = (s) => {
  if (s.length < 7 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new ze(s);
  e.skipBits(16), e.skipBits(16);
  const t = e.readBits(2);
  if (t === 3)
    return null;
  const n = e.readBits(6), r = e.readBits(5);
  if (r > 8)
    return null;
  const i = e.readBits(3), o = e.readBits(3);
  (o & 1) !== 0 && o !== 1 && e.skipBits(2), (o & 4) !== 0 && e.skipBits(2), o === 2 && e.skipBits(2);
  const a = e.readBits(1), d = Math.floor(n / 2);
  return { fscod: t, bsid: r, bsmod: i, acmod: o, lfeon: a, bitRateCode: d };
}, rg = [1, 2, 3, 6], ig = (s) => {
  if (s.length < 6 || s[0] !== 11 || s[1] !== 119)
    return null;
  const e = new ze(s);
  e.skipBits(16);
  const t = e.readBits(2);
  if (e.skipBits(3), t !== 0 && t !== 2)
    return null;
  const n = e.readBits(11), r = e.readBits(2);
  let i = 0, o;
  r === 3 ? (i = e.readBits(2), o = 3) : o = e.readBits(2);
  const a = e.readBits(3), d = e.readBits(1), c = e.readBits(5);
  if (c < 11 || c > 16)
    return null;
  const l = rg[o];
  let u;
  return r < 3 ? u = Vm[r] / 1e3 : u = $m[i] / 1e3, {
    dataRate: Math.round((n + 1) * u / (l * 16)),
    substreams: [{
      fscod: r,
      fscod2: i,
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
const da = /* @__PURE__ */ new Uint8Array(0);
class Ot {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(e, t, n, r, i = -1, o, a) {
    if (this.data = e, this.type = t, this.timestamp = n, this.duration = r, this.sequenceNumber = i, e === da && o === void 0)
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
    return this.data === da;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(ta * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(ta * this.duration);
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
const og = (s) => {
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
const xr = 8, la = 16;
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const ag = 7, cg = 9, ua = (s) => {
  const e = s.filePos, t = lg(s, 9), n = new ze(t);
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
class Xs {
  constructor(e, t, n, r, i) {
    this.bytes = e, this.view = t, this.offset = n, this.start = r, this.end = i, this.bufferPos = r - n;
  }
  static tempFromBytes(e) {
    return new Xs(e, ad(e), 0, 0, e.length);
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
    return new Xs(this.bytes, this.view, this.offset, e, e + t);
  }
}
const dg = (s, e) => {
  if (s.filePos < s.start || s.filePos + e > s.end)
    throw new RangeError(`Tried reading [${s.filePos}, ${s.filePos + e}), but slice is [${s.start}, ${s.end}). This is likely an internal error, please report it alongside the file that caused it.`);
}, lg = (s, e) => {
  dg(s, e);
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
class ug {
  constructor(e) {
    this.mutex = new dd(), this.trackTimestampInfo = /* @__PURE__ */ new WeakMap(), this.output = e;
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
const ha = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g, hg = (s) => {
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
class mn {
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
    T(t !== void 0);
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
const z = /* @__PURE__ */ new Uint8Array(8), Re = /* @__PURE__ */ new DataView(z.buffer), le = (s) => [(s % 256 + 256) % 256], F = (s) => (Re.setUint16(0, s, !1), [z[0], z[1]]), Ji = (s) => (Re.setInt16(0, s, !1), [z[0], z[1]]), gd = (s) => (Re.setUint32(0, s, !1), [z[1], z[2], z[3]]), w = (s) => (Re.setUint32(0, s, !1), [z[0], z[1], z[2], z[3]]), ct = (s) => (Re.setInt32(0, s, !1), [z[0], z[1], z[2], z[3]]), tt = (s) => (Re.setUint32(0, Math.floor(s / 2 ** 32), !1), Re.setUint32(4, s, !1), [z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7]]), fg = (s) => (Re.setInt32(0, Math.floor(s / 2 ** 32), !1), Re.setUint32(4, s, !1), [z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7]]), yd = (s) => (Re.setInt16(0, 2 ** 8 * s, !1), [z[0], z[1]]), De = (s) => (Re.setInt32(0, 2 ** 16 * s, !1), [z[0], z[1], z[2], z[3]]), kr = (s) => (Re.setInt32(0, 2 ** 30 * s, !1), [z[0], z[1], z[2], z[3]]), Tr = (s, e) => {
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
}, wd = (s) => {
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
}, bd = /* @__PURE__ */ wd(0), vd = (s) => [
  De(s[0]),
  De(s[1]),
  kr(s[2]),
  De(s[3]),
  De(s[4]),
  kr(s[5]),
  De(s[6]),
  De(s[7]),
  kr(s[8])
], R = (s, e, t) => ({
  type: s,
  contents: e && new Uint8Array(e.flat(10)),
  children: t
}), Y = (s, e, t, n, r) => R(s, [le(e), gd(t), n ?? []], r), pg = (s) => s.isQuickTime ? R("ftyp", [
  se("qt  "),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("qt  ")
]) : s.fragmented ? s.cmaf ? R("ftyp", [
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
]) : R("ftyp", [
  se("iso5"),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("iso5"),
  se("iso6"),
  se("mp41")
]) : R("ftyp", [
  se("isom"),
  // Major brand
  w(512),
  // Minor version
  // Compatible brands
  se("isom"),
  s.holdsAvc ? se("avc1") : [],
  se("mp41")
]), fa = () => R("styp", [
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
]), pa = (s, e) => {
  let t = s.maxWrittenEndTimestamp - s.minWrittenTimestamp;
  return Number.isFinite(t) || (t = 0), Y("sidx", 1, 0, [
    w(1),
    // Reference ID
    w($e),
    // Timescale
    tt(re(s.minWrittenTimestamp, $e)),
    // Earliest presentation time
    tt(0),
    // First offset
    F(0),
    // Reserved
    F(1),
    // Reference count
    w(e & 2147483647),
    // Reference type (0) + referenced size
    w(re(t, $e)),
    // Subsegment duration
    w(0)
    // Starts with SAP + SAP type + SAP delta time (no information provided)
  ]);
}, gn = (s) => ({ type: "mdat", largeSize: s }), mg = (s) => ({ type: "free", size: s }), Ps = (s) => R("moov", void 0, [
  gg(s.creationTime, s.trackDatas),
  ...s.trackDatas.map((e) => yg(e, s.creationTime)),
  s.isFragmented ? sy(s.trackDatas) : null,
  my(s)
]), gg = (s, e) => {
  const t = Math.max(0, ...e.map((o) => re(ir(o), $e) + re(o.startTimestampOffset ?? 0, $e))), n = Math.max(0, ...e.map((o) => o.track.id)) + 1, r = !Ut(s) || !Ut(t), i = r ? tt : w;
  return Y("mvhd", +r, 0, [
    i(s),
    // Creation time
    i(s),
    // Modification time
    w($e),
    // Timescale
    i(t),
    // Duration
    De(1),
    // Preferred rate
    yd(1),
    // Preferred volume
    Array(10).fill(0),
    // Reserved
    vd(bd),
    // Matrix
    Array(24).fill(0),
    // Pre-defined
    w(n)
    // Next track ID
  ]);
}, ir = (s) => {
  if (s.samples.length === 0)
    return 0;
  let e = 1 / 0, t = -1 / 0;
  for (let n = 0; n < s.samples.length; n++) {
    const r = s.samples[n];
    r.timestamp < e && (e = r.timestamp), r.timestamp + r.duration > t && (t = r.timestamp + r.duration);
  }
  return e === 1 / 0 ? 0 : t - e;
}, yg = (s, e) => {
  const t = Ey(s), n = s.startTimestampOffset !== null && s.startTimestampOffset > 0;
  return R("trak", void 0, [
    wg(s, e),
    n ? bg(s, s.startTimestampOffset) : null,
    vg(s, e),
    t.name !== void 0 ? R("udta", void 0, [
      R("name", [
        ...Ye.encode(t.name)
      ])
    ]) : null
  ]);
}, wg = (s, e) => {
  const t = re(ir(s), $e) + re(s.startTimestampOffset ?? 0, $e), n = !Ut(e) || !Ut(t), r = n ? tt : w;
  let i;
  if (s.type === "video") {
    const a = s.track.metadata.rotation;
    i = wd(a ?? 0);
  } else
    i = bd;
  let o = 2;
  return s.track.metadata.disposition?.default !== !1 && (o |= 1), Y("tkhd", +n, o, [
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
    yd(s.type === "audio" ? 1 : 0),
    // Volume
    F(0),
    // Reserved
    vd(i),
    // Matrix
    De(s.type === "video" ? s.info.width : 0),
    // Track width
    De(s.type === "video" ? s.info.height : 0)
    // Track height
  ]);
}, bg = (s, e) => {
  const t = re(e, $e), n = re(ir(s), $e), r = !Ut(t) || !Ut(n), i = r ? tt : w, o = r ? fg : ct;
  return R("edts", void 0, [
    Y("elst", r ? 1 : 0, 0, [
      w(2),
      // Entry count
      // #1
      i(t),
      // Segment duration
      o(-1),
      // Media time
      De(1),
      // Media rate
      // #2
      i(n),
      // Segment duration
      o(0),
      // Media time
      De(1)
      // Media rate
    ])
  ]);
}, vg = (s, e) => R("mdia", void 0, [
  Sg(s, e),
  eo(!0, _g[s.type], xg[s.type]),
  kg(s)
]), Sg = (s, e) => {
  const t = re(ir(s), s.timescale), n = !Ut(e) || !Ut(t), r = n ? tt : w;
  return Y("mdhd", +n, 0, [
    r(e),
    // Creation time
    r(e),
    // Modification time
    w(s.timescale),
    // Timescale
    r(t),
    // Duration
    F(kd(s.track.metadata.languageCode ?? bm)),
    // Language
    F(0)
    // Quality
  ]);
}, _g = {
  video: "vide",
  audio: "soun",
  subtitle: "text"
}, xg = {
  video: "MediabunnyVideoHandler",
  audio: "MediabunnySoundHandler",
  subtitle: "MediabunnyTextHandler"
}, eo = (s, e, t, n = "\0\0\0\0") => Y("hdlr", 0, 0, [
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
]), kg = (s) => R("minf", void 0, [
  Ag[s.type](),
  Bg(),
  Og(s)
]), Tg = () => Y("vmhd", 0, 1, [
  F(0),
  // Graphics mode
  F(0),
  // Opcolor R
  F(0),
  // Opcolor G
  F(0)
  // Opcolor B
]), Eg = () => Y("smhd", 0, 0, [
  F(0),
  // Balance
  F(0)
  // Reserved
]), Cg = () => Y("nmhd", 0, 0), Ag = {
  video: Tg,
  audio: Eg,
  subtitle: Cg
}, Bg = () => R("dinf", void 0, [
  Mg()
]), Mg = () => Y("dref", 0, 0, [
  w(1)
  // Entry count
], [
  Ig()
]), Ig = () => Y("url ", 0, 1), Og = (s) => {
  const e = s.compositionTimeOffsetTable.length > 1 || s.compositionTimeOffsetTable.some((t) => t.sampleCompositionTimeOffset !== 0);
  return R("stbl", void 0, [
    Rg(s),
    Kg(s),
    e ? ey(s) : null,
    e ? ty(s) : null,
    Xg(s),
    Qg(s),
    Jg(s),
    Yg(s)
  ]);
}, Rg = (s) => {
  let e;
  if (s.type === "video")
    e = Pg(by(s.track.source._codec, s.info.decoderConfig.codec), s);
  else if (s.type === "audio") {
    const t = xd(s.track.source._codec, s.muxer.isQuickTime);
    T(t), e = Vg(t, s);
  } else s.type === "subtitle" && (e = Gg(_y[s.track.source._codec], s));
  return T(e), Y("stsd", 0, 0, [
    w(1)
    // Entry count
  ], [
    e
  ]);
}, Pg = (s, e) => R(s, [
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
  Ji(65535)
  // Pre-defined
], [
  vy[e.track.source._codec]?.(e) ?? null,
  Fg(e),
  gm(e.info.decoderConfig.colorSpace) ? Lg(e) : null
]), Fg = (s) => s.info.pixelAspectRatio.num === s.info.pixelAspectRatio.den ? null : R("pasp", [
  w(s.info.pixelAspectRatio.num),
  w(s.info.pixelAspectRatio.den)
]), Lg = (s) => R("colr", [
  se(s.muxer.isQuickTime ? "nclc" : "nclx"),
  // Colour type
  F(Wi[s.info.decoderConfig.colorSpace.primaries]),
  // Colour primaries
  F(Gi[s.info.decoderConfig.colorSpace.transfer]),
  // Transfer characteristics
  F(Zi[s.info.decoderConfig.colorSpace.matrix]),
  // Matrix coefficients
  s.muxer.isQuickTime ? [] : le((s.info.decoderConfig.colorSpace.fullRange ? 1 : 0) << 7)
  // Full range flag
]), Ug = (s) => s.info.decoderConfig && R("avcC", [
  // For AVC, description is an AVCDecoderConfigurationRecord, so nothing else to do here
  ...nn(s.info.decoderConfig.description)
]), Ng = (s) => s.info.decoderConfig && R("hvcC", [
  // For HEVC, description is an HEVCDecoderConfigurationRecord, so nothing else to do here
  ...nn(s.info.decoderConfig.description)
]), ma = (s) => {
  if (!s.info.decoderConfig)
    return null;
  const e = s.info.decoderConfig, t = e.codec.split("."), n = Number(t[1]), r = Number(t[2]), i = Number(t[3]), o = t[4] ? Number(t[4]) : 1, a = t[8] ? Number(t[8]) : Number(e.colorSpace?.fullRange ?? 0), d = (i << 4) + (o << 1) + a, c = t[5] ? Number(t[5]) : e.colorSpace?.primaries ? Wi[e.colorSpace.primaries] : 2, l = t[6] ? Number(t[6]) : e.colorSpace?.transfer ? Gi[e.colorSpace.transfer] : 2, u = t[7] ? Number(t[7]) : e.colorSpace?.matrix ? Zi[e.colorSpace.matrix] : 2;
  return Y("vpcC", 1, 0, [
    le(n),
    // Profile
    le(r),
    // Level
    le(d),
    // Bit depth, chroma subsampling, full range
    le(c),
    // Colour primaries
    le(l),
    // Transfer characteristics
    le(u),
    // Matrix coefficients
    F(0)
    // Codec initialization data size
  ]);
}, Dg = (s) => R("av1C", Bm(s.info.decoderConfig.codec)), Vg = (s, e) => {
  let t = 0, n, r = 16;
  const i = ks.includes(e.track.source._codec);
  if (i) {
    const o = e.track.source._codec, { sampleSize: a } = Ts(o);
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
      Ji(o),
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
  return R(s, n, [
    Sy(e.track.source._codec, e.muxer.isQuickTime)?.(e) ?? null
  ]);
}, Er = (s) => {
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
    ...le(e),
    // Object type indication
    ...le(21),
    // stream type(6bits)=5 audio, flags(2bits)=1
    ...gd(0),
    // 24bit buffer size
    ...w(0),
    // max bitrate
    ...w(0)
    // avg bitrate
  ];
  if (s.info.decoderConfig.description) {
    const n = nn(s.info.decoderConfig.description);
    t = [
      ...t,
      ...le(5),
      // TAG(5) = DecoderSpecificInfo
      ...Tr(n.byteLength),
      ...n
    ];
  }
  return t = [
    ...F(1),
    // ES_ID = 1
    ...le(0),
    // flags etc = 0
    ...le(4),
    // TAG(4) = ES Descriptor
    ...Tr(t.length),
    ...t,
    ...le(6),
    // TAG(6)
    ...le(1),
    // length
    ...le(2)
    // data
  ], t = [
    ...le(3),
    // TAG(3) = Object Descriptor
    ...Tr(t.length),
    ...t
  ], Y("esds", 0, 0, t);
}, bt = (s) => R("wave", void 0, [
  $g(s),
  zg(s),
  R("\0\0\0\0")
  // NULL tag at the end
]), $g = (s) => R("frma", [
  se(xd(s.track.source._codec, s.muxer.isQuickTime))
]), zg = (s) => {
  const { littleEndian: e } = Ts(s.track.source._codec);
  return R("enda", [
    F(+e)
  ]);
}, Hg = (s) => {
  let e = s.info.numberOfChannels, t = 3840, n = s.info.sampleRate, r = 0, i = 0, o = new Uint8Array(0);
  const a = s.info.decoderConfig?.description;
  if (a) {
    T(a.byteLength >= 18);
    const d = nn(a), c = sg(d);
    e = c.outputChannelCount, t = c.preSkip, n = c.inputSampleRate, r = c.outputGain, i = c.channelMappingFamily, c.channelMappingTable && (o = c.channelMappingTable);
  }
  return R("dOps", [
    le(0),
    // Version
    le(e),
    // OutputChannelCount
    F(t),
    // PreSkip
    w(n),
    // InputSampleRate
    Ji(r),
    // OutputGain
    le(i),
    // ChannelMappingFamily
    ...o
  ]);
}, jg = (s) => {
  const e = s.info.decoderConfig?.description;
  T(e);
  const t = nn(e);
  return Y("dfLa", 0, 0, [
    ...t.subarray(4)
  ]);
}, je = (s) => {
  const { littleEndian: e, sampleSize: t } = Ts(s.track.source._codec), n = +e;
  return Y("pcmC", 0, 0, [
    le(n),
    le(8 * t)
  ]);
}, qg = (s) => {
  const e = ng(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract AC-3 frame info from the audio packet. Ensure the packets contain valid AC-3 sync frames (as specified in ETSI TS 102 366).");
  const t = new Uint8Array(3), n = new ze(t);
  return n.writeBits(2, e.fscod), n.writeBits(5, e.bsid), n.writeBits(3, e.bsmod), n.writeBits(3, e.acmod), n.writeBits(1, e.lfeon), n.writeBits(5, e.bitRateCode), n.writeBits(5, 0), R("dac3", [...t]);
}, Wg = (s) => {
  const e = ig(s.info.firstPacket.data);
  if (!e)
    throw new Error("Couldn't extract E-AC-3 frame info from the audio packet. Ensure the packets contain valid E-AC-3 sync frames (as specified in ETSI TS 102 366).");
  let t = 16;
  for (const o of e.substreams)
    t += 23, o.numDepSub > 0 ? t += 9 : t += 1;
  const n = Math.ceil(t / 8), r = new Uint8Array(n), i = new ze(r);
  i.writeBits(13, e.dataRate), i.writeBits(3, e.substreams.length - 1);
  for (const o of e.substreams)
    i.writeBits(2, o.fscod), i.writeBits(5, o.bsid), i.writeBits(1, 0), i.writeBits(1, 0), i.writeBits(3, o.bsmod), i.writeBits(3, o.acmod), i.writeBits(1, o.lfeon), i.writeBits(3, 0), i.writeBits(4, o.numDepSub), o.numDepSub > 0 ? i.writeBits(9, o.chanLoc) : i.writeBits(1, 0);
  return R("dec3", [...r]);
}, Gg = (s, e) => R(s, [
  Array(6).fill(0),
  // Reserved
  F(1)
  // Data reference index
], [
  xy[e.track.source._codec](e)
]), Zg = (s) => R("vttC", [
  ...Ye.encode(s.info.config.description)
]), Kg = (s) => Y("stts", 0, 0, [
  w(s.timeToSampleTable.length),
  // Number of entries
  s.timeToSampleTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    w(e.sampleDelta)
    // Sample duration
  ])
]), Yg = (s) => {
  if (s.samples.every((t) => t.type === "key"))
    return null;
  const e = [...s.samples.entries()].filter(([, t]) => t.type === "key");
  return Y("stss", 0, 0, [
    w(e.length),
    // Number of entries
    e.map(([t]) => w(t + 1))
    // Sync sample table
  ]);
}, Xg = (s) => Y("stsc", 0, 0, [
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
]), Qg = (s) => {
  if (s.type === "audio" && s.info.requiresPcmTransformation) {
    const { sampleSize: e } = Ts(s.track.source._codec);
    return Y("stsz", 0, 0, [
      w(e * s.info.numberOfChannels),
      // Sample size
      w(s.samples.reduce((t, n) => t + re(n.duration, s.timescale), 0))
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
}, Jg = (s) => s.finalizedChunks.length > 0 && fs(s.finalizedChunks).offset >= 2 ** 32 ? Y("co64", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => tt(e.offset))
  // Chunk offset table
]) : Y("stco", 0, 0, [
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((e) => w(e.offset))
  // Chunk offset table
]), ey = (s) => Y("ctts", 1, 0, [
  w(s.compositionTimeOffsetTable.length),
  // Number of entries
  s.compositionTimeOffsetTable.map((e) => [
    w(e.sampleCount),
    // Sample count
    ct(e.sampleCompositionTimeOffset)
    // Sample offset
  ])
]), ty = (s) => {
  let e = 1 / 0, t = -1 / 0, n = 1 / 0, r = -1 / 0;
  T(s.compositionTimeOffsetTable.length > 0), T(s.samples.length > 0);
  for (let o = 0; o < s.compositionTimeOffsetTable.length; o++) {
    const a = s.compositionTimeOffsetTable[o];
    e = Math.min(e, a.sampleCompositionTimeOffset), t = Math.max(t, a.sampleCompositionTimeOffset);
  }
  for (let o = 0; o < s.samples.length; o++) {
    const a = s.samples[o];
    n = Math.min(n, re(a.timestamp, s.timescale)), r = Math.max(r, re(a.timestamp + a.duration, s.timescale));
  }
  const i = Math.max(-e, 0);
  return r >= 2 ** 31 ? null : Y("cslg", 0, 0, [
    ct(i),
    // Composition to DTS shift
    ct(e),
    // Least decode to display delta
    ct(t),
    // Greatest decode to display delta
    ct(n),
    // Composition start time
    ct(r)
    // Composition end time
  ]);
}, sy = (s) => R("mvex", void 0, s.map(ny)), ny = (s) => Y("trex", 0, 0, [
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
]), ga = (s, e) => R("moof", void 0, [
  ry(s),
  ...e.map(iy)
]), ry = (s) => Y("mfhd", 0, 0, [
  w(s)
  // Sequence number
]), Sd = (s) => {
  let e = 0, t = 0;
  const n = 0, r = 0, i = s.type === "delta";
  return t |= +i, i ? e |= 1 : e |= 2, e << 24 | t << 16 | n << 8 | r;
}, iy = (s) => R("traf", void 0, [
  oy(s),
  ay(s),
  cy(s)
]), oy = (s) => {
  T(s.currentChunk);
  let e = 0;
  e |= 8, e |= 16, e |= 32, e |= 131072;
  const t = s.currentChunk.samples[1] ?? s.currentChunk.samples[0], n = {
    duration: t.timescaleUnitsToNextSample,
    size: t.size,
    flags: Sd(t)
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
}, ay = (s) => (T(s.currentChunk), Y("tfdt", 1, 0, [
  tt(re(s.currentChunk.startTimestamp, s.timescale))
  // Base Media Decode Time
])), cy = (s) => {
  T(s.currentChunk);
  const e = s.currentChunk.samples.map((y) => y.timescaleUnitsToNextSample), t = s.currentChunk.samples.map((y) => y.size), n = s.currentChunk.samples.map(Sd), r = s.currentChunk.samples.map((y) => re(y.timestamp - y.decodeTimestamp, s.timescale)), i = new Set(e), o = new Set(t), a = new Set(n), d = new Set(r), c = a.size === 2 && n[0] !== n[1], l = i.size > 1, u = o.size > 1, h = !c && a.size > 1, f = d.size > 1 || [...d].some((y) => y !== 0);
  let m = 0;
  return m |= 1, m |= 4 * +c, m |= 256 * +l, m |= 512 * +u, m |= 1024 * +h, m |= 2048 * +f, Y("trun", 1, m, [
    w(s.currentChunk.samples.length),
    // Sample count
    w(s.currentChunk.offset - s.currentChunk.moofOffset || 0),
    // Data offset
    c ? w(n[0]) : [],
    s.currentChunk.samples.map((y, p) => [
      l ? w(e[p]) : [],
      // Sample duration
      u ? w(t[p]) : [],
      // Sample size
      h ? w(n[p]) : [],
      // Sample flags
      // Sample composition time offsets
      f ? ct(r[p]) : []
    ])
  ]);
}, dy = (s) => R("mfra", void 0, [
  ...s.map(ly),
  uy()
]), ly = (s, e) => Y("tfra", 1, 0, [
  w(s.track.id),
  // Track ID
  w(63),
  // This specifies that traf number, trun number and sample number are 32-bit ints
  w(s.finalizedChunks.length),
  // Number of entries
  s.finalizedChunks.map((n) => [
    tt(re(n.samples[0].timestamp, s.timescale)),
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
]), uy = () => Y("mfro", 0, 0, [
  // This value needs to be overwritten manually from the outside, where the actual size of the enclosing mfra box
  // is known
  w(0)
  // Size
]), hy = () => R("vtte"), fy = (s, e, t, n, r) => R("vttc", void 0, [
  r !== null ? R("vsid", [ct(r)]) : null,
  t !== null ? R("iden", [...Ye.encode(t)]) : null,
  e !== null ? R("ctim", [...Ye.encode(hg(e))]) : null,
  n !== null ? R("sttg", [...Ye.encode(n)]) : null,
  R("payl", [...Ye.encode(s)])
]), py = (s) => R("vtta", [...Ye.encode(s)]), my = (s) => {
  const e = [], t = s.format._options.metadataFormat ?? "auto", n = s.output._metadataTags;
  if (t === "mdir" || t === "auto" && !s.isQuickTime) {
    const r = yy(n);
    r && e.push(r);
  } else if (t === "mdta") {
    const r = wy(n);
    r && e.push(r);
  } else (t === "udta" || t === "auto" && s.isQuickTime) && gy(e, s.output._metadataTags);
  return e.length === 0 ? null : R("udta", void 0, e);
}, gy = (s, e) => {
  for (const { key: t, value: n } of ud(e))
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
        ld(t);
    }
  if (e.raw)
    for (const t in e.raw) {
      const n = e.raw[t];
      n == null || t.length !== 4 || s.some((r) => r.type === t) || (typeof n == "string" ? s.push(qe(t, n)) : n instanceof Uint8Array && s.push(R(t, Array.from(n))));
    }
}, qe = (s, e) => {
  const t = Ye.encode(e);
  return R(s, [
    F(t.length),
    F(kd("und")),
    Array.from(t)
  ]);
}, ya = {
  "image/jpeg": 13,
  "image/png": 14,
  "image/bmp": 27
}, _d = (s, e) => {
  const t = [];
  for (const { key: n, value: r } of ud(s))
    switch (n) {
      case "title":
        t.push({ key: e ? "title" : "©nam", value: Le(r) });
        break;
      case "description":
        t.push({ key: e ? "description" : "©des", value: Le(r) });
        break;
      case "artist":
        t.push({ key: e ? "artist" : "©ART", value: Le(r) });
        break;
      case "album":
        t.push({ key: e ? "album" : "©alb", value: Le(r) });
        break;
      case "albumArtist":
        t.push({ key: e ? "album_artist" : "aART", value: Le(r) });
        break;
      case "comment":
        t.push({ key: e ? "comment" : "©cmt", value: Le(r) });
        break;
      case "genre":
        t.push({ key: e ? "genre" : "©gen", value: Le(r) });
        break;
      case "lyrics":
        t.push({ key: e ? "lyrics" : "©lyr", value: Le(r) });
        break;
      case "date":
        t.push({
          key: e ? "date" : "©day",
          value: Le(r.toISOString().slice(0, 10))
        });
        break;
      case "images":
        for (const i of r)
          i.kind === "coverFront" && t.push({ key: "covr", value: R("data", [
            w(ya[i.mimeType] ?? 0),
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
          t.push({ key: "track", value: Le(i) });
        } else
          t.push({ key: "trkn", value: R("data", [
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
        e || t.push({ key: "disc", value: R("data", [
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
        ld(n);
    }
  if (s.raw)
    for (const n in s.raw) {
      const r = s.raw[n];
      r == null || !e && n.length !== 4 || t.some((i) => i.key === n) || (typeof r == "string" ? t.push({ key: n, value: Le(r) }) : r instanceof Uint8Array ? t.push({ key: n, value: R("data", [
        w(0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(r)
      ]) }) : r instanceof hd && t.push({ key: n, value: R("data", [
        w(ya[r.mimeType] ?? 0),
        // Type indicator
        w(0),
        // Locale indicator
        Array.from(r.data)
        // Kinda slow, hopefully temp
      ]) }));
    }
  return t;
}, yy = (s) => {
  const e = _d(s, !1);
  return e.length === 0 ? null : Y("meta", 0, 0, void 0, [
    eo(!1, "mdir", "", "appl"),
    // mdir handler
    R("ilst", void 0, e.map((t) => R(t.key, void 0, [t.value])))
    // Item list without keys box
  ]);
}, wy = (s) => {
  const e = _d(s, !0);
  return e.length === 0 ? null : R("meta", void 0, [
    eo(!1, "mdta", ""),
    // mdta handler
    Y("keys", 0, 0, [
      w(e.length)
    ], e.map((t) => R("mdta", [
      ...Ye.encode(t.key)
    ]))),
    R("ilst", void 0, e.map((t, n) => {
      const r = String.fromCharCode(...w(n + 1));
      return R(r, void 0, [t.value]);
    }))
  ]);
}, Le = (s) => R("data", [
  w(1),
  // Type indicator (UTF-8)
  w(0),
  // Locale indicator
  ...Ye.encode(s)
]), by = (s, e) => {
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
}, vy = {
  avc: Ug,
  hevc: Ng,
  vp8: ma,
  vp9: ma,
  av1: Dg,
  prores: null
}, xd = (s, e) => {
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
}, Sy = (s, e) => {
  switch (s) {
    case "aac":
      return Er;
    case "mp3":
      return Er;
    case "opus":
      return Hg;
    case "vorbis":
      return Er;
    case "flac":
      return jg;
    case "ac3":
      return qg;
    case "eac3":
      return Wg;
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
}, _y = {
  webvtt: "wvtt"
}, xy = {
  webvtt: Zg
}, kd = (s) => {
  T(s.length === 3);
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
class hi {
  constructor(e, t) {
    if (this.finalized = !1, this.started = !1, this.pos = 0, this.trackedWrites = null, this.trackedStart = -1, this.trackedEnd = -1, e._writerAcquired)
      throw new Error("Can't have multiple Writers for the same Target.");
    this.target = e, e._setMonotonicity(t), e._writerAcquired = !0;
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
class at extends Ki {
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
    return new ky(this, e);
  }
}
const Cr = 2 ** 16, Ar = 2 ** 32;
class Tn extends at {
  /** Creates a new {@link BufferTarget}. The buffer holding the data will be created and managed internally. */
  constructor(e = {}) {
    if (super(), this.buffer = null, this._maxPos = 0, !e || typeof e != "object")
      throw new TypeError("BufferTarget options, when provided, must be an object.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    if (this._options = e, this._supportsResize = "resize" in new ArrayBuffer(0), this._supportsResize)
      try {
        this._buffer = new ArrayBuffer(Cr, { maxByteLength: Ar });
      } catch {
        this._buffer = new ArrayBuffer(Cr), this._supportsResize = !1;
      }
    else
      this._buffer = new ArrayBuffer(Cr);
    this._bytes = new Uint8Array(this._buffer);
  }
  /** @internal */
  _ensureSize(e) {
    let t = this._buffer.byteLength;
    for (; t < e; )
      t *= 2;
    if (t !== this._buffer.byteLength) {
      if (t > Ar)
        throw new Error(`ArrayBuffer exceeded maximum size of ${Ar} bytes. Please consider using another target.`);
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
class ky extends at {
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
class Br {
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
const $e = 57600, Ty = 2082844800, Ey = (s) => {
  const e = {}, t = s.track;
  return t.metadata.name !== void 0 && (e.name = t.metadata.name), e;
}, re = (s, e, t = !0) => {
  const n = s * e;
  return t ? Math.round(n) : n;
};
class Cy extends ug {
  constructor(e, t) {
    super(e), this.writer = null, this.boxWriter = null, this.initWriter = null, this.initBoxWriter = null, this.auxTarget = new Tn(), this.auxWriter = new hi(this.auxTarget, !1), this.auxBoxWriter = new mn(this.auxWriter), this.mdat = null, this.ftypSize = null, this.trackDatas = [], this.allTracksKnown = ym(), this.creationTime = Math.floor(Date.now() / 1e3) + Ty, this.finalizedChunks = [], this.nextFragmentNumber = 1, this.maxWrittenTimestamp = -1 / 0, this.minWrittenTimestamp = 1 / 0, this.maxWrittenEndTimestamp = -1 / 0, this.segmentHeaderSize = null, this.format = t, this.isQuickTime = t instanceof Bd, this.isCmaf = t instanceof wa, this.minimumFragmentDuration = t._options.minimumFragmentDuration ?? (t instanceof wa ? 1 / 0 : 1), this.auxWriter.start();
  }
  async start() {
    const e = await this.mutex.acquire();
    if (this.isCmaf ? (this.fastStart = "fragmented", this.isFragmented = !0) : (this.writer = await this.output._getRootWriter((n) => this.format._options.fastStart !== void 0 ? this.format._options.fastStart === "fragmented" : n instanceof Tn), this.boxWriter = new mn(this.writer), this.fastStart = this.format._options.fastStart ?? (this.writer.target instanceof Tn ? "in-memory" : !1), this.isFragmented = this.fastStart === "fragmented"), this.isCmaf) {
      if (!this.output._hasInitTarget())
        throw new Error("CMAF outputs require the initTarget field in OutputOptions to be set; the init segment will be written to it.");
      const n = await this.output._getInitTarget(), r = new hi(n, !0);
      r.start(), this.initWriter = r, this.initBoxWriter = new mn(r);
    }
    const t = this.output._tracks.some((n) => n.isVideoTrack() && n.source._codec === "avc");
    {
      const n = this.initBoxWriter ?? this.boxWriter;
      if (T(n), this.format._options.onFtyp && n.writer.startTrackingWrites(), n.writeBox(pg({
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
    } else this.isFragmented || (T(this.writer), T(this.boxWriter), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = gn(!0), this.boxWriter.writeBox(this.mdat));
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
    return og({
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
    Lm(n), T(n), T(n.decoderConfig);
    const i = { ...n.decoderConfig };
    T(i.codedWidth !== void 0), T(i.codedHeight !== void 0);
    let o = !1;
    if (e.source._codec === "avc" && !i.description) {
      const h = jm(t.data);
      if (!h)
        throw new Error("Couldn't extract an AVCDecoderConfigurationRecord from the AVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.264) when not providing a description, or provide a description (must be an AVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in AVCC format.");
      i.description = qm(h), o = !0;
    } else if (e.source._codec === "hevc" && !i.description) {
      const h = Zm(t.data);
      if (!h)
        throw new Error("Couldn't extract an HEVCDecoderConfigurationRecord from the HEVC packet. Make sure the packets are in Annex B format (as specified in ITU-T-REC-H.265) when not providing a description, or provide a description (must be an HEVCDecoderConfigurationRecord as specified in ISO 14496-15) and ensure the packets are in HEVC format.");
      i.description = tg(h), o = !0;
    }
    const a = _m(1 / (e.metadata.frameRate ?? $e), 1e6).den, d = i.displayAspectWidth, c = i.displayAspectHeight, l = d === void 0 || c === void 0 ? { num: 1, den: 1 } : xm({
      num: d * i.codedHeight,
      den: c * i.codedWidth
    }), u = {
      muxer: this,
      track: e,
      type: "video",
      info: {
        width: i.codedWidth,
        height: i.codedHeight,
        pixelAspectRatio: l,
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
    const r = this.trackDatas.find((d) => d.track === e);
    if (r)
      return r;
    Nm(n), T(n), T(n.decoderConfig);
    const i = { ...n.decoderConfig };
    let o = !1;
    if (e.source._codec === "aac" && !i.description) {
      const d = ua(Xs.tempFromBytes(t.data));
      if (!d)
        throw new Error("Couldn't parse ADTS header from the AAC packet. Make sure the packets are in ADTS format (as specified in ISO 13818-7) when not providing a description, or provide a description (must be an AudioSpecificConfig as specified in ISO 14496-3) and ensure the packets are raw AAC data.");
      const c = fd[d.samplingFrequencyIndex], l = pd[d.channelConfiguration];
      if (c === void 0 || l === void 0)
        throw new Error("Invalid ADTS frame header.");
      i.description = Am({
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
        decoderConfig: i,
        requiresPcmTransformation: !this.isFragmented && ks.includes(e.source._codec),
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
    return this.trackDatas.push(a), this.trackDatas.sort((d, c) => d.track.id - c.track.id), this.allTracksAreKnown() && this.allTracksKnown.resolve(), a;
  }
  getSubtitleTrackData(e, t) {
    const n = this.trackDatas.find((i) => i.track === e);
    if (n)
      return n;
    Dm(t), T(t), T(t.config);
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
        const d = [...Xi(o)].map((c) => o.subarray(c.offset, c.offset + c.length));
        if (d.length === 0)
          throw new Error("Failed to transform packet data. Make sure all packets are provided in Annex B format, as specified in ITU-T-REC-H.264 and ITU-T-REC-H.265.");
        o = Hm(d, 4);
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
        const l = ua(Xs.tempFromBytes(o));
        if (!l)
          throw new Error("Expected ADTS frame, didn't get one.");
        const u = l.crcCheck === null ? ag : cg;
        o = o.subarray(u);
      }
      this.validateTimestamp(i.track, t.timestamp, t.type === "key");
      let a = t.timestamp, d = t.duration;
      if (i.info.requiresPcmTransformation) {
        const u = Ts(i.info.decoderConfig.codec).sampleSize * i.info.numberOfChannels;
        if (d = o.byteLength / u / i.info.sampleRate, i.info.expectedNextPcmPacketTimestamp !== null) {
          const h = a - i.info.expectedNextPcmPacketTimestamp;
          if (h < 0.01)
            a = i.info.expectedNextPcmPacketTimestamp;
          else {
            const f = await this.padWithSilence(i, i.info.expectedNextPcmPacketTimestamp, h);
            a = i.info.expectedNextPcmPacketTimestamp + f;
          }
        }
        i.info.expectedNextPcmPacketTimestamp = a + d;
      }
      const c = this.createSampleForTrack(i, o, a, d, t.type);
      await this.registerSample(i, c);
    } finally {
      r();
    }
  }
  async padWithSilence(e, t, n) {
    const r = re(n, e.timescale);
    if (n = r / e.timescale, r > 0) {
      const { sampleSize: i, silentValue: o } = Ts(e.info.decoderConfig.codec), a = r * e.info.numberOfChannels, d = new Uint8Array(i * a).fill(o), c = this.createSampleForTrack(e, new Uint8Array(d.buffer), t, n, "key");
      await this.registerSample(e, c);
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
      for (const c of e.cueQueue)
        T(c.timestamp <= t), T(e.lastCueEndTimestamp <= c.timestamp + c.duration), n.add(Math.max(c.timestamp, e.lastCueEndTimestamp)), n.add(c.timestamp + c.duration);
      const r = [...n].sort((c, l) => c - l), i = r[0], o = r[1] ?? i;
      if (t < o)
        break;
      if (e.lastCueEndTimestamp < i) {
        this.auxWriter.seek(0);
        const c = hy();
        this.auxBoxWriter.writeBox(c);
        const l = this.auxTarget._getSlice(0, this.auxWriter.getPos()), u = this.createSampleForTrack(e, l, e.lastCueEndTimestamp, i - e.lastCueEndTimestamp, "key");
        await this.registerSample(e, u), e.lastCueEndTimestamp = i;
      }
      this.auxWriter.seek(0);
      for (let c = 0; c < e.cueQueue.length; c++) {
        const l = e.cueQueue[c];
        if (l.timestamp >= o)
          break;
        ha.lastIndex = 0;
        const u = ha.test(l.text), h = l.timestamp + l.duration;
        let f = e.cueToSourceId.get(l);
        if (f === void 0 && o < h && (f = e.nextSourceId++, e.cueToSourceId.set(l, f)), l.notes) {
          const y = py(l.notes);
          this.auxBoxWriter.writeBox(y);
        }
        const m = fy(l.text, u ? i : null, l.identifier ?? null, l.settings ?? null, f ?? null);
        this.auxBoxWriter.writeBox(m), h === o && e.cueQueue.splice(c--, 1);
      }
      const a = this.auxTarget._getSlice(0, this.auxWriter.getPos()), d = this.createSampleForTrack(e, a, i, o - i, "key");
      await this.registerSample(e, d), e.lastCueEndTimestamp = o;
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
        const i = fs(e.timeToSampleTable);
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
        T(e.lastSample);
        const d = re(i.decodeTimestamp, e.timescale, !1), c = Math.round(d - e.lastTimescaleUnits);
        if (T(c >= 0), e.lastTimescaleUnits += c, e.lastSample.timescaleUnitsToNextSample = c, !this.isFragmented) {
          let l = fs(e.timeToSampleTable);
          if (T(l), l.sampleCount === 1) {
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
          const u = fs(e.compositionTimeOffsetTable);
          T(u), u.sampleCompositionTimeOffset === o ? u.sampleCount++ : e.compositionTimeOffsetTable.push({
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
    if (e.timestampProcessingQueue.length = 0, T(e.lastSample), T(e.lastTimescaleUnits !== null), t !== void 0 && e.lastSample.timescaleUnitsToNextSample === 0) {
      T(t.type === "key");
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
      if (T(r !== void 0), e.samples.length > r)
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
    }), T(e.currentChunk), e.currentChunk.samples.push(t), this.isFragmented && (this.maxWrittenTimestamp = Math.max(this.maxWrittenTimestamp, t.timestamp), this.maxWrittenEndTimestamp = Math.max(this.maxWrittenEndTimestamp, t.timestamp + t.duration), this.minWrittenTimestamp = Math.min(this.minWrittenTimestamp, t.timestamp));
  }
  async finalizeCurrentChunk(e) {
    if (T(!this.isFragmented), T(this.writer), !e.currentChunk)
      return;
    e.finalizedChunks.push(e.currentChunk), this.finalizedChunks.push(e.currentChunk);
    let t = e.currentChunk.samples.length;
    if (e.type === "audio" && e.info.requiresPcmTransformation && (t = e.currentChunk.samples.reduce((n, r) => n + re(r.duration, e.timescale), 0)), (e.compactlyCodedChunkTable.length === 0 || fs(e.compactlyCodedChunkTable).samplesPerChunk !== t) && e.compactlyCodedChunkTable.push({
      firstChunk: e.finalizedChunks.length,
      // 1-indexed
      samplesPerChunk: t
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
    T(this.isFragmented);
    const t = this.nextFragmentNumber++;
    if (t === 1) {
      const f = this.initBoxWriter ?? this.boxWriter;
      T(f), this.format._options.onMoov && f.writer.startTrackingWrites(), this.ensureOneEnabledTrack();
      const m = Ps(this);
      if (f.writeBox(m), this.format._options.onMoov) {
        const { data: y, start: p } = f.writer.stopTrackingWrites();
        this.format._options.onMoov(y, p);
      }
      if (this.isCmaf) {
        T(this.initWriter), await this.initWriter.flush(), await this.initWriter.finalize(), this.writer = await this.output._getRootWriter(!0), this.boxWriter = new mn(this.writer);
        const y = this.boxWriter.measureBox(fa()), p = this.boxWriter.measureBox(pa(this, 0));
        this.segmentHeaderSize = y + p, this.writer.seek(this.segmentHeaderSize);
      }
    }
    T(this.writer), T(this.boxWriter);
    const n = this.trackDatas.filter((f) => f.currentChunk), r = ga(t, n), i = this.writer.getPos(), o = i + this.boxWriter.measureBox(r);
    let a = o + xr, d = 1 / 0;
    for (const f of n) {
      f.currentChunk.offset = a, f.currentChunk.moofOffset = i;
      for (const m of f.currentChunk.samples)
        a += m.size;
      d = Math.min(d, f.currentChunk.startTimestamp);
    }
    const c = a - o, l = c >= 2 ** 32;
    if (l)
      for (const f of n)
        f.currentChunk.offset += la - xr;
    this.format._options.onMoof && this.writer.startTrackingWrites();
    const u = ga(t, n);
    if (this.boxWriter.writeBox(u), this.format._options.onMoof) {
      const { data: f, start: m } = this.writer.stopTrackingWrites();
      this.format._options.onMoof(f, m, d);
    }
    T(this.writer.getPos() === o), this.format._options.onMdat && this.writer.startTrackingWrites();
    const h = gn(l);
    h.size = c, this.boxWriter.writeBox(h), this.writer.seek(o + (l ? la : xr));
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
    if (T(this.writer), T(this.boxWriter), this.allTracksAreKnown()) {
      if (!this.mdat) {
        this.ensureOneEnabledTrack();
        const n = Ps(this), i = this.boxWriter.measureBox(n) + this.computeSampleTableSizeUpperBound() + 4096;
        T(this.ftypSize !== null), this.writer.seek(this.ftypSize + i), this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat = gn(!0), this.boxWriter.writeBox(this.mdat);
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
    T(this.fastStart === "reserve");
    let e = 0;
    for (const t of this.trackDatas) {
      const n = t.track.metadata.maximumPacketCount;
      T(n !== void 0), e += 8 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * Math.ceil(2 / 3 * n), e += 12 * Math.ceil(2 / 3 * n), e += 4 * n, e += 8 * n;
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
        await this.finalizeCurrentChunk(t), T(t.startTimestampOffset !== null);
        for (let n = 0; n < t.samples.length; n++) {
          const r = t.samples[n];
          r.timestamp -= t.startTimestampOffset, r.decodeTimestamp -= t.startTimestampOffset;
        }
      }
    if (T(this.writer), T(this.boxWriter), this.fastStart === "in-memory") {
      this.mdat = gn(!1);
      let t;
      for (let r = 0; r < 2; r++) {
        const i = Ps(this), o = this.boxWriter.measureBox(i);
        t = this.boxWriter.measureBox(this.mdat);
        let a = this.writer.getPos() + o + t;
        for (const d of this.finalizedChunks) {
          d.offset = a;
          for (const { data: c } of d.samples)
            T(c), a += c.byteLength, t += c.byteLength;
        }
        if (a < 2 ** 32)
          break;
        t >= 2 ** 32 && (this.mdat.largeSize = !0);
      }
      this.format._options.onMoov && this.writer.startTrackingWrites();
      const n = Ps(this);
      if (this.boxWriter.writeBox(n), this.format._options.onMoov) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMoov(r, i);
      }
      this.format._options.onMdat && this.writer.startTrackingWrites(), this.mdat.size = t, this.boxWriter.writeBox(this.mdat);
      for (const r of this.finalizedChunks)
        for (const i of r.samples)
          T(i.data), this.writer.write(i.data), i.data = null;
      if (this.format._options.onMdat) {
        const { data: r, start: i } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(r, i);
      }
    } else if (this.isFragmented)
      if (this.isCmaf) {
        const t = this.segmentHeaderSize !== null ? this.writer.getPos() - this.segmentHeaderSize : 0;
        this.writer.seek(0), this.boxWriter.writeBox(fa()), this.boxWriter.writeBox(pa(this, t));
      } else {
        const t = this.writer.getPos(), n = dy(this.trackDatas);
        this.boxWriter.writeBox(n);
        const r = this.writer.getPos() - t;
        this.writer.seek(this.writer.getPos() - 4), this.boxWriter.writeU32(r);
      }
    else {
      T(this.mdat);
      const t = this.boxWriter.offsets.get(this.mdat);
      T(t !== void 0);
      const n = this.writer.getPos() - t;
      if (this.mdat.size = n, this.mdat.largeSize = n >= 2 ** 32, this.boxWriter.patchBox(this.mdat), this.format._options.onMdat) {
        const { data: i, start: o } = this.writer.stopTrackingWrites();
        this.format._options.onMdat(i, o);
      }
      const r = Ps(this);
      if (this.fastStart === "reserve") {
        T(this.ftypSize !== null), this.writer.seek(this.ftypSize), this.format._options.onMoov && this.writer.startTrackingWrites(), this.boxWriter.writeBox(r);
        const i = this.boxWriter.offsets.get(this.mdat) - this.writer.getPos();
        this.boxWriter.writeBox(mg(i));
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
class to {
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
class Td extends to {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !xs.includes(e))
      throw new TypeError(`Invalid video codec '${e}'. Must be one of: ${xs.join(", ")}.`);
    this._codec = e;
  }
}
const Ay = (s, e) => {
  if (s.metadata.hasOnlyKeyPackets && e.type !== "key")
    throw new Error("Cannot add non-key packets to a hasOnlyKeyPackets video track.");
};
class By extends Td {
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
    return this._ensureValidAdd(), Ay(this._connectedTrack, e), this._connectedTrack.output._muxer.addEncodedVideoPacket(this._connectedTrack, e, t);
  }
}
class Ed extends to {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Gn.includes(e))
      throw new TypeError(`Invalid audio codec '${e}'. Must be one of: ${Gn.join(", ")}.`);
    this._codec = e;
  }
}
class My extends Ed {
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
class Iy extends to {
  /** Internal constructor. */
  constructor(e) {
    if (super(), this._connectedTrack = null, !Ys.includes(e))
      throw new TypeError(`Invalid subtitle codec '${e}'. Must be one of: ${Ys.join(", ")}.`);
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
class Cd {
  /** Returns a list of video codecs that this output format can contain. */
  getSupportedVideoCodecs() {
    return this.getSupportedCodecs().filter((e) => xs.includes(e));
  }
  /** Returns a list of audio codecs that this output format can contain. */
  getSupportedAudioCodecs() {
    return this.getSupportedCodecs().filter((e) => Gn.includes(e));
  }
  /** Returns a list of subtitle codecs that this output format can contain. */
  getSupportedSubtitleCodecs() {
    return this.getSupportedCodecs().filter((e) => Ys.includes(e));
  }
  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _codecUnsupportedHint(e) {
    return "";
  }
}
class so extends Cd {
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
    return new Cy(e, this);
  }
}
class Ad extends so {
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
      ...xs,
      ...Yi,
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
      ...Ys
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Bd().getSupportedCodecs().includes(e) ? " Switching to MOV will grant support for this codec." : "";
  }
}
class wa extends so {
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
      ...xs,
      ...Yi,
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
      ...Ys
    ];
  }
}
class Bd extends so {
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
      ...xs,
      ...Gn
    ];
  }
  /** @internal */
  _codecUnsupportedHint(e) {
    return new Ad().getSupportedCodecs().includes(e) ? " Switching to MP4 will grant support for this codec." : "";
  }
}
/*!
 * Copyright (c) 2026-present, Vanilagy and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const Oy = ["video", "audio", "subtitle"];
class rn {
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
    if (!(e instanceof rn))
      throw new TypeError("other must be an OutputTrack.");
    if (this === e)
      return !1;
    const t = sa(this.metadata.group), n = sa(e.metadata.group);
    for (const r of t)
      if (this.type !== e.type && n.some((a) => r === a) || n.some((a) => r._pairedGroups.has(a)))
        return !0;
    return !1;
  }
}
class Ry extends rn {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "video", n, r);
  }
}
class Py extends rn {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "audio", n, r);
  }
}
class Fy extends rn {
  /** @internal */
  constructor(e, t, n, r) {
    super(e, t, "subtitle", n, r);
  }
}
class Qs {
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
    if (!(e instanceof Qs))
      throw new TypeError("other must be an OutputTrackGroup.");
    if (this === e)
      throw new TypeError("Cannot pair a group with itself.");
    this._pairedGroups.add(e), e._pairedGroups.add(this);
  }
}
const Mr = (s) => {
  if (!s || typeof s != "object")
    throw new TypeError("metadata must be an object.");
  if (s.languageCode !== void 0 && !Sm(s.languageCode))
    throw new TypeError("metadata.languageCode, when provided, must be a three-letter, ISO 639-2/T language code.");
  if (s.name !== void 0 && typeof s.name != "string")
    throw new TypeError("metadata.name, when provided, must be a string.");
  if (s.disposition !== void 0 && Cm(s.disposition), s.maximumPacketCount !== void 0 && (!Number.isInteger(s.maximumPacketCount) || s.maximumPacketCount < 0))
    throw new TypeError("metadata.maximumPacketCount, when provided, must be a non-negative integer.");
  if (s.group !== void 0 && !(s.group instanceof Qs) && (!Array.isArray(s.group) || s.group.some((e) => !(e instanceof Qs))))
    throw new TypeError("metadata.group, when provided, must be an OutputTrackGroup instance or an array of OutputTrackGroup instances.");
};
class Ly extends Ki {
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
    if (super(), this.state = "pending", this.defaultTrackGroup = new Qs(), this._onFinalize = null, this._unfinalizedTargets = /* @__PURE__ */ new Set(), this._rootWriterPromise = null, this._tracks = [], this._startPromise = null, this._cancelPromise = null, this._finalizePromise = null, this._mutex = new dd(), this._metadataTags = {}, this._rootTarget = null, this._rootTargetPromise = null, this._firstMediaStreamTimestamp = null, !e || typeof e != "object")
      throw new TypeError("options must be an object.");
    if (!(e.format instanceof Cd))
      throw new TypeError("options.format must be an OutputFormat.");
    if (!(e.target instanceof at || e.target instanceof Br))
      throw new TypeError("options.target must be a Target or a PathedTarget.");
    if (e.target instanceof at && this._rememberTarget(e.target), e.initTarget !== void 0 && !(e.initTarget instanceof at) && typeof e.initTarget != "function")
      throw new Error("options.initTarget, when provided, must be a Target or a function that returns or resolves to a Target.");
    if (e.onFinalize !== void 0 && typeof e.onFinalize != "function")
      throw new TypeError("options.onFinalize, when provided, must be a function.");
    this.format = e.format, this._target = e.target, this._onFinalize = e.onFinalize ?? null, this._initTarget = e.initTarget ?? null, this._initTarget instanceof at && this._rememberTarget(this._initTarget), this._muxer = e.format._createMuxer(this);
  }
  /** @internal */
  _getTargetValidated(e) {
    T(this._target instanceof Br);
    const t = this._target.getTarget(e), n = (r) => {
      if (!(r instanceof at))
        throw new TypeError("getTarget must return a Target.");
      return r;
    };
    return t instanceof Promise ? t.then(n) : n(t);
  }
  /** @internal */
  async _getTarget(e) {
    T(this._target instanceof Br);
    const t = await this._getTargetValidated(e);
    return this._emit("target", { target: t, request: e, isRoot: e.isRoot }), this.state === "canceled" ? await t._close() : this._rememberTarget(t), t;
  }
  /** @internal */
  _rememberTarget(e) {
    this._unfinalizedTargets.add(e), e.on("finalized", () => this._unfinalizedTargets.delete(e), { once: !0 });
  }
  /** @internal */
  async _getInitTarget() {
    if (T(this._initTarget !== null), this._initTarget instanceof at)
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
    }, t = this._getTargetValidated(e), n = (r) => (this.state === "canceled" ? r._close() : this._rememberTarget(r), this._emit("target", { target: r, request: e, isRoot: !0 }), this._rootTarget = r, r);
    return t instanceof Promise ? this._rootTargetPromise = t.then(n) : n(t);
  }
  /** @internal */
  _getRootWriter(e) {
    return this._rootWriterPromise ??= (async () => {
      const t = await this._getRootTarget(), n = new hi(t, typeof e == "boolean" ? e : e(t));
      return n.start(), n;
    })();
  }
  /** Adds a video track to the output with the given source. Can only be called before the output is started. */
  addVideoTrack(e, t = {}) {
    if (!(e instanceof Td))
      throw new TypeError("source must be a VideoSource.");
    if (Mr(t), t.rotation !== void 0 && ![0, 90, 180, 270].includes(t.rotation))
      throw new TypeError(`Invalid video rotation: ${t.rotation}. Has to be 0, 90, 180 or 270.`);
    if (!this.format.supportsVideoRotationMetadata && t.rotation)
      throw new Error(`${this.format._name} does not support video rotation metadata.`);
    if (t.frameRate !== void 0 && (!Number.isFinite(t.frameRate) || t.frameRate <= 0))
      throw new TypeError(`Invalid video frame rate: ${t.frameRate}. Must be a positive number.`);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new Ry(this._tracks.length + 1, this, e, n));
  }
  /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
  addAudioTrack(e, t = {}) {
    if (!(e instanceof Ed))
      throw new TypeError("source must be an AudioSource.");
    Mr(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new Py(this._tracks.length + 1, this, e, n));
  }
  /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
  addSubtitleTrack(e, t = {}) {
    if (!(e instanceof Iy))
      throw new TypeError("source must be a SubtitleSource.");
    Mr(t);
    const n = { ...t };
    return n.group ??= this.defaultTrackGroup, this._addTrack(new Fy(this._tracks.length + 1, this, e, n));
  }
  /**
   * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
   * multiple times, only the metadata from the last call will be used.
   *
   * Can only be called before the output is started.
   */
  setMetadataTags(e) {
    if (Em(e), this.state !== "pending")
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
    for (const n of Oy) {
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
const ba = 7, fi = 1.5, va = 3, Uy = 2, Ny = 0.05;
class Md {
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
      if (this.gaps += 1, this.gaps <= ba)
        this.warmup.push(n), this.ewmaGapMs = Dy(this.warmup);
      else if (this.ewmaGapMs !== null && Vy(n, this.ewmaGapMs)) {
        const r = Math.max(1 / this.gaps, Ny);
        this.ewmaGapMs += r * (n - this.ewmaGapMs);
      }
      this.recent.push(n), this.recent.length > va && this.recent.shift();
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
    return this.lastAtMs !== null && t > Uy * Math.max(n, this.chunkMs) ? r = "stalled" : this.established() && this.recent.length >= va && this.recent.every((i) => i > fi * n) && (r = "slow"), {
      state: r,
      lastGapMs: this.recent.length > 0 ? this.recent[this.recent.length - 1] : 0,
      ewmaGapMs: n,
      sinceLastMs: t
    };
  }
  established() {
    return this.gaps >= ba;
  }
}
function Dy(s) {
  const e = [...s].sort((n, r) => n - r), t = e.length >> 1;
  return e.length % 2 === 1 ? e[t] : (e[t - 1] + e[t]) / 2;
}
function Vy(s, e) {
  return s >= e / fi && s <= e * fi;
}
const $y = `
const FRAMES_PER_POST = ${Ef};

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
async function zy(s, e, t) {
  const n = new Blob([$y], { type: "application/javascript" }), r = URL.createObjectURL(n);
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
const Ir = J("media.timer");
function Hy() {
  return typeof Worker == "function" && typeof Blob == "function" && typeof URL < "u" && typeof URL.createObjectURL == "function";
}
function Id(s, e) {
  const t = Math.max(1, Math.round(e));
  let n = !1, r = "main", i = null, o = null, a = null, d = !1;
  const c = () => {
    n || s();
  }, l = () => {
    r = "main", i = setInterval(c, t);
  }, u = () => {
    o && (o.onmessage = null, o.onerror = null, o.terminate(), o = null), a && (URL.revokeObjectURL(a), a = null);
  };
  if (Hy())
    try {
      const h = `setInterval(() => postMessage(0), ${t});`;
      a = URL.createObjectURL(new Blob([h], { type: "application/javascript" })), o = new Worker(a), o.onmessage = () => {
        d || (d = !0, Ir.info("worker timer running", { period: t })), c();
      }, o.onerror = (f) => {
        Ir.warn("worker timer failed, falling back to the main-thread interval", {
          err: f.message,
          period: t,
          mode: "main"
        }), u(), n || l();
      }, r = "worker";
    } catch (h) {
      Ir.warn("worker timer unavailable, using the main-thread interval", {
        err: h,
        period: t,
        mode: "main"
      }), u(), l();
    }
  else
    l();
  return {
    get mode() {
      return r;
    },
    stop() {
      n || (n = !0, u(), i !== null && (clearInterval(i), i = null));
    }
  };
}
const Sa = J("media.encoder"), _a = ne(5), jy = 5, qy = [
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
function Wy(s, e) {
  const n = qy.indexOf(s);
  if (n === -1)
    throw new Error(`No AAC frequency index for sample rate ${s}`);
  return new Uint8Array([
    16 | n >> 1,
    (n & 1) << 7 | e << 3
  ]);
}
const Gy = /* @__PURE__ */ new Set(["ftyp", "styp", "moov", "moof", "mdat", "sidx"]);
function Zy(s) {
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
    if (!Gy.has(r))
      return s.subarray(0, t);
    t += n;
  }
  return s;
}
class Ky {
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
      chunkMs: Gt,
      fps: kf,
      videoBitrate: Zc,
      audioBitrate: Kc,
      ...e
    }, this.cadence = new Md(this.opts.chunkMs);
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
      output: (a, d) => this.onVideoOutput(a, d),
      error: (a) => this.fail(a)
    }), this.videoEncoder.configure({
      codec: r.videoCodec,
      width: e.width,
      height: e.height,
      bitrate: this.opts.videoBitrate,
      framerate: this.opts.fps,
      latencyMode: "realtime",
      avc: { format: "avc" }
    }), this.audioTap = await zy(
      t,
      n,
      (a) => this.onPcm(a)
    ), this.baseAudioTime = t.currentTime, this.nextBoundaryUs = 0;
    const i = Math.round(1e6 / this.opts.fps), o = () => {
      if (this.stopped || this.failed || !this.videoEncoder) return;
      const a = Math.round((t.currentTime - this.baseAudioTime) * 1e6);
      if (a <= this.lastVideoTsUs) return;
      if (this.videoEncoder.encodeQueueSize > jy) {
        this.counters.framesDropped += 1;
        return;
      }
      const d = a >= this.nextBoundaryUs;
      d && (this.nextBoundaryUs = a + this.opts.chunkMs * 1e3);
      const c = new VideoFrame(e, { timestamp: a, duration: i });
      this.lastVideoTsUs = a, this.counters.framesCaptured += 1;
      try {
        this.videoEncoder.encode(c, { keyFrame: d });
      } finally {
        c.close();
      }
    };
    this.captureTimer = Id(o, 1e3 / this.opts.fps), Sa.info("capture timer started", { timer: this.captureTimer.mode, fps: this.opts.fps }), o();
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
        _a.allow() && Sa.warn("dropping leading chunk: audio has not started yet", {
          drops: _a.count()
        });
        continue;
      }
      const i = this.seq++;
      this.muxSerial = this.muxSerial.then(() => this.muxGroup(i, e, r)).catch((o) => this.fail(o));
    }
  }
  async muxGroup(e, t, n) {
    if (this.failed) return;
    const r = t.endTsUs, i = new Ly({
      format: new Ad({ fastStart: "fragmented", minimumFragmentDuration: 3600 }),
      target: new Tn()
    }), o = new By("avc");
    i.addVideoTrack(o);
    const a = n.length === 0 ? this.lastAudioPacket : null;
    let d = null;
    if ((n.length > 0 || a) && (d = new My(this.opts.codecs.muxAudioCodec), i.addAudioTrack(d)), await i.start(), !this.videoDecoderConfig)
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
        description: Wy(
          this.opts.audioContext.sampleRate,
          this.audioChannels
        )
      }), a) {
        for (let h = t.startTsUs, f = !0; h < r; h += a.durUs)
          await d.add(
            new Ot(a.data, "key", h / 1e6, a.durUs / 1e6),
            f ? { decoderConfig: u } : void 0
          ), f = !1;
        this.counters.audioPaddedChunks += 1;
      } else {
        for (let y = 0; y < n.length; y++)
          await d.add(
            Ot.fromEncodedChunk(n[y]),
            y === 0 ? { decoderConfig: u } : void 0
          );
        const h = n[n.length - 1], f = new Uint8Array(h.byteLength);
        h.copyTo(f);
        const m = this.opts.codecs.muxAudioCodec === "aac" ? Math.round(1024e6 / this.opts.audioContext.sampleRate) : 2e4;
        this.lastAudioPacket = { data: f, durUs: h.duration || m };
      }
    }
    await i.finalize();
    const c = i.target.buffer;
    if (!c)
      throw new Error(`Muxer produced no output for chunk ${e}`);
    const l = {
      seq: e,
      tsUs: t.startTsUs,
      durUs: r - t.startTsUs,
      payload: Zy(new Uint8Array(c))
    };
    this.counters.chunksEmitted += 1, this.counters.lastChunkBytes = l.payload.byteLength, this.cadence.observe(Date.now()), this.opts.onChunk(l);
  }
}
const Yy = {}, xa = J("ice");
function Od(s) {
  const e = Yy ?? {};
  return {
    VITE_TURN_ISSUER_URL: e.VITE_TURN_ISSUER_URL ?? "",
    VITE_TURN_URL: e.VITE_TURN_URL ?? "",
    VITE_TURN_USER: e.VITE_TURN_USER ?? "",
    VITE_TURN_PASS: e.VITE_TURN_PASS ?? "",
    VITE_DISABLE_STUN: e.VITE_DISABLE_STUN ?? "",
    VITE_DISABLE_TURN: e.VITE_DISABLE_TURN ?? ""
  };
}
const Xy = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" }
], Qy = 5e3, Jy = 10 * 6e4, e0 = 6e4;
let ys = null, Fs = null, ka = 0;
function t0(s, e) {
  if (!s || typeof s != "object") return null;
  const { iceServers: t, ttl: n } = s;
  if (!Array.isArray(t) || typeof n != "number" || n <= 0) return null;
  const r = t.filter(
    (i) => !!i && typeof i == "object" && typeof i.username == "string" && typeof i.credential == "string" && [i.urls].flat().some((o) => typeof o == "string" && /^turns?:/.test(o))
  );
  return r.length === 0 ? null : { servers: r, expiresAt: e + n * 1e3 };
}
function s0(s) {
  return s.VITE_DISABLE_TURN !== "1" && !s.VITE_TURN_URL && !!s.VITE_TURN_ISSUER_URL;
}
function Ta(s) {
  const e = Od();
  if (!s0(e)) return Promise.resolve();
  const t = Date.now();
  return ys && t < ys.expiresAt - Jy ? Promise.resolve() : Fs || (t - ka < e0 ? Promise.resolve() : (Fs = (async () => {
    try {
      const n = await fetch(e.VITE_TURN_ISSUER_URL, {
        signal: AbortSignal.timeout(Qy),
        cache: "no-store"
      });
      if (!n.ok) throw new Error(`HTTP ${n.status}`);
      const r = t0(await n.json(), Date.now());
      if (!r) throw new Error("bad response shape");
      ys = r, xa.info("turn credentials issued", {
        servers: r.servers.length,
        expiresInS: Math.round((r.expiresAt - Date.now()) / 1e3)
      });
    } catch (n) {
      ka = Date.now(), xa.warn("turn issuer failed, using STUN only", {
        url: e.VITE_TURN_ISSUER_URL,
        error: n instanceof Error ? n.message : String(n)
      });
    } finally {
      Fs = null;
    }
  })(), Fs));
}
const n0 = "spotlight.iceRelayOnly";
function r0() {
  try {
    return localStorage.getItem(n0) === "1";
  } catch {
    return !1;
  }
}
function i0(s) {
  const {
    VITE_TURN_ISSUER_URL: e,
    VITE_TURN_URL: t,
    VITE_TURN_USER: n,
    VITE_TURN_PASS: r,
    VITE_DISABLE_STUN: i,
    VITE_DISABLE_TURN: o
  } = Od(), a = i === "1" ? [] : [...Xy], d = [t, n, r].filter(Boolean).length;
  if (d > 0 && d < 3)
    throw new Error(
      "Incomplete TURN config: set VITE_TURN_URL, VITE_TURN_USER, and VITE_TURN_PASS together."
    );
  return o === "1" || (t && n && r ? a.push({
    urls: t,
    username: n,
    credential: r
  }) : e && ys && Date.now() < ys.expiresAt ? (a.push(...ys.servers), Ta()) : e && Ta()), a;
}
const o0 = /* @__PURE__ */ Uint32Array.from([
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
class a0 extends bc {
  constructor(e) {
    super(64, e, 8, !1);
  }
  get() {
    const { A: e, B: t, C: n, D: r, E: i, F: o, G: a, H: d } = this;
    return [e, t, n, r, i, o, a, d];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, d) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = r | 0, this.E = i | 0, this.F = o | 0, this.G = a | 0, this.H = d | 0;
  }
  process(e, t) {
    for (let u = 0; u < 16; u++, t += 4)
      vt[u] = e.getUint32(t, !1);
    for (let u = 16; u < 64; u++) {
      const h = vt[u - 15], f = vt[u - 2], m = He(h, 7) ^ He(h, 18) ^ h >>> 3, y = He(f, 17) ^ He(f, 19) ^ f >>> 10;
      vt[u] = y + vt[u - 7] + m + vt[u - 16] | 0;
    }
    let { A: n, B: r, C: i, D: o, E: a, F: d, G: c, H: l } = this;
    for (let u = 0; u < 64; u++) {
      const h = He(a, 6) ^ He(a, 11) ^ He(a, 25), f = l + h + nu(a, d, c) + o0[u] + vt[u] | 0, y = (He(n, 2) ^ He(n, 13) ^ He(n, 22)) + ru(n, r, i) | 0;
      l = c, c = d, d = a, a = o + f | 0, o = i, i = r, r = n, n = f + y | 0;
    }
    n = n + this.A | 0, r = r + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, d = d + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(n, r, i, o, a, d, c, l);
  }
  roundClean() {
    Je(vt);
  }
  destroy() {
    this.destroyed = !0, this.set(0, 0, 0, 0, 0, 0, 0, 0), Je(this.buffer);
  }
}
class c0 extends a0 {
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
const Rd = iu([
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
].map((s) => BigInt(s))), d0 = Rd[0], l0 = Rd[1], St = /* @__PURE__ */ new Uint32Array(80), _t = /* @__PURE__ */ new Uint32Array(80);
class u0 extends bc {
  constructor(e) {
    super(128, e, 16, !1);
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: n, Bl: r, Ch: i, Cl: o, Dh: a, Dl: d, Eh: c, El: l, Fh: u, Fl: h, Gh: f, Gl: m, Hh: y, Hl: p } = this;
    return [e, t, n, r, i, o, a, d, c, l, u, h, f, m, y, p];
  }
  // prettier-ignore
  set(e, t, n, r, i, o, a, d, c, l, u, h, f, m, y, p) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = r | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = d | 0, this.Eh = c | 0, this.El = l | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = f | 0, this.Gl = m | 0, this.Hh = y | 0, this.Hl = p | 0;
  }
  process(e, t) {
    for (let k = 0; k < 16; k++, t += 4)
      St[k] = e.getUint32(t), _t[k] = e.getUint32(t += 4);
    for (let k = 16; k < 80; k++) {
      const U = St[k - 15] | 0, q = _t[k - 15] | 0, G = Et(U, q, 1) ^ Et(U, q, 8) ^ vo(U, q, 7), L = Ct(U, q, 1) ^ Ct(U, q, 8) ^ So(U, q, 7), j = St[k - 2] | 0, $ = _t[k - 2] | 0, te = Et(j, $, 19) ^ Ns(j, $, 61) ^ vo(j, $, 6), K = Ct(j, $, 19) ^ Ds(j, $, 61) ^ So(j, $, 6), _ = cu(L, K, _t[k - 7], _t[k - 16]), I = du(_, G, te, St[k - 7], St[k - 16]);
      St[k] = I | 0, _t[k] = _ | 0;
    }
    let { Ah: n, Al: r, Bh: i, Bl: o, Ch: a, Cl: d, Dh: c, Dl: l, Eh: u, El: h, Fh: f, Fl: m, Gh: y, Gl: p, Hh: b, Hl: g } = this;
    for (let k = 0; k < 80; k++) {
      const U = Et(u, h, 14) ^ Et(u, h, 18) ^ Ns(u, h, 41), q = Ct(u, h, 14) ^ Ct(u, h, 18) ^ Ds(u, h, 41), G = u & f ^ ~u & y, L = h & m ^ ~h & p, j = lu(g, q, L, l0[k], _t[k]), $ = uu(j, b, U, G, d0[k], St[k]), te = j | 0, K = Et(n, r, 28) ^ Ns(n, r, 34) ^ Ns(n, r, 39), _ = Ct(n, r, 28) ^ Ds(n, r, 34) ^ Ds(n, r, 39), I = n & i ^ n & a ^ i & a, A = r & o ^ r & d ^ o & d;
      b = y | 0, g = p | 0, y = f | 0, p = m | 0, f = u | 0, m = h | 0, { h: u, l: h } = Ne(c | 0, l | 0, $ | 0, te | 0), c = a | 0, l = d | 0, a = i | 0, d = o | 0, i = n | 0, o = r | 0;
      const P = Oi(te, _, A);
      n = Ri(P, $, K, I), r = P | 0;
    }
    ({ h: n, l: r } = Ne(this.Ah | 0, this.Al | 0, n | 0, r | 0)), { h: i, l: o } = Ne(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: d } = Ne(this.Ch | 0, this.Cl | 0, a | 0, d | 0), { h: c, l } = Ne(this.Dh | 0, this.Dl | 0, c | 0, l | 0), { h: u, l: h } = Ne(this.Eh | 0, this.El | 0, u | 0, h | 0), { h: f, l: m } = Ne(this.Fh | 0, this.Fl | 0, f | 0, m | 0), { h: y, l: p } = Ne(this.Gh | 0, this.Gl | 0, y | 0, p | 0), { h: b, l: g } = Ne(this.Hh | 0, this.Hl | 0, b | 0, g | 0), this.set(n, r, i, o, a, d, c, l, u, h, f, m, y, p, b, g);
  }
  roundClean() {
    Je(St, _t);
  }
  destroy() {
    this.destroyed = !0, Je(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class h0 extends u0 {
  Ah = Te[0] | 0;
  Al = Te[1] | 0;
  Bh = Te[2] | 0;
  Bl = Te[3] | 0;
  Ch = Te[4] | 0;
  Cl = Te[5] | 0;
  Dh = Te[6] | 0;
  Dl = Te[7] | 0;
  Eh = Te[8] | 0;
  El = Te[9] | 0;
  Fh = Te[10] | 0;
  Fl = Te[11] | 0;
  Gh = Te[12] | 0;
  Gl = Te[13] | 0;
  Hh = Te[14] | 0;
  Hl = Te[15] | 0;
  constructor() {
    super(64);
  }
}
const f0 = /* @__PURE__ */ Ii(
  () => new c0(),
  /* @__PURE__ */ wc(1)
), p0 = /* @__PURE__ */ Ii(
  () => new h0(),
  /* @__PURE__ */ wc(3)
);
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Se = (s, e, t) => Ce(s, e, t), Pd = ft, Fd = Ve, Ea = (...s) => eu(...s), m0 = (s) => Ie(s), g0 = pc, Ld = (s) => tu(s), Zn = /* @__PURE__ */ BigInt(0), pi = /* @__PURE__ */ BigInt(1);
function Kn(s, e = "") {
  if (typeof s != "boolean") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected boolean, got type=" + typeof s);
  }
  return s;
}
function y0(s) {
  if (typeof s == "bigint") {
    if (!En(s))
      throw new RangeError("positive bigint expected, got " + s);
  } else
    Pd(s);
  return s;
}
function mi(s, e = "") {
  if (typeof s != "number") {
    const t = e && `"${e}" `;
    throw new TypeError(t + "expected number, got type=" + typeof s);
  }
  if (!Number.isSafeInteger(s)) {
    const t = e && `"${e}" `;
    throw new RangeError(t + "expected safe integer, got " + s);
  }
}
function Ud(s) {
  if (typeof s != "string")
    throw new TypeError("hex string expected, got " + typeof s);
  return s === "" ? Zn : BigInt("0x" + s);
}
function w0(s) {
  return Ud(Ve(s));
}
function es(s) {
  return Ud(Ve(Js(Ce(s)).reverse()));
}
function Nd(s, e) {
  if (ft(e), e === 0)
    throw new RangeError("zero length");
  s = y0(s);
  const t = s.toString(16);
  if (t.length > e * 2)
    throw new RangeError("number too large");
  return Ie(t.padStart(e * 2, "0"));
}
function Dd(s, e) {
  return Nd(s, e).reverse();
}
function b0(s, e) {
  if (s = Se(s), e = Se(e), s.length !== e.length)
    return !1;
  let t = 0;
  for (let n = 0; n < s.length; n++)
    t |= s[n] ^ e[n];
  return t === 0;
}
function Js(s) {
  return Uint8Array.from(Se(s));
}
const En = (s) => typeof s == "bigint" && Zn <= s;
function v0(s, e, t) {
  return En(s) && En(e) && En(t) && e <= s && s < t;
}
function Yn(s, e, t, n) {
  if (!v0(e, t, n))
    throw new RangeError("expected valid " + s + ": " + t + " <= n < " + n + ", got " + e);
}
function S0(s) {
  if (s < Zn)
    throw new Error("expected non-negative bigint, got " + s);
  let e;
  for (e = 0; s > Zn; s >>= pi, e += 1)
    ;
  return e;
}
const _0 = (s) => (pi << BigInt(s)) - pi;
function or(s, e = {}, t = {}) {
  if (Object.prototype.toString.call(s) !== "[object Object]")
    throw new TypeError("expected valid options object");
  function n(i, o, a) {
    if (!a && o !== "function" && !Object.hasOwn(s, i))
      throw new TypeError(`param "${i}" is invalid: expected own property`);
    const d = s[i];
    if (a && d === void 0)
      return;
    const c = typeof d;
    if (c !== o || d === null)
      throw new TypeError(`param "${i}" is invalid: expected ${o}, got ${c}`);
  }
  const r = (i, o) => Object.entries(i).forEach(([a, d]) => n(a, d, o));
  r(e, !1), r(t, !0);
}
const Ca = () => {
  throw new Error("not implemented");
};
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ee = /* @__PURE__ */ BigInt(0), ke = /* @__PURE__ */ BigInt(1), jt = /* @__PURE__ */ BigInt(2), Vd = /* @__PURE__ */ BigInt(3), $d = /* @__PURE__ */ BigInt(4), zd = /* @__PURE__ */ BigInt(5), x0 = /* @__PURE__ */ BigInt(7), Hd = /* @__PURE__ */ BigInt(8), k0 = /* @__PURE__ */ BigInt(9), jd = /* @__PURE__ */ BigInt(16);
function fe(s, e) {
  if (e <= Ee)
    throw new Error("mod: expected positive modulus, got " + e);
  const t = s % e;
  return t >= Ee ? t : e + t;
}
function Ue(s, e, t) {
  if (e < Ee)
    throw new Error("pow2: expected non-negative exponent, got " + e);
  let n = s;
  for (; e-- > Ee; )
    n *= n, n %= t;
  return n;
}
function Aa(s, e) {
  if (s === Ee)
    throw new Error("invert: expected non-zero number");
  if (e <= Ee)
    throw new Error("invert: expected positive modulus, got " + e);
  let t = fe(s, e), n = e, r = Ee, i = ke;
  for (; t !== Ee; ) {
    const a = n / t, d = n - t * a, c = r - i * a;
    n = t, t = d, r = i, i = c;
  }
  if (n !== ke)
    throw new Error("invert: does not exist");
  return fe(r, e);
}
function no(s, e, t) {
  const n = s;
  if (!n.eql(n.sqr(e), t))
    throw new Error("Cannot find square root");
}
function qd(s, e) {
  const t = s, n = (t.ORDER + ke) / $d, r = t.pow(e, n);
  return no(t, r, e), r;
}
function T0(s, e) {
  const t = s, n = (t.ORDER - zd) / Hd, r = t.mul(e, jt), i = t.pow(r, n), o = t.mul(e, i), a = t.mul(t.mul(o, jt), i), d = t.mul(o, t.sub(a, t.ONE));
  return no(t, d, e), d;
}
function E0(s) {
  const e = ro(s), t = Wd(s), n = t(e, e.neg(e.ONE)), r = t(e, n), i = t(e, e.neg(n)), o = (s + x0) / jd;
  return ((a, d) => {
    const c = a;
    let l = c.pow(d, o), u = c.mul(l, n);
    const h = c.mul(l, r), f = c.mul(l, i), m = c.eql(c.sqr(u), d), y = c.eql(c.sqr(h), d);
    l = c.cmov(l, u, m), u = c.cmov(f, h, y);
    const p = c.eql(c.sqr(u), d), b = c.cmov(l, u, p);
    return no(c, b, d), b;
  });
}
function Wd(s) {
  if (s < Vd)
    throw new Error("sqrt is not defined for small field");
  let e = s - ke, t = 0;
  for (; e % jt === Ee; )
    e /= jt, t++;
  let n = jt;
  const r = ro(s);
  for (; Ba(r, n) === 1; )
    if (n++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  if (t === 1)
    return qd;
  let i = r.pow(n, e);
  const o = (e + ke) / jt;
  return function(d, c) {
    const l = d;
    if (l.is0(c))
      return c;
    if (Ba(l, c) !== 1)
      throw new Error("Cannot find square root");
    let u = t, h = l.mul(l.ONE, i), f = l.pow(c, e), m = l.pow(c, o);
    for (; !l.eql(f, l.ONE); ) {
      if (l.is0(f))
        return l.ZERO;
      let y = 1, p = l.sqr(f);
      for (; !l.eql(p, l.ONE); )
        if (y++, p = l.sqr(p), y === u)
          throw new Error("Cannot find square root");
      const b = ke << BigInt(u - y - 1), g = l.pow(h, b);
      u = y, h = l.sqr(g), f = l.mul(f, h), m = l.mul(m, g);
    }
    return m;
  };
}
function C0(s) {
  return s % $d === Vd ? qd : s % Hd === zd ? T0 : s % jd === k0 ? E0(s) : Wd(s);
}
const Vt = (s, e) => (fe(s, e) & ke) === ke, A0 = [
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
function B0(s) {
  const e = {
    ORDER: "bigint",
    BYTES: "number",
    BITS: "number"
  }, t = A0.reduce((n, r) => (n[r] = "function", n), e);
  if (or(s, t), mi(s.BYTES, "BYTES"), mi(s.BITS, "BITS"), s.BYTES < 1 || s.BITS < 1)
    throw new Error("invalid field: expected BYTES/BITS > 0");
  if (s.ORDER <= ke)
    throw new Error("invalid field: expected ORDER > 1, got " + s.ORDER);
  return s;
}
function M0(s, e, t) {
  const n = s;
  if (t < Ee)
    throw new Error("invalid exponent, negatives unsupported");
  if (t === Ee)
    return n.ONE;
  if (t === ke)
    return e;
  let r = n.ONE, i = e;
  for (; t > Ee; )
    t & ke && (r = n.mul(r, i)), i = n.sqr(i), t >>= ke;
  return r;
}
function Gd(s, e, t = !1) {
  const n = s, r = new Array(e.length).fill(t ? n.ZERO : void 0), i = e.reduce((a, d, c) => n.is0(d) ? a : (r[c] = a, n.mul(a, d)), n.ONE), o = n.inv(i);
  return e.reduceRight((a, d, c) => n.is0(d) ? a : (r[c] = n.mul(a, r[c]), n.mul(a, d)), o), r;
}
function Ba(s, e) {
  const t = s, n = (t.ORDER - ke) / jt, r = t.pow(e, n), i = t.eql(r, t.ONE), o = t.eql(r, t.ZERO), a = t.eql(r, t.neg(t.ONE));
  if (!i && !o && !a)
    throw new Error("invalid Legendre symbol result");
  return i ? 1 : o ? 0 : -1;
}
function I0(s, e) {
  if (e !== void 0 && Pd(e), s <= Ee)
    throw new Error("invalid n length: expected positive n, got " + s);
  if (e !== void 0 && e < 1)
    throw new Error("invalid n length: expected positive bit length, got " + e);
  const t = S0(s);
  if (e !== void 0 && e < t)
    throw new Error(`invalid n length: expected bit length (${t}) >= n.length (${e})`);
  const n = e !== void 0 ? e : t, r = Math.ceil(n / 8);
  return { nBitLength: n, nByteLength: r };
}
const Ma = /* @__PURE__ */ new WeakMap();
class Zd {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = Ee;
  ONE = ke;
  _lengths;
  _mod;
  constructor(e, t = {}) {
    if (e <= ke)
      throw new Error("invalid field: expected ORDER > 1, got " + e);
    let n;
    this.isLE = !1, t != null && typeof t == "object" && (typeof t.BITS == "number" && (n = t.BITS), typeof t.sqrt == "function" && Object.defineProperty(this, "sqrt", { value: t.sqrt, enumerable: !0 }), typeof t.isLE == "boolean" && (this.isLE = t.isLE), t.allowedLengths && (this._lengths = Object.freeze(t.allowedLengths.slice())), typeof t.modFromBytes == "boolean" && (this._mod = t.modFromBytes));
    const { nBitLength: r, nByteLength: i } = I0(e, n);
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
    return Ee <= e && e < this.ORDER;
  }
  is0(e) {
    return e === Ee;
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
    return M0(this, e, t);
  }
  div(e, t) {
    return fe(e * Aa(t, this.ORDER), this.ORDER);
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
    return Aa(e, this.ORDER);
  }
  sqrt(e) {
    let t = Ma.get(this);
    return t || Ma.set(this, t = C0(this.ORDER)), t(this, e);
  }
  toBytes(e) {
    return this.isLE ? Dd(e, this.BYTES) : Nd(e, this.BYTES);
  }
  fromBytes(e, t = !1) {
    Se(e);
    const { _lengths: n, BYTES: r, isLE: i, ORDER: o, _mod: a } = this;
    if (n) {
      if (e.length < 1 || !n.includes(e.length) || e.length > r)
        throw new Error("Field.fromBytes: expected " + n + " bytes, got " + e.length);
      const c = new Uint8Array(r);
      c.set(e, i ? 0 : c.length - e.length), e = c;
    }
    if (e.length !== r)
      throw new Error("Field.fromBytes: expected " + r + " bytes, got " + e.length);
    let d = i ? es(e) : w0(e);
    if (a && (d = fe(d, o)), !t && !this.isValid(d))
      throw new Error("invalid field element: outside of range 0..ORDER");
    return d;
  }
  // TODO: we don't need it here, move out to separate fn
  invertBatch(e) {
    return Gd(this, e);
  }
  // We can't move this out because Fp6, Fp12 implement it
  // and it's unclear what to return in there.
  cmov(e, t, n) {
    return Kn(n, "condition"), n ? t : e;
  }
}
Object.freeze(Zd.prototype);
function ro(s, e = {}) {
  return new Zd(s, e);
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xn = /* @__PURE__ */ BigInt(0), gi = /* @__PURE__ */ BigInt(1);
function Ia(s, e) {
  const t = e.negate();
  return s ? t : e;
}
function Or(s, e) {
  const t = Gd(s.Fp, e.map((n) => n.Z));
  return e.map((n, r) => s.fromAffine(n.toAffine(t[r])));
}
function Kd(s, e) {
  if (!Number.isSafeInteger(s) || s <= 0 || s > e)
    throw new Error("invalid window size, expected [1.." + e + "], got W=" + s);
}
function Rr(s, e) {
  Kd(s, e);
  const t = Math.ceil(e / s) + 1, n = 2 ** (s - 1), r = 2 ** s, i = _0(s), o = BigInt(s);
  return { windows: t, windowSize: n, mask: i, maxNumber: r, shiftBy: o };
}
function Oa(s, e, t) {
  const { windowSize: n, mask: r, maxNumber: i, shiftBy: o } = t;
  let a = Number(s & r), d = s >> o;
  a > n && (a -= i, d += gi);
  const c = e * n, l = c + Math.abs(a) - 1, u = a === 0, h = a < 0, f = e % 2 !== 0;
  return { nextN: d, offset: l, isZero: u, isNeg: h, isNegF: f, offsetF: c };
}
const Pr = /* @__PURE__ */ new WeakMap(), Yd = /* @__PURE__ */ new WeakMap();
function Fr(s) {
  return Yd.get(s) || 1;
}
function Ra(s) {
  if (s !== Xn)
    throw new Error("invalid wNAF");
}
class O0 {
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
    for (; t > Xn; )
      t & gi && (n = n.add(r)), r = r.double(), t >>= gi;
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
    const { windows: n, windowSize: r } = Rr(t, this.bits), i = [];
    let o = e, a = o;
    for (let d = 0; d < n; d++) {
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
  wNAF(e, t, n) {
    if (!this.Fn.isValid(n))
      throw new Error("invalid scalar");
    let r = this.ZERO, i = this.BASE;
    const o = Rr(e, this.bits);
    for (let a = 0; a < o.windows; a++) {
      const { nextN: d, offset: c, isZero: l, isNeg: u, isNegF: h, offsetF: f } = Oa(n, a, o);
      n = d, l ? i = i.add(Ia(h, t[f])) : r = r.add(Ia(u, t[c]));
    }
    return Ra(n), { p: r, f: i };
  }
  /**
   * Implements unsafe EC multiplication using precomputed tables
   * and w-ary non-adjacent form.
   * @param acc - accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(e, t, n, r = this.ZERO) {
    const i = Rr(e, this.bits);
    for (let o = 0; o < i.windows && n !== Xn; o++) {
      const { nextN: a, offset: d, isZero: c, isNeg: l } = Oa(n, o, i);
      if (n = a, !c) {
        const u = t[d];
        r = r.add(l ? u.negate() : u);
      }
    }
    return Ra(n), r;
  }
  getPrecomputes(e, t, n) {
    let r = Pr.get(t);
    return r || (r = this.precomputeWindow(t, e), e !== 1 && (typeof n == "function" && (r = n(r)), Pr.set(t, r))), r;
  }
  cached(e, t, n) {
    const r = Fr(e);
    return this.wNAF(r, this.getPrecomputes(r, e, n), t);
  }
  unsafe(e, t, n, r) {
    const i = Fr(e);
    return i === 1 ? this._unsafeLadder(e, t, r) : this.wNAFUnsafe(i, this.getPrecomputes(i, e, n), t, r);
  }
  // We calculate precomputes for elliptic curve point multiplication
  // using windowed method. This specifies window size and
  // stores precomputed values. Usually only base point would be precomputed.
  createCache(e, t) {
    Kd(t, this.bits), Yd.set(e, t), Pr.delete(e);
  }
  hasCache(e) {
    return Fr(e) !== 1;
  }
}
function Pa(s, e, t) {
  if (e) {
    if (e.ORDER !== s)
      throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    return B0(e), e;
  } else
    return ro(s, { isLE: t });
}
function R0(s, e, t = {}, n) {
  if (n === void 0 && (n = s === "edwards"), !e || typeof e != "object")
    throw new Error(`expected valid ${s} CURVE object`);
  for (const d of ["p", "n", "h"]) {
    const c = e[d];
    if (!(typeof c == "bigint" && c > Xn))
      throw new Error(`CURVE.${d} must be positive bigint`);
  }
  const r = Pa(e.p, t.Fp, n), i = Pa(e.n, t.Fn, n), a = ["Gx", "Gy", "a", "d"];
  for (const d of a)
    if (!r.isValid(e[d]))
      throw new Error(`CURVE.${d} must be valid field element of CURVE.Fp`);
  return e = Object.freeze(Object.assign({}, e)), { CURVE: e, Fp: r, Fn: i };
}
function Xd(s, e) {
  return function(n) {
    const r = s(n);
    return { secretKey: r, publicKey: e(r) };
  };
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xt = /* @__PURE__ */ BigInt(0), be = /* @__PURE__ */ BigInt(1), Lr = /* @__PURE__ */ BigInt(2), P0 = /* @__PURE__ */ BigInt(8);
function F0(s, e, t, n) {
  const r = s.sqr(t), i = s.sqr(n), o = s.add(s.mul(e.a, r), i), a = s.add(s.ONE, s.mul(e.d, s.mul(r, i)));
  return s.eql(o, a);
}
function L0(s, e = {}) {
  const t = e, n = R0("edwards", s, t, t.FpFnLE), { Fp: r, Fn: i } = n;
  let o = n.CURVE;
  const { h: a } = o;
  or(t, {}, { uvRatio: "function" });
  const d = Lr << BigInt(i.BYTES * 8) - be, c = (y) => r.create(y), l = t.uvRatio === void 0 ? (y, p) => {
    try {
      return { isValid: !0, value: r.sqrt(r.div(y, p)) };
    } catch {
      return { isValid: !1, value: xt };
    }
  } : t.uvRatio;
  if (!F0(r, o, o.Gx, o.Gy))
    throw new Error("bad curve params: generator point");
  function u(y, p, b = !1) {
    const g = b ? be : xt;
    return Yn("coordinate " + y, p, g, d), p;
  }
  function h(y) {
    if (!(y instanceof f))
      throw new Error("EdwardsPoint expected");
  }
  class f {
    // base / generator point
    static BASE = new f(o.Gx, o.Gy, be, c(o.Gx * o.Gy));
    // zero / infinity / identity point
    static ZERO = new f(xt, be, be, xt);
    // 0, 1, 1, 0
    // math field
    static Fp = r;
    // scalar field
    static Fn = i;
    X;
    Y;
    Z;
    T;
    constructor(p, b, g, k) {
      this.X = u("x", p), this.Y = u("y", b), this.Z = u("z", g, !0), this.T = u("t", k), Object.freeze(this);
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
      const { x: b, y: g } = p || {};
      return u("x", b), u("y", g), new f(b, g, be, c(b * g));
    }
    // Uses algo from RFC8032 5.1.3.
    static fromBytes(p, b = !1) {
      const g = r.BYTES, { a: k, d: U } = o;
      p = Js(Se(p, g, "point")), Kn(b, "zip215");
      const q = Js(p), G = p[g - 1];
      q[g - 1] = G & -129;
      const L = es(q), j = b ? d : r.ORDER;
      Yn("point.y", L, xt, j);
      const $ = c(L * L), te = c($ - be), K = c(U * $ - k);
      let { isValid: _, value: I } = l(te, K);
      if (!_)
        throw new Error("bad point: invalid y coordinate");
      const A = (I & be) === be, P = (G & 128) !== 0;
      if (!b && I === xt && P)
        throw new Error("bad point: x=0 and x_0=1");
      return P !== A && (I = c(-I)), f.fromAffine({ x: I, y: L });
    }
    static fromHex(p, b = !1) {
      return f.fromBytes(m0(p), b);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    precompute(p = 8, b = !0) {
      return m.createCache(this, p), b || this.multiply(Lr), this;
    }
    // Useful in fromAffine() - not for fromBytes(), which always created valid points.
    assertValidity() {
      const p = this, { a: b, d: g } = o;
      if (p.is0())
        throw new Error("bad point: ZERO");
      const { X: k, Y: U, Z: q, T: G } = p, L = c(k * k), j = c(U * U), $ = c(q * q), te = c($ * $), K = c(L * b), _ = c($ * c(K + j)), I = c(te + c(g * c(L * j)));
      if (_ !== I)
        throw new Error("bad point: equation left != right (1)");
      const A = c(k * U), P = c(q * G);
      if (A !== P)
        throw new Error("bad point: equation left != right (2)");
    }
    // Compare one point to another.
    equals(p) {
      h(p);
      const { X: b, Y: g, Z: k } = this, { X: U, Y: q, Z: G } = p, L = c(b * G), j = c(U * k), $ = c(g * G), te = c(q * k);
      return L === j && $ === te;
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
      const { a: p } = o, { X: b, Y: g, Z: k } = this, U = c(b * b), q = c(g * g), G = c(Lr * c(k * k)), L = c(p * U), j = b + g, $ = c(c(j * j) - U - q), te = L + q, K = te - G, _ = L - q, I = c($ * K), A = c(te * _), P = c($ * _), B = c(K * te);
      return new f(I, A, B, P);
    }
    // Fast algo for adding 2 Extended Points.
    // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
    // Cost: 9M + 1*a + 1*d + 7add.
    add(p) {
      h(p);
      const { a: b, d: g } = o, { X: k, Y: U, Z: q, T: G } = this, { X: L, Y: j, Z: $, T: te } = p, K = c(k * L), _ = c(U * j), I = c(G * g * te), A = c(q * $), P = c((k + U) * (L + j) - K - _), B = A - I, W = A + I, ee = c(_ - b * K), de = c(P * B), xe = c(W * ee), Be = c(P * ee), Me = c(B * W);
      return new f(de, xe, Me, Be);
    }
    subtract(p) {
      return h(p), this.add(p.negate());
    }
    // Constant-time multiplication.
    multiply(p) {
      if (!i.isValidNot0(p))
        throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
      const { p: b, f: g } = m.cached(this, p, (k) => Or(f, k));
      return Or(f, [b, g])[0];
    }
    // Non-constant-time multiplication. Uses double-and-add algorithm.
    // It's faster, but should only be used when you don't care about
    // an exposed private key e.g. sig verification.
    // Keeps the same subgroup-scalar contract: 0 is allowed for public-scalar callers, but
    // n and larger values are rejected instead of being reduced mod n to the identity point.
    multiplyUnsafe(p) {
      if (!i.isValid(p))
        throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
      return p === xt ? f.ZERO : this.is0() || p === be ? this : m.unsafe(this, p, (b) => Or(f, b));
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
      const b = this;
      let g = p;
      const { X: k, Y: U, Z: q } = b, G = b.is0();
      g == null && (g = G ? P0 : r.inv(q));
      const L = c(k * g), j = c(U * g), $ = r.mul(q, g);
      if (G)
        return { x: xt, y: be };
      if ($ !== be)
        throw new Error("invZ was invalid");
      return { x: L, y: j };
    }
    clearCofactor() {
      return a === be ? this : this.multiplyUnsafe(a);
    }
    toBytes() {
      const { x: p, y: b } = this.toAffine(), g = r.toBytes(b);
      return g[g.length - 1] |= p & be ? 128 : 0, g;
    }
    toHex() {
      return Fd(this.toBytes());
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const m = new O0(f, i.BITS);
  return i.BITS >= 8 && f.BASE.precompute(8), Object.freeze(f.prototype), Object.freeze(f), f;
}
class U0 {
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
    Ca();
  }
  static fromHex(e) {
    Ca();
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
    return Fd(this.toBytes());
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
function N0(s, e, t = {}) {
  if (typeof e != "function")
    throw new Error('"hash" function param is required');
  const n = e, r = t;
  or(r, {}, {
    adjustScalarBytes: "function",
    randomBytes: "function",
    domain: "function",
    prehash: "function",
    zip215: "boolean",
    mapToCurve: "function"
  });
  const { prehash: i } = r, { BASE: o, Fp: a, Fn: d } = s, c = n.outputLen, l = 2 * a.BYTES;
  if (c !== void 0 && (mi(c, "hash.outputLen"), c !== l))
    throw new Error(`hash.outputLen must be ${l}, got ${c}`);
  const u = r.randomBytes === void 0 ? Ld : r.randomBytes, h = r.adjustScalarBytes === void 0 ? (_) => _ : r.adjustScalarBytes, f = r.domain === void 0 ? (_, I, A) => {
    if (Kn(A, "phflag"), I.length || A)
      throw new Error("Contexts/pre-hash are not supported");
    return _;
  } : r.domain;
  function m(_) {
    return d.create(es(_));
  }
  function y(_) {
    const I = L.secretKey;
    Se(_, L.secretKey, "secretKey");
    const A = Se(n(_), 2 * I, "hashedSecretKey"), P = h(A.slice(0, I)), B = A.slice(I, 2 * I), W = m(P);
    return { head: P, prefix: B, scalar: W };
  }
  function p(_) {
    const { head: I, prefix: A, scalar: P } = y(_), B = o.multiply(P), W = B.toBytes();
    return { head: I, prefix: A, scalar: P, point: B, pointBytes: W };
  }
  function b(_) {
    return p(_).pointBytes;
  }
  function g(_ = Uint8Array.of(), ...I) {
    const A = Ea(...I);
    return m(n(f(A, Se(_, void 0, "context"), !!i)));
  }
  function k(_, I, A = {}) {
    _ = Se(_, void 0, "message"), i && (_ = i(_));
    const { prefix: P, scalar: B, pointBytes: W } = p(I), ee = g(A.context, P, _), de = o.multiply(ee).toBytes(), xe = g(A.context, de, W, _), Be = d.create(ee + xe * B);
    if (!d.isValid(Be))
      throw new Error("sign failed: invalid s");
    const Me = Ea(de, d.toBytes(Be));
    return Se(Me, L.signature, "result");
  }
  const U = {
    zip215: r.zip215
  };
  function q(_, I, A, P = U) {
    const { context: B } = P, W = P.zip215 === void 0 ? !!U.zip215 : P.zip215, ee = L.signature;
    _ = Se(_, ee, "signature"), I = Se(I, void 0, "message"), A = Se(A, L.publicKey, "publicKey"), W !== void 0 && Kn(W, "zip215"), i && (I = i(I));
    const de = ee / 2, xe = _.subarray(0, de), Be = es(_.subarray(de, ee));
    let Me, on, ns;
    try {
      Me = s.fromBytes(A, W), on = s.fromBytes(xe, W), ns = o.multiplyUnsafe(Be);
    } catch {
      return !1;
    }
    if (!W && Me.isSmallOrder())
      return !1;
    const an = g(B, xe, A, I);
    return on.add(Me.multiplyUnsafe(an)).subtract(ns).clearCofactor().is0();
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
  function $(_) {
    return g0(_) && _.length === L.secretKey;
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
    toMontgomery(_) {
      const { y: I } = s.fromBytes(_), A = L.publicKey, P = A === 32;
      if (!P && A !== 57)
        throw new Error("only defined for 25519 and 448");
      const B = P ? a.div(be + I, be - I) : a.div(I - be, I + be);
      return a.toBytes(B);
    },
    toMontgomerySecret(_) {
      const I = L.secretKey;
      Se(_, I);
      const A = n(_.subarray(0, I));
      return h(A).subarray(0, I);
    }
  };
  return Object.freeze(L), Object.freeze(K), Object.freeze({
    keygen: Xd(j, b),
    getPublicKey: b,
    sign: k,
    verify: q,
    utils: K,
    Point: s,
    lengths: L
  });
}
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ls = BigInt(0), as = BigInt(1), yn = BigInt(2);
function D0(s) {
  return or(s, {
    P: "bigint",
    type: "string",
    adjustScalarBytes: "function",
    powPminus2: "function"
  }, {
    randomBytes: "function"
  }), Object.freeze({ ...s });
}
function V0(s) {
  const e = D0(s), { P: t, type: n, adjustScalarBytes: r, powPminus2: i, randomBytes: o } = e, a = n === "x25519";
  if (!a && n !== "x448")
    throw new Error("invalid type");
  const d = o === void 0 ? Ld : o, c = a ? 255 : 448, l = a ? 32 : 56, u = BigInt(a ? 9 : 5), h = BigInt(a ? 121665 : 39081), f = a ? yn ** BigInt(254) : yn ** BigInt(447), m = a ? BigInt(8) * yn ** BigInt(251) - as : BigInt(4) * yn ** BigInt(445) - as, y = f + m + as, p = (A) => fe(A, t), b = g(u);
  function g(A) {
    return Dd(p(A), l);
  }
  function k(A) {
    const P = Js(Se(A, l, "uCoordinate"));
    return a && (P[31] &= 127), p(es(P));
  }
  function U(A) {
    return es(r(Js(Se(A, l, "scalar"))));
  }
  function q(A, P) {
    const B = te(k(P), U(A));
    if (B === Ls)
      throw new Error("invalid private or public key received");
    return g(B);
  }
  function G(A) {
    return q(A, b);
  }
  const L = G, j = q;
  function $(A, P, B) {
    const W = p(A * (P - B));
    return P = p(P - W), B = p(B + W), { x_2: P, x_3: B };
  }
  function te(A, P) {
    Yn("u", A, Ls, t), Yn("scalar", P, f, y);
    const B = P, W = A;
    let ee = as, de = Ls, xe = A, Be = as, Me = Ls;
    for (let ns = BigInt(c - 1); ns >= Ls; ns--) {
      const an = B >> ns & as;
      Me ^= an, { x_2: ee, x_3: xe } = $(Me, ee, xe), { x_2: de, x_3: Be } = $(Me, de, Be), Me = an;
      const cn = ee + de, dn = p(cn * cn), ar = ee - de, co = p(ar * ar), lo = dn - co, ul = xe + Be, hl = xe - Be, uo = p(hl * cn), ho = p(ul * ar), fo = uo + ho, po = uo - ho;
      xe = p(fo * fo), Be = p(W * p(po * po)), ee = p(dn * co), de = p(lo * (dn + p(h * lo)));
    }
    ({ x_2: ee, x_3: xe } = $(Me, ee, xe)), { x_2: de, x_3: Be } = $(Me, de, Be);
    const on = i(de);
    return p(ee * on);
  }
  const K = {
    secretKey: l,
    publicKey: l,
    seed: l
  }, _ = (A) => (A = A === void 0 ? d(l) : A, Se(A, K.seed, "seed"), A), I = { randomSecretKey: _ };
  return Object.freeze(K), Object.freeze(I), Object.freeze({
    keygen: Xd(_, L),
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
const $0 = /* @__PURE__ */ BigInt(0), Ws = /* @__PURE__ */ BigInt(1), Fa = /* @__PURE__ */ BigInt(2), z0 = /* @__PURE__ */ BigInt(3), H0 = /* @__PURE__ */ BigInt(5), j0 = /* @__PURE__ */ BigInt(8), Es = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"), Qd = {
  p: Es,
  n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
  h: j0,
  a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
  d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
  Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
  Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
};
function Jd(s) {
  const e = BigInt(10), t = BigInt(20), n = BigInt(40), r = BigInt(80), i = Es, a = s * s % i * s % i, d = Ue(a, Fa, i) * a % i, c = Ue(d, Ws, i) * s % i, l = Ue(c, H0, i) * c % i, u = Ue(l, e, i) * l % i, h = Ue(u, t, i) * u % i, f = Ue(h, n, i) * h % i, m = Ue(f, r, i) * f % i, y = Ue(m, r, i) * f % i, p = Ue(y, e, i) * l % i;
  return { pow_p_5_8: Ue(p, Fa, i) * s % i, b2: a };
}
function el(s) {
  return s[0] &= 248, s[31] &= 127, s[31] |= 64, s;
}
const yi = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function tl(s, e) {
  const t = Es, n = fe(e * e * e, t), r = fe(n * n * e, t), i = Jd(s * r).pow_p_5_8;
  let o = fe(s * n * i, t);
  const a = fe(e * o * o, t), d = o, c = fe(o * yi, t), l = a === s, u = a === fe(-s, t), h = a === fe(-s * yi, t);
  return l && (o = d), (u || h) && (o = c), Vt(o, t) && (o = fe(-o, t)), { isValid: l || u, value: o };
}
const qt = /* @__PURE__ */ L0(Qd, { uvRatio: tl }), $t = qt.Fp, q0 = qt.Fn;
function W0(s) {
  return N0(qt, p0, Object.assign({ adjustScalarBytes: el, zip215: !0 }, s));
}
const Ms = /* @__PURE__ */ W0({}), io = /* @__PURE__ */ (() => {
  const s = Es;
  return V0({
    P: s,
    type: "x25519",
    powPminus2: (e) => {
      const { pow_p_5_8: t, b2: n } = Jd(e);
      return fe(Ue(t, z0, s) * n, s);
    },
    adjustScalarBytes: el
  });
})(), La = yi, G0 = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"), Ua = (s) => tl(Ws, s), Z0 = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), K0 = (s) => $t.create(es(s) & Z0);
class Oe extends U0 {
  // Do NOT change syntax: the following gymnastics is done,
  // because typescript strips comments, which makes bundlers disable tree-shaking.
  // prettier-ignore
  static BASE = new Oe(qt.BASE);
  // prettier-ignore
  static ZERO = new Oe(qt.ZERO);
  // prettier-ignore
  static Fp = $t;
  // prettier-ignore
  static Fn = q0;
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
    Ce(e, 32);
    const { a: t, d: n } = Qd, r = Es, i = (U) => $t.create(U), o = K0(e);
    if (!b0($t.toBytes(o), e) || Vt(o, r))
      throw new Error("invalid ristretto255 encoding 1");
    const a = i(o * o), d = i(Ws + t * a), c = i(Ws - t * a), l = i(d * d), u = i(c * c), h = i(t * n * l - u), { isValid: f, value: m } = Ua(i(h * u)), y = i(m * c), p = i(m * y * h);
    let b = i((o + o) * y);
    Vt(b, r) && (b = i(-b));
    const g = i(d * p), k = i(b * g);
    if (!f || Vt(k, r) || g === $0)
      throw new Error("invalid ristretto255 encoding 2");
    return new Oe(new qt(b, g, Ws, k));
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
    let { X: e, Y: t, Z: n, T: r } = this.ep;
    const i = Es, o = (p) => $t.create(p), a = o(o(n + t) * o(n - t)), d = o(e * t), c = o(d * d), { value: l } = Ua(o(a * c)), u = o(l * a), h = o(l * d), f = o(u * h * r);
    let m;
    if (Vt(r * f, i)) {
      let p = o(t * La), b = o(e * La);
      e = p, t = b, m = o(u * G0);
    } else
      m = h;
    Vt(e * f, i) && (t = o(-t));
    let y = o((n - t) * m);
    return Vt(y, i) && (y = o(-y)), $t.toBytes(y);
  }
  /**
   * Compares two Ristretto points.
   * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
   */
  equals(e) {
    this.assertSame(e);
    const { X: t, Y: n } = this.ep, { X: r, Y: i } = e.ep, o = (c) => $t.create(c), a = o(t * i) === o(n * r), d = o(n * i) === o(t * r);
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
class Na {
  oHash;
  iHash;
  blockLen;
  outputLen;
  canXOF = !1;
  finished = !1;
  destroyed = !1;
  constructor(e, t) {
    if (Bi(e), Ce(t, void 0, "key"), this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const n = this.blockLen, r = new Uint8Array(n);
    r.set(t.length > n ? e.create().update(t).digest() : t);
    for (let i = 0; i < r.length; i++)
      r[i] ^= 54;
    this.iHash.update(r), this.oHash = e.create();
    for (let i = 0; i < r.length; i++)
      r[i] ^= 106;
    this.oHash.update(r), Je(r);
  }
  update(e) {
    return bs(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    bs(this), Mi(e, this), this.finished = !0;
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
const sl = /* @__PURE__ */ (() => {
  const s = ((e, t, n) => new Na(e, t).update(n).digest());
  return s.create = (e, t) => new Na(e, t), s;
})();
function Y0(s, e, t) {
  return Bi(s), t === void 0 && (t = new Uint8Array(s.outputLen)), sl(s, t, e);
}
const Ur = /* @__PURE__ */ Uint8Array.of(0), Da = /* @__PURE__ */ Uint8Array.of();
function X0(s, e, t, n = 32) {
  Bi(s), ft(n, "length"), Ce(e, void 0, "prk");
  const r = s.outputLen;
  if (e.length < r)
    throw new Error('"prk" must be at least HashLen octets');
  if (n > 255 * r)
    throw new Error("Length must be <= 255*HashLen");
  const i = Math.ceil(n / r);
  t === void 0 ? t = Da : Ce(t, void 0, "info");
  const o = new Uint8Array(i * r), a = sl.create(s, e), d = a._cloneInto(), c = new Uint8Array(a.outputLen);
  for (let l = 0; l < i; l++)
    Ur[0] = l + 1, d.update(l === 0 ? Da : c).update(t).update(Ur).digestInto(c), o.set(c, r * l), a._cloneInto(d);
  return a.destroy(), d.destroy(), Je(c, Ur), o.slice(0, n);
}
const Q0 = (s, e, t, n, r) => X0(s, Y0(s, e, t), n, r), nl = J("swarm.seal"), wn = new TextEncoder().encode("spotlight:sdp-seal:v1"), Nr = 5e4;
function J0() {
  const { secretKey: s, publicKey: e } = io.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: Ve(e) };
}
function rl(s, e, t) {
  const n = new Uint8Array(wn.length + e.length + t.length);
  return n.set(wn, 0), n.set(e, wn.length), n.set(t, wn.length + e.length), Q0(f0, s, void 0, n, 32);
}
function il(s, e) {
  const t = io.getSharedSecret(s, e);
  if (t.every((n) => n === 0)) throw new Error("low-order X25519 public key");
  return t;
}
async function ol(s, e) {
  return crypto.subtle.importKey("raw", s, "AES-GCM", !1, [e]);
}
async function wi(s, e) {
  const t = new TextEncoder().encode(e);
  if (t.length === 0 || t.length > Nr)
    throw nl.error("sdp seal failed: size out of range", {
      bytes: t.length,
      max: Nr,
      to: ve(s)
    }), new Error(`sdp size ${t.length} outside (0, ${Nr}]`);
  const n = Ie(s), r = io.keygen(), i = rl(
    il(r.secretKey, n),
    r.publicKey,
    n
  ), o = await ol(i, "encrypt"), a = crypto.getRandomValues(new Uint8Array(12)), d = await crypto.subtle.encrypt({ name: "AES-GCM", iv: a }, o, t);
  return {
    epk: Ve(r.publicKey),
    iv: Ve(a),
    ct: Ve(new Uint8Array(d))
  };
}
async function bi(s, e) {
  try {
    const t = Ie(e.epk), n = rl(
      il(s.secretKey, t),
      t,
      s.publicKey
    ), r = await ol(n, "decrypt"), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: Ie(e.iv) },
      r,
      Ie(e.ct)
    );
    return new TextDecoder().decode(i);
  } catch (t) {
    throw nl.warn("sealed sdp did not open", {
      epk: ve(e.epk),
      self: ve(s.publicKeyHex),
      ctBytes: e.ct.length / 2,
      err: t
    }), t;
  }
}
function vi() {
  return { host: 0, srflx: 0, prflx: 0, relay: 0, other: 0, udp: 0, tcp: 0, total: 0 };
}
function Si(s, e, t) {
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
function _i(s) {
  const e = vi();
  if (!s) return e;
  const t = /^a=candidate:\S+ \d+ (\S+) \d+ \S+ \d+ typ (\S+)/gm;
  let n;
  for (; (n = t.exec(s)) !== null; )
    Si(e, n[2], n[1]);
  return e;
}
function en(s) {
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
function ew(s) {
  const e = [];
  for (const n of s) {
    const r = Array.isArray(n.urls) ? n.urls : [n.urls];
    for (const i of r) typeof i == "string" && e.push(i);
  }
  const t = (n) => e.filter((r) => r.startsWith(`${n}:`)).length;
  return { stun: t("stun"), turn: t("turn"), turns: t("turns"), urls: e };
}
function tw(s) {
  const e = s;
  return {
    type: s.type ?? sw(s.candidate, "typ"),
    protocol: s.protocol ?? null,
    address: s.address ?? null,
    port: s.port ?? null,
    relatedAddress: s.relatedAddress ?? null,
    url: e.url ?? null
  };
}
function sw(s, e) {
  const t = s.split(" "), n = t.indexOf(e);
  return n >= 0 && n + 1 < t.length ? t[n + 1] : null;
}
function nw(s) {
  const e = s;
  return {
    url: e.url ?? null,
    errorCode: e.errorCode ?? null,
    errorText: e.errorText ?? null,
    address: e.address ?? null,
    port: e.port ?? null
  };
}
function rw(s, e) {
  if (s === null && e === null) return null;
  if (s === "relay" || e === "relay") return "turn";
  const t = (n) => n === "srflx" || n === "prflx";
  return t(s) || t(e) ? "stun" : "direct";
}
function iw(s) {
  const e = /* @__PURE__ */ new Map();
  s.forEach((i) => e.set(i.id, i));
  const t = vi(), n = vi(), r = [];
  for (const i of e.values()) {
    const o = typeof i.candidateType == "string" ? i.candidateType : void 0, a = typeof i.protocol == "string" ? i.protocol : void 0;
    if (i.type === "local-candidate") Si(t, o, a);
    else if (i.type === "remote-candidate") Si(n, o, a);
    else if (i.type === "candidate-pair") {
      const d = typeof i.localCandidateId == "string" ? e.get(i.localCandidateId) : void 0, c = typeof i.remoteCandidateId == "string" ? e.get(i.remoteCandidateId) : void 0;
      r.push({
        state: typeof i.state == "string" ? i.state : "unknown",
        local: Va(d),
        remote: Va(c),
        nominated: i.nominated === !0,
        requestsSent: typeof i.requestsSent == "number" ? i.requestsSent : 0,
        responsesReceived: typeof i.responsesReceived == "number" ? i.responsesReceived : 0
      });
    }
  }
  return { local: en(t), remote: en(n), pairs: r };
}
function Va(s) {
  if (!s) return "?";
  const e = typeof s.candidateType == "string" ? s.candidateType : "?", t = typeof s.protocol == "string" ? s.protocol : "?";
  return `${e}/${t}`;
}
const ae = J("swarm.peer"), $a = new TextEncoder(), ow = 3, aw = Jc / 4;
class xi {
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
  invalidCap = ne(ow);
  /** Result of the last `linkStats()` call that found a selected pair. */
  lastLink = null;
  openedAtMs = null;
  /** Payload bytes moved on both channels, for the `peer closed` record. */
  bytesIn = 0;
  bytesOut = 0;
  constructor(e, t) {
    this.addr = e, this.gatherTimeoutMs = t?.gatherTimeoutMs ?? op, this.connectTimeoutMs = t?.connectTimeoutMs ?? ap;
    const n = t?.iceServers ?? i0(), r = r0() ? "relay" : "all";
    this.pc = new RTCPeerConnection({ iceServers: n, iceTransportPolicy: r }), ae.debug("peer created", {
      peer: v(e),
      policy: r,
      ice: ew(n)
    }), this.pc.onicecandidate = (o) => {
      o.candidate ? ae.debug("local candidate", {
        peer: v(this.addr),
        ...tw(o.candidate)
      }) : ae.debug("local candidates complete", {
        peer: v(this.addr),
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.pc.onicecandidateerror = (o) => {
      ae.warn("ice candidate error", { peer: v(this.addr), ...nw(o) });
    }, this.pc.onicegatheringstatechange = () => {
      ae.debug("ice gathering state", {
        peer: v(this.addr),
        state: this.pc.iceGatheringState,
        elapsedMs: Date.now() - this.createdAtMs
      });
    }, this.ctrl = this.pc.createDataChannel("ctrl", { negotiated: !0, id: 0, ordered: !0 }), this.bulk = this.pc.createDataChannel("bulk", { negotiated: !0, id: 1, ordered: !1 }), this.bulk.binaryType = "arraybuffer", this.bulk.bufferedAmountLowThreshold = aw, this.ctrl.onmessage = (o) => {
      if (typeof o.data != "string") {
        this.reportInvalid("binary-on-ctrl"), this.handlers?.onInvalidCtrl?.("binary-on-ctrl");
        return;
      }
      this.bytesIn += $a.encode(o.data).byteLength;
      const a = Up(o.data);
      a.kind === "ok" ? this.handlers?.onCtrl(a.msg) : a.kind === "invalid" && (this.reportInvalid(a.error), this.handlers?.onInvalidCtrl?.(a.error));
    }, this.bulk.onmessage = (o) => {
      const a = o.data;
      if (!(a instanceof ArrayBuffer)) {
        this.reportInvalid("non-binary-on-bulk"), this.handlers?.onInvalidSlice?.("non-binary-on-bulk");
        return;
      }
      this.bytesIn += a.byteLength;
      const d = Vp(new Uint8Array(a));
      d.kind === "ok" ? this.handlers?.onSlice(d.frame) : (this.reportInvalid(d.error), this.handlers?.onInvalidSlice?.(d.error));
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
    await this.pc.setLocalDescription(e), await za(this.pc, this.gatherTimeoutMs);
    const t = this.pc.localDescription ?? e;
    return this.logLocalSdp("offer", t), t;
  }
  /** Answerer side: consume the offer, return a fully-gathered answer. */
  async acceptOffer(e) {
    if (this.closed) throw new Error(`peer ${this.addr} closed`);
    this.armConnectTimer(), this.logRemoteSdp("offer", e), await this.pc.setRemoteDescription(e);
    const t = await this.pc.createAnswer();
    await this.pc.setLocalDescription(t), await za(this.pc, this.gatherTimeoutMs);
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
    const n = _i(t.sdp), r = {
      peer: v(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      gatherState: this.pc.iceGatheringState,
      ...en(n)
    };
    n.total === 0 ? ae.warn("local sdp has no ice candidates", r) : n.srflx === 0 && n.relay === 0 ? ae.warn("local sdp has host candidates only", r) : ae.info("local sdp candidates", r);
  }
  /** Candidate mix the remote sent us — the other half of the picture. */
  logRemoteSdp(e, t) {
    const n = _i(t.sdp), r = {
      peer: v(this.addr),
      kind: e,
      sdpBytes: t.sdp?.length ?? 0,
      ...en(n)
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
    const n = iw(t);
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
      const t = Lp(e);
      return this.ctrl.send(t), this.bytesOut += $a.encode(t).byteLength, !0;
    } catch {
      return !1;
    }
  }
  sendSlice(e) {
    if (this.bulk.readyState !== "open") return !1;
    try {
      const t = Dp(e);
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
    const i = typeof r.localCandidateId == "string" ? n.get(r.localCandidateId) : void 0, o = typeof r.remoteCandidateId == "string" ? n.get(r.remoteCandidateId) : void 0, a = (u) => typeof u == "string" ? u : null, d = a(i?.candidateType), c = a(o?.candidateType), l = {
      path: rw(d, c),
      candidateType: d,
      remoteCandidateType: c,
      relayProtocol: a(i?.relayProtocol),
      relayUrl: a(i?.url),
      rttMs: typeof r.currentRoundTripTime == "number" ? Math.round(r.currentRoundTripTime * 1e3) : null
    };
    return this.lastLink = l, l;
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
        graceMs: Yo
      }), this.closeReasonValue ??= "disconnected", this.close());
    }, Yo));
  }
  clearDisconnectTimer() {
    this.disconnectTimer && (clearTimeout(this.disconnectTimer), this.disconnectTimer = null);
  }
}
function za(s, e) {
  if (s.iceGatheringState === "complete") return Promise.resolve();
  const t = Date.now();
  return new Promise((n) => {
    const r = () => {
      s.removeEventListener("icegatheringstatechange", i), clearTimeout(o);
      const a = s.iceGatheringState, d = {
        elapsedMs: Date.now() - t,
        state: a,
        timeoutMs: e,
        ...en(_i(s.localDescription?.sdp))
      };
      a === "complete" ? ae.debug("ice gathering done", d) : ae.warn("ice gathering cut by timeout", d), n();
    }, i = () => {
      s.iceGatheringState === "complete" && r();
    };
    s.addEventListener("icegatheringstatechange", i);
    const o = setTimeout(r, e);
  });
}
const we = J("swarm.join"), cw = new TextEncoder();
function Dr(s) {
  return s === void 0 ? 0 : cw.encode(s).length;
}
class dw {
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
      const t = Yp(e, Zp);
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
    const n = (this.opts.createPeer ?? ((d, c) => new xi(d, c)))(e.viewerAddress, this.opts.peerOpts);
    this.pending.set(e.viewerAddress, n);
    const r = Date.now(), i = v(e.viewerAddress);
    let o = "open-offer", a = null;
    try {
      const d = await bi(this.opts.boxKey, e.sealedSdp);
      we.debug("offer opened", { viewer: i, sdpBytes: Dr(d) }), o = "accept-offer";
      const c = await n.acceptOffer({ type: "offer", sdp: d });
      this.throwIfSuperseded(n), we.debug("offer accepted", { viewer: i, sdpBytes: Dr(c.sdp) }), o = "submit-welcome";
      const l = await wi(e.boxPub, c.sdp ?? "");
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
      }, this.board.set(e.viewerAddress, a), we.info("answer on the board", { to: i, sdpBytes: Dr(c.sdp) });
      const u = Date.now();
      await this.publishBoard(), we.debug("board with the answer submitted", { to: i, latencyMs: Date.now() - u }), this.testFailAnsweredJoinsOn && (we.warn("test hook closed the answered join link", { viewer: i }), n.close()), o = "wait-open", await n.waitOpen(), we.info("viewer channels open", { viewer: i, totalMs: Date.now() - r }), this.opts.onPeer(n, e.viewerAddress, e.viewerName);
    } catch (d) {
      this.superseded.has(n) ? we.info("join answer abandoned: a newer join took over", { viewer: i, stage: o }) : o === "open-offer" ? we.error("join answer failed: offer did not open", { viewer: i, err: d }) : we.error("join answer failed", { viewer: i, stage: o, err: d }), n.close();
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
      e - r.at > ed * 1e3 && this.board.delete(n);
    const t = [...this.board.entries()].sort((n, r) => n[1].at - r[1].at);
    for (const [n] of t.splice(0, Math.max(0, t.length - td)))
      this.board.delete(n);
    return t.map(([, n]) => n.answer);
  }
  throwIfSuperseded(e) {
    if (this.superseded.has(e)) throw new Error("superseded by a newer join");
  }
}
const lw = J("swarm.seal"), uw = 5, Ha = ne(uw);
function Mt(s, e, t) {
  const n = `${s}:${e}`;
  return Ha.allow(n) && lw.warn(`${s} verification failed: ${e}`, { ...t, seen: Ha.count(n) }), !1;
}
function hw() {
  const { secretKey: s, publicKey: e } = Ms.keygen();
  return { secretKey: s, publicKey: e, publicKeyHex: Ve(e) };
}
function al(s) {
  return Ve(tr(s, { dkLen: 32 }));
}
function oo(s) {
  const e = new Uint8Array(64), t = new DataView(e.buffer);
  return t.setBigUint64(0, BigInt(s.epoch), !0), t.setUint32(8, s.seq, !0), t.setBigUint64(12, BigInt(s.tsUs), !0), t.setBigUint64(20, BigInt(s.durUs), !0), t.setUint32(28, s.size, !0), e.set(Ie(s.hash), 32), e;
}
function fw(s, e, t) {
  const n = {
    epoch: t,
    seq: e.seq,
    tsUs: e.tsUs,
    durUs: e.durUs,
    size: e.payload.length,
    hash: al(e.payload)
  }, r = Ve(Ms.sign(oo(n), s.secretKey));
  return { ...n, sig: r };
}
function pw(s, e) {
  try {
    return Ms.verify(Ie(e.sig), oo(e), Ie(s)) || Mt("chunk meta", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Mt("chunk meta", "malformed key or signature", { seq: e.seq });
  }
}
function mw(s, e, t) {
  try {
    return t.length !== e.size ? Mt("chunk", "wrong size", { seq: e.seq, got: t.length, want: e.size }) : al(t) !== e.hash ? Mt("chunk", "hash mismatch", { seq: e.seq, bytes: t.length }) : Ms.verify(Ie(e.sig), oo(e), Ie(s)) || Mt("chunk", "bad signature", { seq: e.seq, epoch: e.epoch });
  } catch {
    return Mt("chunk", "malformed key or signature", { seq: e.seq });
  }
}
function cl(s) {
  const e = new Uint8Array(12), t = new DataView(e.buffer);
  return e.set([69, 78, 68, 33], 0), t.setBigUint64(4, BigInt(s), !0), e;
}
function gw(s, e) {
  return Ve(Ms.sign(cl(e), s.secretKey));
}
function yw(s, e, t) {
  try {
    return Ms.verify(Ie(t), cl(e), Ie(s)) || Mt("stream end", "bad signature", { epoch: e });
  } catch {
    return Mt("stream end", "malformed key or signature", { epoch: e });
  }
}
const bn = J("swarm.chunk"), ja = 5, ww = 25;
class bw {
  chunks = /* @__PURE__ */ new Map();
  capacity;
  currentEpoch = null;
  /** Highest seq ever stored this epoch, -1 when empty. */
  maxSeq = -1;
  rejectCap = ne(ja);
  missCap = ne(ja);
  storedSinceRollup = 0;
  evictedSinceRollup = 0;
  constructor(e = ii) {
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
    bn.info("store reset", { epoch: e, from: this.currentEpoch, dropped: this.chunks.size }), this.chunks.clear(), this.currentEpoch = e, this.maxSeq = -1, this.rejectCap.reset(), this.missCap.reset(), this.storedSinceRollup = 0, this.evictedSinceRollup = 0;
  }
  /** One line per reject reason while it is new, then a count only. */
  rejected(e, t) {
    return this.rejectCap.allow(e) && bn.debug(`chunk rejected: ${e}`, { seq: t, epoch: this.currentEpoch, size: this.chunks.size }), !1;
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
    return this.storedSinceRollup++, this.storedSinceRollup >= ww && (bn.debug("chunks stored", {
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
    return !t && this.missCap.allow() && bn.debug("chunk requested but missing", {
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
    return e < 0 ? { base: 0, bitmapHex: "" } : Np(e, this.chunks.keys(), this.capacity);
  }
}
const vw = 2;
class Sw {
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
      o.length < vw || (!r || i > r.epoch) && (r = { epoch: i, voters: o, viaHost: !1 });
    return r;
  }
}
const Qn = J("swarm.gossip"), _w = 50, dl = 3;
class xw {
  /** Map preserves insertion order → oldest entry is first (LRU eviction). */
  seen = /* @__PURE__ */ new Map();
  capacity;
  ttlMs;
  duplicatesSinceRollup = 0;
  evictCap = ne(1);
  constructor(e) {
    this.capacity = e?.capacity ?? tp, this.ttlMs = e?.ttlMs ?? sp;
  }
  /**
   * True exactly once per id within the TTL: the caller should process and
   * re-forward the message. False → duplicate, drop silently.
   */
  firstSight(e, t) {
    const n = this.seen.get(e), r = n !== void 0 && t - n < this.ttlMs;
    if (this.seen.delete(e), this.seen.set(e, t), this.seen.size > this.capacity) {
      const i = this.seen.keys().next().value;
      i !== void 0 && this.seen.delete(i), this.evictCap.allow() && Qn.debug("dedup table at capacity", { capacity: this.capacity });
    }
    return r && (this.duplicatesSinceRollup++, this.duplicatesSinceRollup >= _w && (Qn.debug("flood duplicates dropped", {
      dropped: this.duplicatesSinceRollup,
      tracked: this.seen.size
    }), this.duplicatesSinceRollup = 0)), !r;
  }
  get size() {
    return this.seen.size;
  }
}
class kw {
  peers = /* @__PURE__ */ new Map();
  ttlMs;
  expiryCap = ne(dl);
  constructor(e) {
    this.ttlMs = e?.ttlMs ?? Jf;
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
      e - r.lastSeenMs >= this.ttlMs ? (this.peers.delete(n), this.expiryCap.allow() && Qn.debug("presence expired", {
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
class Tw {
  constructor(e, t, n = 1e3) {
    this.senderCap = e, this.aggregateCap = t, this.windowMs = n;
  }
  perSender = /* @__PURE__ */ new Map();
  aggregate = [];
  capReported = ne(dl);
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
    this.capReported.allow(r) && Qn.warn("flood dropped: over the rate cap", {
      scope: e,
      sender: v(t),
      cap: n,
      windowMs: this.windowMs
    });
  }
}
const pe = J("swarm.book"), Ew = 3, Cw = 0.3, Aw = 0.5, Bw = 0.2, Mw = 1e6, Iw = 0.2;
function cs(s, e) {
  return s + Cw * (e - s);
}
class qa {
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
  poolFullCap = ne(Ew);
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
    this.selfAddr = e, this.minDegree = t?.minDegree ?? Af, this.targetDegree = t?.targetDegree ?? Bf, this.maxDegree = t?.maxDegree ?? Mf, this.strikeLimit = t?.badChunkStrikes ?? ep, this.candidatePoolCap = t?.candidatePoolCap ?? 64, this.hostAddr = t?.hostAddr ?? null;
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
      fulfillEwma: Aw,
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
    t && (t.fulfillEwma = cs(t.fulfillEwma, 1), t.denyEwma = cs(t.denyEwma, 0));
  }
  /** A want to this peer timed out (no first slice / never completed). */
  recordTimeout(e) {
    const t = this.neighbors.get(e);
    t && (t.fulfillEwma = cs(t.fulfillEwma, 0));
  }
  /** The peer denied a want. Cheap and honest — penalized far less than a timeout. */
  recordDeny(e) {
    const t = this.neighbors.get(e);
    t && (t.denyEwma = cs(t.denyEwma, 1));
  }
  /** A completed chunk delivery: `bytes` over `elapsedMs`. */
  recordDelivery(e, t, n) {
    const r = this.neighbors.get(e);
    !r || n <= 0 || (r.throughputBpsEwma = cs(r.throughputBpsEwma, t * 8 * 1e3 / n));
  }
  /** A want to this peer produced its first slice `chunks` chunk-spacings
   *  after it was sent. */
  recordFirstSlice(e, t) {
    const n = this.neighbors.get(e);
    !n || !Number.isFinite(t) || t < 0 || (n.firstSliceChunksEwma = cs(n.firstSliceChunksEwma, t));
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
    const n = Math.min(1, t.throughputBpsEwma / Mw);
    return t.fulfillEwma - 0.25 * t.denyEwma + Bw * n - Iw * Math.min(1, t.firstSliceChunksEwma);
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
    return e.relayOnly || e.lowDegreeReports >= up;
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
      if (this.failedTargets.add(e), this.failedTargets.size >= ci) {
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
    if (this.failedTargets.size < ci || this.neighbors.size !== 1) return !1;
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
  deadPeers(e, t = Qc) {
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
      e - r > Rs && (this.candidates.delete(n), this.candidateSeenAt.delete(n), t++);
    return t > 0 && pe.debug("stale candidates dropped", { expired: t, ttlMs: Rs, pool: this.candidates.size }), t;
  }
  isBanned(e, t) {
    const n = this.bannedUntil.get(e);
    return n === void 0 ? !1 : t < n ? !0 : (this.bannedUntil.delete(e), !1);
  }
  /** Refuse `addr` from the pool for REPLACE_BAN_MS: it was pruned for its
   *  score, or pruned us for ours. Links it opens to us are not blocked. */
  banCandidate(e, t) {
    this.candidates.delete(e), this.candidateSeenAt.delete(e), this.bannedUntil.set(e, t + br), pe.debug("candidate banned", { peer: v(e), banMs: br });
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
    let d = 0;
    for (const [c, l] of this.candidates) {
      if (a.length >= o) break;
      this.candidates.delete(c);
      const u = this.candidateSeenAt.get(c) ?? e;
      if (this.candidateSeenAt.delete(c), e - u > Rs) {
        d++;
        continue;
      }
      a.push(l);
    }
    return d > 0 && pe.debug("stale candidates dropped", { expired: d, ttlMs: Rs }), a.length > 0 && pe.debug("dial targets picked", {
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
    return this.isStarved ? dp : cp;
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
    const n = this.rankedByScore().reverse().filter((r) => !r.isHostLink && e - r.connectedAtMs >= qn).slice(0, t).map((r) => r.addr);
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
    this.replaceHoldUntilMs = Math.max(this.replaceHoldUntilMs, e + Wo);
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
      if (c.isHostLink || c.addr === this.hostAddr || e - c.connectedAtMs < qn) continue;
      const l = this.score(c.addr);
      l >= If && c.denyEwma < qo || l < n && (t = c, n = l);
    }
    if (!t) return null;
    const r = (c) => (this.keptCap.allow(c) && pe.debug("weak neighbor kept", {
      peer: v(t.addr),
      score: n,
      deny: t.denyEwma,
      gate: c,
      kept: this.keptCap.count(c)
    }), null);
    if (this.neighbors.size - 1 < this.minDegree) return r("min-degree");
    if (e < this.replaceHoldUntilMs) return r("cooldown");
    let i = null, o = -1 / 0;
    for (const c of this.neighbors.values()) {
      if (c === t) continue;
      const l = this.score(c.addr);
      l > o && (i = c, o = l);
    }
    if (!i || o < Of)
      return this.keptCap.allow("no-reference") && pe.warn("slow neighbors kept: no healthy reference", {
        worst: v(t.addr),
        worstScore: n,
        bestScore: i ? o : null,
        degree: this.neighbors.size,
        kept: this.keptCap.count("no-reference")
      }), null;
    let a = null;
    for (const [c, l] of this.candidates) {
      const u = this.candidateSeenAt.get(c) ?? e;
      if (e - u > Rs) {
        this.candidates.delete(c), this.candidateSeenAt.delete(c);
        continue;
      }
      if (l.boxPub) {
        a = l;
        break;
      }
    }
    if (!a) return r("no-candidate");
    this.candidates.delete(a.addr), this.candidateSeenAt.delete(a.addr), this.replaceHoldUntilMs = e + Wo, this.bannedUntil.set(t.addr, e + br);
    const d = t.denyEwma >= qo ? "deny" : "score";
    return pe.warn("replacing weak neighbor", {
      peer: v(t.addr),
      reason: d,
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
      reason: d,
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
  pexSample(e = zi, t) {
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
const ds = J("swarm.sched"), Ow = 10;
class Rw {
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
  logCap = ne(Ow);
  totals = {
    wantTimeouts: 0,
    progressTimeouts: 0,
    dupPulls: 0,
    deadlineSkips: 0
  };
  constructor(e) {
    this.chunkMs = e?.chunkMs ?? Gt, this.wantTimeoutChunks = e?.wantTimeoutChunks ?? Lf, this.progressTimeoutChunks = e?.progressTimeoutChunks ?? Vf, this.perPeerBudget = e?.maxInflightPerPeer ?? Zf, this.totalBudget = e?.maxInflightTotal ?? Kf, this.duplicateWindowChunks = e?.duplicateWindowChunks ?? Uf, this.skipGraceChunks = e?.skipGraceChunks ?? Nf;
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
    ds.info("scheduler reset", { playhead: this.playhead, edge: this.edge }), this.logCap.reset(), this.playhead = 0, this.playheadDueAtMs = null, this.playheadInitialized = !1, this.chunkDurEwmaMs = null, this.edge = -1, this.inflight.clear(), this.attempted.clear(), this.skipped.clear();
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
    const r = [], i = [...t].sort((a, d) => d.score - a.score), o = this.spacingMs();
    for (const [a, d] of this.inflight) {
      const c = [];
      for (const l of d) {
        const u = e - l.sentAtMs, h = e - (l.lastSliceAtMs ?? l.sentAtMs);
        let f = null;
        if (!l.gotFirstSlice && u >= this.wantTimeoutChunks * o ? (f = "first-slice", this.totals.wantTimeouts++) : l.gotFirstSlice && h >= this.progressTimeoutChunks * o && (f = "progress", this.totals.progressTimeouts++), f === null) {
          c.push(l);
          continue;
        }
        this.markAttempted(a, l.peer), r.push({ type: "cancel", seq: a, peer: l.peer, reason: f }), this.logCap.allow(f) && ds.warn("pull timed out — re-requesting", {
          seq: a,
          peer: v(l.peer),
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
      const d = this.deadlineAt(a, e), c = this.inflight.get(a) ?? [], l = c.length === 0, u = c.length === 1 && this.playheadDueAtMs !== null && d - e < this.duplicateWindowChunks * o;
      if (!l && !u || this.inflightTotal() >= this.totalBudget) continue;
      const h = new Set(c.map((p) => p.peer)), f = this.pickPeer(a, i, h);
      if (!f) {
        l && this.attempted.delete(a);
        continue;
      }
      const m = c[0];
      c.push({ peer: f, sentAtMs: e, gotFirstSlice: !1, lastSliceAtMs: null }), this.inflight.set(a, c);
      const y = Math.max(0, Math.round(d - e));
      u ? (r.push({ type: "want", seq: a, peer: f, deadlineMs: y, duplicate: !0 }), this.totals.dupPulls++, this.logCap.allow("duplicate") && ds.warn("duplicate pull", {
        seq: a,
        peer: v(f),
        firstPeer: v(m.peer),
        remainingMs: Math.round(d - e),
        sinceWantMs: Math.round(e - m.sentAtMs),
        duplicates: this.totals.dupPulls
      })) : r.push({ type: "want", seq: a, peer: f, deadlineMs: y });
    }
    return r.length > 0 && this.logPlan(r), r;
  }
  /** Step 2 of plan(): skip [playhead, nextHeld) once the player has been dry
   *  for the grace and a later chunk is held to hop to. */
  skipDryRun(e, t, n, r) {
    const i = this.playheadDueAtMs, o = this.playhead;
    if (i === null || o > this.edge || t(o) || this.skipped.has(o) || e < i + this.skipGraceChunks * n) return;
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
          r.push({ type: "cancel", seq: c, peer: l.peer, reason: "deadline" }), d.push(v(l.peer));
        this.inflight.delete(c), this.attempted.delete(c), r.push({ type: "skip", seq: c }), this.totals.deadlineSkips++;
      }
    this.logCap.allow("skip") && ds.warn("deadline missed — skipping chunk", {
      seq: o,
      run: [o, a],
      hopTo: a,
      playhead: o,
      edge: this.edge,
      peers: d,
      lateMs: Math.round(e - i),
      remainingMs: Math.round(i - e),
      skipped: this.totals.deadlineSkips
    });
  }
  /** One tick summary instead of a line per action. */
  logPlan(e) {
    if (!ds.on("debug")) return;
    let t = 0, n = 0, r = 0;
    for (const i of e)
      i.type === "want" ? t++ : i.type === "cancel" ? n++ : r++;
    ds.debug("plan", {
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
const Pw = 0.9;
function Fw(s, e) {
  let t = 0, n = 0, r = 0, i = 0, o = 0;
  for (const c of s) {
    if (c.samples < e.windowSamples) continue;
    o = Math.max(o, c.max);
    const l = c.last.sent - c.first.sent, u = c.last.buffered - c.first.buffered;
    l === 0 && u === 0 || (t++, r += Math.max(0, l - u), c.min >= e.backlogBytes && (n++, i += c.min));
  }
  const a = n >= Math.max(2, Math.ceil(t / 2)), d = e.windowMs > 0 ? r * 8 * 1e3 / e.windowMs : 0;
  return {
    samples: e.windowSamples,
    active: t,
    backedUp: n,
    majority: a,
    drainedBytes: r,
    settledBytes: i,
    measuredBps: d,
    maxBuffered: o
  };
}
const Wa = (s, e, t) => Math.min(t, Math.max(e, s));
function Lw(s, e, t) {
  const { floorBps: n, ceilingBps: r } = t, i = [];
  let o = Wa(s.budgetBps, n, r);
  const a = s.settledPrev !== null && e.settledBytes < Pw * s.settledPrev, d = s.starvedRun > 0;
  if (e.majority) {
    if (e.samples >= Yc && !a) {
      const u = Wa(Math.min(o, qf * e.measuredBps), n, r);
      u < o && (o = u, d && u <= n || i.push("cut"));
    }
  } else e.samples >= 1 && o < r && (o = Math.min(r, Wf * o), o >= r && i.push("restored"));
  let { starvedRun: c, starved: l } = s;
  return e.majority ? (c = o <= n ? c + 1 : 0, !l && c >= Gf && (l = !0, i.push("starved"))) : (c = 0, l && (l = !1, i.push("recovered"))), {
    state: { budgetBps: o, settledPrev: e.settledBytes, starvedRun: c, starved: l },
    events: i
  };
}
const rt = J("swarm.serve"), Uw = 5, Nw = 6e4, Dw = 0.2, Vw = 10, Ga = ht, Vr = () => Object.fromEntries(nd.options.map((s) => [s, 0]));
class Jn {
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
  denyCap = ne(Uw);
  dangerCap = ne(Vw);
  ceilingCap = ne(1);
  queuedSinceRollup = 0;
  servedSinceRollup = 0;
  bytesSinceRollup = 0;
  hostOnlySinceRollup = 0;
  deniedSinceRollup = Vr();
  rollupStartMs = null;
  deniedTotal = Vr();
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
    this.ceilingBps = e?.uploadBudgetBps ?? Ff, this.budgetBps = this.ceilingBps, this.budgetState = { budgetBps: this.budgetBps, settledPrev: null, starvedRun: 0, starved: !1 }, this.maxQueueDepth = e?.maxQueueDepth ?? 32, this.fanoutCap = e?.fanoutCap === void 0 ? null : e.fanoutCap, this.chunkMs = e?.chunkMs ?? Gt, this.tokens = this.budgetBps / 8;
  }
  static host(e) {
    return new Jn({ ...e, fanoutCap: Rf });
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
    if (this.tokens < Ga) return this.deny("budget", e, t);
    const o = this.fanoutCap !== null && (this.servedCount.get(t) ?? 0) >= this.fanoutCap, a = i?.hostOnly === "carried" && !this.carriedServed.get(t)?.has(e);
    if (o && i?.hostOnly === "refused") return this.deny("fanout", e, t, "host-full");
    if (o && !a) {
      if (!(n < Hf * this.chunkMs && i?.othersHave === !1) || this.dangerUsed.has(t))
        return this.deny("fanout", e, t);
      this.dangerUsed.add(t), this.dangerServes++, this.dangerCap.allow() && rt.info("fanout cap overridden: requester in its danger zone", {
        peer: v(e),
        seq: t,
        deadlineMs: n,
        dangerServes: this.dangerServes
      });
    }
    this.queue = this.queue.filter((c) => !(c.peer === e && c.seq === t));
    const d = { peer: e, seq: t, deadlineAtMs: r + n, enqueuedAtMs: r };
    return a && (d.carried = !0, d.overCap = o), this.queue.push(d), this.queuedSinceRollup++, { kind: "queued" };
  }
  countDeny(e) {
    this.deniedTotal[e]++, this.deniedSinceRollup[e]++;
  }
  /** One line per deny reason while it is new, then a count only. */
  deny(e, t, n, r) {
    return this.countDeny(e), this.denyCap.allow(e) && rt.debug(`want denied: ${e}`, {
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
    return t - e.enqueuedAtMs >= $f * this.chunkMs ? (this.countDeny("busy"), "deny") : (this.queue.push(e), "held");
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
    if (this.refill(e), this.tokens < Ga) return null;
    const t = zf * this.chunkMs;
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
    const n = Dw;
    this.chunkBytesEwma = this.chunkBytesEwma === null ? e : (1 - n) * this.chunkBytesEwma + n * e, this.chunkMsEwma = this.chunkMsEwma === null ? t : (1 - n) * this.chunkMsEwma + n * t;
  }
  /** Chunk duration from the stream EWMAs: paces the stream rate and the
   *  budget window. Kept apart from `chunkMs` (the scheduler's spacing, which
   *  the danger zone, expiry grace and hold limit use): that one restarts on
   *  an epoch reset, and these EWMAs carry over it. */
  get streamChunkMs() {
    return this.chunkMsEwma ?? Gt;
  }
  get chunkBytes() {
    return this.chunkBytesEwma ?? (Zc + Kc) * Gt / 8e3;
  }
  get streamBps() {
    return this.chunkBytes * 8 * 1e3 / this.streamChunkMs;
  }
  get floorBps() {
    return Math.min(this.ceilingBps, vr * this.streamBps);
  }
  get windowMs() {
    return Math.max(this.streamChunkMs, Yc * ai);
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
    const n = Fw(this.linkWindows.values(), {
      windowSamples: this.windowSamples,
      backlogBytes: jf * this.chunkBytes,
      windowMs: e
    });
    this.linkWindows = /* @__PURE__ */ new Map(), this.measuredBps = n.measuredBps, this.backedUpLinks = n.backedUp, this.maxBufferedBytes = n.maxBuffered;
    const r = this.streamBps, i = this.floorBps;
    this.ceilingBps < vr * r && this.ceilingCap.allow() && rt.warn("upload ceiling below one full-rate copy", {
      ceilingBps: this.ceilingBps,
      floorBps: Math.round(vr * r),
      streamBps: Math.round(r)
    });
    const o = this.budgetBps, { state: a, events: d } = Lw(this.budgetState, n, {
      floorBps: i,
      ceilingBps: this.ceilingBps
    });
    this.budgetState = a, a.budgetBps !== o && (this.refill(t), this.budgetBps = a.budgetBps, this.tokens = Math.min(this.tokens, this.budgetBps / 8));
    for (const c of d)
      switch (c) {
        case "cut":
          this.cuts++, this.limitedSinceMs ??= t, rt.info("upload budget cut", {
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
          rt.info("upload budget restored", {
            budgetBps: Math.round(this.budgetBps),
            limitedMs: this.limitedSinceMs === null ? null : t - this.limitedSinceMs
          }), this.limitedSinceMs = null;
          break;
        case "starved":
          this.starvedSinceMs = t, rt.warn("upload starved", {
            budgetBps: Math.round(this.budgetBps),
            measuredBps: Math.round(n.measuredBps),
            streamBps: Math.round(r),
            backedUp: n.backedUp
          });
          break;
        case "recovered":
          rt.info("upload recovered", {
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
    if (t < Nw) return null;
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
    return i && rt.debug("chunks served", { ...i }), this.clearRollup(), this.rollupStartMs = e, i;
  }
  clearRollup() {
    this.queuedSinceRollup = 0, this.servedSinceRollup = 0, this.bytesSinceRollup = 0, this.hostOnlySinceRollup = 0, this.deniedSinceRollup = Vr();
  }
  /** Epoch change / go-live reset. The link did not change, so the budget,
   *  the stream EWMAs and the deny/cut totals carry over. */
  reset() {
    rt.info("serve queue reset", { depth: this.queue.length }), this.queue = [], this.servedCount.clear(), this.carriedServed.clear(), this.lastServedAt.clear(), this.dangerUsed.clear(), this.denyCap.reset(), this.dangerCap.reset(), this.clearRollup(), this.rollupStartMs = null, this.windowStartMs = null, this.windowSamples = 0, this.linkWindows = /* @__PURE__ */ new Map();
  }
  get depth() {
    return this.queue.length;
  }
  timesServed(e) {
    return this.servedCount.get(e) ?? 0;
  }
}
const V = J("swarm.node"), $w = 6e4, Za = 5;
class zw {
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
  lagChunksValue = Cf;
  callbacks;
  now;
  /** Fed by noteEdge: one observation per edge advance. */
  edgeCadence;
  book;
  store;
  scheduler;
  serve;
  dedup = new xw();
  presence = new kw();
  reactionLimiter = new Tw(
    rp,
    ip
  );
  assembler = new zp();
  /** The last CHAT_BACKLOG_LINES chat lines of this epoch, for new neighbors. */
  chatLog = [];
  /** Which epoch the neighbors' hellos say is current (assessment gap 13). */
  epochVotes = new Sw();
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
  dialCap = ne(Za);
  sigCap = ne(20);
  expiryCap = ne(Za);
  /** Held-serve denies repeat while a requester's link stays congested. */
  heldCap = ne(10);
  /** Host-only peers already logged as carried (one line each). */
  carriedLogged = /* @__PURE__ */ new Set();
  /** A refused host-only viewer re-wants every chunk. */
  refusedCap = ne(5);
  constructor(e) {
    if (this.selfAddr = e.selfAddr, this.selfName = e.selfName, this.role = e.role, this.epoch = e.epoch, this.streamPubKeyHex = e.streamPubKeyHex, this.boxKey = e.boxKey, this.streamKey = e.streamKey ?? null, this.chunkMs = e.chunkMs ?? Gt, this.isResponder = e.responder ?? !1, this.callbacks = e.callbacks ?? {}, this.now = e.now ?? (() => Date.now()), e.role === "host" && !e.streamKey)
      throw new Error("host SwarmNode needs the stream signing key");
    this.book = e.role === "host" ? new qa(e.selfAddr, { minDegree: 0, targetDegree: 0, maxDegree: Go }) : new qa(e.selfAddr, { hostAddr: e.hostAddr }), this.store = new bw(ii), this.store.reset(this.epoch), this.scheduler = new Rw({
      chunkMs: this.chunkMs,
      wantTimeoutChunks: e.wantTimeoutChunks
    }), this.edgeCadence = new Md(this.chunkMs);
    const t = e.fanoutCap !== void 0 ? e.fanoutCap : e.role === "host" ? void 0 : null;
    this.serve = t === void 0 ? Jn.host({ uploadBudgetBps: e.uploadBudgetBps, chunkMs: this.chunkMs }) : new Jn({
      uploadBudgetBps: e.uploadBudgetBps,
      fanoutCap: t,
      chunkMs: this.chunkMs
    });
  }
  // ── Lifecycle ──────────────────────────────────────────────────────────────
  start() {
    if (this.running) return;
    this.running = !0, V.info("node started", {
      self: v(this.selfAddr),
      role: this.role,
      epoch: this.epoch,
      tickMs: ai
    });
    const e = this.now();
    this.lastSummaryAt = e, this.lastPresenceAt = e, this.lastPexAt = e, this.lastLinkSummaryAt = e, this.tickTimer = setInterval(() => this.tick(), ai);
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
      e?.silent || t.sendCtrl({ v: me, t: "bye" }), t.close();
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
    const r = this.epochVotes.decide(this.epoch);
    if (r) {
      if (r.viaHost) {
        this.resetEpoch(r.epoch), this.callbacks.onEpochReset?.(r.epoch);
        return;
      }
      r.epoch <= this.suspectedEpoch || (this.suspectedEpoch = r.epoch, V.info("neighbors agree on a newer epoch — asking for the heartbeat", {
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
    V.debug("peer attached", {
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
    }), V.debug("hello sent", {
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
    n && (V.info("link dropped", {
      peer: v(e),
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
      const r = e.payload.slice();
      for (let i = 4; i < Math.min(8, r.length); i++) r[i] ^= 255;
      t = { ...e, payload: r }, V.warn("test hook poisoned a seeded chunk", { seq: e.seq });
    }
    const n = fw(this.streamKey, t, this.epoch);
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
    V.debug("flood tx", { type: e.t, neighbors: this.peers.size }), this.dedup.firstSight(wt(e), this.now()), e.t === "chat" && this.logChat(e), this.forwardFlood(e, null);
  }
  logChat(e) {
    const t = wt(e);
    this.chatLog.some((n) => wt(n) === t) || (this.chatLog.push(e), this.chatLog.length > np && this.chatLog.shift());
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
        r && (r.name = t.name, r.responder = t.responder ?? !1, r.boxPub = t.boxPub ?? r.boxPub), this.book.recordDegreeReport(e.addr, t.degree, t.relayOnly), r && this.role === "viewer" && this.considerEpoch(e.addr, t.epoch, r.isHostLink), this.neighborHaves.set(e.addr, Jo(t.have)), this.noteEdge(t.edgeSeq, n);
        break;
      }
      case "have": {
        this.neighborHaves.get(e.addr)?.add(t.seq), this.noteEdge(Math.max(t.seq, t.edgeSeq), n);
        break;
      }
      case "summary": {
        this.neighborHaves.set(
          e.addr,
          Jo({ base: t.base, bitmapHex: t.bitmapHex })
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
        if (!this.dedup.firstSight(wt(t), n)) break;
        if (V.info("stream end received", { from: v(t.from), epoch: t.epoch }), !yw(this.streamPubKeyHex, t.epoch, t.sig)) {
          this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
          break;
        }
        this.forwardFlood(t, e.addr), this.callbacks.onEnd?.(t.epoch);
        break;
      }
      case "presence": {
        if (!this.dedup.firstSight(wt(t), n)) break;
        V.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), this.presence.touch(t.from, t.name, t.ts, n), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "reaction": {
        if (!this.dedup.firstSight(wt(t), n) || !this.reactionLimiter.allow(t.from, n)) break;
        V.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat":
      case "poll-open":
      case "poll-vote":
      case "poll-tally":
      case "poll-close": {
        if (!this.dedup.firstSight(wt(t), n)) break;
        V.debug("flood rx", { type: t.t, from: v(t.from), via: v(e.addr) }), t.t === "chat" && this.logChat(t), this.forwardFlood(t, e.addr), this.callbacks.onFlood?.(t);
        break;
      }
      case "chat-backlog": {
        if (t.epoch !== this.epoch || !this.dedup.firstSight(wt(t), n)) break;
        const { epoch: r, ...i } = t, o = { ...i, t: "chat" };
        this.logChat(o), this.callbacks.onFlood?.(o);
        break;
      }
      case "bye": {
        this.presence.remove(e.addr), this.removePeer(e.addr);
        break;
      }
      case "prune": {
        V.info("pruned by neighbor", {
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
    for (const [c, l] of this.neighborHaves)
      if (c !== e.addr && l.has(t)) {
        o = !0;
        break;
      }
    const a = this.hostOnlyStatus(e.addr), d = this.serve.request(e.addr, t, n, r, {
      hasChunk: i,
      othersHave: o,
      hostOnly: a
    });
    if (d.kind === "deny") {
      e.sendCtrl({ v: me, t: "deny", seq: t, reason: d.reason, detail: d.detail }), d.detail === "host-full" && this.refusedCap.allow() && V.warn("host-only slots full: requester refused", {
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
    return this.testHostOnlySlotsOverride ?? Math.min(lp, Math.max(0, this.serve.upload.copies - 1));
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
        if (r.bulkBufferedAmount > Jc) {
          t.push(n);
          continue;
        }
        this.serveChunk(r, n, e);
      }
    }
    for (const n of t) {
      if (this.serve.hold(n, e) === "held") continue;
      const r = this.peers.get(n.peer);
      r?.sendCtrl({ v: me, t: "deny", seq: n.seq, reason: "busy" }), this.counters.heldDenies++, this.heldCap.allow() && V.warn("serve held too long — denying", {
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
    o && (i = i.slice(), i[0] ^= 255, o <= 1 ? this.testCorruptServes.delete(t.peer) : this.testCorruptServes.set(t.peer, o - 1), this.testCorruptedServeCount += 1, V.warn("test hook corrupted a served chunk", {
      seq: t.seq,
      peer: v(t.peer)
    })), e.sendCtrl({ v: me, t: "meta", meta: r.meta });
    const a = $p(this.epoch, t.seq, i), d = this.testDelayServes.get(t.peer);
    if (d && a.length > 1)
      d.left <= 1 ? this.testDelayServes.delete(t.peer) : d.left--, this.testDelayedServeCount += 1, V.warn("test hook delayed a served chunk", {
        seq: t.seq,
        peer: v(t.peer),
        delayMs: d.delayMs
      }), e.sendSlice(a[0]), setTimeout(() => {
        if (e.isOpen)
          for (const c of a.slice(1)) e.sendSlice(c);
      }, d.delayMs);
    else
      for (const c of a) e.sendSlice(c);
    this.serve.onServed(t, r.payload.length, n), this.counters.chunksServed++, this.counters.upBytes += r.payload.length;
  }
  // ── Receiving chunks (plan §4, §7.1) ───────────────────────────────────────
  handleMeta(e, t) {
    if (t.epoch !== this.epoch) return;
    if (!this.metas.has(t.seq)) {
      if (!pw(this.streamPubKeyHex, t)) {
        V.warn("chunk meta rejected", { from: v(e.addr), seq: t.seq }), this.counters.badChunks++, this.book.recordBadChunk(e.addr) && this.removePeer(e.addr);
        return;
      }
      this.metas.set(t.seq, t);
    }
    this.noteEdge(t.seq, this.now());
    const n = this.pendingVerify.get(t.seq);
    n && (this.pendingVerify.delete(t.seq), this.finalizeChunk(t.seq, n.payload, n.from));
  }
  handleSlice(e, t) {
    if (t.epochLow !== xn(this.epoch) || this.store.has(t.seq)) return;
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
    if (!mw(this.streamPubKeyHex, r, t)) {
      V.warn("chunk rejected: verification failed", {
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
    if (t.path.length > oi) {
      this.sigCap.allow("hop-cap") && V.debug("sig dropped: hop cap reached", {
        target: v(t.target),
        hops: t.path.length,
        cap: oi
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
    t === 0 || !this.sigCap.allow() || V.debug("sig relayed", {
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
      this.dialCap.allow("no-box-key") && V.warn("mesh dial skipped: candidate has no box key", {
        target: v(t),
        skipped: this.dialCap.count("no-box-key")
      });
      return;
    }
    V.debug("mesh dial started", { target: v(t), degree: this.peers.size });
    const n = new xi(t, { gatherTimeoutMs: Zo });
    this.dials.set(t, { peer: n, atMs: this.now(), outbound: !0 }), this.attachPeer(n);
    try {
      const r = await n.createOffer();
      this.routeSig({
        v: me,
        t: "sig",
        target: t,
        from: this.selfAddr,
        kind: "offer",
        sealed: await wi(e.boxPub, r.sdp ?? ""),
        boxPub: this.boxKey.publicKeyHex,
        path: [this.selfAddr]
      });
    } catch (r) {
      V.warn("mesh dial failed", { target: v(t), err: r }), this.dials.delete(t), n.close();
    }
  }
  async answerMeshOffer(e, t) {
    if (this.testRefuseMeshDialsOn) return;
    if (this.peers.has(e.from)) {
      this.dialCap.allow("offer-from-neighbor") && V.info("mesh offer ignored: still linked to the sender", {
        from: v(e.from),
        ignored: this.dialCap.count("offer-from-neighbor")
      });
      return;
    }
    let n;
    try {
      n = await bi(this.boxKey, e.sealed);
    } catch {
      V.warn("mesh offer dropped: the sealed sdp did not open", {
        from: v(e.from),
        via: v(t)
      });
      return;
    }
    const r = this.dials.get(e.from);
    if (r) {
      if (V.debug("mesh dial glare", {
        from: v(e.from),
        ourOfferWins: this.selfAddr < e.from
      }), this.selfAddr < e.from) return;
      r.peer.close(), this.dials.delete(e.from);
    }
    const i = new xi(e.from, { gatherTimeoutMs: Zo });
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
          sealed: await wi(e.boxPub, o.sdp ?? ""),
          boxPub: this.boxKey.publicKeyHex,
          path: [this.selfAddr]
        },
        t
      );
    } catch (o) {
      V.warn("mesh answer failed", { to: v(e.from), err: o }), this.dials.delete(e.from), i.close();
    }
  }
  async completeMeshDial(e) {
    const t = this.dials.get(e.from);
    if (t)
      try {
        const n = await bi(this.boxKey, e.sealed);
        await t.peer.acceptAnswer({ type: "answer", sdp: n }), t.peer.waitOpen().catch(() => {
          this.running && this.onMeshDialFailed(e.from, t.peer.closeReason);
        }), this.testRefuseMeshDialsOn && (V.warn("test hook refused a mesh dial", { target: v(e.from) }), t.peer.close());
      } catch (n) {
        V.warn("mesh dial completion failed", { from: v(e.from), err: n }), this.dials.delete(e.from), t.peer.close();
      }
  }
  onMeshDialFailed(e, t) {
    this.book.recordDialFailure(e, this.now(), hp * this.scheduler.spacingMs()), V.warn("mesh dial failed after the answer arrived", {
      target: v(e),
      closeReason: t,
      streak: this.book.dialFailStreak,
      limit: ci
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
          const l = o - (d.started ? this.lagChunks + Df : this.lagChunks);
          c = this.scheduler.advancePlayhead(
            Math.max(d.seq, l),
            d.remainingMs === null ? null : e + d.remainingMs,
            a,
            e
          );
        }
        for (const l of c)
          this.counters.skips++, this.assembler.drop(xn(this.epoch), l), this.pendingVerify.delete(l), this.callbacks.onSkip?.(l);
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
              v: me,
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
            this.counters.skips++, this.assembler.drop(xn(this.epoch), d.seq), this.pendingVerify.delete(d.seq), this.callbacks.onSkip?.(d.seq);
            break;
        }
    }
    this.serve.setChunkMs(this.scheduler.spacingMs()), this.pumpServe(), e - this.lastSummaryAt >= Xc && this.sendSummary(e);
    for (const o of this.book.deadPeers(e))
      V.warn("neighbor missed its summaries — dropping", {
        peer: v(o),
        silentMs: e - (this.book.get(o)?.lastSummaryAtMs ?? e),
        limitMs: Qc
      }), this.removePeer(o);
    if (e - this.lastPresenceAt >= Qf && (this.lastPresenceAt = e, this.flood({ ...this.floodFields(), t: "presence", name: this.selfName })), e - this.lastPexAt >= sd) {
      this.lastPexAt = e;
      for (const [o, a] of this.peers)
        a.sendCtrl({
          v: me,
          t: "pex",
          peers: this.book.pexSample(zi, o)
        });
    }
    e - this.lastLinkSummaryAt >= $w && !this.linkSummaryRunning && (this.lastLinkSummaryAt = e, this.logLinkSummary());
    let t = 0;
    for (const o of this.dials.values()) o.outbound && t++;
    const n = this.book.dialTargets(e, t), r = this.book.maxDialsInFlight - t - n.length;
    for (const o of n)
      this.meshDial(o);
    if (this.role === "host")
      for (const o of this.book.hostPruneTargets(
        Go,
        Pf
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
      e - a.atMs > Xo && (this.dialCap.allow("timeout") && V.warn("mesh dial timed out", {
        target: v(o),
        timeoutMs: Xo,
        timedOut: this.dialCap.count("timeout")
      }), this.dials.delete(o), a.peer.close());
    for (const [o, a] of this.pendingVerify)
      e - a.atMs > 3 * this.chunkMs && (this.expiryCap.allow("pending-verify") && V.warn("chunk dropped: its meta never arrived", {
        seq: o,
        from: v(a.from),
        expired: this.expiryCap.count("pending-verify")
      }), this.pendingVerify.delete(o), this.book.recordTimeout(a.from));
    const i = this.store.edgeSeq - 2 * ii;
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
    n && (n.fulfillEwma = t, V.warn("test hook set a neighbor score", { peer: v(e), fulfill: t }));
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
        V.info("links", {
          total: e.length,
          ...t,
          rttMs: { direct: $r(n.direct), stun: $r(n.stun), turn: $r(n.turn) }
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
function $r(s) {
  if (s.length === 0) return null;
  const e = [...s].sort((n, r) => n - r), t = e.length >> 1;
  return e.length % 2 ? e[t] : Math.round((e[t - 1] + e[t]) / 2);
}
const kt = J("swarm.host");
class Hw {
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
    this.epoch = e.epoch, this.codecs = e.codecs, this.chunkMs = e.chunkMs ?? Gt, this.audioContext = e.audioContext, this.key = hw(), this.boxKey = J0(), kt.info("host created", {
      self: v(e.selfAddr),
      epoch: e.epoch,
      streamPubKey: ve(this.key.publicKeyHex),
      boxPub: ve(this.boxKey.publicKeyHex),
      codecs: e.codecs.mimeType
    });
    const t = e.callbacks ?? {};
    this.node = new zw({
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
    }), this.responder = new dw({
      selfAddr: e.selfAddr,
      boxKey: this.boxKey,
      transport: e.transport,
      getEpoch: () => this.node.epoch,
      getEdgeSeq: () => this.node.store.edgeSeq,
      getSeeds: () => this.node.seedSample(Ko),
      onPeer: (n) => this.node.attachPeer(n)
    }), this.pipeline = new Ky({
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
    if (this.started = !0, this.startedAtMs = Date.now(), kt.info("go live started", { epoch: this.epoch, chunkMs: this.chunkMs }), this.audioContext.state === "suspended")
      try {
        await this.audioContext.resume();
      } catch {
      }
    this.node.start(), this.responder.start();
    try {
      await this.pipeline.start();
    } catch (e) {
      throw kt.error("go live failed: the encoder did not start", {
        epoch: this.epoch,
        elapsedMs: Date.now() - this.startedAtMs,
        err: e
      }), this.stopSwarm(), e;
    }
    kt.info("go live ready", { epoch: this.epoch, elapsedMs: Date.now() - this.startedAtMs });
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
    const e = this.node.book.responderSample(Ko).filter((n) => n.boxPub !== null), t = {
      [this.node.selfAddr]: this.boxKey.publicKeyHex
    };
    for (const n of e) t[n.addr] = n.boxPub;
    return e.length !== this.lastResponderCount && (kt.info("responder list changed", {
      responders: e.length,
      was: this.lastResponderCount < 0 ? null : this.lastResponderCount,
      neighbors: this.node.book.size
    }), this.lastResponderCount = e.length), kt.debug("heartbeat mesh", {
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
      this.ended = !0, kt.info("stream ending", {
        epoch: this.epoch,
        liveMs: this.startedAtMs > 0 ? Date.now() - this.startedAtMs : 0,
        neighbors: this.node.book.size
      }), this.node.flood({
        ...this.node.floodFields(),
        t: "end",
        epoch: this.epoch,
        sig: gw(this.key, this.epoch)
      });
      try {
        await this.pipeline.stop();
      } catch (e) {
        kt.error("encoder stop failed — teardown continues", { epoch: this.epoch, err: e });
      }
      this.stopSwarm();
    }
  }
  stopSwarm() {
    this.responder.stop(), this.node.stop();
  }
}
class jw {
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
    this.ctx = new AudioContext({ sampleRate: Tf }), this.destination = this.ctx.createMediaStreamDestination(), this.masterBus = this.ctx.createGain(), this.masterBus.connect(this.destination), e.mic && this.setMicSource(e.mic), e.system && this.setSystemSource(e.system);
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
const Ka = /* @__PURE__ */ new Map();
function Tt(s) {
  const e = Ka.get(s);
  if (e !== void 0) return e;
  if (typeof document > "u") return "";
  const t = getComputedStyle(document.documentElement).getPropertyValue(s).trim();
  return t && Ka.set(s, t), t;
}
const qw = () => ({
  isHidden: () => document.visibilityState === "hidden",
  raf: (s) => requestAnimationFrame(s),
  caf: (s) => cancelAnimationFrame(s),
  startInterval: Id
});
class Ww {
  constructor(e, t, n = {}) {
    this.paint = e, this.periodMs = t, this.deps = { ...qw(), ...n };
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
const zr = J("media.compositor"), Gw = ne(3);
class Zw {
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
    this.width = e.width ?? 1280, this.height = e.height ?? 720, this.fps = e.fps ?? 30, this.pipScale = e.pipScale ?? 0.2, this.pipPadding = e.pipPadding ?? 24, this.pipRadius = e.pipRadius ?? 12, this.paintClock = new Ww(() => this.paint(), 1e3 / this.fps), this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height;
    const t = this.canvas.getContext("2d", { alpha: !1 });
    if (!t) throw new Error("CanvasCompositor: unable to acquire 2d context");
    this.ctx = t, this.screenVideo = Ya(), this.cameraVideo = Ya();
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
      e ? vn(this.screenVideo) : Promise.resolve(),
      t ? vn(this.cameraVideo) : Promise.resolve()
    ]), this.paint(), this.output = this.canvas.captureStream(this.fps), this.paintClock.start(), zr.info("painting started", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    }), this.output;
  }
  /** Replace the camera source. Pass null to clear. */
  setCameraSource(e) {
    this.cameraVideo.srcObject = e, e && vn(this.cameraVideo);
  }
  /** Replace the screen-share source. Pass null to clear. */
  setScreenSource(e) {
    this.screenVideo.srcObject = e, e && vn(this.screenVideo);
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
    this.paintClock.onVisibilityChange() && zr.info("visibility changed", {
      visibility: document.visibilityState,
      paint: this.paintClock.mode,
      fps: this.fps
    });
  };
  paint() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Tt("--bg-surface-main"), e.fillRect(0, 0, t, n);
    const r = this.effectiveScene(this.scene);
    if (this.fadeFromScene != null) {
      const i = performance.now() - this.fadeStart, o = Math.min(1, i / this.fadeMs), a = Yw(o);
      if (o < 1) {
        const d = this.effectiveScene(this.fadeFromScene);
        e.save(), e.globalAlpha = 1 - a, this.paintScene(d), e.restore(), e.save(), e.globalAlpha = a, this.paintScene(r), e.restore();
      } else
        this.fadeFromScene = null, this.paintScene(r);
    } else
      this.paintScene(r);
    for (const i of this.overlays)
      try {
        i.draw({ ctx: e, width: t, height: n });
      } catch (o) {
        Gw.allow(i.id) && zr.warn("overlay draw threw", { overlay: i.id, err: o });
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
    this.cameraVideo.readyState < 2 || Xa(this.ctx, this.cameraVideo, 0, 0, this.width, this.height);
  }
  paintScreenFull() {
    this.screenVideo.readyState < 2 || Kw(this.ctx, this.screenVideo, 0, 0, this.width, this.height);
  }
  paintCameraPip() {
    const { ctx: e, width: t, height: n } = this;
    if (this.cameraVideo.readyState < 2) return;
    const r = Math.round(t * this.pipScale), i = Math.round(r * 9 / 16), o = t - r - this.pipPadding, a = n - i - this.pipPadding;
    e.save(), e.shadowColor = "rgba(0, 0, 0, 0.55)", e.shadowBlur = 18, e.shadowOffsetY = 4, Hr(e, o, a, r, i, this.pipRadius), e.fillStyle = Tt("--bg-surface-main"), e.fill(), e.restore(), e.save(), Hr(e, o, a, r, i, this.pipRadius), e.clip(), Xa(e, this.cameraVideo, o, a, r, i), e.restore(), e.save(), e.strokeStyle = "rgba(255, 255, 255, 0.08)", e.lineWidth = 1, Hr(e, o + 0.5, a + 0.5, r - 1, i - 1, this.pipRadius), e.stroke(), e.restore();
  }
  paintBrb() {
    const { ctx: e, width: t, height: n } = this;
    e.fillStyle = Tt("--bg-surface-main"), e.fillRect(0, 0, t, n), e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = Tt("--fg-primary");
    const r = Math.round(n * 0.12);
    e.font = `600 ${r}px ${Tt("--scale-font-family-accent")}, sans-serif`, e.fillText("Be right back", t / 2, n * 0.42);
    const i = this.brb.subtitle?.trim() || "Back in a moment.";
    e.fillStyle = Tt("--fg-secondary");
    const o = Math.round(n * 0.035);
    e.font = `${o}px ${Tt("--scale-font-family-sans")}, sans-serif`, e.fillText(i, t / 2, n * 0.58);
    const a = performance.now(), d = Math.round(n * 8e-3), c = Math.round(n * 0.03), l = t / 2 - c, u = n * 0.68;
    for (let h = 0; h < 3; h++) {
      const f = (a / 400 + h * 0.33) % 1, m = 0.35 + 0.65 * Math.sin(f * Math.PI);
      e.globalAlpha = m, e.fillStyle = Tt("--fg-secondary"), e.beginPath(), e.arc(l + h * c, u, d, 0, Math.PI * 2), e.fill();
    }
    e.globalAlpha = 1;
  }
}
function Ya() {
  const s = document.createElement("video");
  return s.autoplay = !0, s.playsInline = !0, s.muted = !0, s;
}
async function vn(s) {
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
function Kw(s, e, t, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const d = Math.min(r / o, i / a), c = o * d, l = a * d, u = t + (r - c) / 2, h = n + (i - l) / 2;
  s.drawImage(e, u, h, c, l);
}
function Xa(s, e, t, n, r, i) {
  const o = e.videoWidth, a = e.videoHeight;
  if (!o || !a) return;
  const d = Math.max(r / o, i / a), c = o * d, l = a * d, u = t + (r - c) / 2, h = n + (i - l) / 2;
  s.drawImage(e, u, h, c, l);
}
function Yw(s) {
  return s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2;
}
function Hr(s, e, t, n, r, i) {
  const o = Math.min(i, n / 2, r / 2);
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + n - o, t), s.quadraticCurveTo(e + n, t, e + n, t + o), s.lineTo(e + n, t + r - o), s.quadraticCurveTo(e + n, t + r, e + n - o, t + r), s.lineTo(e + o, t + r), s.quadraticCurveTo(e, t + r, e, t + r - o), s.lineTo(e, t + o), s.quadraticCurveTo(e, t, e + o, t), s.closePath();
}
function Xw() {
  if (typeof window > "u") return !1;
  if (window.__HOST_WEBVIEW_MARK__) return !0;
  try {
    return window !== window.top;
  } catch {
    return !0;
  }
}
const Qw = J("media.permission");
async function Jw(s, e) {
  if (!Xw())
    return { camera: !0, microphone: !0 };
  const t = [];
  s && t.push("camera"), e && t.push("microphone");
  const n = await Dc(...t), r = {
    camera: s ? n.camera === "granted" : !0,
    microphone: e ? n.microphone === "granted" : !0
  };
  return Qw.info("device permissions resolved", { ...r, wantVideo: s, wantAudio: e }), r;
}
const eb = Jw, Wt = J("media.capture");
class ws extends Error {
  camera;
  microphone;
  constructor(e, t) {
    const n = [];
    e || n.push("camera"), t || n.push("microphone"), super(`Host denied access to: ${n.join(", ")}`), this.name = "HostMediaPermissionError", this.camera = e, this.microphone = t;
  }
}
async function ki(s = !0, e = !0) {
  const t = await eb(s, e);
  Wt.info("host permissions resolved", {
    camera: t.camera,
    microphone: t.microphone,
    wantVideo: s,
    wantAudio: e
  });
  const n = s && !t.camera, r = e && !t.microphone;
  if (n || r)
    throw new ws(t.camera, t.microphone);
  try {
    const i = await navigator.mediaDevices.getUserMedia({
      video: s ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : !1,
      audio: e ? { echoCancellation: !0, noiseSuppression: !0, autoGainControl: !0 } : !1
    });
    return tb(), i;
  } catch (i) {
    const o = i;
    if (Wt.error("getUserMedia failed", { name: o.name, message: o.message, err: i }), s && e && o.name === "NotAllowedError") {
      let a = !1, d = !1;
      try {
        const u = await navigator.mediaDevices.getUserMedia({ video: !0 });
        a = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Wt.error("camera-only probe failed", { err: u });
      }
      try {
        const u = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        d = !0, u.getTracks().forEach((h) => h.stop());
      } catch (u) {
        Wt.error("microphone-only probe failed", { err: u });
      }
      const c = [];
      a || c.push("camera"), d || c.push("microphone");
      const l = await Qa(c, s, e);
      if (l) return l;
      throw new ws(a, d);
    }
    if (o.name === "NotAllowedError") {
      const a = await Qa(
        s ? ["camera"] : e ? ["microphone"] : [],
        s,
        e
      );
      if (a) return a;
    }
    throw i;
  }
}
const Ti = "spotlight.media.staleGrantRetry";
async function Qa(s, e, t) {
  if (s.length === 0) return null;
  try {
    if (sessionStorage.getItem(Ti) === "1")
      return Wt.warn("already re-asked for a stale device grant this session — not looping", { blocked: s }), null;
    sessionStorage.setItem(Ti, "1");
  } catch {
    return null;
  }
  Wt.warn("the OS refused a device we had remembered as granted — re-asking once", { blocked: s }), Bh(...s);
  try {
    return await ki(e, t);
  } catch (n) {
    return Wt.warn("the device was still refused after re-asking", { blocked: s, err: n }), null;
  }
}
function tb() {
  try {
    sessionStorage.removeItem(Ti);
  } catch {
  }
}
function Us(s) {
  s && s.getTracks().forEach((e) => e.stop());
}
const sb = J("sdk.media"), Ja = 30;
class ao {
  compositor = new Zw();
  mixer = new jw();
  appVideo;
  ownsAppVideo;
  camera = null;
  mic = null;
  micOn = !1;
  released = !1;
  constructor(e, t) {
    this.appVideo = e, this.ownsAppVideo = t;
  }
  /** Starts painting and mixing the app's media. Camera and mic start off. */
  static async start(e) {
    const t = !(e.video instanceof MediaStream), n = e.video instanceof MediaStream ? e.video : e.video.captureStream(e.fps ?? Ja), r = new ao(n, t);
    try {
      await r.compositor.start(n, null);
      const i = e.audio instanceof MediaStream ? e.audio.getAudioTracks()[0] ?? null : e.audio ?? null;
      if (r.mixer.start({ system: i }), !r.mixer.getContext() || !r.mixer.getOutputNode()) throw new Error("The audio graph did not start.");
      return r;
    } catch (i) {
      throw r.release(), i;
    }
  }
  /** The composite as viewers will see it, for a preview `<video>`. */
  previewStream() {
    return this.compositor.getCanvas().captureStream(Ja);
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
      return this.adopt(await ki(e, t)), { camera: !1, microphone: !1 };
    } catch (n) {
      if (!(n instanceof ws)) throw n;
      sb.warn("a device was refused — starting the other alone", { camera: n.camera, microphone: n.microphone });
      const r = e && n.camera, i = t && n.microphone;
      return (r || i) && this.adopt(await ki(r, i)), { camera: e && !n.camera, microphone: t && !n.microphone };
    }
  }
  /** Camera tile on or off. Off stops the camera, so its light goes out. */
  async setCamera(e) {
    if (!(e === this.cameraOn || this.released)) {
      if (e) {
        if ((await this.startDevices(!0, !1)).camera) throw new ws(!1, !0);
        return;
      }
      this.compositor.setScene("screen"), this.compositor.setCameraSource(null), Us(this.camera), this.camera = null;
    }
  }
  /** Microphone on or off. Off mutes the track, so turning it back on asks nothing. */
  async setMicrophone(e) {
    if (!this.released) {
      if (e && !this.mic) {
        if ((await this.startDevices(!1, !0)).microphone) throw new ws(!0, !1);
        return;
      }
      for (const t of this.mic?.getAudioTracks() ?? []) t.enabled = e;
      this.micOn = e && this.mic !== null;
    }
  }
  release() {
    this.released || (this.released = !0, this.compositor.stop(), this.mixer.stop(), Us(this.camera), Us(this.mic), this.ownsAppVideo && Us(this.appVideo));
  }
  adopt(e) {
    if (this.released) {
      Us(e);
      return;
    }
    const [t] = e.getVideoTracks(), [n] = e.getAudioTracks();
    t && (this.camera = new MediaStream([t]), this.compositor.setCameraSource(this.camera), this.compositor.setScene("both")), n && (this.mic = new MediaStream([n]), this.mixer.setMicSource(n), this.micOn = !0);
  }
}
const ps = J("sdk.broadcast"), nb = 3e4, rb = 2e3, ib = 1e4, ob = 1e4, ab = 6e4, cb = "spotlight-mesh";
function bb() {
  return Zu(Nu());
}
async function ll(s) {
  const e = Ph(await Rh());
  if (!e)
    throw new Error("This browser cannot host a stream: WebCodecs H.264 with Opus or AAC is required.");
  const t = await ao.start(s);
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
    goLive: (i) => (r ??= db(t, e, i).catch((o) => {
      throw r = null, o;
    }), r),
    cancel: () => t.release()
  };
}
async function vb(s) {
  const e = await ll(s);
  try {
    return await e.goLive(s);
  } catch (t) {
    throw e.cancel(), t;
  }
}
async function db(s, e, t) {
  const n = Cc(window.location), r = await ub(n), i = (t.hostName || n).slice(0, 64), o = await Ah("statements", "statement-submit");
  for (const f of ["statements", "statement-submit"]) {
    const m = o[f];
    if (m && m !== "granted") throw new Error(Mh[m]);
  }
  const a = mb(), d = new dm({ claimSlotWhenFull: !0 });
  let c = null;
  if (d.onFatalError = (f) => {
    c ??= f, a.emit("error", { message: f.message, fatal: !0 });
  }, d.onSubmitError = (f) => a.emit("error", { message: f.message, fatal: !1 }), await d.connect(), !d.isConnected)
    throw d.destroy(), c ?? new Error("The host has no Statement Store, so the stream cannot be announced.");
  d.setProductAccount({ dotNsIdentifier: n, derivationIndex: 0 });
  const l = Date.now();
  hm();
  let u = null, h = null;
  try {
    const f = s.mixer.getContext(), m = s.mixer.getOutputNode();
    if (!f || !m) throw new Error("The audio graph did not start.");
    const y = em(r), p = new Hw({
      selfAddr: r,
      selfName: i,
      epoch: l,
      transport: mm(d, y),
      codecs: e,
      canvas: s.compositor.getCanvas(),
      audioContext: f,
      audioSource: m,
      callbacks: {
        onFlood: (B) => hb(B, a),
        onPeersChanged: () => {
          queueMicrotask(() => {
            const B = p.node.neighborAddrs.length;
            B < b && h?.reopen("neighbor dropped", { degree: B }), b = B;
          });
        },
        onEncoderError: (B) => {
          ps.error("encoder pipeline failed", { err: B }), a.emit("error", { message: B.message, fatal: !0 });
        }
      }
    });
    let b = 0;
    await p.start(), u = p;
    const g = pb(d, y, () => p.joinsInFlight);
    h = g;
    const k = await Lh(r), U = Jp(), q = tm(), G = /* @__PURE__ */ new Set(), L = async (B) => {
      let W;
      try {
        W = d.submit(
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
              startedAt: l,
              mesh: p.mesh(),
              ...B ? { ended: !0 } : {}
            }
          },
          { channel: q }
        ), B || G.add(W), await W;
      } catch (ee) {
        if (dh(ee)) return;
        ps.error("heartbeat failed", { err: ee });
      } finally {
        W && G.delete(W);
      }
    };
    L(!1);
    const j = setInterval(() => void L(!1), nb), $ = setInterval(() => {
      a.emit("viewers", p.node.stats().presenceCount);
    }, rb);
    let te = document.visibilityState === "hidden";
    const K = () => {
      if (document.visibilityState === "hidden") {
        te = !0;
        return;
      }
      L(!1), te && (te = !1, d.refreshAllSubscriptions());
    }, _ = () => {
      L(!1), d.refreshAllSubscriptions();
    }, I = (B) => {
      B.persisted || P();
    };
    document.addEventListener("visibilitychange", K), window.addEventListener("online", _), window.addEventListener("pagehide", I);
    let A = null;
    const P = () => (A ??= (async () => {
      clearInterval(j), clearInterval($), g.stop(), document.removeEventListener("visibilitychange", K), window.removeEventListener("online", _), window.removeEventListener("pagehide", I);
      try {
        await p.end();
      } catch (B) {
        ps.warn("swarm end failed — teardown continues", { err: B });
      }
      await Promise.allSettled([...G]), await L(!0), s.release(), d.destroy(), a.emit("ended", void 0), a.clear();
    })(), A);
    return {
      roomHash: k,
      roomUrl: fb(k, t.spotlightOrigin),
      hostAddress: r,
      on: a.on,
      sendChat: (B) => p.sendChat(i, B.slice(0, 500), Date.now()),
      get camera() {
        return s.cameraOn;
      },
      get microphone() {
        return s.microphoneOn;
      },
      setCamera: (B) => s.setCamera(B),
      setMicrophone: (B) => s.setMicrophone(B),
      end: P
    };
  } catch (f) {
    throw ps.error("go live failed", { err: f }), h?.stop(), u && await u.end().catch(() => {
    }), d.destroy(), f;
  }
}
const lb = _c();
async function ub(s) {
  const e = await Rt(vl(), vs.read, "getAccountsProvider");
  if (!e) throw new Error("Not inside a Polkadot host, so there is no account to stream from.");
  const t = await Rt(
    Promise.resolve(e.getProductAccount(s, 0)),
    vs.hostDialog,
    "getProductAccount"
  );
  if (t.isErr()) {
    const r = ku(t.error) ?? Sl(t.error);
    throw new Error(`The host refused a product account for ${s}: ${r}`);
  }
  const { publicKey: n } = t.value;
  return lb.dec(n);
}
function hb(s, e) {
  s.t === "chat" ? e.emit("chat", { from: s.from, senderName: s.senderName, text: s.text, timestamp: s.ts }) : s.t === "reaction" && e.emit("reaction", { from: s.from, emoji: s.emoji });
}
function fb(s, e) {
  if (e) return `${e.replace(/\/+$/, "")}/#/room/${s}`;
  const { hostname: t, protocol: n } = window.location;
  if (n !== "https:" && n !== "http:" || /^[\d.]+$/.test(t) || t.includes(":") || t.endsWith(`.${Pi}`)) return null;
  const r = t.split(".");
  if (r.length < 3) return null;
  const i = r.slice(-2).join(".");
  return `${window.location.protocol}//${cb}.${i}/#/room/${s}`;
}
function pb(s, e, t) {
  let n = 0, r = null;
  const i = (a, d) => {
    const c = Date.now();
    if (t() > 0 || c - n < ob) {
      r ??= { reason: a, sinceMs: c };
      return;
    }
    r = null, n = c;
    const l = s.reopenTopic(e);
    ps.info(`signal route reopen (${l ? "done" : "no live route"}): ${a}`, d);
  }, o = setInterval(() => {
    const a = s.silentMsFor(e);
    if (a !== null) {
      if (r) {
        const d = Date.now() - r.sinceMs;
        a < d ? r = null : i(`${r.reason}, deferred`, { waitedMs: d });
        return;
      }
      a >= ab && i("topic quiet", { silentMs: a });
    }
  }, ib);
  return { reopen: i, stop: () => clearInterval(o) };
}
function mb() {
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
          ps.warn("event handler threw", { event: e, err: r });
        }
    },
    clear: () => s.clear()
  };
}
const ec = J("sdk.launch"), Ei = "spotlight-broadcast.launchIntent", gb = 2 * 6e4;
function Sb() {
  try {
    const s = Number(localStorage.getItem(Ei));
    return Number.isFinite(s) && s > 0 && Date.now() - s < gb;
  } catch {
    return !1;
  }
}
function Sn(s) {
  try {
    s ? localStorage.setItem(Ei, String(Date.now())) : localStorage.removeItem(Ei);
  } catch {
  }
}
const yb = `
:host { all: initial; }
.backdrop { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center;
  justify-content: center; padding: 16px; background: rgba(11, 12, 15, 0.72);
  font: 14px/1.45 Inter, system-ui, -apple-system, sans-serif; color: #F4F4F5; }
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
button { font: inherit; min-height: 40px; padding: 8px 14px; border-radius: 10px; cursor: pointer;
  border: 1px solid #2C2E34; background: transparent; color: #F4F4F5; }
button:hover:not(:disabled) { background: #2C2E34; }
button:disabled { opacity: 0.5; cursor: default; }
button.toggle[aria-pressed="false"] { color: #8C8F98; }
.primary { background: #FFFFFF; color: #0B0C0F; border-color: #FFFFFF; font-weight: 600; }
.primary:hover:not(:disabled) { background: #DADBE0; }
.actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.hint { margin: 12px 0 0; color: #8C8F98; font-size: 13px; }
.error { margin: 12px 0 0; color: #D9363E; font-size: 13px; }
.error:empty, .hint:empty { display: none; }
`;
function _b(s) {
  return new Promise((e) => {
    const t = document.createElement("div");
    t.setAttribute("data-spotlight-launch", "");
    const n = t.attachShadow({ mode: "open" });
    n.innerHTML = `
      <style>${yb}</style>
      <div class="backdrop">
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
    const r = (g) => n.querySelector(g), i = r("video"), o = r(".overlay"), a = r("#title"), d = r(".error"), c = r('[data-action="live"]'), l = {
      camera: r('[data-device="camera"]'),
      microphone: r('[data-device="microphone"]')
    };
    a.value = (s.title ?? "").slice(0, 200);
    let u = null, h = !1, f = !1;
    const m = (g) => {
      f || (f = !0, Sn(!1), g || u?.cancel(), document.removeEventListener("keydown", y, !0), t.remove(), e(g));
    }, y = (g) => {
      g.key === "Escape" && !h && m(null);
    };
    for (const g of ["keydown", "keyup", "keypress"]) t.addEventListener(g, (k) => k.stopPropagation());
    document.addEventListener("keydown", y, !0);
    const p = () => {
      for (const g of ["camera", "microphone"]) {
        const k = u?.[g] ?? !1, U = l[g];
        U.disabled = !u || h, U.setAttribute("aria-pressed", String(k)), U.textContent = g === "camera" ? k ? "Camera on" : "Camera off" : k ? "Mic on" : "Mic off";
      }
      c.disabled = !u || h || a.value.trim() === "", c.textContent = h ? "Going live…" : "Go live";
    }, b = (g) => {
      d.textContent = g instanceof ws ? `Polkadot did not allow the ${g.camera ? "microphone" : "camera"}. You can go live without it.` : g instanceof Error ? g.message : String(g);
    };
    for (const g of ["camera", "microphone"])
      l[g].addEventListener("click", async () => {
        if (u) {
          d.textContent = "", h = !0, p();
          try {
            g === "camera" ? await u.setCamera(!u.camera) : await u.setMicrophone(!u.microphone);
          } catch (k) {
            b(k);
          } finally {
            h = !1, p();
          }
        }
      });
    a.addEventListener("input", p), a.addEventListener("keydown", (g) => {
      g.key === "Enter" && !c.disabled && c.click();
    }), r('[data-action="cancel"]').addEventListener("click", () => {
      h || m(null);
    }), c.addEventListener("click", async () => {
      if (!(!u || h)) {
        d.textContent = "", h = !0, p();
        try {
          const g = await u.goLive({
            title: a.value.trim(),
            hostName: s.hostName,
            spotlightOrigin: s.spotlightOrigin
          });
          m(g);
        } catch (g) {
          ec.error("go live from the launch screen failed", { err: g }), b(g), h = !1, p();
        }
      }
    }), document.body.appendChild(t), a.focus(), Sn(!0), ll({ ...s, camera: !0, microphone: !0 }).then(
      (g) => {
        if (Sn(!1), f) {
          g.cancel();
          return;
        }
        if (u = g, i.srcObject = g.stream, i.play().catch(() => {
        }), o.remove(), g.refused.camera || g.refused.microphone) {
          const k = [g.refused.camera && "camera", g.refused.microphone && "microphone"].filter(Boolean);
          d.textContent = `Polkadot did not allow the ${k.join(" or ")}. You can go live without it, or turn it on to ask again.`;
        }
        p();
      },
      (g) => {
        Sn(!1), ec.error("launch screen preview failed", { err: g }), o.textContent = "The preview could not start.", b(g);
      }
    );
  });
}
export {
  Ei as LAUNCH_INTENT_KEY,
  bb as getBroadcastLog,
  Sb as launchIntentPending,
  _b as openLaunchScreen,
  ll as prepareBroadcast,
  vb as startBroadcast
};
