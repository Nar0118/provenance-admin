// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const path = require('path');

module.exports = withNx({
  nx: {
    // Set this to false if you do not want to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
});
