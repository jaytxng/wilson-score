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

test('.interval() should return 0 limits if total is 0', () => {
  const result = WilsonScore.interval(100, 0, { confidence: 0.95, correction: false });
  expect(result).toStrictEqual({ left: 0, right: 0 });
});

test('.interval() should return 0 for left limit if phat is 0', () => {
  const result = WilsonScore.interval(0, 100);
  expect(result.left).toBe(0);
});

test('.interval() should return 1 for right limit if phat is 1', () => {
  const result = WilsonScore.interval(100, 100);
  expect(result.right).toBe(1);
});

test('.interval() invokes ._pnorm() function', () => {
  const spy = jest.spyOn(WilsonScore, '_pnorm');
  WilsonScore.interval(100, 140);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('.lowerBound() returns lower interval limit to 4 digits after the decimal', () => {
  let result = WilsonScore.lowerBound(100, 140, { confidence: 0.95, correction: true });
  result = parseFloat(result.toFixed(4));
  expect(result).toBe(0.6308);
});

test('.lowerBound() returns with low confidence input', () => {
  let result = WilsonScore.lowerBound(100, 140, { confidence: 0.12 });
  result = parseFloat(result.toFixed(4));
  expect(result).toBe(0.7049);
});

test('.lowerBound() invokes .interval() function', () => {
  const spy = jest.spyOn(WilsonScore, 'interval');
  WilsonScore.lowerBound(100, 140);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('.ratingInterval() is accurate to 4 digits after the decimal with confidence and correction explicitly set', () => {
  const result = WilsonScore.ratingInterval(2.5, 2, 1, 5, { confidence: 0.95, correction: true });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  const left = parseFloat((1 + 4 * 0.007269).toFixed(4));
  const right = parseFloat((1 + 4 * 0.9439).toFixed(4));
  const expected = { left, right };
  expect(result).toStrictEqual(expected);
});

test('.ratingInterval() defaults to confidence interval of 0.95 and correction enabled', () => {
  const resultWithoutOptions = WilsonScore.ratingInterval(2.5, 2, 1, 5);
  const options = { confidence: 0.95, correction: true };
  const resultWithOptions = WilsonScore.ratingInterval(2.5, 2, 1, 5, options);
  expect(resultWithoutOptions).toStrictEqual(resultWithOptions);
});

test('.ratingInterval() set to non-default confidence interval % is accurate', () => {
  const result = WilsonScore.ratingInterval(2.5, 2, 1, 5, { confidence: 0.90, correction: true });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  const left = parseFloat((1 + 4 * 0.0099).toFixed(4));
  const right = parseFloat((1 + 4 * 0.9272).toFixed(4));
  const expected = { left, right };
  expect(result).toStrictEqual(expected);
});

test('.ratingInterval() with correction disabled returns accurate result', () => {
  const result = WilsonScore.ratingInterval(2.5, 2, 1, 5, { confidence: 0.95, correction: false });
  result.left = parseFloat(result.left.toFixed(4));
  result.right = parseFloat(result.right.toFixed(4));
  const left = parseFloat((1 + 4 * 0.0561).toFixed(4));
  const right = parseFloat((1 + 4 * 0.8583).toFixed(4));
  const expected = { left, right };
  expect(result).toStrictEqual(expected);
});

test('.ratingInterval() invokes .interval() function', () => {
  const spy = jest.spyOn(WilsonScore, 'interval');
  WilsonScore.ratingInterval(2.5, 2, 1, 5, { confidence: 0.90, correction: true });

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('.ratingLowerBound() returns lower interval limit to 4 digits after the decimal', () => {
  let result = WilsonScore.ratingLowerBound(2.5, 2, 1, 5);
  result = parseFloat(result.toFixed(4));
  const expected = parseFloat((1 + 4 * 0.007269).toFixed(4));
  expect(result).toBe(expected);
});

test('.ratingLowerBound() returns with low confidence input', () => {
  let result = WilsonScore.ratingLowerBound(2.0, 10, 0, 2, { confidence: 0.12 });
  result = parseFloat(result.toFixed(4));
  const expected = parseFloat((1.8770669044883168).toFixed(4));
  expect(result).toBe(expected);
});

test('.ratingLowerBound() invokes .ratingInterval() function', () => {
  const spy = jest.spyOn(WilsonScore, 'ratingInterval');
  WilsonScore.ratingLowerBound(2.5, 2, 1, 5);

  expect(spy).toHaveBeenCalled();

  spy.mockRestore();
});

test('._pnorm() throws error if input is out of bounds', () => {
  const forceLessThanZero = () => WilsonScore._pnorm(-1);
  const forceGreaterThanOne = () => WilsonScore._pnorm(2);
  expect(forceLessThanZero).toThrowError(new Error('Error : qn <= 0 or qn >= 1  in pnorm()!'));
  expect(forceGreaterThanOne).toThrowError(new Error('Error : qn <= 0 or qn >= 1  in pnorm()!'));
});

test('._pnorm() returns 0 when input is 0.5', () => {
  const result = WilsonScore._pnorm(0.5);
  expect(result).toEqual(0);
});

test('._pnorm() calculates z-scores accurately', () => {
  const resultUnder = parseFloat(WilsonScore._pnorm(0.3).toFixed(3));
  expect(resultUnder).toEqual(-0.524);
  const resultOver = parseFloat(WilsonScore._pnorm(0.8).toFixed(3));
  expect(resultOver).toEqual(0.842);
});
