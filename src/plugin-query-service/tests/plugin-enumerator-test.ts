import { PluginInfoExtractor } from '../plugin-info-extractor';
import { WinstonLog } from '../../winston-logger';
import { PluginEnumerator } from '../plugin-enumerator';
import { Log } from '../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';
import { FileEnumerator } from "../file-enumerator";
import { FileReader } from "../file-reader";

@suite
class PluginEnumeratorTests {

  private log : Log;
  private pluginPath : string;
  private req : any;
  private mockFileEnumerator : TypeMoq.IMock<FileEnumerator>;

  before() {
    should();
    this.log = new WinstonLog();
    this.pluginPath = 'c:\\appRoot\\testPath';    
    this.req = {
      protocol : 'http',
      get  : (host) => {'127.0.0.1'}
    };
  }

  @test
  onlyJsFilesAreRecognizedAsPlugins() {    
    let fileContentMap = new Map([
      [`${this.pluginPath}\\plugin1.js`,'content for plugin1'],
      [`${this.pluginPath}\\not-a-plugin.xs`, 'not plugin content'],      
      [`${this.pluginPath}\\plugin2.js`, 'content for plugin2']
    ]);
    let enumerator = this.getNewPluginEnumerator(fileContentMap);
    enumerator.enumerate(this.req).length.should.equal(2);
  }

  pluginsAreCached() {
    let fileContentMap = new Map([
      [`${this.pluginPath}\\plugin1.js`,'content for plugin1'],
      [`${this.pluginPath}\\not-a-plugin.xs`, 'not plugin content'],      
      [`${this.pluginPath}\\plugin2.js`, 'content for plugin2']
    ]);
    let enumerator = this.getNewPluginEnumerator(fileContentMap);
    enumerator.enumerate(this.req).length.should.equal(2);    
    enumerator.enumerate(this.req).length.should.equal(2);

    this.mockFileEnumerator.verify(x=>x.enumerate(TypeMoq.It.isAny()), TypeMoq.Times.once());

  }

  getNewPluginEnumerator(fileContentMap : Map<string,string>)  {
    this.mockFileEnumerator = this.getMockFileEnumerator(fileContentMap.keys());
    let fileReader = this.getMockFileReader(fileContentMap.values());
    let extractor = new PluginInfoExtractor(this.log, fileReader);
    return new PluginEnumerator(this.log, extractor, this.mockFileEnumerator.object, this.pluginPath);
  }

  getMockFileEnumerator(filesReturned : IterableIterator<string>) : TypeMoq.IMock<FileEnumerator> {
    let enumerator = TypeMoq.Mock.ofType<FileEnumerator>()
    enumerator.setup(x=>x.enumerate(TypeMoq.It.isAny())).returns(() => {
      return Array.from(filesReturned);
    });    
    return enumerator;
  }

  getMockFileReader(contentIterator : IterableIterator<string>) : FileReader {
    let contentArray = Array.from(contentIterator);
    let reader = TypeMoq.Mock.ofType<FileReader>();
    let i : number = 0;
    reader.setup(x=>x.read(TypeMoq.It.isAny())).returns((file)=>{
      return contentArray[i++];
    });
    return reader.object;
  }

}