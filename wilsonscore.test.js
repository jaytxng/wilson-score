/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const WilsonScore = require('./wilsonscore');

test('.interval() is accurate to 4 digits after the decimal with confidence and correction explicitly set', () => {
  const result = WilsonScore.interval(100, 140, { confidence: 0.95, correction: true });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  expect(result).toStrictEqual({ left: 0.6308, right: 0.7858 });
});

test('.interval() defaults to confidence interval of 0.95 and correction enabled', () => {
  const resultWithoutOptions = WilsonScore.interval(100, 140);
  const resultWithOptions = WilsonScore.interval(100, 140, { confidence: 0.95, correction: true });
  expect(resultWithoutOptions).toStrictEqual(resultWithOptions);
});

test('.interval() set to non-default confidence interval % is accurate', () => {
  const result = WilsonScore.interval(100, 140, { confidence: 0.90, correction: true });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  expect(result).toStrictEqual({ left: 0.6442, right: 0.7758 });
});

test('.interval() with correction disabled returns accurate result', () => {
  const result = WilsonScore.interval(100, 140, { confidence: 0.95, correction: false });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  expect(result).toStrictEqual({ left: 0.6345, right: 0.7826 });
});

test('.interval() invokes ._pnorm() function', () => {
  const spy = jest.spyOn(WilsonScore, '_pnorm');
  WilsonScore.interval(100, 140);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});


