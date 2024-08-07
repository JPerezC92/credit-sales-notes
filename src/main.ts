import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';

import { versioningConfig } from '@/shared/infrastructure/utils';

import { AppModule } from './app.module';

const whitelist = [
	'http://localhost:8000',
	'http://10.0.2.2',
	'http://localhost:8081',
	'exp://192.168.18.73',
	'http://172.24.8.33',
];

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(morgan('combined'));
	app.enableCors({
		origin: whitelist,
		preflightContinue: false,
		methods: ['*'],
		optionsSuccessStatus: 204,
		allowedHeaders: [
			'Access-Control-Allow-Origin',
			'Content-Type',
			'Accept',
			'Origin',
			'x-refresh-token',
			'Authorization',
		],
		credentials: true,
	});

	app.enableVersioning(versioningConfig);

	const config = new DocumentBuilder()
		.setTitle('Api example')
		.setDescription('The API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	patchNestjsSwagger();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, { ...document, openapi: '3.1.0' });

	await app.listen(8000);
}

bootstrap().catch(console.error);
