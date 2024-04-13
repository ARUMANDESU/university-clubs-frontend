/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5000',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5001',
			},
			{
				hostname: '',
			},
		],
	},
}

module.exports = nextConfig
