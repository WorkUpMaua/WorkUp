export class userInfoValidation {

    static validateCPF(cpf: string): boolean {
    const regex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    return regex.test(cpf);
  }

  static validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const regex = /^(\+55\s?)?(\(?\d{2}\)?[\s.-]?)?9\d{4}[\s.-]?\d{4}$/;
    return regex.test(phone);
  }

  static validateBirth(birth_timestamp: number) {
    const birthDate = new Date(birth_timestamp);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasNotHadBirthdayThisYear =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (hasNotHadBirthdayThisYear) {
      age--;
    }

    return age >= 18;
  }

}