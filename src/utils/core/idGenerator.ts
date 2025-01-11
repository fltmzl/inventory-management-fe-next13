export class IdGenerator {
  private static randomId(min: number = 10000, max: number = 90000) {
    return Math.floor(min + Math.random() * max);
  }

  private static getDateString() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${day}${month}${year}`;
  }

  static itemId() {
    return "BRG" + this.randomId();
  }

  static customerId() {
    return "P" + this.randomId();
  }

  static categoryId() {
    return "K" + this.randomId();
  }

  static unitId() {
    return "S" + this.randomId();
  }

  static itemRequestId() {
    return "PB" + this.getDateString() + this.randomId(100, 900);
  }

  static transactionInId() {
    return "TRM" + this.getDateString() + this.randomId(100, 900);
  }

  static transactionOutId() {
    return "TRK" + this.getDateString() + this.randomId(100, 900);
  }
}
