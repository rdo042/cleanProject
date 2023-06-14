import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import NotificationError from "../../@shared/notification/notitication.error";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendEmailWhenCustomerAddressIsChangedHandler from "../event/handler/send-email-when-customer-address-is-changed.handler";
import Address from "../value-object/address";

export default class Customer extends Entity {

    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    validate() {
        if (this._name.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Name is required",
            });
        }
        if (this.id.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Id is required",
            });
        }
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
            this.notification.addError({
                context: "customer",
                message: "Address is mandatory to activate a customer",
            });

            if (this.notification.hasErrors()) {
                throw new NotificationError(this.notification.getErrors());
            }
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