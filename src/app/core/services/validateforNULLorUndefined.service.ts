export class ValidateforNullnUndefined {
  validate(data) {
    if (
      data != null &&
      data != "" &&
      data != undefined &&
      data != "0" &&
      data != "---Select---" &&
      data != "-1"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
