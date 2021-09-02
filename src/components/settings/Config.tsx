import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import settings from 'electron-settings';
import {
  Button,
  ControlLabel,
  InputNumber,
  Checkbox,
  Tag,
  Nav,
  Icon,
  Input,
  InputGroup,
  Message,
  Whisper,
  Popover,
  RadioGroup,
  Radio,
} from 'rsuite';
import { ConfigPanel } from './styled';
import { startScan, getScanStatus } from '../../api/api';
import GenericPage from '../layout/GenericPage';
import DisconnectButton from './DisconnectButton';
import GenericPageHeader from '../layout/GenericPageHeader';
import ListViewConfig from './ListViewConfig';
import {
  songColumnList,
  songColumnPicker,
  albumColumnList,
  albumColumnPicker,
  playlistColumnList,
  playlistColumnPicker,
} from './ListViewColumns';
import { getImageCachePath, getSongCachePath } from '../../shared/utils';
import setDefaultSettings from '../shared/setDefaultSettings';
import { HeaderButton } from '../shared/styled';

const fsUtils = require('nodejs-fs-utils');

const Config = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [imgCacheSize, setImgCacheSize] = useState(0);
  const [songCacheSize, setSongCacheSize] = useState(0);
  const [currentLAFTab, setCurrentLAFTab] = useState('songList');
  const [isEditingCachePath, setIsEditingCachePath] = useState(false);
  const [newCachePath, setNewCachePath] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const songCols: any = settings.getSync('songListColumns');
  const albumCols: any = settings.getSync('albumListColumns');
  const playlistCols: any = settings.getSync('playlistListColumns');
  const currentSongColumns = songCols?.map((column: any) => column.label) || [];
  const currentAlbumColumns =
    albumCols?.map((column: any) => column.label) || [];
  const currentPlaylistColumns =
    playlistCols?.map((column: any) => column.label) || [];

  useEffect(() => {
    // Retrieve cache sizes on render
    try {
      setImgCacheSize(
        Number(
          (fsUtils.fsizeSync(getImageCachePath()) / 1000 / 1000).toFixed(0)
        )
      );

      setSongCacheSize(
        Number((fsUtils.fsizeSync(getSongCachePath()) / 1000 / 1000).toFixed(0))
      );
    } catch (err) {
      setImgCacheSize(0);
      setSongCacheSize(0);
      fs.mkdirSync(getSongCachePath(), { recursive: true });
      fs.mkdirSync(getImageCachePath(), { recursive: true });
    }
  }, []);

  useEffect(() => {
    // Check scan status on render
    getScanStatus()
      .then((status) => {
        if (status.scanning) {
          return setIsScanning(true);
        }
        setIsScanning(false);
        return setScanProgress(0);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Reload scan status on interval during scan
    if (isScanning) {
      const interval = setInterval(() => {
        getScanStatus()
          .then((status) => {
            if (status.scanning) {
              return setScanProgress(status.count);
            }
            setIsScanning(false);
            return setScanProgress(0);
          })
          .catch((err) => console.log(err));
      }, 1000);

      return () => clearInterval(interval);
    }
    return () => clearInterval();
  }, [isScanning]);

  return (
    <GenericPage
      id="settings"
      header={
        <GenericPageHeader
          title="Config"
          subtitle={
            <>
              <HeaderButton
                size="sm"
                onClick={async () => {
                  startScan();
                  setIsScanning(true);
                }}
                disabled={isScanning}
              >
                {isScanning ? `Scanning: ${scanProgress}` : 'Scan Library'}
              </HeaderButton>
              <Whisper
                trigger="click"
                speaker={
                  <Popover title="Confirm">
                    <div>
                      Are you sure you want to reset your settings to default?
                    </div>
                    <div>
                      <Button
                        id="reset-submit-button"
                        size="sm"
                        onClick={() => {
                          setDefaultSettings(true);
                          window.location.reload();
                        }}
                        appearance="link"
                      >
                        Yes
                      </Button>
                      <strong>WARNING: This will reload the application</strong>
                    </div>
                  </Popover>
                }
              >
                <HeaderButton size="sm">Reset defaults</HeaderButton>
              </Whisper>
            </>
          }
          sidetitle={<DisconnectButton />}
        />
      }
    >
      <ConfigPanel header="Playback" bordered>
        <p>
          Fading works by polling the audio player on an interval (50ms) to
          determine when to start fading to the next track. Due to this, you may
          notice the fade timing may not be 100% perfect.
        </p>

        <p>
          If the crossfade duration is set to less than or equal to{' '}
          <code>0.5</code>, volume fading will not occur for either track, but
          rather start the fading-in track at full volume. This is to
          tentatively support <strong> gapless playback</strong> without fade.
        </p>

        <div style={{ width: '300px', paddingTop: '20px' }}>
          <ControlLabel>Crossfade duration (seconds)</ControlLabel>
          <InputNumber
            defaultValue={String(settings.getSync('fadeDuration')) || '0'}
            step={0.05}
            min={0}
            max={100}
            onChange={(e) => {
              settings.setSync('fadeDuration', e);
            }}
            style={{ width: '150px' }}
          />
          <br />

          <ControlLabel>Crossfade type</ControlLabel>
          <RadioGroup
            name="radioList"
            appearance="default"
            defaultValue={String(settings.getSync('fadeType'))}
            onChange={(e) => settings.setSync('fadeType', e)}
          >
            <Radio value="equalPower">Equal Power</Radio>
            <Radio value="linear">Linear</Radio>
          </RadioGroup>
        </div>
      </ConfigPanel>
      <ConfigPanel header="Look & Feel" bordered>
        <div>
          Select the columns you want displayed pages with a song list. The
          columns will be displayed in the order selected below.
        </div>
        <Nav
          style={{ paddingTop: '10px' }}
          activeKey={currentLAFTab}
          onSelect={(e) => setCurrentLAFTab(e)}
        >
          <Nav.Item eventKey="songList">Song List</Nav.Item>
          <Nav.Item eventKey="albumList">Album List</Nav.Item>
          <Nav.Item eventKey="playlistList">Playlist List</Nav.Item>
        </Nav>
        {currentLAFTab === 'songList' && (
          <ListViewConfig
            title="Song List"
            defaultColumns={currentSongColumns}
            columnPicker={songColumnPicker}
            columnList={songColumnList}
            settingsConfig={{
              columnList: 'songListColumns',
              rowHeight: 'songListRowHeight',
              fontSize: 'songListFontSize',
            }}
          />
        )}

        {currentLAFTab === 'albumList' && (
          <ListViewConfig
            title="Album List"
            defaultColumns={currentAlbumColumns}
            columnPicker={albumColumnPicker}
            columnList={albumColumnList}
            settingsConfig={{
              columnList: 'albumListColumns',
              rowHeight: 'albumListRowHeight',
              fontSize: 'albumListFontSize',
            }}
          />
        )}

        {currentLAFTab === 'playlistList' && (
          <ListViewConfig
            title="Playlist List"
            defaultColumns={currentPlaylistColumns}
            columnPicker={playlistColumnPicker}
            columnList={playlistColumnList}
            settingsConfig={{
              columnList: 'playlistListColumns',
              rowHeight: 'playlistListRowHeight',
              fontSize: 'playlistListFontSize',
            }}
          />
        )}
      </ConfigPanel>
      <ConfigPanel header="Cache" bordered>
        {errorMessage !== '' && (
          <>
            <Message showIcon type="error" description={errorMessage} />
            <br />
          </>
        )}
        <p>
          Songs are cached only when playback for the track fully completes and
          ends. Skipping to the next or previous track after only partially
          completing the track will not begin the caching process.
        </p>
        <br />
        {isEditingCachePath && (
          <>
            <InputGroup>
              <Input
                value={newCachePath}
                onChange={(e: string) => setNewCachePath(e)}
              />
              <InputGroup.Button
                onClick={() => {
                  const check = fs.existsSync(newCachePath);
                  if (check) {
                    settings.setSync('cachePath', newCachePath);
                    fs.mkdirSync(getSongCachePath(), { recursive: true });
                    fs.mkdirSync(getImageCachePath(), { recursive: true });
                    setErrorMessage('');
                    return setIsEditingCachePath(false);
                  }

                  return setErrorMessage(
                    `Path: ${newCachePath} not found. Enter a valid path.`
                  );
                }}
              >
                <Icon icon="check" />
              </InputGroup.Button>
              <InputGroup.Button
                onClick={() => {
                  setIsEditingCachePath(false);
                  setErrorMessage('');
                }}
              >
                <Icon icon="close" />
              </InputGroup.Button>
            </InputGroup>
            <p style={{ fontSize: 'smaller' }}>
              *You will need to manually move any existing cached files to their
              new location.
            </p>
          </>
        )}
        {!isEditingCachePath && (
          <div style={{ overflow: 'auto' }}>
            Location:{' '}
            <code>
              {path.join(
                String(settings.getSync('cachePath')),
                'sonixdCache',
                String(localStorage.getItem('serverBase64'))
              )}
            </code>
          </div>
        )}
        <div style={{ width: '300px', marginTop: '20px' }}>
          <Checkbox
            defaultChecked={Boolean(settings.getSync('cacheSongs'))}
            onChange={() => {
              settings.setSync('cacheSongs', !settings.getSync('cacheSongs'));
            }}
          >
            Songs{' '}
            <Tag>
              {songCacheSize} MB{' '}
              {imgCacheSize === 9999999 && '- Folder not found'}
            </Tag>
          </Checkbox>
          <Checkbox
            defaultChecked={Boolean(settings.getSync('cacheImages'))}
            onChange={() => {
              settings.setSync('cacheImages', !settings.getSync('cacheImages'));
            }}
          >
            Images{' '}
            <Tag>
              {imgCacheSize} MB{' '}
              {imgCacheSize === 9999999 && '- Folder not found'}
            </Tag>
          </Checkbox>
          <br />
          <Button onClick={() => setIsEditingCachePath(true)}>
            Edit cache location
          </Button>
        </div>
      </ConfigPanel>
      <ConfigPanel header="Advanced" bordered>
        <Checkbox
          defaultChecked={Boolean(settings.getSync('showDebugWindow'))}
          onChange={() => {
            settings.setSync(
              'showDebugWindow',
              !settings.getSync('showDebugWindow')
            );
          }}
        >
          Show debug window (requires reload)
        </Checkbox>
        <br />
        <Button onClick={() => window.location.reload()}>Reload window</Button>
      </ConfigPanel>
    </GenericPage>
  );
};

export default Config;
