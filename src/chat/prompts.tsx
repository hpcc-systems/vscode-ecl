import {
	BasePromptElementProps,
	PromptElement,
	PromptSizing,
	UserMessage
} from '@vscode/prompt-tsx';

export interface PromptProps extends BasePromptElementProps {
	userQuery: string;
	topic: string;
}

export class SummarizePrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					You are an ECL expert! Your job is to read the following ECL code and summarize it. When summarizing, please avoid listing a step-by-step description and use more of a business-like tone. Please do not use markdown!
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}

export class CommentPrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					Your are an ECL programming language expert. Your job is to insert comments throughout this code. Do not use markdown!.
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}
export class CommentDetailedPrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					Your are an ECL programming language expert. Your job is to insert comments throughout this code. Be extremely detailed. Do not use markdown!).
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}
export class CommentTersePrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					Your are an ECL programming language expert. Your job is to insert comments throughout this code. Be very sparse and terse. Do not use markdown!).
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}

export class FollowupQuestionsPrompt extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					Suggest some similar questions about the ECL programming language that can be asked about the topic ${this.props.topic}.
				</UserMessage>
				<UserMessage>{this.props.userQuery}</UserMessage>
			</>
		);
	}
}

export class GeneralECLQuestion extends PromptElement<PromptProps, void> {
	render(state: void, sizing: PromptSizing) {
		return (
			<>
				<UserMessage>
					You are an ECL language expert! Think carefully and step by step like an ECL language expert who is good at explaining something. Your job is to explain computer science concepts in fun and entertaining way. Always start your response by stating what concept you are explaining. Always include code samples.
				</UserMessage>
				<UserMessage>In the ECL language, explain {this.props.userQuery}</UserMessage>
			</>
		);
	}
}