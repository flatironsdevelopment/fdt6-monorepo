import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    // Validate
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      //Get the errors and push to custom array
      const errorArray = [];
      errors.forEach((obj) => {
        errorArray.push(...Object.values(obj.constraints));
      });

      throw new BadRequestException(errorArray);
    }

    // return header dto object
    return dto;
  },
);
