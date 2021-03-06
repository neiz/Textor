module Textor
{
	export class TextUndoUnit implements IUndoUnit
	{
		private _textModel: TextModel;
		private _textBuffer: TextBuffer;
		private _redoRange: TextRange;
		private _redoText: string;
		private _redoSelection: TextRange = null;
		private _undoRange: TextRange = null;
		private _undoText: string;
		private _undoSelection: TextRange;

		constructor(textModel: TextModel, textBuffer: TextBuffer, textRange: TextRange, text: string)
		{
			this._textModel = textModel;
			this._textBuffer = textBuffer;
			this._redoRange = textRange;
			this._redoText = text;
			this._undoText = textBuffer.getText(textRange);
			this._undoSelection = textModel.getTextRange();
		}

		public undo()
		{
			this._textBuffer.setText(this._undoRange, this._undoText);
			this._textModel.selectRange(this._undoSelection);
		}

		public redo()
		{
			this._undoRange = this._textBuffer.setText(this._redoRange, this._redoText);
			if (this._redoSelection === null)
			{
				var position: TextPosition = this._textModel.toScreenPosition(this._undoRange.end);
				this._redoSelection = new TextRange(position.clone(), position.clone());
			}
			this._textModel.selectRange(this._redoSelection);
		}

		public get isEmpty(): bool
		{
			return false;
		}

		public merge(undoUnit: IUndoUnit): bool
		{
			if (undoUnit instanceof SelectionUndoUnit)
			{
				var selectionUndoUnit: SelectionUndoUnit = <SelectionUndoUnit> undoUnit;
				this._redoSelection = selectionUndoUnit.redoTextRange;
				return true;
			}
			return false;
		}

		public toString(): string
		{
			return "Text: " + 
				this._undoRange.toString() + " => " + this._redoRange.toString() + " | \'" + 
				this._undoText.replace(/\t/g, "\\t") + "' => '" + this._redoText.replace(/\t/g, "\\t") + "' | " + 
				this._undoSelection.toString() + " => " + this._redoSelection.toString();
		}
	}
}