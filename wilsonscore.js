/* eslint-disable no-underscore-dangle */

class WilsonScore {
  static interval(k, n, ...args) {
    if (n === 0) {
      return {
        left: 0,
        right: 0,
      };
    }

    const lastArg = args[args.length - 1];
    const options = lastArg && typeof lastArg === 'object' && lastArg.constructor === Object ? args.slice(-1)[0] : {};
    const confidence = options.confidence || 0.95;
    const correction = options.correction !== undefined ? options.correction : true;

    // phat is the proportion of successes in a Bernoulli trial process
    const phat = k / n;
    const z = this._pnorm(1 - (1 - confidence) / 2.0);
    const z2 = z ** 2;

    // continuity correction enabled
    if (correction) {
      const a = 2 * (n + z2);
      const b = 2 * n * phat + z2;
      const c = z * Math.sqrt(z2 - 1.0 / n + 4 * n * phat * (1 - phat) + (4 * phat - 2)) + 1;
      const d = z * Math.sqrt(z2 - 1.0 / n + 4 * n * phat * (1 - phat) - (4 * phat - 2)) + 1;
      const lower = phat === 0 ? 0 : Math.max(0, (b - c) / a);
      const upper = phat === 1 ? 1 : Math.min(1, (b + d) / a);
      return {
        left: lower,
        right: upper,
      };
    }

    // continuity correction disabled
    const a = 1 + z2 / n;
    const b = phat + z2 / (2 * n);
    const c = z * Math.sqrt((phat * (1 - phat) + z2 / (4 * n)) / n);
    return {
      left: ((b - c) / a),
      right: ((b + c) / a),
    };
  }

  static lowerBound(k, n, options = {}) {
    return this.interval(k, n, options).left;
  }

  static ratingInterval(avg, n, minScore, maxScore, ...args) {
    const lastArg = args[args.length - 1];
    const options = lastArg && typeof lastArg === 'object' && lastArg.constructor === Object ? args.slice(-1)[0] : {};

    const range = maxScore - minScore;
    const interval = this.interval(n * (avg - minScore) / range, n, options);
    return {
      left: minScore + range * interval.left,
      right: minScore + range * interval.right,
    };
  }

  static ratingLowerBound(avg, n, minScore, maxScore, options = {}) {
    return this.ratingInterval(avg, n, minScore, maxScore, options).left;
  }

  static _pnorm(qn) {
    const b = [
      1.570796288,
      0.03706987906,
      -0.8364353589e-3,
      -0.2250947176e-3,
      0.6841218299e-5,
      0.5824238515e-5,
      -0.104527497e-5,
      0.8360937017e-7,
      -0.3231081277e-8,
      0.3657763036e-10,
      0.6936233982e-12,
    ];

    if (qn < 0 || qn > 1) throw Error('Error : qn <= 0 or qn >= 1  in pnorm()!');
    if (qn === 0.5) return 0;

    const w3 = qn > 0.5 ? -Math.log(4.0 * (1 - qn) * qn) : -Math.log(4.0 * qn * (1.0 - qn));

    let w1 = b[0];
    for (let i = 1; i <= 10; i += 1) {
      w1 += b[i] * (w3 ** i);
    }

    return qn > 0.5 ? Math.sqrt(w1 * w3) : -Math.sqrt(w1 * w3);
  }
}

module.exports = WilsonScore;
