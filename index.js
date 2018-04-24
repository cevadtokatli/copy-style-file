const {RawSource} = require('webpack-sources');
const fs = require('fs');
const less = require('less');
const uglifycss = require('uglifycss');

class CopyStyleFile {
	constructor(files) {
		this.files = files;
	}
	
	apply(compiler) {
		this.mode = compiler.options.mode;
		
		const emit = async (compilation, callback) => {
			if(!this.compilation) {
				await this.files.forEach(file => {
					return new Promise(async resolve => {
						await this.compileFile(file, compilation);
						resolve();
					});
				});
			}
				
			this.compilation = compilation;
			this.callback = callback;
			this.callback();
		};
		
		if(compiler.hooks) {
            const plugin = {name:'CopyStyleFilePlugin'};
            compiler.hooks.emit.tapAsync(plugin, emit);
        } else {
            compiler.plugin('emit', emit);
        }
			
		if(this.mode == 'development') {
			this.files.forEach(file => {
				fs.watch(file.from, () => {
					this.compileFile(file);
				});
			});
		}
	}
	
	async compileFile(file, compilation=this.compilation) {
		return new Promise(async resolve => {
			var src = '';
		
			if(file.from.endsWith('less')) {
				src = await this.renderLess(file.from);
			} else {
				src = fs.readFileSync(file.from).toString();
			}

			if(this.mode == 'production') {
				src = uglifycss.processString(src, {maxLineLen:500, expandVars:true});
			}
							
			compilation.assets[file.to] = {
				source: () => src,
				size: () => src.length
			};
			
			resolve();
			
			if(this.callback) {
				this.callback();
			}
		});	
	}
	
	async renderLess(f) {
		return new Promise(resolve => {
			less.render(fs.readFileSync(f).toString(), (err, result) => {
				resolve(result.css);
			})		
		});
	}
}

module.exports = CopyStyleFile;