import type {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  Attachment,
  GuildChannel,
  GuildMember,
  Message,
  Role,
  User,
  LocaleString,
  ChannelType,
} from 'discord.js';

export type CommandPayload = Readonly<{
  type?: ApplicationCommandType;
  name: string;
  name_localizations?: Record<LocaleString, string>;
  description: string;
  description_localizations?: Record<LocaleString, string>;
  options?: Record<string, Option>;
}>;

type BaseOption<IncludesName extends boolean = false> = Readonly<{
  name?: string;
  name_localizations?: Record<LocaleString, string>;
  description: string;
  description_localizations?: Record<LocaleString, string>;
  required?: boolean;
  type: ApplicationCommandOptionType;
}> &
  (IncludesName extends true ? { name: string } : {});

type OptionChoice<Value extends string | number> = Readonly<{
  name: string;
  name_localizations?: Record<LocaleString, string>;
  value: Value;
}>;

export type SubCommandOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> &
    Readonly<{
      type: ApplicationCommandOptionType.Subcommand;
      options?: Record<string, BaseOption>;
    }>;

export type SubCommandGroupOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> &
    Readonly<{
      type: ApplicationCommandOptionType.SubcommandGroup;
      options?: Record<string, SubCommandOption>;
    }>;

export type StringOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> &
    Readonly<{
      type: ApplicationCommandOptionType.String;
      choices?: readonly OptionChoice<string>[];
      minLength?: number;
      maxLength?: number;
      autocomplete?: boolean;
    }>;

export type NumberOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> &
    Readonly<{
      type: ApplicationCommandOptionType.Number;
      choices?: readonly OptionChoice<number>[];
      min_value?: number;
      max_value?: number;
      autocomplete?: boolean;
    }>;

export type IntegerOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> &
    Readonly<{
      type: ApplicationCommandOptionType.Integer;
      choices?: readonly OptionChoice<number>[];
      min_value?: number;
      max_value?: number;
      autocomplete?: boolean;
    }>;

export type BooleanOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.Boolean;
  };

export type UserOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.User;
  };

export type RoleOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.Role;
  };

export type ChannelOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.Channel;
    channel_types: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[];
  };

export type AttachmentOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.Attachment;
  };

export type MentionableOption<IncludesName extends boolean = false> =
  BaseOption<IncludesName> & {
    type: ApplicationCommandOptionType.Mentionable;
  };

export type BasicOptions<IncludesName extends boolean = false> =
  | StringOption<IncludesName>
  | NumberOption<IncludesName>
  | IntegerOption<IncludesName>
  | BooleanOption<IncludesName>
  | UserOption<IncludesName>
  | RoleOption<IncludesName>
  | ChannelOption<IncludesName>
  | AttachmentOption<IncludesName>
  | MentionableOption<IncludesName>;

export type Option<IncludesName extends boolean = false> =
  | SubCommandOption<IncludesName>
  | SubCommandGroupOption<IncludesName>
  | BasicOptions<IncludesName>;

type UnionToIntersection<Union> = (
  Union extends unknown ? (k: Union) => void : never
) extends (k: infer Intersection) => void
  ? Intersection
  : never;

type CommandOptionTypeSwitch<
  CommandOptionType extends ApplicationCommandOptionType,
  Options,
  Choices
> = {
  [ApplicationCommandOptionType.Subcommand]: ArgumentsOfRaw<Options>;
  [ApplicationCommandOptionType.SubcommandGroup]: ArgumentsOfRaw<Options>;
  [ApplicationCommandOptionType.String]: Choices extends OptionChoice<string>[]
    ? Choices[number]['value']
    : string;
  [ApplicationCommandOptionType.Integer]: Choices extends OptionChoice<number>[]
    ? Choices[number]['value']
    : number;
  [ApplicationCommandOptionType.Number]: Choices extends OptionChoice<number>[]
    ? Choices[number]['value']
    : number;
  [ApplicationCommandOptionType.Boolean]: boolean;
  [ApplicationCommandOptionType.User]: {
    user: User;
    member?: GuildMember;
  };
  [ApplicationCommandOptionType.Channel]: GuildChannel;
  [ApplicationCommandOptionType.Role]: Role;
  [ApplicationCommandOptionType.Mentionable]:
    | { user: User; member?: GuildMember }
    | Role
    | undefined;
  [ApplicationCommandOptionType.Attachment]: Attachment;
}[CommandOptionType];

type TypeIdToType<CommandOptionType, Options, Choices> =
  CommandOptionType extends ApplicationCommandOptionType
    ? CommandOptionTypeSwitch<CommandOptionType, Options, Choices>
    : never;

type OptionToObject<_Options> = _Options extends {
  name: infer Name;
  type: infer Type;
  required?: infer Required;
  options?: infer Options;
  choices?: infer Choices;
}
  ? Name extends string
    ? Type extends ApplicationCommandOptionType
      ? Required extends true
        ? RequiredOption<Name, Type, Options, Choices> // Required is a boolean and is true
        : GlobalOptionalOption<Name, Type, Options, Choices> // Required is not a boolean or is false
      : never // Type is not a valid ApplicationCommandOptionType
    : never // name is not a string
  : never; // Options is not the valid object that we want

type RequiredOption<
  Name extends string,
  Type extends ApplicationCommandOptionType,
  SubOptions = readonly Option[],
  Choices = unknown
> = {
  [name in Name]: TypeIdToType<Type, SubOptions, Choices>;
};

type GlobalOptionalOption<
  Name extends string,
  Type extends ApplicationCommandOptionType,
  SubOptions = readonly Option[],
  Choices = unknown
> = Type extends
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup
  ? OptionalOptionSubCommand<Name, Type, SubOptions, Choices>
  : OptionalOption<Name, Type, SubOptions, Choices>;

type OptionalOptionSubCommand<
  Name extends string,
  Type extends ApplicationCommandOptionType,
  SubOptions = readonly Option[],
  Choices = unknown
> = { [name in Name]: TypeIdToType<Type, SubOptions, Choices> };

type OptionalOption<
  Name extends string,
  Type extends ApplicationCommandOptionType,
  SubOptions = readonly Option[],
  Choices = unknown
> = { [name in Name]?: TypeIdToType<Type, SubOptions, Choices> };

type ArgumentsOfRaw<Options> = UnionToIntersection<
  OptionToObject<
    {
      [K in keyof Options]: {
        readonly name: K;
      } & Options[K];
    }[keyof Options]
  >
>;

export type ArgumentsOf<
  Command extends CommandPayload | SubCommandOption | SubCommandGroupOption
> = Command extends { options: Record<string, Option> }
  ? UnionToIntersection<
      OptionToObject<
        {
          [K in keyof Command['options']]: {
            readonly name: K;
          } & Command['options'][K];
        }[keyof Command['options']]
      >
    >
  : CommandIsOfType<Command, ApplicationCommandType.Message> extends true
  ? { message: Message<true> }
  : CommandIsOfType<Command, ApplicationCommandType.User> extends true
  ? { user: { user: User; member?: GuildMember } }
  : Command extends any // Temporary until we do stuff with generics so we can force the subCommands to be type defined instead of being any
  ? any
  : never;

type CommandIsOfType<
  Command extends CommandPayload | SubCommandOption | SubCommandGroupOption,
  type extends ApplicationCommandType
> = Command extends { type: type } ? true : false;

export type SubCommandNamesOf<C extends CommandPayload> =
  C['options'] extends Record<string, Option>
    ? {
        [K in keyof C['options']]: C['options'][K] extends SubCommandOption
          ? K
          : never;
      }[keyof C['options']]
    : never;
