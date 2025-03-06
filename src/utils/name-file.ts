export default function getRealName(nameFile: string): string {
	const realName = nameFile.split('-').slice(3).join(' ').split('.')[0];
	return realName;
}
