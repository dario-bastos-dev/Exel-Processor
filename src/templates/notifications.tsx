interface NotificationsProps {
	messages: string[];
}

const Notifications: React.FC<NotificationsProps> = ({ messages }) => {
	return (
		<div className="fixed top-0 right-0 z-50 w-full max-w-xs p-4">
			<div className="flex items-center justify-between w-full max-w-sm p-4 text-white bg-blue-500 rounded-lg shadow-md">
				<div className="flex items-center">
					<svg
						className="w-6 h-6 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 1v22M1 12h22" />
					</svg>
					{messages.map((message, index) => (
						<span key={index.toString()} id={index.toString()}>
							{message}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default Notifications;
