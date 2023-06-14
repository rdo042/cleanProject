import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendEmailWhenCustomerAddressIsChangedHandler from "../event/handler/send-email-when-customer-address-is-changed.handler";
import Address from "../value-object/address";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }

    validate() {
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    isActive(): boolean {
        return this._active;
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        this.sendChangedAddress();
        this.validate();
        
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    sendChangedAddress() {
        try {
            const eventDispatcher = new EventDispatcher();
            const eventHandler = new SendEmailWhenCustomerAddressIsChangedHandler();

            eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

            const customerChangedEvent = new CustomerAddressChangedEvent({
            customer: this
            });

            eventDispatcher.notify(customerChangedEvent);
        } catch (error) {
            throw new Error("Problem in sent message to handler");
        }
    }

}