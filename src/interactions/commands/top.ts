import { ApplicationCommandOptionType } from 'discord.js';
import { rangeChoices } from '../utils';

function createRangeOptionForTop<T extends string>(type: T) {
  return {
    type: ApplicationCommandOptionType.String,
    description: `The range of which you want to see top ${type} of`,
    choices: rangeChoices<false>(false),
  } as const;
}

function createUserOptionForTop<T extends string>(type: T) {
  return {
    type: ApplicationCommandOptionType.User,
    description: `The user of which you want to see the top ${type}, if not yourself`,
  } as const;
}

export const TopCommand = {
  name: 'top',
  description: 'Look at top statistics',
  options: {
    artists: {
      type: ApplicationCommandOptionType.Subcommand,
      description:
        'See your top artists or the top artists of another user, supports customizable timeframes',
      options: {
        user: createUserOptionForTop('artists'),
        range: createRangeOptionForTop('artists'),
      },
    },
    tracks: {
      type: ApplicationCommandOptionType.Subcommand,
      description:
        'See your top tracks or the top tracks of another user, supports customizable timeframes',
      options: {
        user: createUserOptionForTop('tracks'),
        range: createRangeOptionForTop('tracks'),
      },
    },
    albums: {
      type: ApplicationCommandOptionType.Subcommand,
      description:
        'See your top albums or the top albums of another user, supports customizable timeframes',
      options: {
        user: createUserOptionForTop('albums'),
        range: createRangeOptionForTop('albums'),
      },
    },
    // listeners: {
    //   type: ApplicationCommandOptionType.SubcommandGroup,
    //   description: 'See top listeners of an album, artist or track',
    //   options: {
    //     album: {
    //       type: ApplicationCommandOptionType.Subcommand,
    //       description: 'See top listeners of an album',
    //       options: {
    //         search: {
    //           type: ApplicationCommandOptionType.String,
    //           description: 'The album to search for',
    //           required: true,
    //         },
    //       },
    //     },
    //     artist: {
    //       type: ApplicationCommandOptionType.Subcommand,
    //       description: 'See top listeners of an artist',
    //       options: {
    //         search: {
    //           type: ApplicationCommandOptionType.String,
    //           description: 'The artist to search for',
    //           required: true,
    //         },
    //       },
    //     },
    //     track: {
    //       type: ApplicationCommandOptionType.Subcommand,
    //       description: 'See top listeners of a track',
    //       options: {
    //         search: {
    //           type: ApplicationCommandOptionType.String,
    //           description: 'The track to search for',
    //           required: true,
    //         },
    //       },
    //     },
    //   },
    // },
  },
} as const;
