export function Required({required}: {required?: boolean}) {
  if (!required)  {
    return null
  }

  return <span class="text-red">*</span>;
}
