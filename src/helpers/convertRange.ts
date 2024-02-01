function ConvertRange(
  value: number,
  oldmin: number,
  oldmax: number,
  min: number,
  max: number
) {
  return ((value - oldmin) * (max - min)) / (oldmax - oldmin) + min;
}

export { ConvertRange };
