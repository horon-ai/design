import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from "@horon-ai/react/components/list";
import { Chip } from "@horon-ai/react/components/chip";
import { Avatar, AvatarFallback } from "@horon-ai/react/components/avatar";
import { FileTextIcon, FolderIcon, ImageIcon } from "lucide-react";

const meta = {
  title: "Web/List",
  component: List,
  parameters: { layout: "centered" },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <List className="w-96">
      <ListItem interactive>
        <ListItemMedia>
          <FolderIcon />
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Design tokens</ListItemTitle>
          <ListItemDescription>12 files updated yesterday</ListItemDescription>
        </ListItemContent>
        <ListItemTrailing>
          <Chip variant="secondary">synced</Chip>
        </ListItemTrailing>
      </ListItem>
      <ListItem interactive>
        <ListItemMedia>
          <FileTextIcon />
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Component inventory</ListItemTitle>
          <ListItemDescription>Draft</ListItemDescription>
        </ListItemContent>
        <ListItemTrailing>
          <Chip variant="outline">draft</Chip>
        </ListItemTrailing>
      </ListItem>
      <ListItem interactive>
        <ListItemMedia>
          <ImageIcon />
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Mascot assets</ListItemTitle>
          <ListItemDescription>8 images</ListItemDescription>
        </ListItemContent>
        <ListItemTrailing>
          <Chip variant="success">ready</Chip>
        </ListItemTrailing>
      </ListItem>
    </List>
  ),
};

export const WithAvatars: Story = {
  render: () => (
    <List className="w-96">
      <ListItem>
        <Avatar>
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <ListItemContent>
          <ListItemTitle>Ada Lovelace</ListItemTitle>
          <ListItemDescription>ada@example.com</ListItemDescription>
        </ListItemContent>
      </ListItem>
      <ListItem>
        <Avatar>
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <ListItemContent>
          <ListItemTitle>Grace Hopper</ListItemTitle>
          <ListItemDescription>grace@example.com</ListItemDescription>
        </ListItemContent>
      </ListItem>
    </List>
  ),
};
