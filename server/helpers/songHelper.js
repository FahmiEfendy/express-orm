const Boom = require("boom");

const db = require("../../models");
const generalHelper = require("./generalHelper");

const fileName = "server/helpers/songHelper.js";

const getSongList = async () => {
  try {
    const data = await db.Song.findAll();

    console.log([fileName, "GET All Song", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET All Song", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const getSongDetail = async (objectData) => {
  const { id } = objectData;

  try {
    const data = await db.Song.findOne({ where: { id: id } });

    console.log([fileName, "GET Song Detail", "INFO"]);

    return Promise.resolve(data);
  } catch (err) {
    console.log([fileName, "GET Song Detail", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const postCreateSong = async (objectData) => {
  const { title, singer, genre, duration } = objectData;

  try {
    const songExist = await db.Song.findOne({
      where: { title, singer },
    });

    if (songExist) {
      throw Boom.badData(
        `Song with title ${title} and singer ${singer} already exist!`
      );
    }

    const songList = await getSongList();

    const newData = db.Song.build({
      id: `song-${songList.length + 1}`,
      title,
      singer,
      genre,
      duration,
    });

    await newData.save();

    console.log([fileName, "POST Create Song", "INFO"]);

    return Promise.resolve(newData);
  } catch (err) {
    console.log([fileName, "POST Create Song", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const patchUpdateSong = async (objectData) => {
  const { id, title, singer, genre, duration } = objectData;

  try {
    const selectedSong = await db.Song.findOne({ id: id });

    selectedSong.title = title || selectedSong.title;
    selectedSong.singer = singer || selectedSong.singer;
    selectedSong.genre = genre || selectedSong.genre;
    selectedSong.duration = duration || selectedSong.duration;

    await selectedSong.save({
      fields: ["title", "singer", "genre", "duration"],
    });

    await selectedSong.reload();

    console.log([fileName, "PATCH Update Song", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "PATCH Update Song", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

const deleteRemoveSong = async (objectData) => {
  const { id } = objectData;

  try {
    await db.Song.destroy({ where: { id: id } });

    console.log([fileName, "DELETE Remove Song", "INFO"]);

    return Promise.resolve([]);
  } catch (err) {
    console.log([fileName, "DELETE Remove Song", "ERROR"], {
      message: { info: `${err}` },
    });

    return Promise.reject(generalHelper.errorResponse(err));
  }
};

module.exports = {
  getSongList,
  getSongDetail,
  postCreateSong,
  patchUpdateSong,
  deleteRemoveSong,
};
