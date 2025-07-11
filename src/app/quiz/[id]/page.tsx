import React from "react";

interface QuizPageProps {
	params: {
		id: string;
	};
}

export default function QuizPage({ params }: QuizPageProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<h1 className="text-3xl font-bold text-gray-900">
						Quiz #{params.id}
					</h1>
					<div className="mt-6">
						<p className="text-gray-600">Quiz interface coming soon...</p>
					</div>
				</div>
			</div>
		</div>
	);
}
