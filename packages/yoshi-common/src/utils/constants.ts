export const localIdentName = {
  short: '[hash:base64:5]',
  long: '[path][name]__[local]__[hash:base64:5]',
};

export const PORT = parseInt(process.env.PORT || '', 10) || 3000;

export const minimumNodeVersion = '8.7.0';
