import { StyleSheet, View } from "react-native";
import { CaretLeft, CaretRight, DotsThree, PlusCircle, Trash } from "phosphor-react-native";
import {
  FlueBackground,
  HoronText,
  Sidebar,
  SidebarAccount,
  SidebarAddButton,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProject,
  SidebarProjectMore,
  SidebarProjectTile,
  SidebarSpacer,
  SidebarTree,
} from "@horon-ai/expo";

/** Every sidebar piece in the three surfaces, the resizable column and the tree connector. */
export default function SidebarDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Glass · header, groups, a tree and the account card
      </HoronText>
      <View style={styles.frame}>
        <Sidebar aria-label="Workspace navigation" style={styles.column}>
          <SidebarHeader initial="H" name="Horon" onCollapse={() => undefined} />
          <SidebarGroup label="Workspace">
            <SidebarItem icon={<CaretLeft size={18} />} current>
              Home
            </SidebarItem>
            <SidebarItem icon={<CaretRight size={18} />} count={3}>
              Inbox
            </SidebarItem>
            <SidebarItem attention>Needs attention</SidebarItem>
          </SidebarGroup>
          <SidebarProject icon={<SidebarProjectTile>H</SidebarProjectTile>} label="Horon" defaultOpen>
            <SidebarTree>
              <SidebarItem>Chats</SidebarItem>
              <SidebarItem>Files</SidebarItem>
            </SidebarTree>
          </SidebarProject>
          <SidebarProject
            icon={<SidebarProjectTile>D</SidebarProjectTile>}
            label="Design"
            actions={<SidebarProjectMore onPress={() => undefined} />}
            defaultOpen
          >
            <SidebarItem>Components</SidebarItem>
          </SidebarProject>
          <SidebarAddButton onPress={() => undefined}>New project</SidebarAddButton>
          <SidebarSpacer />
          <SidebarAccount initials="MJ" name="Min-yeol" email="mj@horon.ai" onPress={() => undefined} />
        </Sidebar>
      </View>

      <HoronText variant="label-sm" tone="text-secondary">
        Glass · resizable, drag the right edge
      </HoronText>
      <View style={styles.frame}>
        <Sidebar resizable defaultWidth={260} onWidthChange={() => undefined}>
          <SidebarHeader initial="R" name="Research" />
          <SidebarGroup label="Recent">
            <SidebarItem>Weekly digest</SidebarItem>
            <SidebarItem>Source audit</SidebarItem>
          </SidebarGroup>
        </Sidebar>
      </View>

      <HoronText variant="label-sm" tone="text-secondary">
        Plain and photo surfaces
      </HoronText>
      <View style={styles.frame}>
        <Sidebar surface="plain" style={styles.column}>
          <SidebarHeader initial="P" name="Plain" />
          <SidebarItem current>Home</SidebarItem>
        </Sidebar>
        <Sidebar surface="photo" style={styles.column}>
          <SidebarHeader initial="H" name="Horon" />
          <SidebarItem current>Home</SidebarItem>
        </Sidebar>
      </View>

      <HoronText variant="label-sm" tone="text-secondary">
        Flue · the smoke gradient behind the sidebar glass
      </HoronText>
      <View style={styles.flue}>
        <FlueBackground variant="sidebar" />
        <Sidebar surface="plain" style={styles.flueColumn}>
          <SidebarHeader initial="F" name="Flue" />
          <SidebarGroup label="Sections">
            <SidebarItem icon={<DotsThree size={18} />}>Overview</SidebarItem>
            <SidebarItem icon={<Trash size={18} />} count={2}>
              Archive
            </SidebarItem>
          </SidebarGroup>
          <SidebarAddButton icon={<PlusCircle size={16} />} onPress={() => undefined}>
            Add section
          </SidebarAddButton>
          <SidebarSpacer />
          <SidebarAccount initials="FL" name="Flue" email="flue@horon.ai" />
        </Sidebar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  frame: { flexDirection: "row", gap: 12, minHeight: 420 },
  column: { width: 280 },
  flue: { position: "relative", overflow: "hidden", borderRadius: 16, minHeight: 420 },
  flueColumn: { width: 280 },
});
