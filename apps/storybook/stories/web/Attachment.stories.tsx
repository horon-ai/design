import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Attachment,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "@horon/web/components/attachment"
import { Button } from "@horon/web/components/button"
import { DownloadIcon, FileTextIcon, ImageIcon, PaperclipIcon } from "lucide-react"
import { createElement } from "react"

/**
 * The media slot styles a nested `<img>` for its image variant. The storybook runs
 * on Vite with no Next image pipeline, so the preview element is built without
 * the JSX `<img>` form that `next/no-img-element` targets.
 */
const previewImage = createElement("img", {
	alt: "Preview",
	src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23e5e0d5'/%3E%3C/svg%3E",
})

const meta = {
	title: "Web/Attachment",
	component: Attachment,
	parameters: { layout: "centered" },
} satisfies Meta<typeof Attachment>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-3">
			<Attachment>
				<AttachmentMedia>
					<FileTextIcon />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>Design brief.pdf</AttachmentTitle>
					<AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
				</AttachmentContent>
				<AttachmentActions>
					<Button variant="ghost" size="icon-xs" aria-label="Download">
						<DownloadIcon />
					</Button>
				</AttachmentActions>
			</Attachment>
			<Attachment state="uploading">
				<AttachmentMedia>
					<ImageIcon />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>mascot-hero.png</AttachmentTitle>
					<AttachmentDescription>Uploading · 64%</AttachmentDescription>
				</AttachmentContent>
			</Attachment>
			<Attachment state="error">
				<AttachmentMedia>
					<PaperclipIcon />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>quarterly-numbers.csv</AttachmentTitle>
					<AttachmentDescription>Upload failed · retry</AttachmentDescription>
				</AttachmentContent>
			</Attachment>
		</div>
	),
}

export const Vertical: Story = {
	render: () => (
		<div className="flex items-start gap-3">
			<Attachment orientation="vertical">
				<AttachmentMedia variant="image">{previewImage}</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>cover.jpg</AttachmentTitle>
					<AttachmentDescription>820 KB</AttachmentDescription>
				</AttachmentContent>
			</Attachment>
			<Attachment orientation="vertical" size="sm">
				<AttachmentMedia>
					<FileTextIcon />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>notes.md</AttachmentTitle>
					<AttachmentDescription>4 KB</AttachmentDescription>
				</AttachmentContent>
			</Attachment>
		</div>
	),
}
