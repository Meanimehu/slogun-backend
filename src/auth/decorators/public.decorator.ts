import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Use this decorator to mark routes as public (no login required)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);