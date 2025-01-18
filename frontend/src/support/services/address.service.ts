import type { Address } from '../types';
import BaseService from './base-service';

export class AddressService extends BaseService<Address, Address> {
    constructor() {
        super("address")
    }
}
