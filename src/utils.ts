/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { TokenType, isTokenType } from '@ardrive/turbo-sdk';

export function tokenFromOptions(options: unknown): TokenType {
  const token = (options as { token: string }).token;
  if (token === undefined) {
    throw new Error('Token type required');
  }

  if (!isTokenType(token)) {
    throw new Error('Invalid token type');
  }
  return token;
}

export function amountFromOptions(options: unknown): string {
  const amount = (options as { amount: string }).amount;
  if (amount === undefined) {
    throw new Error('Amount required');
  }
  return amount;
}
